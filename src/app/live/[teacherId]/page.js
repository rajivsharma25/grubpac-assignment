'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { contentService } from '@/services/content.service';
import { Card, Badge } from '@/components/ui/DataDisplay';
import { Play, Clock, Info, AlertCircle, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PublicLivePage() {
  const { teacherId } = useParams();
  const [activeContent, setActiveContent] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchActiveContent = async () => {
    try {
      const data = await contentService.getPublicLive(teacherId);
      setActiveContent(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveContent();
    const interval = setInterval(fetchActiveContent, 30000); // Auto-refresh every 30s
    return () => clearInterval(interval);
  }, [teacherId]);

  useEffect(() => {
    if (activeContent.length > 1) {
      const current = activeContent[currentIndex];
      const duration = (current.rotationDuration || 10) * 1000;
      
      const timer = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % activeContent.length);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [currentIndex, activeContent]);

  const currentItem = activeContent[currentIndex];

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center">
          <RefreshCcw className="animate-spin text-primary mb-4" size={48} />
          <p className="text-white font-medium">Connecting to broadcast stream...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col font-sans">
      {/* Header */}
      <header className="p-6 bg-neutral-900/50 backdrop-blur-md border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center animate-pulse shadow-[0_0_20px_rgba(220,38,38,0.5)]">
            <Play size={24} fill="white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight uppercase tracking-[0.1em]">Live Broadcast</h1>
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mt-1">Source: {currentItem?.teacherName || 'Educational Stream'}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-[10px] font-black bg-green-500/10 text-green-500 px-4 py-2 rounded-full border border-green-500/20 uppercase tracking-widest">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
            <span>Active Stream</span>
          </div>
          <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">L-UPD: {lastUpdated.toLocaleTimeString()}</span>
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-1 flex items-center justify-center p-8 lg:p-16 relative overflow-hidden bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.05)_0%,transparent_70%)]">
        <AnimatePresence mode="wait">
          {activeContent.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-md w-full text-center space-y-8"
            >
              <div className="w-24 h-24 bg-neutral-900 rounded-[2.5rem] flex items-center justify-center mx-auto text-neutral-700 shadow-inner">
                <AlertCircle size={48} />
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl font-black tracking-tight uppercase tracking-[0.1em]">No Active Stream</h2>
                <p className="text-neutral-500 font-medium leading-relaxed">
                  The broadcast session is currently offline. Please wait for the instructor to initialize the content stream.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key={currentItem.id}
              initial={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.02, filter: "blur(10px)" }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              className="w-full max-w-7xl aspect-video rounded-[3rem] overflow-hidden shadow-[0_0_120px_rgba(0,0,0,0.5),0_0_80px_rgba(79,70,229,0.15)] border border-neutral-800 relative group"
            >
              <Image 
                src={currentItem.previewUrl} 
                alt={currentItem.title}
                fill
                className="object-cover"
                unoptimized
              />
              
              {/* Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-12 lg:p-16">
                <div className="flex items-center space-x-4 mb-6">
                   <span className="bg-primary px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/40">{currentItem.subject}</span>
                   <div className="flex items-center space-x-2 text-[10px] font-black text-neutral-300 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-xl border border-white/10 uppercase tracking-widest">
                     <Clock size={14} className="text-primary" />
                     <span>Ends {new Date(currentItem.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                   </div>
                </div>
                <h2 className="text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl">{currentItem.title}</h2>
                <p className="text-xl text-neutral-400 mt-6 max-w-3xl leading-relaxed font-medium">{currentItem.description}</p>
              </div>

              {/* Progress Indicator */}
              {activeContent.length > 1 && (
                <div className="absolute top-0 left-0 right-0 h-1.5 flex gap-1 px-1 pt-1">
                  {activeContent.map((item, idx) => (
                    <div key={item.id} className="flex-1 h-full bg-white/10 rounded-full overflow-hidden">
                       {idx === currentIndex && (
                         <motion.div 
                           className="h-full bg-primary shadow-[0_0_10px_rgba(79,70,229,0.5)]"
                           initial={{ width: 0 }}
                           animate={{ width: "100%" }}
                           transition={{ duration: currentItem.rotationDuration || 10, ease: "linear" }}
                         />
                       )}
                       {idx < currentIndex && <div className="h-full bg-primary/40 w-full" />}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer / Status */}
      <footer className="p-6 bg-neutral-900/30 border-t border-neutral-900/50 text-[10px] text-neutral-600 flex justify-between uppercase tracking-[0.2em] font-black">
        <div className="flex items-center space-x-8">
          <span className="flex items-center"><Info size={12} className="mr-2" /> Public Access Mode</span>
          <span>SESS-ID: {teacherId.slice(0, 8)}...</span>
        </div>
        <div className="flex items-center space-x-8">
          <span>Buffer: Optimized</span>
          <span className="text-neutral-400">Sequence: {currentIndex + 1} of {activeContent.length || 0}</span>
        </div>
      </footer>
    </div>
  );
}
