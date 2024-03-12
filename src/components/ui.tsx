import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export const Container = ({ children }: Props) => {
  return (
    // prettier-ignore
    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {children}
    </div>
  );
};
