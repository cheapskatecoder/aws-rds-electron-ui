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
  Box,
  Alert,
} from "@mantine/core";
import Icon from "../components/Icon";
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
        {error && (
          <Alert
            icon={<Icon icon="AlertCircle" size={16} />}
            color="red"
            title="Error"
            withCloseButton
            onClose={() => setError("")}
          >
            {error}
          </Alert>
        )}
        {loading ? (
          <Center style={{ height: "100%" }}>
            <Loader size="lg" />
          </Center>
        ) : (
          <ScrollArea style={{ flex: 1 }} viewportRef={scrollAreaRef}>
            <Stack gap="lg">
              {messages.length === 0 ? (
                <Box
                  style={{
                    height: "auto",
                    minHeight: 400,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Paper p="lg" withBorder maw={700} w="100%" mx="auto">
                    <Stack align="flex-start">
                      <Text size="lg" fw={700} c="blue">
                        Welcome to AWS RDS Expert!
                      </Text>
                      <Text ta="left">
                        I can help you manage your RDS databases. Here are the
                        actions I can perform:
                      </Text>
                      <Stack gap="xs" align="flex-start" w="100%">
                        <Text fw={500}>• list_rds_instances:</Text>
                        <Text ml="md">Show your current RDS databases.</Text>

                        <Text fw={500}>• describe_rds_instance:</Text>
                        <Text ml="md">
                          Get detailed information about a specific database.
                        </Text>

                        <Text fw={500}>• create_rds_instance:</Text>
                        <Text ml="md">
                          Create a new database (MySQL, PostgreSQL, SQL Server,
                          etc.). I'll ask for required parameters.
                        </Text>

                        <Text fw={500}>• stop_rds_instance:</Text>
                        <Text ml="md">Stop a running database.</Text>

                        <Text fw={500}>• start_rds_instance:</Text>
                        <Text ml="md">Start a stopped database.</Text>

                        <Text fw={500}>• modify_rds_instance:</Text>
                        <Text ml="md">
                          Change settings like instance class or storage size.
                        </Text>

                        <Text fw={500}>• delete_rds_instance:</Text>
                        <Text ml="md">
                          Delete a database (I'll confirm and ask about final
                          snapshots).
                        </Text>

                        <Text fw={500}>• list_instance_classes:</Text>
                        <Text ml="md">
                          Show available hardware options for your database.
                        </Text>
                      </Stack>
                      <Text mt="md" fw={500} ta="left">
                        Ask a question to get started!
                      </Text>
                    </Stack>
                  </Paper>
                </Box>
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
      <Box mt="md">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <Group align="flex-end">
            <Textarea
              placeholder="Type your message..."
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
              type="submit"
              variant="filled"
              color="blue"
              size="lg"
              disabled={sending || !userMessage.trim()}
            >
              <Icon icon="Send" size={18} />
            </ActionIcon>
          </Group>
        </form>
      </Box>
    </Stack>
  );
};

export default Chat;
