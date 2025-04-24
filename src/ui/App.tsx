import "@mantine/core/styles.css";
import "./App.css";
import { Route, Routes, Navigate } from "react-router";
import DashboardPage from "./pages/Dashboard";
import SignupPage from "./pages/Signup";
import { axiosInstance } from "./utils";
import React, { useEffect, useState } from "react";
import { Center, Loader, MantineProvider, createTheme } from "@mantine/core";

const theme = createTheme({
  // you can customize the theme if needed
});

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("useEffect running, isLoading:", isLoading);

    axiosInstance
      .get("/")
      .then((res) => {
        console.log("token is valid");
        console.log(res);
        setIsAuthenticated(false);
      })
      .catch((err) => {
        setIsAuthenticated(false);
        console.log("error verifying token", err);
      })
      .finally(() => {
        console.log("Setting isLoading to false");
        setIsLoading(false);
      });
  }, []);

  console.log("Rendering App, isLoading:", isLoading);

  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      {/* show a loader if the auth request is being verified */}
      {isLoading && (
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
      )}

      {/* show the dashboard page if the user is authenticated */}
      {!isLoading && (
        <Routes>
          {isAuthenticated ? (
            <Route path="/" element={<DashboardPage />} />
          ) : (
            <>
              <Route path="/" element={<Navigate to="/signup" replace />} />
              <Route path="/signup" element={<SignupPage />} />
            </>
          )}
        </Routes>
      )}
    </MantineProvider>
  );
};

export default App;
