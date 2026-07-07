import React, { useState, useEffect, useRef } from 'react';
import { Upload, X, Trash2, Loader2, Sparkles, Shield, Car, Users, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import { useTranslation } from '@/hooks/useTranslation.js';

const ServicesForm = () => {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    nama: '',
    nama_en: '',
    deskripsi: '',
    deskripsi_en: '',
    benefits: '',
    benefits_en: '',
    file: null,
    preview: null
  });

  const fetchItems = async () => {
    try {
      const records = await pb.collection('services').getList(1, 50, {
        sort: 'created',
        $autoCancel: false
      });
      setItems(records.items);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error(t('messages.error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
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
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t('messages.fileTooLarge'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData(prev => ({
        ...prev,
        file,
        preview: e.target.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nama || !formData.deskripsi || !formData.benefits) {
      toast.error(t('messages.required'));
      return;
    }

    setUploading(true);
    try {
      const data = new FormData();
      data.append('nama', formData.nama);
      data.append('nama_en', formData.nama_en || formData.nama);
      data.append('deskripsi', formData.deskripsi);
      data.append('deskripsi_en', formData.deskripsi_en || formData.deskripsi);
      data.append('benefits', formData.benefits);
      data.append('benefits_en', formData.benefits_en || formData.benefits);
      if (formData.file) {
        data.append('image', formData.file);
      }

      await pb.collection('services').create(data, { $autoCancel: false });
      
      toast.success(t('messages.servicesUpdated'));
      setFormData({ 
        nama: '', nama_en: '', deskripsi: '', deskripsi_en: '', 
        benefits: '', benefits_en: '', file: null, preview: null 
      });
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchItems();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(t('messages.error'));
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('messages.confirmDelete'))) return;
    
    try {
      await pb.collection('services').delete(id, { $autoCancel: false });
      toast.success(t('messages.servicesUpdated'));
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(t('messages.error'));
    }
  };

  const getIconForService = (title) => {
    const tStr = title.toLowerCase();
    if (tStr.includes('clean')) return Sparkles;
    if (tStr.includes('secur')) return Shield;
    if (tStr.includes('driv')) return Car;
    return Users;
  };

  return (
    <div className="space-y-8">
      <div className="bg-card border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-6">{t('buttons.addService')}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg border">
                <div className="space-y-2">
                  <Label htmlFor="nama">{t('form.serviceName')} (ID) *</Label>
                  <Input
                    id="nama"
                    value={formData.nama}
                    onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value }))}
                    placeholder="Contoh: Layanan Kebersihan"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nama_en">{t('form.serviceName')} (EN)</Label>
                  <Input
                    id="nama_en"
                    value={formData.nama_en}
                    onChange={(e) => setFormData(prev => ({ ...prev, nama_en: e.target.value }))}
                    placeholder="e.g. Cleaning Service"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg border">
                <div className="space-y-2">
                  <Label htmlFor="benefits">{t('form.benefits')} (ID) *</Label>
                  <Input
                    id="benefits"
                    value={formData.benefits}
                    onChange={(e) => setFormData(prev => ({ ...prev, benefits: e.target.value }))}
                    placeholder="Contoh: Staf terlatih, Produk ramah lingkungan"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="benefits_en">{t('form.benefits')} (EN)</Label>
                  <Input
                    id="benefits_en"
                    value={formData.benefits_en}
                    onChange={(e) => setFormData(prev => ({ ...prev, benefits_en: e.target.value }))}
                    placeholder="e.g. Certified staff, Eco-friendly"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg border">
                <div className="space-y-2">
                  <Label htmlFor="deskripsi">{t('form.description')} (ID) *</Label>
                  <Textarea
                    id="deskripsi"
                    value={formData.deskripsi}
                    onChange={(e) => setFormData(prev => ({ ...prev, deskripsi: e.target.value }))}
                    placeholder="Deskripsi layanan dalam Bahasa Indonesia"
                    rows={4}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deskripsi_en">{t('form.description')} (EN)</Label>
                  <Textarea
                    id="deskripsi_en"
                    value={formData.deskripsi_en}
                    onChange={(e) => setFormData(prev => ({ ...prev, deskripsi_en: e.target.value }))}
                    placeholder="Service description in English"
                    rows={4}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 lg:col-span-1">
              <Label>{t('form.image')}</Label>
              <div 
                className={`upload-dropzone h-[300px] rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer ${dragActive ? 'active' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                />
                
                {formData.preview ? (
                  <div className="relative w-full h-full rounded-lg overflow-hidden group">
                    <img src={formData.preview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                      <p className="text-white text-sm font-medium">Click to change</p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormData(prev => ({ ...prev, file: null, preview: null }));
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <Upload className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-sm font-medium mb-1">Click to upload image</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG or WEBP (Max 5MB)</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Button type="submit" disabled={uploading} className="w-full">
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t('buttons.saving')}
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                {t('buttons.saveServices')}
              </>
            )}
          </Button>
        </form>
      </div>

      <div className="bg-card border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-6">Existing Services</h2>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
            <LayoutGrid className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No services added yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item) => {
              const Icon = getIconForService(item.nama);
              return (
                <div key={item.id} className="relative rounded-lg overflow-hidden border bg-background flex flex-row items-center p-4 gap-4">
                  <div className="w-20 h-20 shrink-0 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                    {item.image ? (
                      <img 
                        src={pb.files.getURL(item, item.image)} 
                        alt={item.nama}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Icon className="w-8 h-8 text-muted-foreground/50" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate">{item.nama}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">{item.deskripsi}</p>
                    <p className="text-xs text-primary font-medium mt-1 line-clamp-1">{item.benefits}</p>
                  </div>
                  
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 bg-destructive/10 text-destructive rounded-md hover:bg-destructive hover:text-destructive-foreground transition-colors shrink-0"
                    title={t('buttons.delete')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesForm;
