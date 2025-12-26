import { Label } from '../ui/label';
import { Input } from '../ui/input';

function ImageInput() {
  const name = 'image';

  return (
    <div className='mb-2'>
      <Label htmlFor={name} className='capitalize mb-2'>
        Image
      </Label>
      <Input id={name} name={name} type='file' required accept='image/*' />
    </div>
  );
}
export default ImageInput;


export function Attachment() {
  const name = 'attachment';

  return (
    <div className='mb-2'>
      <Label htmlFor={name} className='capitalize mb-2'>
        Attachments
      </Label>
      <Input id={name} name={name} type='file' accept='application/pdf' />
    </div>
  );
}

export function Attachments({id}: any) {
  const name = 'attachments';

  return (
    <div className='mb-2'>
      <Label htmlFor={name} className='capitalize mb-2'>
        Attachments
      </Label>
      <Input id={id} name={name} type='file' multiple accept='application/pdf' />
    </div>
  );
}
