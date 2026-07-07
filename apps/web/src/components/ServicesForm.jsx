
import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import { Trash2, Plus } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation.js';

const ServicesForm = () => {
  const { t } = useTranslation();
  const [recordId, setRecordId] = useState(null);
  const [isFetching, setIsFetching] = useState(true);

  const serviceItemSchema = z.object({
    nama: z.string().min(1, t('messages.required')),
    deskripsi: z.string().min(1, t('messages.required')),
    benefits: z.string().min(1, t('messages.required')),
    image: z.string().url().optional().or(z.literal(''))
  });

  const servicesSchema = z.object({
    services: z.array(serviceItemSchema)
  });

  const { register, control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(servicesSchema),
    defaultValues: { services: [] }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "services"
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const records = await pb.collection('content').getFullList({
          filter: `page="services" && field="data"`,
          $autoCancel: false
        });
        if (records.length > 0) {
          setRecordId(records[0].id);
          const data = JSON.parse(records[0].value);
          const mappedServices = data.map(s => ({
            ...s,
            benefits: Array.isArray(s.benefits) ? s.benefits.join(', ') : s.benefits
          }));
          reset({ services: mappedServices });
        } else {
          reset({
            services: [
              { nama: 'Cleaning Service', deskripsi: 'Professional cleaning...', benefits: 'Certified staff, Eco-friendly', image: 'https://images.unsplash.com/photo-1699109076552-58db1cccae82' }
            ]
          });
        }
      } catch (error) {
        console.error('Error fetching services content:', error);
      } finally {
        setIsFetching(false);
      }
    };
    fetchContent();
  }, [reset]);

  const onSubmit = async (formData) => {
    try {
      const finalData = formData.services.map(s => ({
        ...s,
        benefits: s.benefits.split(',').map(b => b.trim()).filter(Boolean)
      }));

      const payload = {
        page: 'services',
        field: 'data',
        value: JSON.stringify(finalData)
      };

      if (recordId) {
        await pb.collection('content').update(recordId, payload, { $autoCancel: false });
      } else {
        const record = await pb.collection('content').create(payload, { $autoCancel: false });
        setRecordId(record.id);
      }
      toast.success(t('messages.servicesUpdated'));
    } catch (error) {
      toast.error(t('messages.error'));
      console.error(error);
    }
  };

  if (isFetching) return <div className="p-8 text-center text-muted-foreground animate-pulse">{t('admin.loading')}</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
      {fields.map((field, index) => (
        <div key={field.id} className="bg-card p-6 rounded-xl shadow-sm border relative">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Service {index + 1}</h3>
            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="text-destructive">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t('form.serviceName')}</label>
              <Input {...register(`services.${index}.nama`)} placeholder="e.g. Cleaning Service" />
              {errors.services?.[index]?.nama && <p className="text-sm text-destructive mt-1">{errors.services[index].nama.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('form.image')}</label>
              <Input {...register(`services.${index}.image`)} placeholder="https://..." />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">{t('form.description')}</label>
            <Textarea {...register(`services.${index}.deskripsi`)} rows={2} />
            {errors.services?.[index]?.deskripsi && <p className="text-sm text-destructive mt-1">{errors.services[index].deskripsi.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('form.benefits')}</label>
            <Input {...register(`services.${index}.benefits`)} placeholder={t('placeholders.benefits')} />
            {errors.services?.[index]?.benefits && <p className="text-sm text-destructive mt-1">{errors.services[index].benefits.message}</p>}
          </div>
        </div>
      ))}

      <div className="flex gap-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => append({ nama: '', deskripsi: '', benefits: '', image: '' })}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" /> {t('buttons.addService')}
        </Button>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? t('buttons.saving') : t('buttons.saveServices')}
        </Button>
      </div>
    </form>
  );
};

export default ServicesForm;
