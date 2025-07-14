import { format } from 'date-fns';
import Card from '@/components/atoms/Card';
import Avatar from '@/components/atoms/Avatar';
import PriorityBadge from '@/components/molecules/PriorityBadge';
import ProgressRing from '@/components/atoms/ProgressRing';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

const TaskCard = ({ 
  task, 
  user, 
  onClick, 
  onDragStart, 
  onDragEnd, 
  className,
  ...props 
}) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('application/json', JSON.stringify(task));
    onDragStart?.();
  };

  const progress = Math.floor(Math.random() * 100); // Mock progress

  return (
    <Card
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className={cn(
        'task-card p-4 cursor-pointer hover:shadow-lg transition-all duration-200',
        className
      )}
      {...props}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="font-medium text-gray-900 leading-5 flex-1">
            {task.title}
          </h3>
          <ProgressRing progress={progress} size="sm" />
        </div>
        
        {task.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <PriorityBadge priority={task.priority} />
          
          <div className="flex items-center space-x-2">
            {task.dueDate && (
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <ApperIcon name="Calendar" size={12} />
                <span>{format(new Date(task.dueDate), 'MMM d')}</span>
              </div>
            )}
            {user && (
              <Avatar
                src={user.avatar}
                alt={user.name}
                fallback={user.name.charAt(0).toUpperCase()}
                size="sm"
              />
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;