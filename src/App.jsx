import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "@/contexts/ThemeContext";
import React from "react";
import Layout from "@/components/organisms/Layout";
import AdminDashboard from "@/components/pages/AdminDashboard";
import Settings from "@/components/pages/Settings";
import TeamView from "@/components/pages/TeamView";
import Dashboard from "@/components/pages/Dashboard";
import ProjectBoard from "@/components/pages/ProjectBoard";
import MyWork from "@/components/pages/MyWork";

function App() {
  return (
    <ThemeProvider>
    <Layout>
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/my-work" element={<MyWork />} />
            <Route path="/project/:boardId" element={<ProjectBoard />} />
            <Route path="/team" element={<TeamView />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
    </Layout>
    <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{
            zIndex: 9999
        }} />
</ThemeProvider>
  );
}

export default App;