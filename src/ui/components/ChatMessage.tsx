import {
  Paper,
  Text,
  Stack,
  useMantineTheme,
  Group,
  Avatar,
} from "@mantine/core";
import { Message } from "../utils";

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const theme = useMantineTheme();
  const isUser = message.role === "user";

  return (
    <Group
      align="flex-start"
      gap="xs"
      justify={isUser ? "flex-end" : "flex-start"}
    >
      {!isUser && (
        <Avatar color="blue" radius="xl">
          AI
        </Avatar>
      )}

      <Paper
        p="md"
        radius="md"
        style={{
          maxWidth: "75%",
          backgroundColor: isUser ? theme.colors.blue[1] : theme.colors.gray[0],
        }}
      >
        <Stack gap="xs">
          <Text size="sm" fw={500}>
            {isUser ? "You" : "AWS RDS Expert"}
          </Text>
          <Text>{message.content}</Text>
        </Stack>
      </Paper>

      {isUser && (
        <Avatar color="blue" radius="xl">
          You
        </Avatar>
      )}
    </Group>
  );
};

export default ChatMessage;
