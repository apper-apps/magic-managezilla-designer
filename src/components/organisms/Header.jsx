import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import SearchBar from '@/components/molecules/SearchBar';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

const Header = ({ onMenuToggle, className }) => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/my-work':
        return 'My Work';
      case '/team':
        return 'Team';
      case '/settings':
        return 'Settings';
      default:
        if (location.pathname.startsWith('/project/')) {
          return 'Project Board';
        }
        return 'ManageZilla';
    }
  };

const handleSearch = (term) => {
    setSearchTerm(term);
    // TODO: Implement global search functionality
    console.log('Searching for:', term);
  };

  const handleNotificationClick = () => {
    // TODO: Open notifications panel
    console.log('Opening notifications');
  };

  const handleSettingsClick = () => {
    // TODO: Navigate to settings or open settings menu
    console.log('Opening settings');
  };

  return (
    <header className={cn(
      'bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-6',
      className
    )}>
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuToggle}
          className="lg:hidden"
        >
          <ApperIcon name="Menu" size={20} />
        </Button>
        
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* Center Section - Search */}
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <SearchBar
          placeholder="Search tasks, projects..."
          onSearch={handleSearch}
          className="w-full"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-3">
<Button 
          variant="ghost" 
          size="sm" 
          className="relative"
          onClick={handleNotificationClick}
        >
          <ApperIcon name="Bell" size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full"></span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleSettingsClick}
        >
          <ApperIcon name="Settings" size={20} />
        </Button>
        
        <div className="w-8 h-8 bg-gradient-to-br from-accent to-pink-400 rounded-full flex items-center justify-center">
          <span className="text-white font-medium text-sm">JD</span>
        </div>
      </div>
    </header>
  );
};

export default Header;