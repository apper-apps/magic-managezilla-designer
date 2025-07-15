import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Avatar from '@/components/atoms/Avatar';
import FilterBar from '@/components/molecules/FilterBar';
import PriorityBadge from '@/components/molecules/PriorityBadge';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { taskService } from '@/services/api/taskService';
import { userService } from '@/services/api/userService';
import { boardService } from '@/services/api/boardService';

const MyWork = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    assignee: '',
    priority: '',
    dueDate: ''
  });
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [tasksData, usersData, boardsData] = await Promise.all([
        taskService.getAll(),
        userService.getAll(),
        boardService.getAll()
      ]);
      
      setTasks(tasksData);
      setUsers(usersData);
      setBoards(boardsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getUserById = (userId) => {
    return users.find(user => user.Id === userId);
  };

  const getColumnName = (columnId) => {
    for (const board of boards) {
      const column = board.columns.find(col => col.id === columnId);
      if (column) return column.name;
    }
    return 'Unknown';
  };

  const getBoardName = (columnId) => {
    for (const board of boards) {
      const column = board.columns.find(col => col.id === columnId);
      if (column) return board.name;
    }
    return 'Unknown';
  };

  const filteredTasks = tasks.filter(task => {
    // Tab filtering
    const currentUser = 'user-1'; // Mock current user
    switch (activeTab) {
      case 'assigned':
        if (task.assigneeId !== currentUser) return false;
        break;
      case 'overdue':
        if (!task.dueDate || new Date(task.dueDate) >= new Date()) return false;
        break;
      case 'high-priority':
        if (task.priority !== 'high' && task.priority !== 'urgent') return false;
        break;
    }

    // Filter bar filtering
    if (filters.assignee && task.assigneeId !== filters.assignee) return false;
    if (filters.priority && task.priority !== filters.priority) return false;
    if (filters.dueDate) {
      const today = new Date();
      const taskDate = task.dueDate ? new Date(task.dueDate) : null;
      
      switch (filters.dueDate) {
        case 'today':
          if (!taskDate || taskDate.toDateString() !== today.toDateString()) return false;
          break;
        case 'week':
          const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
          if (!taskDate || taskDate > weekFromNow) return false;
          break;
        case 'overdue':
          if (!taskDate || taskDate >= today) return false;
          break;
      }
    }

    return true;
  });

  const tabs = [
    { id: 'all', name: 'All Tasks', count: tasks.length },
    { id: 'assigned', name: 'Assigned to Me', count: tasks.filter(t => t.assigneeId === 'user-1').length },
    { id: 'overdue', name: 'Overdue', count: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date()).length },
    { id: 'high-priority', name: 'High Priority', count: tasks.filter(t => t.priority === 'high' || t.priority === 'urgent').length }
  ];

  if (loading) {
    return <Loading type="table" />;
  }

  if (error) {
    return <Error title="My Work Error" message={error} onRetry={loadData} />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Work</h1>
          <p className="text-gray-600">Manage your tasks and track your progress</p>
        </div>
<Button 
          variant="primary"
          onClick={() => {
            // TODO: Open create task modal
            console.log('Opening create task modal');
          }}
        >
          <ApperIcon name="Plus" size={16} />
          Create Task
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
              <span className="ml-2 py-0.5 px-2 rounded-full bg-gray-100 text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <FilterBar
          users={users}
          onFilterChange={setFilters}
        />
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <Empty
            title="No tasks found"
            message="No tasks match your current filters. Try adjusting your filters or create a new task."
            icon="ClipboardList"
            actionLabel="Create New Task"
onAction={() => {
              // TODO: Open create task modal
              console.log('Creating new task');
            }}
          />
        ) : (
          filteredTasks.map(task => {
            const user = getUserById(task.assigneeId);
            const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
            
            return (
              <motion.div
                key={task.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Card className={`p-6 hover:shadow-lg transition-shadow cursor-pointer ${
                  isOverdue ? 'ring-2 ring-error/20 bg-error/5' : ''
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                        <PriorityBadge priority={task.priority} />
                        {isOverdue && (
                          <Badge variant="error">
                            <ApperIcon name="AlertTriangle" size={12} className="mr-1" />
                            Overdue
                          </Badge>
                        )}
                      </div>
                      
                      {task.description && (
                        <p className="text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="Folder" size={14} />
                          <span>{getBoardName(task.columnId)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="Circle" size={14} />
                          <span>{getColumnName(task.columnId)}</span>
                        </div>
                        {task.dueDate && (
                          <div className="flex items-center space-x-1">
                            <ApperIcon name="Calendar" size={14} />
                            <span>{format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {user && (
                        <div className="flex items-center space-x-2">
                          <Avatar
                            src={user.avatar}
                            alt={user.name}
                            fallback={user.name.charAt(0).toUpperCase()}
                            size="sm"
                          />
                          <span className="text-sm text-gray-600">{user.name}</span>
                        </div>
                      )}
<Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          // TODO: Open task options menu
                          console.log('Opening options for task', task.title);
                        }}
                      >
                        <ApperIcon name="MoreHorizontal" size={16} />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MyWork;