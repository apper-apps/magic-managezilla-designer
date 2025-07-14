import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from '@/components/organisms/Layout';
import Dashboard from '@/components/pages/Dashboard';
import MyWork from '@/components/pages/MyWork';
import ProjectBoard from '@/components/pages/ProjectBoard';
import TeamView from '@/components/pages/TeamView';
import Settings from '@/components/pages/Settings';

function App() {
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/my-work" element={<MyWork />} />
          <Route path="/project/:boardId" element={<ProjectBoard />} />
          <Route path="/team" element={<TeamView />} />
          <Route path="/settings" element={<Settings />} />
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
        style={{ zIndex: 9999 }}
      />
    </>
  );
}

export default App;