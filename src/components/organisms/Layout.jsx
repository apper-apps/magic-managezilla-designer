import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import Header from '@/components/organisms/Header';
import Sidebar from '@/components/organisms/Sidebar';
import { boardService } from '@/services/api/boardService';
const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [boards, setBoards] = useState([]);

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
        theme="light"
      />
    </div>
  );
};

export default Layout;