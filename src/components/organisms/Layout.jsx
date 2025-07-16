import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";
import { boardService } from "@/services/api/boardService";
import { useTheme } from "@/contexts/ThemeContext";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [boards, setBoards] = useState([]);
  const { isDarkMode } = useTheme();
  useEffect(() => {
    const loadBoards = async () => {
      try {
        const boardsData = await boardService.getAll();
        setBoards(boardsData);
      } catch (error) {
        console.error('Error loading boards:', error);
      }
    };
    loadBoards();
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
return (
    <div className="min-h-screen bg-background">
      <Sidebar 
        boards={boards}
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
      />
      
      <div className="lg:ml-60">
        <Header onMenuToggle={toggleSidebar} />
        <main className="min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
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
        theme={isDarkMode ? "dark" : "light"}
        style={{
          zIndex: 9999
        }}
      />
    </div>
  );
};

export default Layout;