
import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import { useTranslation } from '@/hooks/useTranslation.js';
import { Upload, X, Loader2 } from 'lucide-react';

const AboutForm = () => {
  const { t } = useTranslation();
  const [record, setRecord] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  
  // Image states
  const [uploadingImage, setUploadingImage] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const aboutSchema = z.object({
    visi: z.string().min(1, t('messages.required')),
    visi_en: z.string().min(1, t('messages.required')),
    misi: z.string().min(1, t('messages.required')),
    misi_en: z.string().min(1, t('messages.required')),
    deskripsi: z.string().min(1, t('messages.required')),
    deskripsi_en: z.string().min(1, t('messages.required')),
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(aboutSchema),
    defaultValues: { visi: '', visi_en: '', misi: '', misi_en: '', deskripsi: '', deskripsi_en: '' }
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const records = await pb.collection('content').getFullList({
          filter: `page="about" && field="data"`,
          $autoCancel: false
        });
        if (records.length > 0) {
          setRecord(records[0]);
          reset(JSON.parse(records[0].value));
          if (records[0].image_file) {
            setPreview(pb.files.getURL(records[0], records[0].image_file));
          }
        } else {
          reset({
            visi: 'Menjadi penyedia layanan profesional terpercaya...',
            visi_en: 'To be the most trusted and preferred professional service provider...',
            misi: 'Memberikan layanan berkualitas lewat tenaga profesional...',
            misi_en: 'To deliver exceptional service quality through trained professionals...',
            deskripsi: 'Saeklindo adalah penyedia layanan profesional...',
            deskripsi_en: 'Saeklindo is a professional service provider dedicated to delivering excellence...'
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

      if (record) {
        const updated = await pb.collection('content').update(record.id, payload, { $autoCancel: false });
        setRecord(updated);
      } else {
        const newRecord = await pb.collection('content').create(payload, { $autoCancel: false });
        setRecord(newRecord);
      }
      toast.success(t('messages.aboutUpdated'));
    } catch (error) {
      toast.error(t('messages.error'));
      console.error(error);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (file) => {
    if (!file.type.startsWith('image/')) {
      toast.error(t('messages.invalidFileType'));
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error(t('messages.fileTooLarge'));
      return;
    }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleImageUpload = async () => {
    if (!selectedFile) return;
    setUploadingImage(true);
    
    try {
      const formData = new FormData();
      formData.append('image_file', selectedFile);
      
      let targetId = record?.id;
      if (!targetId) {
        const defaultData = {
          visi: 'Menjadi penyedia layanan profesional terpercaya...',
          visi_en: 'To be the most trusted and preferred professional service provider...',
          misi: 'Memberikan layanan berkualitas lewat tenaga profesional...',
          misi_en: 'To deliver exceptional service quality through trained professionals...',
          deskripsi: 'Saeklindo adalah penyedia layanan profesional...',
          deskripsi_en: 'Saeklindo is a professional service provider dedicated to delivering excellence...'
        };
        const newRecord = await pb.collection('content').create({
          page: 'about',
          field: 'data',
          value: JSON.stringify(defaultData)
        }, { $autoCancel: false });
        setRecord(newRecord);
        targetId = newRecord.id;
      }
      
      const updatedRecord = await pb.collection('content').update(targetId, formData, { $autoCancel: false });
      setRecord(updatedRecord);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      
      toast.success('Gambar Tentang Kami berhasil diunggah');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(t('messages.error'));
    } finally {
      setUploadingImage(false);
    }
  };

  if (isFetching) return <div className="p-8 text-center text-muted-foreground animate-pulse">{t('admin.loading')}</div>;

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="bg-card p-6 rounded-xl shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Gambar Tentang Kami</h3>
        <div 
          className={`upload-dropzone h-[300px] rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer ${dragActive ? 'active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !preview && fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
          />
          
          {preview ? (
            <div className="relative w-full h-full rounded-lg overflow-hidden group">
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all cursor-pointer" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                <p className="text-white text-sm font-medium">Klik untuk mengganti gambar</p>
              </div>
              {selectedFile && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                    setPreview(record?.image_file ? pb.files.getURL(record, record.image_file) : null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Upload className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm font-medium mb-1">Klik atau seret gambar ke sini</p>
              <p className="text-xs text-muted-foreground">PNG, JPG, atau WEBP (Max 10MB)</p>
            </div>
          )}
        </div>
        {selectedFile && (
          <div className="mt-4 flex justify-end">
            <Button onClick={handleImageUpload} disabled={uploadingImage}>
              {uploadingImage ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Mengunggah...</>
              ) : (
                <><Upload className="w-4 h-4 mr-2" /> Simpan Gambar</>
              )}
            </Button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-card p-6 rounded-xl shadow-sm border space-y-6">
        <h3 className="text-lg font-semibold mb-4">Teks Tentang Kami</h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-muted/30 rounded-lg border">
            <h4 className="font-medium mb-3">{t('form.companyDesc')}</h4>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Bahasa Indonesia</label>
                <Textarea {...register('deskripsi')} rows={3} />
                {errors.deskripsi && <p className="text-sm text-destructive mt-1">{errors.deskripsi.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">English</label>
                <Textarea {...register('deskripsi_en')} rows={3} />
                {errors.deskripsi_en && <p className="text-sm text-destructive mt-1">{errors.deskripsi_en.message}</p>}
              </div>
            </div>
          </div>

          <div className="p-4 bg-muted/30 rounded-lg border">
            <h4 className="font-medium mb-3">{t('form.visi')}</h4>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Bahasa Indonesia</label>
                <Textarea {...register('visi')} rows={2} />
                {errors.visi && <p className="text-sm text-destructive mt-1">{errors.visi.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">English</label>
                <Textarea {...register('visi_en')} rows={2} />
                {errors.visi_en && <p className="text-sm text-destructive mt-1">{errors.visi_en.message}</p>}
              </div>
            </div>
          </div>

          <div className="p-4 bg-muted/30 rounded-lg border">
            <h4 className="font-medium mb-3">{t('form.misi')}</h4>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Bahasa Indonesia</label>
                <Textarea {...register('misi')} rows={3} />
                {errors.misi && <p className="text-sm text-destructive mt-1">{errors.misi.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">English</label>
                <Textarea {...register('misi_en')} rows={3} />
                {errors.misi_en && <p className="text-sm text-destructive mt-1">{errors.misi_en.message}</p>}
              </div>
            </div>
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? t('buttons.saving') : t('buttons.saveAbout')}
        </Button>
      </form>
    </div>
  );
};

export default AboutForm;
