'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/DataDisplay';
import { contentService } from '@/services/content.service';
import { useState, useEffect } from 'react';
import { Files, Clock, CheckCircle, XCircle, Users, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function PrincipalDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      const contents = await contentService.getAll();
      setStats({
        total: contents.length,
        pending: contents.filter(c => c.status === 'PENDING').length,
        approved: contents.filter(c => c.status === 'APPROVED').length,
        rejected: contents.filter(c => c.status === 'REJECTED').length,
      });
    };
    fetchStats();
  }, []);

  const statCards = [
    { name: 'Total Repository', value: stats.total, icon: Files, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Pending Review', value: stats.pending, icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { name: 'Approved Assets', value: stats.approved, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
    { name: 'Rejected Items', value: stats.rejected, icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
  ];

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {statCards.map((stat) => (
          <Card key={stat.name} className="p-8 border-none shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className={stat.bg + " p-4 rounded-2xl " + stat.color + " shadow-inner"}>
                <stat.icon size={28} />
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{stat.name}</p>
              <p className="text-4xl font-black text-foreground mt-1 tabular-nums">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-10">
        <Card className="p-10 border-none shadow-xl bg-card">
          <h3 className="text-xl font-black tracking-tight text-foreground mb-6 uppercase tracking-[0.1em] flex items-center">
            <Users size={20} className="mr-3 text-primary" />
            System Insights
          </h3>
          <div className="space-y-6">
             <div className="p-6 bg-muted rounded-2xl border border-border">
               <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
                 Activity monitoring and teacher engagement metrics will be populated as more content is broadcasted.
               </p>
             </div>
             <div className="flex items-center space-x-4 opacity-50">
               <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden flex-1">
                 <div className="w-1/3 h-full bg-primary" />
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Initializing...</span>
             </div>
          </div>
        </Card>
        
        <Card className="p-10 border-none shadow-2xl bg-primary text-primary-foreground relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
          
          <h3 className="text-2xl font-black mb-4 flex items-center">
            <ShieldCheck size={28} className="mr-3" />
            Approval Queue
          </h3>
          <p className="text-primary-foreground/80 text-sm mb-8 font-medium leading-relaxed max-w-xs">
            There are currently <span className="font-black text-white">{stats.pending}</span> items awaiting your administrative review and broadcasting authorization.
          </p>
          <Link href="/principal/approvals" className="inline-flex items-center px-6 py-3 bg-white text-primary rounded-xl text-xs font-black uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all">
            Review Queue <ArrowRight size={16} className="ml-2" />
          </Link>
        </Card>
      </div>
    </DashboardLayout>
  );
}
