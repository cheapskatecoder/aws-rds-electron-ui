import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Text,
  Button,
  Title,
  Divider,
  ScrollArea,
  Loader,
  Center,
  Stack,
} from "@mantine/core";
import Icon from "./Icon";
import { axiosInstance, Chat, logoutUser } from "../utils";

interface SidebarProps {
  onChatSelect: (chatId: number, threadId: number) => void;
  selectedChatId: number | null;
}

const Sidebar = ({ onChatSelect, selectedChatId }: SidebarProps) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Load chats on component mount
  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/api/chats");
      if (response.data.status === "success") {
        setChats(response.data.chats);
      } else {
        setError("Failed to load chats");
      }
    } catch (error) {
      setError("Failed to load chats");
    } finally {
      setLoading(false);
    }
  };

  const createNewChat = async () => {
    try {
      const response = await axiosInstance.post("/api/chats");
      if (response.data.status === "success") {
        const newChat = response.data.chat;

        // Create a thread for this chat
        const threadResponse = await axiosInstance.post("/api/threads", {
          chat_id: newChat.id,
        });

        if (threadResponse.data.status === "success") {
          // Add the new chat to the list and select it
          setChats([newChat, ...chats]);
          onChatSelect(newChat.id, threadResponse.data.thread_session.id);
        }
      }
    } catch (error) {
      setError("Failed to create chat");
    }
  };

  const handleChatClick = async (chat: Chat) => {
    try {
      console.log("Loading chat:", chat.id);
      // Create or get thread for this chat
      const response = await axiosInstance.post("/api/threads", {
        chat_id: chat.id,
      });

      if (response.data.status === "success") {
        console.log("Thread response:", response.data);
        onChatSelect(chat.id, response.data.thread_session.id);
      }
    } catch (error) {
      console.error("Failed to load chat:", error);
      setError("Failed to load chat");
    }
  };

  return (
    <Box style={{ width: 280 }} p="md">
      <Box>
        <Title order={3}>AWS RDS Expert</Title>
      </Box>

      <Divider my="md" />

      <Box>
        <Button
          leftSection={<Icon icon="MessagePlus" size={16} />}
          fullWidth
          onClick={createNewChat}
        >
          New Chat
        </Button>
      </Box>

      <Divider my="md" />

      <Box style={{ maxHeight: "calc(100vh - 240px)", overflow: "auto" }}>
        <ScrollArea>
          {loading ? (
            <Center h={100}>
              <Loader />
            </Center>
          ) : error ? (
            <Text c="red" ta="center">
              {error}
            </Text>
          ) : chats.length === 0 ? (
            <Text c="dimmed" ta="center">
              No chats yet. Create your first chat!
            </Text>
          ) : (
            <Stack gap="xs">
              {chats.map((chat) => (
                <Button
                  key={chat.id}
                  variant={selectedChatId === chat.id ? "filled" : "subtle"}
                  justify="space-between"
                  fullWidth
                  onClick={() => handleChatClick(chat)}
                >
                  <Text truncate style={{ maxWidth: "180px" }}>
                    {chat.chat_name || `Chat ${chat.id}`}
                  </Text>
                </Button>
              ))}
            </Stack>
          )}
        </ScrollArea>
      </Box>

      <Divider my="md" />

      <Box mt="auto">
        <Button
          variant="outline"
          color="red"
          fullWidth
          onClick={async () => {
            await logoutUser();
            navigate("/signup");
            window.location.reload();
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default Sidebar;
