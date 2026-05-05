'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/DataDisplay';
import { useAuth } from '@/context/AuthContext';
import { contentService } from '@/services/content.service';
import { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle, XCircle, Upload, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  useEffect(() => {
    if (!user?.id) return;
    
    const fetchStats = async () => {
      const contents = await contentService.getByTeacher(user.id);
      setStats({
        total: contents.length,
        pending: contents.filter(c => c.status === 'PENDING').length,
        approved: contents.filter(c => c.status === 'APPROVED').length,
        rejected: contents.filter(c => c.status === 'REJECTED').length,
      });
    };
    fetchStats();
  }, [user?.id]);

  const statCards = [
    { name: 'Total Uploaded', value: stats.total, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Pending Approval', value: stats.pending, icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { name: 'Approved Assets', value: stats.approved, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
    { name: 'Rejected Items', value: stats.rejected, icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
  ];

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {statCards.map((stat) => (
          <Card key={stat.name} className="p-8 border-none shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className={stat.bg + " p-4 rounded-2xl " + stat.color + " shadow-inner"}>
                <stat.icon size={28} />
              </div>
              <ArrowUpRight className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{stat.name}</p>
              <p className="text-4xl font-black text-foreground mt-1 tabular-nums">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-black tracking-tight text-foreground mb-6 uppercase tracking-[0.1em]">Accelerated Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link href="/teacher/upload">
            <Card className="p-10 border-2 border-dashed border-border flex flex-col items-center justify-center text-center hover:border-primary hover:bg-primary/5 transition-all duration-500 group cursor-pointer h-full">
              <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg shadow-primary/10">
                <Upload size={32} />
              </div>
              <h3 className="text-xl font-black text-foreground tracking-tight">Broadcast New Content</h3>
              <p className="text-sm font-medium text-muted-foreground mt-2 max-w-xs mx-auto leading-relaxed">
                Seamlessly upload and schedule subject materials for student viewing.
              </p>
            </Card>
          </Link>

          <Link href="/teacher/content">
            <Card className="p-10 border-2 border-dashed border-border flex flex-col items-center justify-center text-center hover:border-primary hover:bg-primary/5 transition-all duration-500 group cursor-pointer h-full">
              <div className="w-16 h-16 bg-muted rounded-3xl flex items-center justify-center text-muted-foreground mb-6 group-hover:scale-110 transition-all">
                <FileText size={32} />
              </div>
              <h3 className="text-xl font-black text-foreground tracking-tight">Review Library</h3>
              <p className="text-sm font-medium text-muted-foreground mt-2 max-w-xs mx-auto leading-relaxed">
                Manage your content history and monitor approval status.
              </p>
            </Card>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
