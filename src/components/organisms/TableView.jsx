import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Avatar from '@/components/atoms/Avatar';
import PriorityBadge from '@/components/molecules/PriorityBadge';
import ApperIcon from '@/components/ApperIcon';
import { taskService } from '@/services/api/taskService';
import { userService } from '@/services/api/userService';
import { cn } from '@/utils/cn';

const TableView = ({ board, onTaskClick, onTaskUpdate }) => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');

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

  const getUserById = (userId) => {
    return users.find(user => user.Id === userId);
  };

  const getColumnName = (columnId) => {
    const column = board.columns.find(col => col.id === columnId);
    return column ? column.name : 'Unknown';
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

const sortedTasks = [...boardTasks].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (sortField === 'assigneeId') {
      const aUser = getUserById(aValue);
      const bUser = getUserById(bValue);
      aValue = aUser ? aUser.name : '';
      bValue = bUser ? bUser.name : '';
    }

    if (sortField === 'columnId') {
      aValue = getColumnName(aValue);
      bValue = getColumnName(bValue);
    }

    if (sortField === 'dueDate') {
      aValue = aValue ? new Date(aValue) : new Date(0);
      bValue = bValue ? new Date(bValue) : new Date(0);
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
const boardTasks = tasks.filter(task => 
    board.columns.some(col => col.id === task.columnId)
  );

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ApperIcon name="ArrowUpDown" size={16} className="text-gray-400" />;
    return sortDirection === 'asc' ? 
      <ApperIcon name="ArrowUp" size={16} className="text-primary" /> : 
      <ApperIcon name="ArrowDown" size={16} className="text-primary" />;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="shimmer h-12 w-full mb-4"></div>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="shimmer h-16 w-full mb-2"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <ApperIcon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Tasks</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadData}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('title')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Task</span>
                    <SortIcon field="title" />
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('columnId')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Status</span>
                    <SortIcon field="columnId" />
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('assigneeId')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Assignee</span>
                    <SortIcon field="assigneeId" />
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('priority')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Priority</span>
                    <SortIcon field="priority" />
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('dueDate')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Due Date</span>
                    <SortIcon field="dueDate" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedTasks.map(task => {
                const user = getUserById(task.assigneeId);
                
                return (
                  <tr 
                    key={task.Id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => onTaskClick(task)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {task.title}
                        </div>
                        {task.description && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {task.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary/10 text-primary">
                        {getColumnName(task.columnId)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user ? (
                        <div className="flex items-center space-x-2">
                          <Avatar
                            src={user.avatar}
                            alt={user.name}
                            fallback={user.name.charAt(0).toUpperCase()}
                            size="sm"
                          />
                          <span className="text-sm text-gray-900">{user.name}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <PriorityBadge priority={task.priority} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : 'No due date'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onTaskClick(task);
                          }}
                        >
                          <ApperIcon name="Edit" size={16} />
                        </Button>
<Button
                          variant="ghost"
                          size="sm"
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (window.confirm('Are you sure you want to delete this task?')) {
                              try {
                                await taskService.delete(task.Id);
                                setTasks(tasks.filter(t => t.Id !== task.Id));
                                toast.success('Task deleted successfully');
                                onTaskUpdate?.(null);
                              } catch (error) {
                                toast.error('Failed to delete task');
                              }
                            }
                          }}
                        >
                          <ApperIcon name="Trash2" size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {sortedTasks.length === 0 && (
          <div className="text-center py-12">
            <ApperIcon name="ClipboardList" size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-600">Get started by creating your first task.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableView;