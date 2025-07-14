import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import ProgressRing from '@/components/atoms/ProgressRing';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { boardService } from '@/services/api/boardService';
import { taskService } from '@/services/api/taskService';
import { userService } from '@/services/api/userService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    boards: [],
    tasks: [],
    users: [],
    stats: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [boards, tasks, users] = await Promise.all([
        boardService.getAll(),
        taskService.getAll(),
        userService.getAll()
      ]);

      const stats = calculateStats(boards, tasks, users);
      
      setData({ boards, tasks, users, stats });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (boards, tasks, users) => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => {
      const board = boards.find(b => b.columns.some(c => c.id === task.columnId));
      if (!board) return false;
      const column = board.columns.find(c => c.id === task.columnId);
      return column && (column.name.toLowerCase() === 'done' || column.name.toLowerCase() === 'completed');
    }).length;

    const overdueTasks = tasks.filter(task => {
      if (!task.dueDate) return false;
      return new Date(task.dueDate) < new Date();
    }).length;

    const myTasks = tasks.filter(task => task.assigneeId === 'user-1').length;

    return {
      totalTasks,
      completedTasks,
      overdueTasks,
      myTasks,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    };
  };

  const recentTasks = data.tasks
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const priorityTasks = data.tasks
    .filter(task => task.priority === 'high' || task.priority === 'urgent')
    .slice(0, 5);

  if (loading) {
    return <Loading type="dashboard" />;
  }

  if (error) {
    return <Error title="Dashboard Error" message={error} onRetry={loadDashboardData} />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 bg-gradient-to-br from-primary to-secondary text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">Total Tasks</p>
                <p className="text-3xl font-bold">{data.stats.totalTasks}</p>
                <p className="text-sm text-white/80">Active projects</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <ApperIcon name="ClipboardList" size={24} className="text-white" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-gradient-to-br from-success to-green-400 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">Completed</p>
                <p className="text-3xl font-bold">{data.stats.completedTasks}</p>
                <p className="text-sm text-white/80">{data.stats.completionRate}% completion</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <ApperIcon name="CheckCircle" size={24} className="text-white" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-gradient-to-br from-warning to-yellow-400 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">Overdue</p>
                <p className="text-3xl font-bold">{data.stats.overdueTasks}</p>
                <p className="text-sm text-white/80">Need attention</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <ApperIcon name="AlertTriangle" size={24} className="text-white" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 bg-gradient-to-br from-accent to-pink-400 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">My Tasks</p>
                <p className="text-3xl font-bold">{data.stats.myTasks}</p>
                <p className="text-sm text-white/80">Assigned to me</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <ApperIcon name="User" size={24} className="text-white" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Projects and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Active Projects</h3>
              <Button variant="ghost" size="sm">
                <ApperIcon name="Plus" size={16} />
                New Project
              </Button>
            </div>
            
            <div className="space-y-4">
              {data.boards.map(board => {
                const boardTasks = data.tasks.filter(task => 
                  board.columns.some(col => col.id === task.columnId)
                );
                const completedTasks = boardTasks.filter(task => {
                  const column = board.columns.find(c => c.id === task.columnId);
                  return column && (column.name.toLowerCase() === 'done' || column.name.toLowerCase() === 'completed');
                }).length;
                const progress = boardTasks.length > 0 ? Math.round((completedTasks / boardTasks.length) * 100) : 0;

                return (
                  <motion.div
                    key={board.Id}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => navigate(`/project/${board.Id}`)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                        <ApperIcon name="FolderOpen" size={20} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{board.name}</h4>
                        <p className="text-sm text-gray-600">{boardTasks.length} tasks</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <ProgressRing progress={progress} size="sm" />
                      <ApperIcon name="ChevronRight" size={16} className="text-gray-400" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <Button variant="ghost" size="sm">
                <ApperIcon name="MoreHorizontal" size={16} />
              </Button>
            </div>
            
            <div className="space-y-4">
              {recentTasks.map(task => (
                <div key={task.Id} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                    <ApperIcon name="CheckCircle" size={14} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{task.title}</p>
                    <p className="text-xs text-gray-500">Updated recently</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Priority Tasks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">High Priority Tasks</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/my-work')}>
              View All
              <ApperIcon name="ArrowRight" size={16} className="ml-1" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {priorityTasks.map(task => (
              <motion.div
                key={task.Id}
                whileHover={{ scale: 1.02 }}
                className="p-4 bg-gradient-to-br from-error/10 to-warning/10 rounded-lg border border-error/20 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    task.priority === 'urgent' ? 'bg-error text-white' : 'bg-warning text-gray-900'
                  }`}>
                    {task.priority}
                  </span>
                  <ApperIcon name="AlertTriangle" size={16} className="text-error" />
                </div>
                <h4 className="font-medium text-gray-900 mb-1">{task.title}</h4>
                <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;