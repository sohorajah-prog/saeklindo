
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import VideoUploadForm from './VideoUploadForm';
import { useTranslation } from '@/hooks/useTranslation.js';

const HeroForm = () => {
  const { t } = useTranslation();
  const [record, setRecord] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [activeTab, setActiveTab] = useState('text');

  const heroSchema = z.object({
    tagline: z.string().min(1, t('messages.required')),
    tagline_en: z.string().min(1, t('messages.required')),
    deskripsi: z.string().min(1, t('messages.required')),
    deskripsi_en: z.string().min(1, t('messages.required')),
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(heroSchema),
    defaultValues: { tagline: '', tagline_en: '', deskripsi: '', deskripsi_en: '' }
  });

  const fetchOrCreateContent = async () => {
    try {
      const records = await pb.collection('content').getFullList({
        filter: `page="hero" && field="data"`,
        $autoCancel: false
      });
      
      if (records.length > 0) {
        setRecord(records[0]);
        reset(JSON.parse(records[0].value));
      } else {
        const defaultData = {
          tagline: 'Care For Yours',
          tagline_en: 'Care For Yours',
          deskripsi: 'Professional service solutions for your home and business.',
          deskripsi_en: 'Professional service solutions for your home and business.'
        };
        const newRecord = await pb.collection('content').create({
          page: 'hero',
          field: 'data',
          value: JSON.stringify(defaultData)
        }, { $autoCancel: false });
        
        setRecord(newRecord);
        reset(defaultData);
      }
    } catch (error) {
      console.error('Error fetching hero content:', error);
      toast.error(t('messages.error'));
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchOrCreateContent();
  }, [reset]);

  const onTextSubmit = async (data) => {
    try {
      const payload = {
        value: JSON.stringify(data)
      };

      if (record) {
        const updated = await pb.collection('content').update(record.id, payload, { $autoCancel: false });
        setRecord(updated);
      }
      toast.success(t('messages.heroUpdated'));
    } catch (error) {
      toast.error(t('messages.error'));
      console.error(error);
    }
  };

  const handleVideoUploadSuccess = (updatedRecord) => {
    setRecord(updatedRecord);
  };

  if (isFetching) return <div className="p-8 text-center text-muted-foreground animate-pulse">{t('admin.loading')}</div>;

  return (
    <div className="bg-card rounded-xl shadow-sm border overflow-hidden">
      <div className="flex border-b border-border bg-muted/30">
        <button
          onClick={() => setActiveTab('text')}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === 'text' 
              ? 'bg-card text-foreground border-b-2 border-primary' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {t('form.textContent')}
        </button>
        <button
          onClick={() => setActiveTab('video')}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === 'video' 
              ? 'bg-card text-foreground border-b-2 border-primary' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {t('form.videoUpload')}
        </button>
      </div>

      <div className="p-6">
        {activeTab === 'text' ? (
          <form onSubmit={handleSubmit(onTextSubmit)} className="space-y-6 max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t('form.tagline')} (ID)</label>
                <Input {...register('tagline')} placeholder={t('placeholders.tagline')} />
                {errors.tagline && <p className="text-sm text-destructive mt-1">{errors.tagline.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t('form.tagline')} (EN)</label>
                <Input {...register('tagline_en')} placeholder={t('placeholders.tagline')} />
                {errors.tagline_en && <p className="text-sm text-destructive mt-1">{errors.tagline_en.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t('form.deskripsi')} (ID)</label>
                <Textarea {...register('deskripsi')} rows={4} placeholder={t('placeholders.description')} />
                {errors.deskripsi && <p className="text-sm text-destructive mt-1">{errors.deskripsi.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t('form.deskripsi')} (EN)</label>
                <Textarea {...register('deskripsi_en')} rows={4} placeholder={t('placeholders.description')} />
                {errors.deskripsi_en && <p className="text-sm text-destructive mt-1">{errors.deskripsi_en.message}</p>}
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('buttons.saving') : t('buttons.saveHero')}
            </Button>
          </form>
        ) : (
          <div className="max-w-2xl">
            <VideoUploadForm 
              record={record} 
              onUploadSuccess={handleVideoUploadSuccess} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroForm;
