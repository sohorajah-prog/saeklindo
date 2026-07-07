
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/useTranslation.js';

const ContactForm = () => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formSchema = z.object({
    name: z.string().min(2, t('messages.required')),
    email: z.string().email(t('messages.invalidEmail')),
    phone: z.string().min(10, t('messages.required')),
    serviceType: z.string().min(1, t('messages.required')),
    message: z.string().min(10, t('messages.required'))
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      serviceType: '',
      message: ''
    }
  });

  const serviceType = watch('serviceType');

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
      submissions.push({
        ...data,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(t('messages.messageSent'));
      reset();
    } catch (error) {
      toast.error(t('messages.messageFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          {t('form.name')} *
        </label>
        <Input
          id="name"
          {...register('name')}
          placeholder={t('placeholders.name')}
          className="text-gray-900 placeholder:text-gray-400"
        />
        {errors.name && (
          <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          {t('form.email')} *
        </label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          placeholder={t('placeholders.email')}
          className="text-gray-900 placeholder:text-gray-400"
        />
        {errors.email && (
          <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium mb-2">
          {t('form.phone')} *
        </label>
        <Input
          id="phone"
          type="tel"
          {...register('phone')}
          placeholder={t('placeholders.phone')}
          className="text-gray-900 placeholder:text-gray-400"
        />
        {errors.phone && (
          <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="serviceType" className="block text-sm font-medium mb-2">
          {t('form.serviceType')} *
        </label>
        <Select value={serviceType} onValueChange={(value) => setValue('serviceType', value)}>
          <SelectTrigger className="text-gray-900">
            <SelectValue placeholder={t('placeholders.selectService')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cleaning">{t('services.items.cleaning')}</SelectItem>
            <SelectItem value="security">{t('services.items.security')}</SelectItem>
            <SelectItem value="driver">{t('services.items.driver')}</SelectItem>
            <SelectItem value="pramubakti">{t('services.items.pramubakti')}</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        {errors.serviceType && (
          <p className="text-sm text-destructive mt-1">{errors.serviceType.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-2">
          {t('form.message')} *
        </label>
        <Textarea
          id="message"
          {...register('message')}
          placeholder={t('placeholders.message')}
          rows={5}
          className="text-gray-900 placeholder:text-gray-400"
        />
        {errors.message && (
          <p className="text-sm text-destructive mt-1">{errors.message.message}</p>
        )}
      </div>

      <Button 
        type="submit" 
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? t('buttons.sending') : t('buttons.sendMessage')}
      </Button>
    </form>
  );
};

export default ContactForm;
