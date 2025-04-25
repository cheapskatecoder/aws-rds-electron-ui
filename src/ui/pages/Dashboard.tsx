import { useState, useEffect } from "react";
import { AppShell, Burger, Group, Skeleton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Sidebar from "../components/Sidebar";
import Chat from "./Chat";
import { axiosInstance } from "../utils";

const DashboardPage = () => {
  const [opened, { toggle }] = useDisclosure();
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [selectedThreadId, setSelectedThreadId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to load the most recent chat or create a new one
    const loadInitialChat = async () => {
      try {
        console.log("Loading initial chat...");
        const response = await axiosInstance.get("/api/chats");
        if (
          response.data.status === "success" &&
          response.data.chats.length > 0
        ) {
          const chat = response.data.chats[0];
          console.log("Found existing chat:", chat.id);

          // Create or get thread for this chat
          const threadResponse = await axiosInstance.post("/api/threads", {
            chat_id: chat.id,
          });

          if (threadResponse.data.status === "success") {
            console.log(
              "Thread for initial chat:",
              threadResponse.data.thread_session.id,
            );
            setSelectedChatId(chat.id);
            setSelectedThreadId(threadResponse.data.thread_session.id);
          }
        } else {
          console.log("No existing chats, creating new one");
          // Create a new chat if none exists
          const newChatResponse = await axiosInstance.post("/api/chats");
          if (newChatResponse.data.status === "success") {
            const newChat = newChatResponse.data.chat;
            console.log("Created new chat:", newChat.id);

            // Create a thread for this chat
            const threadResponse = await axiosInstance.post("/api/threads", {
              chat_id: newChat.id,
            });

            if (threadResponse.data.status === "success") {
              console.log(
                "Created thread for new chat:",
                threadResponse.data.thread_session.id,
              );
              setSelectedChatId(newChat.id);
              setSelectedThreadId(threadResponse.data.thread_session.id);
            }
          }
        }
      } catch (error) {
        console.error("Failed to load initial chat", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialChat();
  }, []);

  const handleChatSelect = (chatId: number, threadId: number) => {
    setSelectedChatId(chatId);
    setSelectedThreadId(threadId);
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 280,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Sidebar
          onChatSelect={handleChatSelect}
          selectedChatId={selectedChatId}
        />
      </AppShell.Navbar>

      <AppShell.Main>
        {loading ? (
          <Skeleton height={600} width="100%" />
        ) : (
          <Chat chatId={selectedChatId} threadId={selectedThreadId} />
        )}
      </AppShell.Main>
    </AppShell>
  );
};

export default DashboardPage;
