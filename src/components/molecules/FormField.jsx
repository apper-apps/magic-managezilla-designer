import Label from '@/components/atoms/Label';
import Input from '@/components/atoms/Input';
import Textarea from '@/components/atoms/Textarea';
import Select from '@/components/atoms/Select';
import { cn } from '@/utils/cn';

const FormField = ({ 
  label, 
  type = 'text', 
  error, 
  className, 
  children, 
  ...props 
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={props.id || props.name}>
          {label}
        </Label>
      )}
      {type === 'textarea' ? (
        <Textarea {...props} />
      ) : type === 'select' ? (
        <Select {...props}>
          {children}
        </Select>
      ) : (
        <Input type={type} {...props} />
      )}
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  );
};

export default FormField;