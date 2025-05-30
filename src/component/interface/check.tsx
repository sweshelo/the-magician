import { nanoid } from 'nanoid';

interface CheckProps {
  title: string;
  defaultChecked?: boolean;
  props?: unknown[];
}

export const Check = ({ title, defaultChecked, ...props }: CheckProps) => {
  const id = nanoid();

  return (
    <div>
      <input id={id} type="checkbox" className="mr-2" defaultChecked={defaultChecked} {...props} />
      <label htmlFor={id}>{title}</label>
    </div>
  );
};
