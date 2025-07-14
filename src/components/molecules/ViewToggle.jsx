import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

const ViewToggle = ({ 
  activeView, 
  onViewChange, 
  className 
}) => {
  return (
    <div className={cn('flex items-center bg-gray-100 rounded-lg p-1', className)}>
      <Button
        variant={activeView === 'board' ? 'primary' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('board')}
        className="flex items-center space-x-2"
      >
        <ApperIcon name="Columns" size={16} />
        <span>Board</span>
      </Button>
      <Button
        variant={activeView === 'table' ? 'primary' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('table')}
        className="flex items-center space-x-2"
      >
        <ApperIcon name="Table" size={16} />
        <span>Table</span>
      </Button>
    </div>
  );
};

export default ViewToggle;