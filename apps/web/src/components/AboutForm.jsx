
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import { useTranslation } from '@/hooks/useTranslation.js';

const AboutForm = () => {
  const { t } = useTranslation();
  const [recordId, setRecordId] = useState(null);
  const [isFetching, setIsFetching] = useState(true);

  const aboutSchema = z.object({
    visi: z.string().min(1, t('messages.required')),
    misi: z.string().min(1, t('messages.required')),
    deskripsi: z.string().min(1, t('messages.required')),
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(aboutSchema),
    defaultValues: { visi: '', misi: '', deskripsi: '' }
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const records = await pb.collection('content').getFullList({
          filter: `page="about" && field="data"`,
          $autoCancel: false
        });
        if (records.length > 0) {
          setRecordId(records[0].id);
          reset(JSON.parse(records[0].value));
        } else {
          reset({
            visi: 'To be the most trusted and preferred professional service provider...',
            misi: 'To deliver exceptional service quality through trained professionals...',
            deskripsi: 'Saeklindo is a professional service provider dedicated to delivering excellence...'
          });
        }
      } catch (error) {
        console.error('Error fetching about content:', error);
      } finally {
        setIsFetching(false);
      }
    };
    fetchContent();
  }, [reset]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        page: 'about',
        field: 'data',
        value: JSON.stringify(data)
      };

      if (recordId) {
        await pb.collection('content').update(recordId, payload, { $autoCancel: false });
      } else {
        const record = await pb.collection('content').create(payload, { $autoCancel: false });
        setRecordId(record.id);
      }
      toast.success(t('messages.aboutUpdated'));
    } catch (error) {
      toast.error(t('messages.error'));
      console.error(error);
    }
  };

  if (isFetching) return <div className="p-8 text-center text-muted-foreground animate-pulse">{t('admin.loading')}</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl bg-card p-6 rounded-xl shadow-sm border">
      <div>
        <label className="block text-sm font-medium mb-2">{t('form.companyDesc')}</label>
        <Textarea {...register('deskripsi')} rows={4} />
        {errors.deskripsi && <p className="text-sm text-destructive mt-1">{errors.deskripsi.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">{t('form.visi')}</label>
        <Textarea {...register('visi')} rows={3} />
        {errors.visi && <p className="text-sm text-destructive mt-1">{errors.visi.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">{t('form.misi')}</label>
        <Textarea {...register('misi')} rows={4} />
        {errors.misi && <p className="text-sm text-destructive mt-1">{errors.misi.message}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? t('buttons.saving') : t('buttons.saveAbout')}
      </Button>
    </form>
  );
};

export default AboutForm;
