
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Trash2, Edit, UploadCloud, Loader2, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/useTranslation.js';

const ClientsForm = () => {
  const { t } = useTranslation();
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const records = await pb.collection('clients').getFullList({
        sort: '-created',
        $autoCancel: false
      });
      setClients(records);
    } catch (error) {
      toast.error(t('messages.error'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      
      if (data.logo && data.logo.length > 0) {
        const file = data.logo[0];
        if (file.size > 2 * 1024 * 1024) {
          toast.error(t('messages.fileTooLarge'));
          setIsSubmitting(false);
          return;
        }
        formData.append('logo', file);
      }

      await pb.collection('clients').create(formData, { $autoCancel: false });
      toast.success(t('messages.clientAdded'));
      reset();
      fetchClients();
    } catch (error) {
      console.error(error);
      toast.error(t('messages.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('messages.confirmDelete'))) return;
    
    try {
      await pb.collection('clients').delete(id, { $autoCancel: false });
      toast.success(t('messages.clientDeleted'));
      fetchClients();
    } catch (error) {
      toast.error(t('messages.error'));
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-card text-card-foreground border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" />
          {t('clients.addTitle')}
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">{t('form.name')} <span className="text-destructive">*</span></Label>
            <Input
              id="name"
              {...register('name', { required: t('messages.required') })}
              placeholder={t('placeholders.clientName')}
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t('form.description')} <span className="text-destructive">*</span></Label>
            <Textarea
              id="description"
              {...register('description', { required: t('messages.required') })}
              placeholder={t('placeholders.description')}
              rows={4}
              className={errors.description ? 'border-destructive' : ''}
            />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo">{t('form.logo')} (Max 2MB. JPG, PNG, WebP, SVG)</Label>
            <div className="flex items-center gap-4">
              <Input
                id="logo"
                type="file"
                accept="image/jpeg, image/png, image/webp, image/svg+xml"
                {...register('logo')}
                className="file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('buttons.uploading')}
              </>
            ) : (
              <>
                <UploadCloud className="mr-2 h-4 w-4" />
                {t('buttons.addClient')}
              </>
            )}
          </Button>
        </form>
      </div>

      <div className="bg-card text-card-foreground border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6">{t('clients.manageTitle')}</h2>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : clients.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
            <Building2 className="mx-auto h-12 w-12 opacity-20 mb-3" />
            <p>{t('clients.noClients')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clients.map((client) => (
              <div key={client.id} className="flex gap-4 p-4 border rounded-lg hover:border-primary/50 transition-colors bg-background">
                <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                  {client.logo ? (
                    <img 
                      src={pb.files.getURL(client, client.logo)} 
                      alt={client.name} 
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <Building2 className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{client.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{client.description}</p>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    onClick={() => handleDelete(client.id)}
                    title={t('buttons.delete')}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientsForm;
