import Avatar from '@/components/atoms/Avatar';
import { cn } from '@/utils/cn';

const AvatarStack = ({ 
  users = [], 
  max = 3, 
  size = 'sm', 
  className 
}) => {
  const visibleUsers = users.slice(0, max);
  const remainingCount = users.length - max;

  return (
    <div className={cn('flex items-center -space-x-2', className)}>
      {visibleUsers.map((user, index) => (
        <Avatar
          key={user.Id}
          src={user.avatar}
          alt={user.name}
          fallback={user.name.charAt(0).toUpperCase()}
          size={size}
          className="ring-2 ring-white"
          style={{ zIndex: users.length - index }}
        />
      ))}
      {remainingCount > 0 && (
        <div className={cn(
          'flex items-center justify-center rounded-full bg-gray-200 text-gray-600 font-medium ring-2 ring-white',
          size === 'sm' ? 'h-8 w-8 text-xs' : size === 'md' ? 'h-10 w-10 text-sm' : 'h-12 w-12 text-base'
        )}>
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

export default AvatarStack;