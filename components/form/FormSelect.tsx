import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

type FormSelectProps = {
  name: string;
  label?: string;
  options: string[];
  defaultValue?: string;
  placeholder?: string;
};

function FormSelect({
  name,
  label,
  options,
  defaultValue,
  placeholder = 'Select an option',
}: FormSelectProps) {
  return (
    <div className="mb-2">
      <Label htmlFor={name} className="capitalize mb-2">
        {label || name}
      </Label>

      <Select name={name} defaultValue={defaultValue}>
        <SelectTrigger id={name} className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default FormSelect;
