import "@mantine/core/styles.css";
import "./App.css";
import { Route, Routes, Navigate } from "react-router";
import DashboardPage from "./pages/Dashboard";
import SignupPage from "./pages/Signup";
import { isAuthenticated } from "./utils";
import * as React from "react";
import { useEffect, useState } from "react";
import { Center, Loader, MantineProvider, createTheme } from "@mantine/core";

const theme = createTheme({
  // you can customize the theme if needed
});

const App: React.FC = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const authResult = await isAuthenticated();
        setIsAuth(authResult);
      } catch (error) {
        setIsAuth(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      {isLoading ? (
        <Center
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Loader size="xl" color="blue" />
        </Center>
      ) : (
        <Routes>
          {isAuth ? (
            <Route path="/" element={<DashboardPage />} />
          ) : (
            <>
              <Route path="/" element={<Navigate to="/signup" replace />} />
              <Route path="/signup" element={<SignupPage />} />
            </>
          )}
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </MantineProvider>
  );
};

export default App;
