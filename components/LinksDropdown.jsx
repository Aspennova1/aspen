'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AlignLeft } from 'lucide-react';
import { Button } from './ui/button';
import links from '@/utils/links';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from './context/AuthContext';
function LinksDropdown() {
  const [filteredLinks, Setlinks] = useState();
  const {user} = useAuth();

  useEffect(()=>{
      Setlinks(links.filter(link =>
        link.roles.includes(user?.roleId)
      ));
  },[user]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className='lg:hidden'>
        <Button variant='outline' size='icon'>
          <AlignLeft />
          <span className='sr-only'>Toggle links</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='w-52 lg:hidden'
        align='start'
        sideOffset={25}
      >
        {(filteredLinks && filteredLinks.length) && filteredLinks.map((link) => {
          return (
            <DropdownMenuItem key={link.href}>
              <Link href={link.href} className='flex items-center gap-x-2 '>
                {link.icon} <span className='capitalize'>{link.label}</span>
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default LinksDropdown;