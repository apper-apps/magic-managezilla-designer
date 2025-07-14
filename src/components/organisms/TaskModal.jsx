import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import Avatar from '@/components/atoms/Avatar';
import PriorityBadge from '@/components/molecules/PriorityBadge';
import ApperIcon from '@/components/ApperIcon';
import { taskService } from '@/services/api/taskService';
import { userService } from '@/services/api/userService';
import { format } from 'date-fns';

const TaskModal = ({ task, board, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    columnId: '',
    assigneeId: '',
    priority: 'medium',
    dueDate: ''
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        columnId: task.columnId || '',
        assigneeId: task.assigneeId || '',
        priority: task.priority || 'medium',
        dueDate: task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        columnId: board?.columns?.[0]?.id || '',
        assigneeId: '',
        priority: 'medium',
        dueDate: ''
      });
    }
  }, [task, board]);

  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen]);

  const loadUsers = async () => {
    try {
      const usersData = await userService.getAll();
      setUsers(usersData);
    } catch (err) {
      setError('Failed to load users');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const taskData = {
        ...formData,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
      };

      let savedTask;
      if (task) {
        savedTask = await taskService.update(task.Id, taskData);
        toast.success('Task updated successfully');
      } else {
        savedTask = await taskService.create(taskData);
        toast.success('Task created successfully');
      }

      onSave(savedTask);
      onClose();
    } catch (err) {
      setError(err.message);
      toast.error('Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!task || !window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    setLoading(true);
    try {
      await taskService.delete(task.Id);
      toast.success('Task deleted successfully');
      onSave(null); // Signal deletion
      onClose();
    } catch (err) {
      toast.error('Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 modal-backdrop"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {task ? 'Edit Task' : 'Create New Task'}
            </h2>
            <div className="flex items-center space-x-2">
              {task && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  disabled={loading}
                  className="text-error hover:bg-error/10"
                >
                  <ApperIcon name="Trash2" size={16} />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                disabled={loading}
              >
                <ApperIcon name="X" size={20} />
              </Button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-error/10 border border-error/20 rounded-md p-3">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="AlertCircle" size={16} className="text-error" />
                  <span className="text-sm text-error">{error}</span>
                </div>
              </div>
            )}

            <FormField
              label="Task Title"
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter task title..."
              required
            />

            <FormField
              label="Description"
              type="textarea"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Enter task description..."
              rows={4}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Status"
                type="select"
                value={formData.columnId}
                onChange={(e) => handleChange('columnId', e.target.value)}
                required
              >
                {board?.columns?.map(column => (
                  <option key={column.id} value={column.id}>
                    {column.name}
                  </option>
                ))}
              </FormField>

              <FormField
                label="Assignee"
                type="select"
                value={formData.assigneeId}
                onChange={(e) => handleChange('assigneeId', e.target.value)}
              >
                <option value="">Unassigned</option>
                {users.map(user => (
                  <option key={user.Id} value={user.Id}>
                    {user.name}
                  </option>
                ))}
              </FormField>

              <FormField
                label="Priority"
                type="select"
                value={formData.priority}
                onChange={(e) => handleChange('priority', e.target.value)}
                required
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </FormField>

              <FormField
                label="Due Date"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleChange('dueDate', e.target.value)}
              />
            </div>

            {/* Preview */}
            {formData.title && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Preview</h3>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{formData.title}</h4>
                    <PriorityBadge priority={formData.priority} />
                  </div>
                  {formData.description && (
                    <p className="text-sm text-gray-600 mb-3">{formData.description}</p>
                  )}
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    {formData.dueDate && (
                      <div className="flex items-center space-x-1">
                        <ApperIcon name="Calendar" size={12} />
                        <span>{format(new Date(formData.dueDate), 'MMM d, yyyy')}</span>
                      </div>
                    )}
                    {formData.assigneeId && (
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="User" size={12} />
                        <span>{users.find(u => u.Id === formData.assigneeId)?.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !formData.title}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Loader2" size={16} className="animate-spin" />
                    <span>Saving...</span>
                  </div>
                ) : (
                  task ? 'Update Task' : 'Create Task'
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TaskModal;