import type { FC } from 'react';
import IconSpin from '../Shared/Spin';

const Loading: FC = () => {
  return (
    <div className="bg-gray-100 bg-opacity-20 flex justify-center fixed text-center left-0 top-0 h-full w-full place-items-center">
      <IconSpin className="h-12 w-12 inline-block" />
    </div>
  );
};

export default Loading;
