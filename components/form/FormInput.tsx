import { Label } from '../ui/label';
import { Input } from '../ui/input';

type FormInputProps = {
  name: string;
  type: string;
  label?: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean
};

function FormInput({
  name,
  type,
  label,
  defaultValue,
  placeholder,
  required
}: FormInputProps) {
  return (
    <div className='mb-2'>
      <Label htmlFor={name} className='capitalize mb-2'>
        {label || name}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}
export default FormInput;

export function FormDisableInput({
  name,
  type,
  label,
  defaultValue,
  placeholder,
}: FormInputProps) {
  return (
    <div className='mb-2'>
      <Label htmlFor={name} className='capitalize mb-2'>
        {label || name}
      </Label>
      <Input readOnly
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required
      />
    </div>
  );
}
