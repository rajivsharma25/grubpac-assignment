'use client';

import Image from 'next/image';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/DataDisplay';
import { useForm, useWatch } from 'react-hook-form';
import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Calendar, Clock as ClockIcon, FileText, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { contentService } from '@/services/content.service';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils/cn';

export default function UploadPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm({
    defaultValues: {
      rotationDuration: 10
    }
  });

  const startTime = useWatch({ control, name: 'startTime' });

  const handleFile = (file) => {
    if (file && file.size <= 10 * 1024 * 1024) { // 10MB limit
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setValue('file', file);
    } else {
      alert('File too large or invalid (Max 10MB)');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onSubmit = async (data) => {
    if (!user?.id) return;
    setLoading(true);
    try {
      await contentService.create({
        ...data,
        teacherId: user.id,
        teacherName: user.name,
        previewUrl: preview // In real app, this would be a URL after upload
      });
      router.push('/teacher/content');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              <Card className="p-8 space-y-6 border-none shadow-xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black tracking-tight flex items-center gap-3 text-foreground">
                    <div className="p-2 bg-primary/10 rounded-xl text-primary">
                      <FileText size={20} />
                    </div>
                    Content Details
                  </h3>
                  <div className="px-3 py-1 bg-muted rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Required Information
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Content Title"
                    placeholder="e.g., Introduction to Photosynthesis"
                    error={errors.title?.message}
                    {...register('title', { required: 'Title is required' })}
                  />

                  <Input
                    label="Subject Area"
                    placeholder="e.g., Biology"
                    error={errors.subject?.message}
                    {...register('subject', { required: 'Subject is required' })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Detailed Description</label>
                  <textarea
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 min-h-[120px] text-sm font-medium"
                    placeholder="Provide context and details about this broadcast content..."
                    {...register('description')}
                  />
                </div>
              </Card>

              <Card className="p-8 space-y-6 border-none shadow-xl">
                <h3 className="text-xl font-black tracking-tight flex items-center gap-3 text-foreground">
                  <div className="p-2 bg-primary/10 rounded-xl text-primary">
                    <Calendar size={20} />
                  </div>
                  Scheduling & Broadcast
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Start Time"
                    type="datetime-local"
                    error={errors.startTime?.message}
                    {...register('startTime', { required: 'Start time is required' })}
                  />
                  <Input
                    label="End Time"
                    type="datetime-local"
                    error={errors.endTime?.message}
                    {...register('endTime', { 
                      required: 'End time is required',
                      validate: (value) => !startTime || new Date(value) > new Date(startTime) || 'End time must be after start time'
                    })}
                  />
                </div>

                <div className="pt-4">
                  <Input
                    label="Rotation Interval (seconds)"
                    type="number"
                    placeholder="10"
                    {...register('rotationDuration')}
                  />
                  <p className="text-[10px] font-medium text-muted-foreground mt-2">How long this content stays on screen during active broadcast.</p>
                </div>
              </Card>
            </div>

            <div className="space-y-8">
              <Card className="p-8 border-none shadow-xl">
                <h3 className="text-xl font-black tracking-tight flex items-center gap-3 mb-6 text-foreground">
                  <div className="p-2 bg-primary/10 rounded-xl text-primary">
                    <ImageIcon size={20} />
                  </div>
                  Media Asset
                </h3>

                <div
                  className={cn(
                    "relative border-2 border-dashed rounded-3xl p-6 transition-all duration-500 min-h-[300px] flex flex-col items-center justify-center text-center",
                    dragActive ? "border-primary bg-primary/5 scale-105" : "border-border bg-muted/30 hover:bg-muted/50",
                    preview ? "p-2 overflow-hidden border-solid border-primary/20" : "p-8"
                  )}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {preview ? (
                    <div className="relative w-full h-full group rounded-2xl overflow-hidden shadow-2xl">
                      <Image src={preview} alt="Preview" width={400} height={256} className="w-full h-64 object-cover" unoptimized />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => { setPreview(null); setValue('file', null); }}
                          className="p-3 bg-red-500 text-white rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all"
                        >
                          <X size={24} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto text-primary">
                        <Upload size={32} />
                      </div>
                      <div>
                        <p className="text-sm font-black uppercase tracking-widest text-foreground">
                          Drop your asset here
                        </p>
                        <p className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-widest">
                          High-res PNG, JPG or GIF (max 10MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={(e) => handleFile(e.target.files[0])}
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="shadow-sm"
                      >
                        Browse Files
                      </Button>
                    </div>
                  )}
                </div>
                {errors.file && <p className="text-[10px] font-black text-red-500 mt-3 text-center uppercase tracking-widest">Asset is required for broadcast</p>}
                <input type="hidden" {...register('file', { required: true })} />
              </Card>

              <div className="sticky top-10 space-y-4">
                 <Button type="submit" className="w-full py-6 text-base" size="lg" loading={loading}>
                    <Sparkles size={20} className="mr-2" />
                    Publish Content
                 </Button>
                 <div className="p-4 bg-muted/50 rounded-2xl border border-border">
                   <p className="text-[10px] font-bold text-muted-foreground text-center uppercase tracking-widest leading-relaxed">
                     Once published, the principal will review your content for live broadcasting.
                   </p>
                 </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
