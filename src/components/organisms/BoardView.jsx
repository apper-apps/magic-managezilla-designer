import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import TaskCard from "@/components/molecules/TaskCard";
import { userService } from "@/services/api/userService";
import { taskService } from "@/services/api/taskService";

const BoardView = ({ board, onTaskClick, onTaskUpdate }) => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);

  useEffect(() => {
    loadData();
  }, [board.Id]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksData, usersData] = await Promise.all([
        taskService.getAll(),
        userService.getAll()
      ]);
      setTasks(tasksData);
      setUsers(usersData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (task) => {
    setDraggedTask(task);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

const handleDrop = async (e, columnId) => {
    e.preventDefault();
    
    if (!draggedTask || draggedTask.columnId === columnId) {
      return;
    }

    try {
      const updatedTask = { ...draggedTask, columnId };
      await taskService.update(draggedTask.Id, updatedTask);
      
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.Id === draggedTask.Id
            ? { ...task, columnId }
            : task
        )
      );
      
      if (onTaskUpdate) {
        onTaskUpdate(updatedTask);
      }
      
      toast.success('Task moved successfully');
    } catch (err) {
      toast.error('Failed to move task');
      console.error('Error moving task:', err);
    }
  };

  const getTasksByColumn = (columnId) => {
    return tasks.filter(task => 
      task.columnId === columnId && 
      board.columns.some(col => col.id === task.columnId)
    );
  };

  const getUserById = (userId) => {
    return users.find(user => user.Id === userId) || null;
  };

  const getColumnColor = (columnName) => {
    switch (columnName.toLowerCase()) {
      case 'todo':
      case 'to do':
        return 'column-todo';
      case 'in progress':
      case 'progress':
        return 'column-progress';
      case 'done':
      case 'completed':
        return 'column-done';
      default:
        return 'bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex space-x-6 p-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex-1 bg-white rounded-lg p-4">
            <div className="shimmer h-6 w-24 mb-4 rounded"></div>
            <div className="space-y-3">
              {[1, 2, 3].map(j => (
                <div key={j} className="shimmer h-24 rounded-lg"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <ApperIcon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Board</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadData}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex space-x-6 p-6 h-full overflow-x-auto">
      {board.columns.map(column => {
        const columnTasks = getTasksByColumn(column.id);
        
        return (
          <div
            key={column.id}
            className="flex-shrink-0 w-80"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <Card className={cn(
              'h-full min-h-[600px] p-4',
              draggedTask && draggedTask.columnId !== column.id && 'drop-zone'
            )}>
              <div className={cn(
                'flex items-center justify-between mb-4 p-3 rounded-lg',
                getColumnColor(column.name)
              )}>
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-gray-900">
                    {column.name}
                  </h3>
                  <span className="text-sm text-gray-500">
                    ({columnTasks.length})
                  </span>
                </div>
<Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    onTaskClick(null);
                  }}
                >
                  <ApperIcon name="Plus" size={16} />
                </Button>
              </div>

              <div className="space-y-3">
                <AnimatePresence>
                  {columnTasks.map(task => (
                    <motion.div
                      key={task.Id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <TaskCard
                        task={task}
                        user={getUserById(task.assigneeId)}
                        onClick={() => onTaskClick(task)}
                        onDragStart={() => handleDragStart(task)}
                        onDragEnd={handleDragEnd}
                        className={draggedTask?.Id === task.Id ? 'dragging' : ''}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {columnTasks.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <ApperIcon name="Plus" size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No tasks yet</p>
                  <p className="text-xs text-gray-400">Drag a task here or click + to add</p>
                </div>
              )}
            </Card>
          </div>
        );
      })}
    </div>
  );
};

export default BoardView;