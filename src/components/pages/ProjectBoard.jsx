import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ViewToggle from "@/components/molecules/ViewToggle";
import FilterBar from "@/components/molecules/FilterBar";
import BoardView from "@/components/organisms/BoardView";
import TableView from "@/components/organisms/TableView";
import TaskModal from "@/components/organisms/TaskModal";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { boardService } from "@/services/api/boardService";
import { userService } from "@/services/api/userService";

const ProjectBoard = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState('board');
  const [selectedTask, setSelectedTask] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    assignee: '',
    priority: '',
    dueDate: ''
  });

  useEffect(() => {
    loadBoard();
  }, [boardId]);

  const loadBoard = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [boardData, usersData] = await Promise.all([
        boardService.getById(parseInt(boardId)),
        userService.getAll()
      ]);
      
      setBoard(boardData);
      setUsers(usersData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleTaskSave = (savedTask) => {
    // Refresh the board data
    loadBoard();
  };

  const handleCreateTask = () => {
    setSelectedTask(null);
    setIsTaskModalOpen(true);
  };

  if (loading) {
    return <Loading type={activeView} />;
  }

  if (error) {
    return <Error title="Board Error" message={error} onRetry={loadBoard} />;
  }

  if (!board) {
    return (
      <Empty
        title="Board not found"
        message="The board you're looking for doesn't exist or has been deleted."
        icon="FolderX"
        actionLabel="Back to Dashboard"
        onAction={() => navigate('/')}
      />
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{board.name}</h1>
            <p className="text-gray-600">Manage tasks and track progress</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="primary" onClick={handleCreateTask}>
              <ApperIcon name="Plus" size={16} />
              Add Task
            </Button>
            <Button variant="outline">
              <ApperIcon name="Users" size={16} />
              Invite
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <FilterBar
            users={users}
            onFilterChange={setFilters}
          />
          <ViewToggle
            activeView={activeView}
            onViewChange={setActiveView}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeView === 'board' ? (
          <BoardView
            board={board}
            onTaskClick={handleTaskClick}
            onTaskUpdate={handleTaskSave}
          />
        ) : (
          <TableView
            board={board}
            onTaskClick={handleTaskClick}
            onTaskUpdate={handleTaskSave}
          />
        )}
      </div>

      {/* Task Modal */}
      <TaskModal
        task={selectedTask}
        board={board}
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleTaskSave}
      />
    </div>
  );
};

export default ProjectBoard;