import { useState } from 'react';
import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

const FilterBar = ({ 
  users = [], 
  onFilterChange, 
  className 
}) => {
  const [filters, setFilters] = useState({
    assignee: '',
    priority: '',
    dueDate: ''
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = { assignee: '', priority: '', dueDate: '' };
    setFilters(clearedFilters);
    onFilterChange?.(clearedFilters);
  };

  return (
    <div className={cn('flex items-center space-x-4', className)}>
      <div className="flex items-center space-x-2">
        <ApperIcon name="Filter" size={16} className="text-gray-400" />
        <span className="text-sm font-medium text-gray-700">Filter by:</span>
      </div>
      
      <Select
        value={filters.assignee}
        onChange={(e) => handleFilterChange('assignee', e.target.value)}
        className="min-w-[140px]"
      >
        <option value="">All Assignees</option>
        {users.map(user => (
          <option key={user.Id} value={user.Id}>
            {user.name}
          </option>
        ))}
      </Select>

      <Select
        value={filters.priority}
        onChange={(e) => handleFilterChange('priority', e.target.value)}
        className="min-w-[120px]"
      >
        <option value="">All Priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="urgent">Urgent</option>
      </Select>

      <Select
        value={filters.dueDate}
        onChange={(e) => handleFilterChange('dueDate', e.target.value)}
        className="min-w-[130px]"
      >
        <option value="">All Due Dates</option>
        <option value="today">Due Today</option>
        <option value="week">Due This Week</option>
        <option value="overdue">Overdue</option>
      </Select>

      <Button 
        variant="ghost" 
        size="sm" 
        onClick={clearFilters}
        className="text-gray-600"
      >
        <ApperIcon name="X" size={16} />
        Clear
      </Button>
    </div>
  );
};

export default FilterBar;