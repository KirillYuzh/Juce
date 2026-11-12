import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from './Sidebar';
import { Icon } from './Icon';

const meta: Meta = {
  title: 'Primitives/Sidebar',
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

const nav = [
  { icon: 'doc', label: 'Обзор', active: true },
  { icon: 'code', label: 'Разборы кода' },
  { icon: 'calendar', label: 'План на неделю' },
  { icon: 'star', label: 'Избранное' },
];

function Demo() {
  return (
    <div style={{ height: 560 }}>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton icon={<Icon name="globe" size={20} />}>Джус</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Рабочее пространство</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {nav.map((item) => (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        icon={<Icon name={item.icon as 'doc'} size={20} />}
                        isActive={item.active}
                      >
                        {item.label}
                      </SidebarMenuButton>
                      {item.label === 'Разборы кода' && <SidebarMenuBadge>12</SidebarMenuBadge>}
                    </SidebarMenuItem>
                  ))}
                  <SidebarMenuItem>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton isActive>Java</SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton>Go</SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton>Математика</SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarSeparator />

            <SidebarGroup>
              <SidebarGroupLabel>Команда</SidebarGroupLabel>
              <SidebarGroupAction aria-label="Добавить участника">
                <Icon name="plus" size={16} />
              </SidebarGroupAction>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton icon={<Icon name="user" size={20} />}>
                      Анна Соколова
                    </SidebarMenuButton>
                    <SidebarMenuAction aria-label="Настройки">
                      <Icon name="info" size={16} />
                    </SidebarMenuAction>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton icon={<Icon name="user" size={20} />}>
                      Илья Морозов
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton icon={<Icon name="shield" size={20} />}>
                  Настройки
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>

          <SidebarRail />
        </Sidebar>

        <SidebarInset>
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <SidebarTrigger />
            <h2 style={{ margin: 0, font: '700 24px/28px var(--tb-font-heading)' }}>
              Обзор проекта
            </h2>
            <p style={{ margin: 0, font: '400 15px/24px var(--tb-font-text)', color: 'var(--tb-text-secondary)' }}>
              Нажмите ⌘B или Ctrl+B, чтобы свернуть панель. На узком экране она превращается в
              выдвижной ящик.
            </p>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

export const Default: Story = {
  render: () => <Demo />,
};

export const IconCollapsible: Story = {
  name: 'Collapse to icons',
  render: () => (
    <div style={{ height: 560 }}>
      <SidebarProvider defaultOpen>
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton icon={<Icon name="globe" size={20} />}>Джус</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Разделы</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {nav.map((item) => (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        icon={<Icon name={item.icon as 'doc'} size={20} />}
                        isActive={item.active}
                      >
                        {item.label}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarRail />
        </Sidebar>
        <SidebarInset>
          <div style={{ padding: 24 }}>
            <SidebarTrigger />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  ),
};

export const Loading: Story = {
  name: 'Skeleton',
  render: () => (
    <div style={{ height: 420 }}>
      <SidebarProvider>
        <Sidebar collapsible="none">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Загрузка</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {Array.from({ length: 4 }, (_, index) => (
                    <SidebarMenuItem key={index}>
                      <SidebarMenuSkeleton />
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <div style={{ padding: 24 }}>
            <SidebarTrigger />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  ),
};
