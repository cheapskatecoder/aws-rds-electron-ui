import {
  Button,
  TextInput,
  Title,
  Stack,
  Center,
  Paper,
  Container,
} from "@mantine/core";
import { useState } from "react";

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Just for demo, using a public API that always succeeds
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users/1",
      );
      if (response.ok) {
        // Store some auth data in localStorage
        localStorage.setItem("auth", "authenticated");
      }
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  return (
    <Container size="xs" mt="xl">
      <Paper shadow="md" p="xl" radius="md">
        <Stack gap="lg">
          <Title order={2} ta="center">
            Sign Up
          </Title>
          <form onSubmit={handleSubmit}>
            <Stack gap="md">
              <TextInput
                label="Username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                size="md"
              />
              <TextInput
                label="Password"
                placeholder="Enter your password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                size="md"
              />
              <Button type="submit" fullWidth size="md" mt="md">
                Create Account
              </Button>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Container>
  );
};

export default SignupPage;
