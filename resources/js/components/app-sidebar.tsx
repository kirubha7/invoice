import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import CustomerController from '@/actions/App/Http/Controllers/CustomerController';
import InvoiceController from '@/actions/App/Http/Controllers/InvoiceController';
import ProjectController from '@/actions/App/Http/Controllers/ProjectController';
import TaskController from '@/actions/App/Http/Controllers/TaskController';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { FileText, LayoutGrid, Users, FolderKanban, CheckSquare } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Projects',
        href: ProjectController.index().url,
        icon: FolderKanban,
    },
    {
        title: 'Tasks',
        href: TaskController.index().url,
        icon: CheckSquare,
    },
    {
        title: 'Customers',
        href: CustomerController.index().url,
        icon: Users,
    },
    {
        title: 'Invoices',
        href: InvoiceController.index().url,
        icon: FileText,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
