'use client';

import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { 
  LayoutDashboard, 
  Upload, 
  FileText, 
  CheckCircle, 
  Files, 
  LogOut, 
  Sun, 
  Moon,
  User,
  ShieldCheck
} from 'lucide-react';
import { Badge } from '@/components/ui/DataDisplay';
import Link from 'next/link';
import { cn } from '@/utils/cn';

export default function DashboardLayout({ children }) {
  const { user, logout, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-primary rounded-2xl mb-4 shadow-lg shadow-primary/20"></div>
          <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Initializing...</p>
        </div>
      </div>
    );
  }

  const teacherNav = [
    { name: 'Dashboard', href: '/teacher', icon: LayoutDashboard },
    { name: 'Upload Content', href: '/teacher/upload', icon: Upload },
    { name: 'My Content', href: '/teacher/content', icon: FileText },
  ];

  const principalNav = [
    { name: 'Dashboard', href: '/principal', icon: LayoutDashboard },
    { name: 'Pending Approvals', href: '/principal/approvals', icon: CheckCircle },
    { name: 'All Content', href: '/principal/content', icon: Files },
  ];

  const navigation = user.role === 'PRINCIPAL' ? principalNav : teacherNav;

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col shadow-xl z-20">
        <div className="p-8">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-black text-xl shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">G</div>
            <span className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors">GrubPac</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center px-4 py-3.5 text-xs font-black uppercase tracking-widest rounded-2xl transition-all duration-300',
                  isActive 
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon className={cn('mr-3 h-5 w-5', isActive ? 'text-primary-foreground' : 'text-muted-foreground')} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-border space-y-3">
          <button
            onClick={toggleTheme}
            className="flex items-center w-full px-4 py-3 text-xs font-black uppercase tracking-widest text-muted-foreground hover:bg-muted hover:text-foreground rounded-xl transition-all"
          >
            {theme === 'light' ? <Moon className="mr-3 h-5 w-5" /> : <Sun className="mr-3 h-5 w-5" />}
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>
          <button
            onClick={logout}
            className="flex items-center w-full px-4 py-3 text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-20 bg-card/80 backdrop-blur-md border-b border-border flex items-center justify-between px-10 sticky top-0 z-10">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Workspace</span>
            <h1 className="text-xl font-black tracking-tight">
              {navigation.find(n => n.href === pathname)?.name || 'Dashboard'}
            </h1>
          </div>
          
          <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3 px-3.5 py-2 bg-muted rounded-2xl border border-border shadow-sm">
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20">
                    <User size={20} />
                  </div>
                  <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-muted rounded-full"></div>
                </div>
                <div className="flex flex-col justify-center space-y-1 overflow-hidden">
                  <span className="text-[11px] font-black capitalize tracking-tight leading-none truncate max-w-[90px]">{user.name}</span>
                  <div className="flex">
                    <Badge variant={user.role === 'PRINCIPAL' ? 'info' : 'success'}>
                      {user.role}
                    </Badge>
                  </div>
                </div>
              </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 bg-background/50">
          {children}
        </div>
      </main>
    </div>
  );
}
