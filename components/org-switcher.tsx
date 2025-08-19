'use client';

import { Check, ChevronsUpDown, GalleryVerticalEnd } from 'lucide-react';
import * as React from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';
import { useSubdomainModal } from '@/hooks/use-subdomain-modal';
import { useParams } from 'next/navigation';


export function OrgSwitcher({
  tenants,
  onTenantSwitch
}: {
  tenants: Record<string, any>[];
  onTenantSwitch?: (tenantId: string) => void;
}) {

  const subdomainModal = useSubdomainModal();
  const params = useParams();
  const [subdomainId, setSubdomainId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setSubdomainId(resolvedParams.subdomainId as string);
    };
    getParams();
  }, [params]);

  const formattedItems = tenants.map((item) => ({
    label: item.name,
    value: item.id
  }));

  const currentSubdomain = formattedItems.find((item) => item.value === subdomainId);

  const handleTenantSwitch = (tenant: Record<string, any>) => {

    if (onTenantSwitch) {
      onTenantSwitch(tenant.id);
    }

  };

  if (!currentSubdomain) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <div className='bg-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
                <GalleryVerticalEnd className='size-4' />
              </div>
              <div className='flex flex-col gap-0.5 leading-none'>
                <span className='font-semibold'>Julius Biascan</span>
                <span className=''>{currentSubdomain.label}</span>
              </div>
              <ChevronsUpDown className='ml-auto' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width]'
            align='start'
          >
            {tenants.map((tenant) => (
              <DropdownMenuItem
                key={tenant.id}
                onSelect={() => handleTenantSwitch(tenant)}
              >
                {tenant.name}{' '}
                {tenant.id === currentSubdomain.value && (
                  <Check className='ml-auto' />
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem onSelect={() => subdomainModal.onOpen()}>
              Create new subdomain
            </DropdownMenuItem>
          </DropdownMenuContent>

        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
