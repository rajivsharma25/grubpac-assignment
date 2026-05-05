'use client';

import Image from 'next/image';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, Badge } from '@/components/ui/DataDisplay';
import { Pagination } from '@/components/ui/Pagination';
import { useAuth } from '@/context/AuthContext';
import { contentService } from '@/services/content.service';
import { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, MoreVertical, Calendar, FileText } from 'lucide-react';
import { format } from 'date-fns';

export default function MyContentPage() {
  const { user } = useAuth();
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    if (!user?.id) return;

    const fetchContents = async () => {
      try {
        const data = await contentService.getByTeacher(user.id);
        setContents(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchContents();
  }, [user?.id]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING': return <Badge variant="warning"><Clock size={12} className="mr-1" /> Pending</Badge>;
      case 'APPROVED': return <Badge variant="success"><CheckCircle size={12} className="mr-1" /> Approved</Badge>;
      case 'REJECTED': return <Badge variant="error"><XCircle size={12} className="mr-1" /> Rejected</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const totalPages = Math.ceil(contents.length / itemsPerPage);
  const paginatedContents = contents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <DashboardLayout>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-80 animate-pulse bg-muted rounded-3xl" />
          ))}
        </div>
      ) : contents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-24 h-24 bg-muted rounded-3xl flex items-center justify-center text-muted-foreground/30 mb-6">
             <FileText size={48} />
          </div>
          <h3 className="text-2xl font-black tracking-tight text-foreground">No content uploaded yet</h3>
          <p className="text-muted-foreground mt-2 max-w-xs mx-auto text-sm font-medium">Start by uploading your first educational material to broadcast.</p>
        </div>
      ) : (
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedContents.map((content) => (
              <Card key={content.id} className="group border-none shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="relative h-48 overflow-hidden">
                  <Image 
                    src={content.previewUrl || 'https://via.placeholder.com/400x200?text=No+Preview'} 
                    alt={content.title}
                    width={400}
                    height={192}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                  <div className="absolute top-4 right-4">
                    {getStatusBadge(content.status)}
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="text-[10px] font-black text-white bg-primary px-2.5 py-1 rounded-lg uppercase tracking-widest shadow-lg shadow-primary/40">
                      {content.subject}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-black text-lg text-foreground truncate tracking-tight mb-2" title={content.title}>
                    {content.title}
                  </h3>
                  
                  <p className="text-xs font-medium text-muted-foreground line-clamp-2 mb-6 h-8 leading-relaxed">
                    {content.description || 'No description provided.'}
                  </p>

                  <div className="space-y-3 pt-5 border-t border-border">
                    <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      <Calendar size={14} className="mr-2 text-primary" />
                      <span>{format(new Date(content.startTime), 'MMM d, HH:mm')} - {format(new Date(content.endTime), 'HH:mm')}</span>
                    </div>
                    {content.status === 'REJECTED' && content.rejectionReason && (
                      <div className="mt-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                        <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] mb-1">Rejection Reason</p>
                        <p className="text-xs text-red-600 dark:text-red-400 font-bold italic leading-relaxed">{content.rejectionReason}</p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={setCurrentPage} 
          />
        </div>
      )}
    </DashboardLayout>
  );
}
