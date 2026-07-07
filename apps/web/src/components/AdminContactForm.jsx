
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

const contactSchema = z.object({
  whatsapp: z.string().min(1, 'WhatsApp number is required'),
  email: z.string().email('Valid email is required'),
  alamat: z.string().min(1, 'Address is required'),
});

const AdminContactForm = () => {
  const [recordId, setRecordId] = useState(null);
  const [isFetching, setIsFetching] = useState(true);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: { whatsapp: '', email: '', alamat: '' }
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const records = await pb.collection('content').getFullList({
          filter: `page="contact" && field="data"`,
          $autoCancel: false
        });
        if (records.length > 0) {
          setRecordId(records[0].id);
          reset(JSON.parse(records[0].value));
        } else {
          reset({
            whatsapp: '+62 896-7069-1999',
            email: 'hello@saeklindo.com',
            alamat: 'Ruko Sentra Kranji, Jl. Bintara No.12f, RT.001/RW.012, Kranji, Kec. Bekasi Bar., Kota Bks, Jawa Barat 17135, Indonesia'
          });
        }
      } catch (error) {
        console.error('Error fetching contact content:', error);
      } finally {
        setIsFetching(false);
      }
    };
    fetchContent();
  }, [reset]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        page: 'contact',
        field: 'data',
        value: JSON.stringify(data)
      };

      if (recordId) {
        await pb.collection('content').update(recordId, payload, { $autoCancel: false });
      } else {
        const record = await pb.collection('content').create(payload, { $autoCancel: false });
        setRecordId(record.id);
      }
      toast.success('Contact info updated successfully');
    } catch (error) {
      toast.error('Failed to update contact info');
      console.error(error);
    }
  };

  if (isFetching) return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading form...</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl bg-card p-6 rounded-xl shadow-sm border">
      <div>
        <label className="block text-sm font-medium mb-2">WhatsApp Number (include country code)</label>
        <Input {...register('whatsapp')} placeholder="+62 896..." />
        {errors.whatsapp && <p className="text-sm text-destructive mt-1">{errors.whatsapp.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Public Email Address</label>
        <Input {...register('email')} type="email" placeholder="contact@example.com" />
        {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Full Address</label>
        <Textarea {...register('alamat')} rows={3} placeholder="Full physical address" />
        {errors.alamat && <p className="text-sm text-destructive mt-1">{errors.alamat.message}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save Contact Info'}
      </Button>
    </form>
  );
};

export default AdminContactForm;
