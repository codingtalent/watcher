import Link from 'next/link';
import type { FC } from 'react';

const Custom500: FC = () => {
  return (
    <div className="flex-col page-center">
      <div className="py-10 text-center">
        <h1 className="mb-4 text-3xl font-bold">Looks like something went wrong!</h1>
        <div className="mb-4 text-gray-500">
          We track these errors automatically, but if the problem persists feel free to contact us. In the
          meantime, try refreshing.
        </div>
        <Link href="/">
          <button className="flex mx-auto item-center">
            <div>Go to home</div>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Custom500;
