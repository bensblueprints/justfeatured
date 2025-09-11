import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarTrigger,
  useSidebar 
} from '@/components/ui/sidebar';
import { 
  Users, 
  FileText, 
  Building, 
  BarChart3,
  Settings,
  Upload,
  Database,
  Crown,
  ShieldCheck
} from 'lucide-react';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { ClientManagement } from '@/components/admin/ClientManagement';
import { UserManagement } from '@/components/admin/UserManagement';
import { PressReleaseManagement } from '@/components/admin/PressReleaseManagement';
import { PublicationBulkEditor } from '@/components/admin/PublicationBulkEditor';
import { PublicationManagement } from '@/components/admin/PublicationManagement';
import { SpreadsheetSync } from '@/components/SpreadsheetSync';
import { useToast } from '@/hooks/use-toast';

type AdminSection = 
  | 'dashboard'
  | 'clients' 
  | 'press-releases'
  | 'publications'
  | 'bulk-editor'
  | 'sync'
  | 'users';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin, isLoading, userRole } = useAdminCheck();
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin panel",
        variant: "destructive"
      });
      navigate('/dashboard');
    }
  }, [isAdmin, isLoading, navigate, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const menuItems = [
    { 
      id: 'dashboard' as AdminSection, 
      title: 'Dashboard', 
      icon: BarChart3,
      description: 'Overview and statistics'
    },
    { 
      id: 'clients' as AdminSection, 
      title: 'Clients', 
      icon: Building,
      description: 'Manage client accounts'
    },
    { 
      id: 'press-releases' as AdminSection, 
      title: 'Press Releases', 
      icon: FileText,
      description: 'Review and manage press releases'
    },
    { 
      id: 'publications' as AdminSection, 
      title: 'Publications', 
      icon: Database,
      description: 'Manage publication database'
    },
    { 
      id: 'bulk-editor' as AdminSection, 
      title: 'Bulk Editor', 
      icon: Settings,
      description: 'Bulk edit publications'
    },
    { 
      id: 'sync' as AdminSection, 
      title: 'Spreadsheet Sync', 
      icon: Upload,
      description: 'Sync with external spreadsheets'
    },
    { 
      id: 'users' as AdminSection, 
      title: 'Users', 
      icon: Users,
      description: 'Manage user accounts and roles'
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'clients':
        return <ClientManagement />;
      case 'press-releases':
        return <PressReleaseManagement />;
      case 'publications':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Publications Management</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <PublicationManagement />
              </div>
              <div>
                <SpreadsheetSync />
              </div>
            </div>
          </div>
        );
      case 'bulk-editor':
        return <PublicationBulkEditor />;
      case 'sync':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Spreadsheet Synchronization</h2>
            </div>
            <SpreadsheetSync />
          </div>
        );
      case 'users':
        return <UserManagement />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar 
          menuItems={menuItems}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          userRole={userRole}
        />
        
        <main className="flex-1 overflow-hidden">
          {/* Header */}
          <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-full items-center px-6">
              <SidebarTrigger className="mr-4" />
              <div className="flex items-center space-x-2">
                {userRole === 'super_admin' ? (
                  <Crown className="h-5 w-5 text-amber-500" />
                ) : (
                  <ShieldCheck className="h-5 w-5 text-primary" />
                )}
                <h1 className="text-xl font-semibold">Admin Panel</h1>
                <span className="text-sm text-muted-foreground">
                  {menuItems.find(item => item.id === activeSection)?.title}
                </span>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

interface AdminSidebarProps {
  menuItems: Array<{
    id: AdminSection;
    title: string;
    icon: React.ComponentType<any>;
    description: string;
  }>;
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
  userRole: string;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  menuItems,
  activeSection,
  onSectionChange,
  userRole
}) => {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center space-x-2">
            {userRole === 'super_admin' ? (
              <Crown className="h-4 w-4 text-amber-500" />
            ) : (
              <ShieldCheck className="h-4 w-4 text-primary" />
            )}
            <span>Administration</span>
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onSectionChange(item.id)}
                    className={`
                      w-full justify-start transition-colors
                      ${activeSection === item.id 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-muted'
                      }
                    `}
                  >
                    <item.icon className="h-4 w-4" />
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{item.title}</span>
                      <span className="text-xs opacity-70">{item.description}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminPanel;