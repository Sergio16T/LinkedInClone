'use client';

import React from 'react';
import {
  BriefcaseIcon,
  HomeIcon,
  UsersIcon,
} from '@heroicons/react/24/solid';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LinkedInIcon from '@/components/Icon/LinkedInIcon';

const navigation = [
  { name: 'Home', href: '/', icon: HomeIcon, current: true },
  { name: 'Network', href: '/network', icon: UsersIcon, current: false },
  { name: 'Jobs', href: '/jobs', icon: BriefcaseIcon, current: false },
];
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function NavigationMenu({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // const imgLoader = ({ src }: { src: string }) => {
  //   return `${src}`;
  // };

  return (
    <>
      <div>
        <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-gray-900 p-0 shadow-sm sm:px-2">
          <div className="w-full flex grow gap-y-5 overflow-y-auto bg-gray-900">
            <div className="px-2 flex basis-1/4 justify-center items-center">
              <LinkedInIcon/>
            </div>
            <nav className="flex items-center">
              <ul className="-mx-2 flex items-center" role="list">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      className={classNames(
                        item.href === pathname
                          ? 'text-white icon-active'
                          : 'text-gray-400 hover:text-white',
                        'group flex gap-x-3 py-0 pt-2 px-4 text-xs mx-2 leading-6 font-semibold flex flex-col items-center',
                      )}
                      href={item.href}
                      onClick={() => {
                        if (item.href === '/' && pathname === '/') {
                          console.log('refresh!');
                          window.location.reload();
                        }
                      }}
                    >
                      <item.icon
                        aria-hidden="true"
                        className="h-6 w-6 shrink-0"
                      />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <main className="py-10 lg:pl-72">
          <div className="px-0 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </>
  );
}