import { useEffect, useState, useRef } from "react";
import {
  Stack,
  Text,
  Paper,
  ScrollArea,
  Loader,
  Center,
  Group,
  ActionIcon,
  Textarea,
} from "@mantine/core";
import { IconSend } from "@tabler/icons-react";
import { axiosInstance, Message } from "../utils";
import ChatMessage from "../components/ChatMessage";

interface ChatProps {
  chatId: number | null;
  threadId: number | null;
}

const Chat = ({ chatId, threadId }: ChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [error, setError] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const loadMessages = async () => {
    if (!threadId) return;

    setLoading(true);
    try {
      console.log("Loading messages for thread:", threadId);
      const response = await axiosInstance.get(
        `/api/threads/${threadId}/messages`,
      );
      if (response.data.status === "success") {
        console.log("Messages loaded:", response.data.messages.length);
        setMessages(response.data.messages);
      } else {
        console.error("Failed to load messages:", response.data);
        setError("Failed to load messages");
      }
    } catch (error) {
      console.error("Failed to load messages:", error);
      setError("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  // Load messages when thread changes
  useEffect(() => {
    if (threadId) {
      loadMessages();
    } else {
      setMessages([]);
    }
  }, [threadId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      setTimeout(() => {
        if (scrollAreaRef.current) {
          scrollAreaRef.current.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior: "smooth",
          });
        }
      }, 100);
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!threadId || !userMessage.trim()) return;

    setSending(true);
    try {
      console.log("Sending message to thread:", threadId);
      const response = await axiosInstance.post(
        `/api/threads/${threadId}/messages`,
        {
          message: userMessage,
        },
      );

      if (response.data.status === "success") {
        console.log("Message sent successfully, received response");
        setUserMessage("");

        // Check if response contains messages directly
        if (response.data.messages && response.data.messages.length > 0) {
          console.log(
            "Using messages from response:",
            response.data.messages.length,
          );
          setMessages((prevMessages) => [
            ...prevMessages,
            ...response.data.messages,
          ]);
        } else {
          // Otherwise reload all messages
          console.log("Reloading all messages");
          loadMessages();
        }
      } else {
        console.error("Failed to send message:", response.data);
        setError("Failed to send message");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setError("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!chatId || !threadId) {
    return (
      <Center style={{ height: "100%" }}>
        <Stack align="center" gap="md">
          <Text size="xl">Select a chat or create a new one</Text>
        </Stack>
      </Center>
    );
  }

  return (
    <Stack style={{ height: "100%" }} p="md">
      {/* Messages area */}
      <Paper
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
        shadow="xs"
        p="md"
      >
        {loading ? (
          <Center style={{ height: "100%" }}>
            <Loader size="lg" />
          </Center>
        ) : (
          <ScrollArea style={{ flex: 1 }} viewportRef={scrollAreaRef}>
            <Stack gap="lg">
              {messages.length === 0 ? (
                <Center style={{ height: 200 }}>
                  <Text c="dimmed">
                    No messages yet. Start by asking about AWS RDS services!
                  </Text>
                </Center>
              ) : (
                messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))
              )}
              {sending && (
                <Center>
                  <Loader size="sm" />
                </Center>
              )}
            </Stack>
          </ScrollArea>
        )}
      </Paper>

      {/* Input area */}
      <Group align="flex-end">
        <Textarea
          placeholder="Ask about AWS RDS..."
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          autosize
          minRows={1}
          maxRows={5}
          style={{ flex: 1 }}
          disabled={sending}
        />
        <ActionIcon
          size="lg"
          color="blue"
          variant="filled"
          onClick={sendMessage}
          disabled={sending || !userMessage.trim()}
        >
          <IconSend size={18} />
        </ActionIcon>
      </Group>
    </Stack>
  );
};

export default Chat;
