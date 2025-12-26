import { Control } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

type CustomFormFieldProps = {
  name: string;
  value?: string;
  placeholder?: string;
  control: Control<any>;
  disable?: boolean
};

export function CustomFormField({ name, value, control }: CustomFormFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className='capitalize'>{value ?? name}</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function CustomInputFileField({ name, value, control }: CustomFormFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className='capitalize'>{value ?? name}</FormLabel>
          <FormControl>
            <Input type='file' accept='.pdf,.xls,.xlsx' {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}


export function CustomFormFieldDisable({ name, value, control, disable }: CustomFormFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className='capitalize'>{value ?? name}</FormLabel>
          <FormControl>
            <Input disabled={disable} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function CustomFormFieldPlaceholder({ name, value, control, placeholder }: CustomFormFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className='capitalize'>{value ?? name}</FormLabel>
          <FormControl>
            <Input placeholder={placeholder} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function CustomDateFieldPlaceholder({ name, value, control, placeholder }: CustomFormFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className='capitalize'>{value ?? name}</FormLabel>
          <FormControl>
            <Input type='date' min={new Date().toISOString().split('T')[0]} placeholder={placeholder} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function CustomFormFieldNumPlaceholder({ name, value, control, placeholder }: CustomFormFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className='capitalize'>{value ?? name}</FormLabel>
          <FormControl>
            <Input type='number' placeholder={placeholder} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function CustomFormPlaceholderPass({ name, value, control, placeholder }: CustomFormFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className='capitalize'>{value ?? name}</FormLabel>
          <FormControl>
            <Input type='password' placeholder={placeholder} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function CustomPassowrdField({ name, value, control }: CustomFormFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className='capitalize'>{value ?? name}</FormLabel>
          <FormControl>
            <Input type='password' {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}


export function CustomFormTextArea({ name, value, control, placeholder }: CustomFormFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className='capitalize'>{value ?? name}</FormLabel>
          <FormControl>
            <Textarea placeholder={placeholder} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}


type CustomFormSelectProps = {
  name: string;
  control: Control<any>;
  items: string[];
  labelText?: string;
};

export function CustomFormSelect({
  name,
  control,
  items,
  labelText,
}: CustomFormSelectProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className='capitalize'>{labelText || name}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {items.map((item) => {
                return (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
export default CustomFormSelect;