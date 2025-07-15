import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { adminService } from '@/services/api/adminService';
import { userService } from '@/services/api/userService';
import { taskService } from '@/services/api/taskService';
import { boardService } from '@/services/api/boardService';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState({
    users: [],
    analytics: {},
    systemStats: {},
    settings: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    role: 'user',
    status: 'active'
  });

  const tabs = [
    { id: 'overview', name: 'Overview', icon: 'LayoutDashboard' },
    { id: 'users', name: 'Users', icon: 'Users' },
    { id: 'analytics', name: 'Analytics', icon: 'BarChart3' },
    { id: 'system', name: 'System', icon: 'Settings' },
    { id: 'settings', name: 'Settings', icon: 'Cog' }
  ];

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [adminData, users, tasks, boards] = await Promise.all([
        adminService.getAll(),
        userService.getAll(),
        taskService.getAll(),
        boardService.getAll()
      ]);

      const analytics = calculateAnalytics(users, tasks, boards);
      
      setData({
        ...adminData,
        users,
        analytics
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (users, tasks, boards) => {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status === 'active').length;
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const totalBoards = boards.length;
    
    return {
      totalUsers,
      activeUsers,
      totalTasks,
      completedTasks,
      totalBoards,
      userGrowth: '+12%',
      taskCompletion: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      systemHealth: 98
    };
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingUser) {
        await userService.update(editingUser.Id, userForm);
        toast.success('User updated successfully');
      } else {
        await userService.create(userForm);
        toast.success('User created successfully');
      }
      
      setUserModalOpen(false);
      setEditingUser(null);
      setUserForm({ name: '', email: '', role: 'user', status: 'active' });
      loadAdminData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    });
    setUserModalOpen(true);
  };

  const handleDeleteUser = async (userId) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.delete(userId);
        toast.success('User deleted successfully');
        loadAdminData();
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
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
                <p className="text-sm text-white/80">Total Users</p>
                <p className="text-3xl font-bold">{data.analytics.totalUsers}</p>
                <p className="text-sm text-white/80">{data.analytics.userGrowth} this month</p>
              </div>
              <ApperIcon name="Users" size={24} className="text-white/80" />
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
                <p className="text-sm text-white/80">Active Users</p>
                <p className="text-3xl font-bold">{data.analytics.activeUsers}</p>
                <p className="text-sm text-white/80">Currently online</p>
              </div>
              <ApperIcon name="UserCheck" size={24} className="text-white/80" />
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
                <p className="text-sm text-white/80">Total Tasks</p>
                <p className="text-3xl font-bold">{data.analytics.totalTasks}</p>
                <p className="text-sm text-white/80">{data.analytics.taskCompletion}% completed</p>
              </div>
              <ApperIcon name="ClipboardList" size={24} className="text-white/80" />
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
                <p className="text-sm text-white/80">System Health</p>
                <p className="text-3xl font-bold">{data.analytics.systemHealth}%</p>
                <p className="text-sm text-white/80">All systems operational</p>
              </div>
              <ApperIcon name="Activity" size={24} className="text-white/80" />
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {data.systemStats.recentActivity?.map((activity, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <ApperIcon name={activity.icon} size={14} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
        <Button onClick={() => setUserModalOpen(true)}>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add User
        </Button>
      </div>

      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Email</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Role</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map((user) => (
                <tr key={user.Id} className="border-b border-gray-100">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{user.email}</td>
                  <td className="py-3 px-4">
                    <Badge variant={user.role === 'admin' ? 'error' : 'secondary'}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={user.status === 'active' ? 'success' : 'secondary'}>
                      {user.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                      >
                        <ApperIcon name="Edit" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteUser(user.Id)}
                      >
                        <ApperIcon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* User Modal */}
      {userModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingUser ? 'Edit User' : 'Add User'}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setUserModalOpen(false);
                  setEditingUser(null);
                  setUserForm({ name: '', email: '', role: 'user', status: 'active' });
                }}
              >
                <ApperIcon name="X" size={16} />
              </Button>
            </div>
            
            <form onSubmit={handleUserSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <Input
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <Select
                  value={userForm.role}
                  onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <Select
                  value={userForm.status}
                  onChange={(e) => setUserForm({ ...userForm, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Select>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button type="submit" className="flex-1">
                  {editingUser ? 'Update' : 'Create'} User
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setUserModalOpen(false);
                    setEditingUser(null);
                    setUserForm({ name: '', email: '', role: 'user', status: 'active' });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Analytics Dashboard</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h4 className="font-medium text-gray-900 mb-4">User Growth</h4>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <ApperIcon name="TrendingUp" size={48} className="text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Chart visualization would go here</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="font-medium text-gray-900 mb-4">Task Completion</h4>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <ApperIcon name="PieChart" size={48} className="text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Chart visualization would go here</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderSystem = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">System Monitoring</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h4 className="font-medium text-gray-900 mb-4">Server Status</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">API Server</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-sm text-success">Online</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-sm text-success">Online</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Cache</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-warning rounded-full"></div>
                <span className="text-sm text-warning">Degraded</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="font-medium text-gray-900 mb-4">Performance</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Response Time</span>
              <span className="text-sm font-medium">145ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">CPU Usage</span>
              <span className="text-sm font-medium">34%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Memory Usage</span>
              <span className="text-sm font-medium">67%</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Application Settings</h3>
      
      <Card className="p-6">
        <h4 className="font-medium text-gray-900 mb-4">General Settings</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
            <Input defaultValue="ManageZilla" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Default Language</label>
            <Select defaultValue="en">
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
            <Select defaultValue="UTC">
              <option value="UTC">UTC</option>
              <option value="EST">Eastern Time</option>
              <option value="PST">Pacific Time</option>
            </Select>
          </div>
        </div>
        <div className="mt-6">
          <Button>Save Settings</Button>
        </div>
      </Card>
    </div>
  );

  if (loading) {
    return <Loading type="dashboard" />;
  }

  if (error) {
    return <Error title="Admin Dashboard Error" message={error} onRetry={loadAdminData} />;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your application settings and monitor system health</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <ApperIcon name={tab.icon} size={16} />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'system' && renderSystem()}
        {activeTab === 'settings' && renderSettings()}
      </motion.div>
    </div>
  );
};

export default AdminDashboard;