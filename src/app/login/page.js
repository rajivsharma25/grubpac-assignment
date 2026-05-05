'use client';

import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/DataDisplay';
import { useState } from 'react';
import { LogIn, ShieldCheck, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary text-primary-foreground mb-6 shadow-2xl shadow-primary/30 rotate-3">
            <LogIn size={40} />
          </div>
          <h2 className="text-4xl font-black tracking-tight text-foreground">
            Welcome Back
          </h2>
          <p className="mt-3 text-sm font-medium text-muted-foreground">
            Sign in to your broadcast workspace
          </p>
        </div>

        <Card className="p-10 border-none shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <Input
              label="Professional Email"
              type="email"
              placeholder="name@example.com"
              error={errors.email?.message}
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
            />

            <Input
              label="Access Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password', { 
                required: 'Password is required',
                minLength: { value: 6, message: 'Minimum 6 characters' }
              })}
            />

            <Button
              type="submit"
              className="w-full py-6 text-base"
              size="lg"
              loading={loading}
            >
              <Sparkles size={18} className="mr-2" />
              Sign In
            </Button>
          </form>

          <div className="mt-10 p-5 bg-muted rounded-2xl border border-border">
            <div className="flex items-start space-x-3">
              <ShieldCheck size={18} className="text-primary flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-foreground">Demo Credentials</p>
                <div className="space-y-1 text-[11px] font-bold text-muted-foreground leading-relaxed">
                  <p>• Principal: <span className="text-primary">principal@example.com</span></p>
                  <p>• Teacher: Any other email address</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
