import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/useTranslation.js';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const LoginPage = () => {
  const { t } = useTranslation();
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  if (isLoading) return null;
  if (isAuthenticated) return <Navigate to="/admin" replace />;

  const onSubmit = async (data) => {
    setAuthError('');
    try {
      await login(data.email, data.password);
      toast.success('Logged in successfully');
      navigate('/admin');
    } catch (error) {
      setAuthError('Invalid email or password');
      toast.error('Login failed');
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('login.title')} - Saeklindo</title>
      </Helmet>

      <div className="min-h-screen flex bg-background">
        {/* Left Side - Image/Branding */}
        <div className="hidden lg:flex w-1/2 relative bg-secondary/30 items-center justify-center overflow-hidden">
          {/* Abstract Background Elements */}
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[100px]" />
          
          <div className="relative z-10 p-12 max-w-lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <img 
                src="https://horizons-cdn.hostinger.com/0fbf01b6-28c7-4623-ba2e-62114b48b0f6/b439283246ab46f18acfac7d6df67b60.png" 
                alt="Saeklindo Logo" 
                className="h-16 mb-8"
              />
              <h2 className="text-4xl font-bold mb-6 text-foreground tracking-tight">
                Welcome Back to Saeklindo
              </h2>
              <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                Professional service solutions tailored to your needs. Access your dashboard to manage services and personnel.
              </p>
              
              <div className="space-y-5">
                {[
                  "Secure and encrypted access",
                  "Manage your services effectively",
                  "24/7 dedicated support"
                ].map((feature, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + (i * 0.1) }}
                    className="flex items-center gap-4 text-muted-foreground"
                  >
                    <div className="p-1 rounded-full bg-primary/10">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-medium">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 bg-background">
          <div className="w-full max-w-md">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="mb-8 -ml-4 text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('login.back')}
            </Button>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-8">
                <img 
                  src="https://horizons-cdn.hostinger.com/0fbf01b6-28c7-4623-ba2e-62114b48b0f6/b439283246ab46f18acfac7d6df67b60.png" 
                  alt="Saeklindo" 
                  className="h-10 lg:hidden mb-8"
                />
                <h1 className="text-3xl font-bold mb-3 tracking-tight">{t('login.title')}</h1>
                <p className="text-muted-foreground">{t('login.desc')}</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="email">{t('login.email')}</label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder={t('login.emailPlaceholder')}
                    className="h-12 bg-background border-border/50 focus-visible:ring-primary/20"
                  />
                  {errors.email && <p className="text-sm text-destructive font-medium">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium" htmlFor="password">{t('login.password')}</label>
                    <a href="#" className="text-sm text-primary hover:underline font-medium">Forgot password?</a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    {...register('password')}
                    placeholder="••••••••"
                    className="h-12 bg-background border-border/50 focus-visible:ring-primary/20"
                  />
                  {errors.password && <p className="text-sm text-destructive font-medium">{errors.password.message}</p>}
                </div>

                {authError && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-destructive/10 text-destructive rounded-xl text-sm border border-destructive/20 flex items-center gap-3 font-medium"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-destructive flex-shrink-0" />
                    {authError}
                  </motion.div>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-12 text-base font-medium mt-6 shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 hover:-translate-y-0.5" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t('login.signingIn') : t('login.signIn')}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
