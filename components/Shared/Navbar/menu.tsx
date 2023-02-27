import type { FC } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import clsx from 'clsx';
import {
  ArrowsRightLeftIcon,
  HomeIcon
} from '@heroicons/react/24/solid';

const Menu: FC = () => {

  interface NavItemProps {
    url: string;
    name: string;
    current: boolean;
    icon: string;
  };

  const NavItem = ({ url, name, current, icon }: NavItemProps) => {
    return (
      <Link className="w-full inline-block py-1" href={url} aria-current={current ? 'page' : undefined}>
        <button
          className={clsx(
            'w-full h-14 space-x-2 text-left px-2 md:px-3 font-bold cursor-pointer text-sm tracking-wide',
            {
              'text-black bg-gray-200': current,
              'text-white hover:text-black  hover:bg-gray-200':
                !current
            }
          )}
        >
          {icon === 'Home' && (<HomeIcon className="inline w-6 h-6" />)}
          {icon === 'ArrowsRightLeft' && (<ArrowsRightLeftIcon className="inline w-6 h-6" />)}
          <span>{name}</span>
        </button>
      </Link>
    );
  };

  const NavItems = () => {
    const { pathname } = useRouter();
    return (
      <>
        <NavItem url="/" name="Home" current={pathname == '/'} icon="Home" />
        <NavItem url="swaps" name="Latest Swaps" current={pathname == 'swaps'} icon="ArrowsRightLeft" />
      </>
    );
  };

  return (
    <NavItems />
  );
}

export default Menu;
