'use client';

import Image from 'next/image';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, Badge } from '@/components/ui/DataDisplay';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { contentService } from '@/services/content.service';
import { useState, useEffect } from 'react';
import { Check, X, Eye, Clock, User, Calendar, AlertTriangle, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

export default function ApprovalsPage() {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPending = async () => {
    setLoading(true);
    const data = await contentService.getAll();
    setContents(data.filter(c => c.status === 'PENDING'));
    setLoading(false);
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (id) => {
    setActionLoading(true);
    await contentService.updateStatus(id, 'APPROVED');
    await fetchPending();
    setActionLoading(false);
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) return;
    setActionLoading(true);
    await contentService.updateStatus(selectedContent.id, 'REJECTED', rejectionReason);
    setShowRejectModal(false);
    setRejectionReason('');
    setSelectedContent(null);
    await fetchPending();
    setActionLoading(false);
  };

  return (
    <DashboardLayout>
      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map(i => <div key={i} className="h-32 w-full bg-muted animate-pulse rounded-3xl" />)}
        </div>
      ) : contents.length === 0 ? (
        <Card className="p-20 flex flex-col items-center justify-center text-center border-none shadow-xl">
           <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
             <Check size={40} />
           </div>
           <h3 className="text-2xl font-black tracking-tight text-foreground">Inbox Zero</h3>
           <p className="text-muted-foreground mt-2 max-w-xs mx-auto text-sm font-medium">All broadcast submissions have been processed. Great work!</p>
        </Card>
      ) : (
        <div className="space-y-8">
          {contents.map((content) => (
            <Card key={content.id} className="p-8 border-none shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-64 h-40 rounded-2xl overflow-hidden flex-shrink-0 bg-muted relative group">
                  <Image src={content.previewUrl} alt={content.title} width={256} height={160} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" unoptimized />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Eye className="text-white" size={32} />
                  </div>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black tracking-tight text-foreground">{content.title}</h3>
                    <Badge variant="warning">Awaiting Review</Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    <div className="flex items-center"><User size={16} className="mr-2 text-primary opacity-70" /> {content.teacherName}</div>
                    <div className="flex items-center"><Calendar size={16} className="mr-2 text-primary opacity-70" /> {format(new Date(content.startTime), 'MMM d, HH:mm')}</div>
                    <div className="flex items-center"><Clock size={16} className="mr-2 text-primary opacity-70" /> {content.rotationDuration}s interval</div>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-2xl border border-border">
                    <p className="text-xs font-bold text-muted-foreground italic leading-relaxed">
                      "{content.description || 'No description provided.'}"
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col justify-center gap-4">
                  <Button 
                    variant="primary" 
                    className="shadow-lg shadow-green-500/20 bg-green-500 hover:bg-green-600 border-none min-w-[140px]" 
                    onClick={() => handleApprove(content.id)}
                    loading={actionLoading && selectedContent?.id === content.id}
                  >
                    <Check size={18} className="mr-2" /> Authorize
                  </Button>
                  <Button 
                    variant="danger" 
                    className="min-w-[140px]"
                    onClick={() => { setSelectedContent(content); setShowRejectModal(true); }}
                  >
                    <X size={18} className="mr-2" /> Decline
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Rejection Modal */}
      <AnimatePresence>
        {showRejectModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
              onClick={() => setShowRejectModal(false)}
            />
            <motion.div 
              initial={{ y: 20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg"
            >
              <Card className="p-10 shadow-3xl border-none">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-red-500/10 text-red-500 rounded-2xl">
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black tracking-tight text-foreground">Reject Submission</h3>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Reviewing: {selectedContent?.title}</p>
                  </div>
                </div>

                <p className="text-sm font-medium text-muted-foreground mb-8 leading-relaxed">
                  Provide a clear rationale for declining this content. The teacher will receive this feedback to refine their submission.
                </p>
                
                <div className="space-y-8">
                   <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Refusal Reason</label>
                    <textarea
                      autoFocus
                      className="w-full px-5 py-4 bg-background border border-border rounded-2xl text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:outline-none min-h-[160px] text-sm font-medium shadow-inner transition-all"
                      placeholder="Specify why this content does not meet broadcast standards..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button variant="secondary" className="flex-1 py-4" onClick={() => setShowRejectModal(false)}>
                      Dismiss
                    </Button>
                    <Button 
                      variant="danger" 
                      className="flex-1 py-4" 
                      onClick={handleReject}
                      disabled={!rejectionReason.trim()}
                      loading={actionLoading}
                    >
                      Confirm Rejection
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
