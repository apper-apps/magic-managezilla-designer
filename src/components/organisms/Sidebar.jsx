import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

const Sidebar = ({ 
  boards = [], 
  isOpen, 
  onToggle, 
  className 
}) => {
  const location = useLocation();
  const [expandedProjects, setExpandedProjects] = useState(true);

const navItems = [
    { name: 'Dashboard', path: '/', icon: 'LayoutDashboard' },
    { name: 'My Work', path: '/my-work', icon: 'User' },
    { name: 'Team', path: '/team', icon: 'Users' },
    { name: 'Admin', path: '/admin', icon: 'Shield' },
    { name: 'Settings', path: '/settings', icon: 'Settings' }
  ];

  const toggleProjects = () => {
    setExpandedProjects(!expandedProjects);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={cn(
        'hidden lg:block fixed left-0 top-0 h-full w-60 bg-white border-r border-gray-200 z-40',
        className
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-4 border-b border-gray-200">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="Zap" size={20} className="text-white" />
            </div>
            <span className="ml-3 text-xl font-bold gradient-text">ManageZilla</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary border-r-2 border-primary'
                      : 'text-gray-600 hover:bg-gray-100'
                  )
                }
              >
                <ApperIcon name={item.icon} size={18} className="mr-3" />
                {item.name}
              </NavLink>
            ))}

            {/* Projects Section */}
            <div className="pt-6">
              <button
                onClick={toggleProjects}
                className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <div className="flex items-center">
                  <ApperIcon name="FolderOpen" size={18} className="mr-3" />
                  Projects
                </div>
                <ApperIcon 
                  name={expandedProjects ? "ChevronDown" : "ChevronRight"} 
                  size={16} 
                />
              </button>
              
              {expandedProjects && (
                <div className="ml-6 mt-2 space-y-1">
                  {boards.map((board) => (
                    <NavLink
                      key={board.Id}
                      to={`/project/${board.Id}`}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center px-3 py-2 rounded-lg text-sm transition-colors',
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-gray-600 hover:bg-gray-100'
                        )
                      }
                    >
                      <ApperIcon name="Circle" size={12} className="mr-3" />
                      {board.name}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* User Profile */}
          <div className="px-4 py-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-accent to-pink-400 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">JD</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">John Doe</p>
                <p className="text-xs text-gray-500">Project Manager</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        {/* Backdrop */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onToggle}
          />
        )}
        
        {/* Mobile Sidebar */}
        <motion.div
          initial={false}
          animate={{ x: isOpen ? 0 : '-100%' }}
          transition={{ type: 'tween', duration: 0.3 }}
          className="fixed left-0 top-0 h-full w-60 bg-white border-r border-gray-200 z-50"
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <ApperIcon name="Zap" size={20} className="text-white" />
                </div>
                <span className="ml-3 text-xl font-bold gradient-text">ManageZilla</span>
              </div>
              <Button variant="ghost" size="sm" onClick={onToggle}>
                <ApperIcon name="X" size={20} />
              </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={onToggle}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary border-r-2 border-primary'
                        : 'text-gray-600 hover:bg-gray-100'
                    )
                  }
                >
                  <ApperIcon name={item.icon} size={18} className="mr-3" />
                  {item.name}
                </NavLink>
              ))}

              {/* Projects Section */}
              <div className="pt-6">
                <button
                  onClick={toggleProjects}
                  className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <div className="flex items-center">
                    <ApperIcon name="FolderOpen" size={18} className="mr-3" />
                    Projects
                  </div>
                  <ApperIcon 
                    name={expandedProjects ? "ChevronDown" : "ChevronRight"} 
                    size={16} 
                  />
                </button>
                
                {expandedProjects && (
                  <div className="ml-6 mt-2 space-y-1">
                    {boards.map((board) => (
                      <NavLink
                        key={board.Id}
                        to={`/project/${board.Id}`}
                        onClick={onToggle}
                        className={({ isActive }) =>
                          cn(
                            'flex items-center px-3 py-2 rounded-lg text-sm transition-colors',
                            isActive
                              ? 'bg-primary/10 text-primary'
                              : 'text-gray-600 hover:bg-gray-100'
                          )
                        }
                      >
                        <ApperIcon name="Circle" size={12} className="mr-3" />
                        {board.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            {/* User Profile */}
            <div className="px-4 py-4 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-accent to-pink-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">JD</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">John Doe</p>
                  <p className="text-xs text-gray-500">Project Manager</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Sidebar;