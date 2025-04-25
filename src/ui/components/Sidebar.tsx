import { useState, useEffect } from "react";
import {
  Box,
  Text,
  Button,
  Title,
  TextInput,
  ActionIcon,
  Divider,
  ScrollArea,
  Loader,
  Center,
  Modal,
  Stack,
} from "@mantine/core";
import { IconEdit, IconMessagePlus } from "@tabler/icons-react";
import { axiosInstance, Chat, logoutUser } from "../utils";
import { useDisclosure } from "@mantine/hooks";

interface SidebarProps {
  onChatSelect: (chatId: number, threadId: number) => void;
  selectedChatId: number | null;
}

const Sidebar = ({ onChatSelect, selectedChatId }: SidebarProps) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [opened, { open, close }] = useDisclosure(false);
  const [editingChat, setEditingChat] = useState<Chat | null>(null);
  const [chatName, setChatName] = useState("");

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

  const handleRenameClick = (chat: Chat) => {
    setEditingChat(chat);
    setChatName(chat.chat_name || "");
    open();
  };

  const renameChat = async () => {
    if (!editingChat) return;

    try {
      const response = await axiosInstance.patch(
        `/api/chats/${editingChat.id}`,
        {
          chat_name: chatName,
        },
      );

      if (response.data.status === "success") {
        // Update chat in the list
        setChats(
          chats.map((c) =>
            c.id === editingChat.id ? { ...c, chat_name: chatName } : c,
          ),
        );
        close();
      }
    } catch (error) {
      setError("Failed to rename chat");
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
          leftSection={<IconMessagePlus size={16} />}
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
                  rightSection={
                    <ActionIcon
                      variant="transparent"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRenameClick(chat);
                      }}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                  }
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
            window.location.href = "/signup";
          }}
        >
          Logout
        </Button>
      </Box>

      {/* Rename Chat Modal */}
      <Modal opened={opened} onClose={close} title="Rename Chat">
        <Stack>
          <TextInput
            label="Chat Name"
            placeholder="Enter chat name"
            value={chatName}
            onChange={(e) => setChatName(e.target.value)}
          />
          <Button onClick={renameChat}>Save</Button>
        </Stack>
      </Modal>
    </Box>
  );
};

export default Sidebar;
