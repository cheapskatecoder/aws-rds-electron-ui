import {
  Button,
  TextInput,
  Title,
  Stack,
  Paper,
  Container,
  Tabs,
  Text,
  Alert,
  LoadingOverlay,
} from "@mantine/core";
import { useState } from "react";
import { axiosInstance, loginUser } from "../utils";

const SignupPage = () => {
  const [activeTab, setActiveTab] = useState<string | null>("signup");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post("/register", {
        username,
        password,
      });

      if (response.data.status === "success") {
        setActiveTab("login");
        setPassword("");
        setConfirmPassword("");
      } else {
        setError(response.data.message || "Registration failed");
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("Attempting login for:", username);
      const response = await loginUser(username, password);
      console.log("Login response:", response);

      if (response.status === "success") {
        // Verify the token was stored
        const savedToken = localStorage.getItem("token");
        console.log("Token saved:", savedToken ? "Yes" : "No");

        // Token is already stored in localStorage by loginUser
        // Redirect to dashboard with a small delay to ensure state updates
        setTimeout(() => {
          window.location.href = "/";
        }, 100);
      } else {
        setError(response.message || "Login failed");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="xs" mt="xl">
      <Paper shadow="md" p="xl" radius="md" pos="relative">
        <LoadingOverlay
          visible={loading}
          overlayProps={{ radius: "sm", blur: 2 }}
        />

        <Title order={1} ta="center" mb="lg">
          AWS RDS Expert
        </Title>

        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List grow mb="md">
            <Tabs.Tab value="signup">Sign Up</Tabs.Tab>
            <Tabs.Tab value="login">Login</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="signup">
            <form onSubmit={handleSignup}>
              <Stack gap="md">
                <TextInput
                  label="Username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  size="md"
                  required
                />
                <TextInput
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  size="md"
                  required
                />
                <TextInput
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  size="md"
                  required
                />
                {error && <Alert color="red">{error}</Alert>}
                <Button type="submit" fullWidth size="md" mt="md">
                  Create Account
                </Button>
                <Text ta="center" size="sm">
                  Already have an account?{" "}
                  <Text
                    span
                    c="blue"
                    onClick={() => setActiveTab("login")}
                    style={{ cursor: "pointer" }}
                  >
                    Login
                  </Text>
                </Text>
              </Stack>
            </form>
          </Tabs.Panel>

          <Tabs.Panel value="login">
            <form onSubmit={handleLogin}>
              <Stack gap="md">
                <TextInput
                  label="Username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  size="md"
                  required
                />
                <TextInput
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  size="md"
                  required
                />
                {error && <Alert color="red">{error}</Alert>}
                <Button type="submit" fullWidth size="md" mt="md">
                  Login
                </Button>
                <Text ta="center" size="sm">
                  Don't have an account?{" "}
                  <Text
                    span
                    c="blue"
                    onClick={() => setActiveTab("signup")}
                    style={{ cursor: "pointer" }}
                  >
                    Sign Up
                  </Text>
                </Text>
              </Stack>
            </form>
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </Container>
  );
};

export default SignupPage;
