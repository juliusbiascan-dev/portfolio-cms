'use client';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail
} from '@/components/ui/sidebar';
import { UserAvatarProfile } from '@/components/user-avatar-profile';
import { useMediaQuery } from '@/hooks/use-media-query';
import { signOut } from "next-auth/react"

import {
  IconBell,
  IconChevronRight,
  IconChevronsDown,
  IconCreditCard,
  IconLogout,
  IconPhotoUp,
  IconUserCircle
} from '@tabler/icons-react';

import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import * as React from 'react';
import { Icons } from '../icons';
import { OrgSwitcher } from '../org-switcher';
export const company = {
  name: 'Julius Biascan',
  logo: IconPhotoUp,
  plan: 'Enterprise'
};



import { useSession } from "next-auth/react"
import { Button } from '../ui/button';

import { NavItem } from '@/types';

interface Subdomain {
  id: string;
  name: string | null;
  userId: string | null;
  profileId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export default function AppSidebar({ subdomains = [] }: { subdomains: Subdomain[] }) {
  const { data: session } = useSession()

  const user = session?.user || null;
  const pathname = usePathname();
  const { isOpen } = useMediaQuery();
  const params = useParams();
  const router = useRouter();
  const [subdomainId, setSubdomainId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setSubdomainId(resolvedParams.subdomainId as string);
    };
    getParams();
  }, [params]);

  const handleSwitchTenant = (_tenantId: string) => {
    const currentPath = window.location.pathname;
    const newPath = currentPath.replace(/^\/[^\/]+/, `/${_tenantId}`);
    router.push(newPath);
  };

  const tenants = subdomains.map((subdomain) => ({
    id: subdomain.id,
    name: subdomain.name,
  }));

  //Info: The following data is used for the sidebar navigation and Cmd K bar.
  const navItems: NavItem[] = [
    {
      title: 'Dashboard',
      url: `/${subdomainId}/overview`,
      icon: 'dashboard',
      isActive: false,
      shortcut: ['d', 'd'],
      items: [] // Empty array as there are no child items for Dashboard
    },
    {
      title: 'Profile',
      url: `/${subdomainId}/profile`,
      icon: 'userPen',
      shortcut: ['p', 'p'],
      isActive: false,
      items: [] // No child items
    },
    {
      title: 'Work Experience',
      url: `/${subdomainId}/work`,
      icon: 'briefcase',
      shortcut: ['w', 'e'],
      isActive: false,
      items: [] // No child items
    },
    {
      title: 'Projects',
      url: `/${subdomainId}/projects`,
      icon: 'projects',
      shortcut: ['p', 'p'],
      isActive: false,
      items: [] // No child items
    },
    {
      title: 'Contacts',
      url: `/${subdomainId}/contacts`,
      icon: 'contact',
      shortcut: ['k', 'k'],
      isActive: false,
      items: [] // No child items
    }
  ];
  React.useEffect(() => {
    // Side effects based on sidebar state changes
  }, [isOpen]);

  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader>
        <OrgSwitcher
          tenants={tenants}
          onTenantSwitch={handleSwitchTenant}
        />
      </SidebarHeader>
      <SidebarContent className='overflow-x-hidden'>
        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => {
              const Icon = item.icon ? Icons[item.icon] : Icons.logo;
              return item?.items && item?.items?.length > 0 ? (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive}
                  className='group/collapsible'
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={pathname === item.url}
                      >
                        {item.icon && <Icon />}
                        <span>{item.title}</span>
                        <IconChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={pathname === subItem.url}
                            >
                              <Link href={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={pathname === item.url}
                  >
                    <Link href={item.url}>
                      <Icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size='lg'
                  className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
                >
                  {user && (
                    <UserAvatarProfile
                      className='h-8 w-8 rounded-lg'
                      showInfo
                      user={{ name: user.name, email: user.email, image: user.image }}
                    />
                  )}
                  <IconChevronsDown className='ml-auto size-4' />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
                side='bottom'
                align='end'
                sideOffset={4}
              >
                <DropdownMenuLabel className='p-0 font-normal'>
                  <div className='px-1 py-1.5'>
                    {user && (
                      <UserAvatarProfile
                        className='h-8 w-8 rounded-lg'
                        showInfo
                        user={user}
                      />
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => router.push(`/${subdomainId}/profile`)}
                  >
                    <IconUserCircle className='mr-2 h-4 w-4' />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <IconCreditCard className='mr-2 h-4 w-4' />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <IconBell className='mr-2 h-4 w-4' />
                    Notifications
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <IconLogout className='mr-2 h-4 w-4' />
                  {/* <SignOutButton redirectUrl='/auth/sign-in' /> */}
                  <Button onClick={() => signOut()}>Sign Out</Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
