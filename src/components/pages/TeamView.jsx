import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Avatar from '@/components/atoms/Avatar';
import ProgressRing from '@/components/atoms/ProgressRing';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { userService } from '@/services/api/userService';
import { taskService } from '@/services/api/taskService';
import { boardService } from '@/services/api/boardService';

const TeamView = () => {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [usersData, tasksData, boardsData] = await Promise.all([
        userService.getAll(),
        taskService.getAll(),
        boardService.getAll()
      ]);
      
      setUsers(usersData);
      setTasks(tasksData);
      setBoards(boardsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getUserStats = (userId) => {
    const userTasks = tasks.filter(task => task.assigneeId === userId);
    const completedTasks = userTasks.filter(task => {
      const board = boards.find(b => b.columns.some(c => c.id === task.columnId));
      if (!board) return false;
      const column = board.columns.find(c => c.id === task.columnId);
      return column && (column.name.toLowerCase() === 'done' || column.name.toLowerCase() === 'completed');
    }).length;

    const overdueTasks = userTasks.filter(task => {
      if (!task.dueDate) return false;
      return new Date(task.dueDate) < new Date();
    }).length;

    return {
      totalTasks: userTasks.length,
      completedTasks,
      overdueTasks,
      completionRate: userTasks.length > 0 ? Math.round((completedTasks / userTasks.length) * 100) : 0
    };
  };

  const getRecentTasks = (userId) => {
    return tasks
      .filter(task => task.assigneeId === userId)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 3);
  };

  if (loading) {
    return <Loading type="dashboard" />;
  }

  if (error) {
    return <Error title="Team View Error" message={error} onRetry={loadData} />;
  }

  if (users.length === 0) {
    return (
      <Empty
        title="No team members"
        message="Add team members to start collaborating on projects."
        icon="Users"
        actionLabel="Invite Team Member"
        onAction={() => console.log('Invite team member')}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team</h1>
          <p className="text-gray-600">Manage your team and track their progress</p>
        </div>
        <Button variant="primary">
          <ApperIcon name="UserPlus" size={16} />
          Invite Member
        </Button>
      </div>

      {/* Team Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-primary to-secondary text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/80">Total Members</p>
              <p className="text-3xl font-bold">{users.length}</p>
              <p className="text-sm text-white/80">Active team</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <ApperIcon name="Users" size={24} className="text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-success to-green-400 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/80">Active Tasks</p>
              <p className="text-3xl font-bold">{tasks.length}</p>
              <p className="text-sm text-white/80">In progress</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <ApperIcon name="Clock" size={24} className="text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-warning to-yellow-400 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/80">Projects</p>
              <p className="text-3xl font-bold">{boards.length}</p>
              <p className="text-sm text-white/80">Active boards</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <ApperIcon name="Folder" size={24} className="text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-accent to-pink-400 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/80">Completion</p>
              <p className="text-3xl font-bold">
                {Math.round((tasks.filter(t => {
                  const board = boards.find(b => b.columns.some(c => c.id === t.columnId));
                  if (!board) return false;
                  const column = board.columns.find(c => c.id === t.columnId);
                  return column && (column.name.toLowerCase() === 'done' || column.name.toLowerCase() === 'completed');
                }).length / tasks.length) * 100) || 0}%
              </p>
              <p className="text-sm text-white/80">Overall rate</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <ApperIcon name="TrendingUp" size={24} className="text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Team Members */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(user => {
          const stats = getUserStats(user.Id);
          const recentTasks = getRecentTasks(user.Id);

          return (
            <motion.div
              key={user.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar
                      src={user.avatar}
                      alt={user.name}
                      fallback={user.name.charAt(0).toUpperCase()}
                      size="lg"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  <ProgressRing progress={stats.completionRate} size="md" />
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{stats.totalTasks}</p>
                    <p className="text-xs text-gray-500">Total</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-success">{stats.completedTasks}</p>
                    <p className="text-xs text-gray-500">Completed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-error">{stats.overdueTasks}</p>
                    <p className="text-xs text-gray-500">Overdue</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Recent Tasks</h4>
                  <div className="space-y-2">
                    {recentTasks.map(task => (
                      <div key={task.Id} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-sm text-gray-600 truncate">{task.title}</span>
                      </div>
                    ))}
                    {recentTasks.length === 0 && (
                      <p className="text-sm text-gray-400">No recent tasks</p>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex justify-end space-x-2">
                  <Button variant="ghost" size="sm">
                    <ApperIcon name="MessageCircle" size={16} />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ApperIcon name="Mail" size={16} />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ApperIcon name="MoreHorizontal" size={16} />
                  </Button>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TeamView;