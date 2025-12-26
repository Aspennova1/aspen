import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Prisma } from '@prisma/client';

const name = 'price';
type FormInputNumberProps = {
  defaultValue?: number;
};
type FormInputNumberProps2 = {
  defaultValue?: number;
  name: string
};

function PriceInput({ defaultValue }: FormInputNumberProps) {
  return (
    <div className='mb-2'>
      <Label htmlFor={name} className='capitalize'>
        Price ($)
      </Label>
      <Input
        id={name}
        type='number'
        name={name}
        min={0}
        defaultValue={defaultValue || 100}
        required
      />
    </div>
  );
}

export function AmountInput({ defaultValue, name }: FormInputNumberProps2) {
  return (
    <div className='mb-2'>
      <Label htmlFor={name} className='mb-2 capitalize'>
        Amount ($)
      </Label>
      <Input
        id={name}
        type='number'
        name={name}
        min={0}
        defaultValue={defaultValue || 100}
        required
      />
    </div>
  );
}

export default PriceInput;
