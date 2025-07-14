import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

const PriorityBadge = ({ priority, className }) => {
  const priorityConfig = {
    low: { icon: 'ArrowDown', label: 'Low' },
    medium: { icon: 'Minus', label: 'Medium' },
    high: { icon: 'ArrowUp', label: 'High' },
    urgent: { icon: 'AlertTriangle', label: 'Urgent' }
  };

  const config = priorityConfig[priority] || priorityConfig.low;

  return (
    <Badge
      variant={priority}
      className={cn('flex items-center space-x-1', className)}
    >
      <ApperIcon name={config.icon} size={12} />
      <span>{config.label}</span>
    </Badge>
  );
};

export default PriorityBadge;