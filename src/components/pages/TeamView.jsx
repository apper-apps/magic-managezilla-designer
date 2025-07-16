import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Avatar from '@/components/atoms/Avatar';
import ProgressRing from '@/components/atoms/ProgressRing';
import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import Select from '@/components/atoms/Select';
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
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', role: 'member' });
  const [isInviting, setIsInviting] = useState(false);
  const [openOptionsMenu, setOpenOptionsMenu] = useState(null);
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);
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
        onAction={() => setIsInviteModalOpen(true)}
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
<Button 
          variant="primary"
          onClick={() => setIsInviteModalOpen(true)}
        >
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
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      toast.info(`Opening chat with ${user.name}`);
                      // Integration point for future chat feature
                    }}
                  >
                    <ApperIcon name="MessageCircle" size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      window.location.href = `mailto:${user.email}?subject=Team Communication&body=Hi ${user.name},%0D%0A%0D%0A`;
                      toast.success(`Opening email to ${user.name}`);
                    }}
                  >
                    <ApperIcon name="Mail" size={16} />
                  </Button>
                  <div className="relative">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setOpenOptionsMenu(openOptionsMenu === user.Id ? null : user.Id);
                      }}
                    >
                      <ApperIcon name="MoreHorizontal" size={16} />
                    </Button>
                    {openOptionsMenu === user.Id && (
                      <UserOptionsMenu 
                        user={user}
                        onClose={() => setOpenOptionsMenu(null)}
                        onEdit={(editUser) => handleEditUser(editUser)}
                        onRemove={(removeUser) => handleRemoveUser(removeUser)}
                        onRoleChange={(userId, newRole) => handleRoleChange(userId, newRole)}
                        isUpdatingRole={isUpdatingRole}
                      />
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
</div>

      {/* Invite Member Modal */}
      {isInviteModalOpen && (
        <InviteModal
          isOpen={isInviteModalOpen}
          onClose={() => {
            setIsInviteModalOpen(false);
            setInviteForm({ name: '', email: '', role: 'member' });
          }}
          onInvite={handleInviteUser}
          inviteForm={inviteForm}
          setInviteForm={setInviteForm}
          isInviting={isInviting}
        />
      )}
    </div>
  );

  // Handle invite user functionality
  async function handleInviteUser() {
    if (!inviteForm.name.trim() || !inviteForm.email.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!inviteForm.email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsInviting(true);
    try {
      const newUser = await userService.create({
        name: inviteForm.name.trim(),
        email: inviteForm.email.trim(),
        role: inviteForm.role,
        avatar: null,
        status: 'active',
        joinDate: new Date().toISOString()
      });

      setUsers(prev => [...prev, newUser]);
      setIsInviteModalOpen(false);
      setInviteForm({ name: '', email: '', role: 'member' });
      toast.success(`${newUser.name} has been invited to the team!`);
    } catch (err) {
      toast.error(`Failed to invite user: ${err.message}`);
    } finally {
      setIsInviting(false);
    }
  }

  // Handle edit user functionality
  function handleEditUser(user) {
    setOpenOptionsMenu(null);
    toast.info(`Edit functionality for ${user.name} will be implemented soon`);
    // Future implementation: Open edit user modal
  }

  // Handle remove user functionality
  async function handleRemoveUser(user) {
    setOpenOptionsMenu(null);
    
    if (!window.confirm(`Are you sure you want to remove ${user.name} from the team? This action cannot be undone.`)) {
      return;
    }

    try {
      await userService.delete(user.Id);
      setUsers(prev => prev.filter(u => u.Id !== user.Id));
      toast.success(`${user.name} has been removed from the team`);
    } catch (err) {
      toast.error(`Failed to remove user: ${err.message}`);
    }
  }

  // Handle role change functionality
  async function handleRoleChange(userId, newRole) {
    setIsUpdatingRole(true);
    try {
      const updatedUser = await userService.updateRole(userId, newRole);
      setUsers(prev => prev.map(u => u.Id === userId ? updatedUser : u));
      setOpenOptionsMenu(null);
      toast.success(`User role updated to ${newRole}`);
    } catch (err) {
      toast.error(`Failed to update role: ${err.message}`);
    } finally {
      setIsUpdatingRole(false);
    }
  }
};

// Invite Modal Component
const InviteModal = ({ isOpen, onClose, onInvite, inviteForm, setInviteForm, isInviting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Invite Team Member</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <ApperIcon name="X" size={20} />
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter full name"
              value={inviteForm.name}
              onChange={(e) => setInviteForm(prev => ({ ...prev, name: e.target.value }))}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email address"
              value={inviteForm.email}
              onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="role">Role</Label>
            <Select
              value={inviteForm.role}
              onValueChange={(value) => setInviteForm(prev => ({ ...prev, role: value }))}
              className="mt-1"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="viewer">Viewer</option>
            </Select>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="outline" onClick={onClose} disabled={isInviting}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={onInvite}
            disabled={isInviting}
          >
            {isInviting ? (
              <>
                <ApperIcon name="Loader2" size={16} className="animate-spin" />
                Inviting...
              </>
            ) : (
              <>
                <ApperIcon name="UserPlus" size={16} />
                Send Invite
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

// User Options Menu Component
const UserOptionsMenu = ({ user, onClose, onEdit, onRemove, onRoleChange, isUpdatingRole }) => {
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />
      
      {/* Menu */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
      >
        <div className="py-2">
          <button
            onClick={() => onEdit(user)}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
          >
            <ApperIcon name="Edit" size={16} />
            <span>Edit Profile</span>
          </button>
          
          <button
            onClick={() => setShowRoleSelector(!showRoleSelector)}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between"
            disabled={isUpdatingRole}
          >
            <div className="flex items-center space-x-2">
              <ApperIcon name="Shield" size={16} />
              <span>Change Role</span>
            </div>
            <ApperIcon name={showRoleSelector ? "ChevronUp" : "ChevronDown"} size={16} />
          </button>

          {showRoleSelector && (
            <div className="border-t border-gray-100 py-1">
              {['member', 'admin', 'manager', 'viewer'].map(role => (
                <button
                  key={role}
                  onClick={() => onRoleChange(user.Id, role)}
                  className={`w-full px-8 py-2 text-left text-sm hover:bg-gray-50 capitalize ${
                    user.role === role ? 'text-primary font-medium' : 'text-gray-600'
                  }`}
                  disabled={isUpdatingRole || user.role === role}
                >
                  {isUpdatingRole ? (
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Loader2" size={14} className="animate-spin" />
                      <span>{role}</span>
                    </div>
                  ) : (
                    role
                  )}
                </button>
              ))}
            </div>
          )}

          <div className="border-t border-gray-100 pt-1">
            <button
              onClick={() => onRemove(user)}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
            >
              <ApperIcon name="UserMinus" size={16} />
              <span>Remove from Team</span>
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default TeamView;