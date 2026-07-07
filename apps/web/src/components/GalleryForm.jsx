
import React, { useState, useEffect, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import { useTranslation } from '@/hooks/useTranslation.js';

const GalleryForm = () => {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Cleaning',
    file: null,
    preview: null
  });

  const fetchItems = async () => {
    try {
      const records = await pb.collection('gallery').getList(1, 50, {
        sort: '-created',
        $autoCancel: false
      });
      setItems(records.items);
    } catch (error) {
      console.error('Error fetching gallery:', error);
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
        preview: e.target.result,
        title: prev.title || file.name.split('.')[0]
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.file || !formData.title) {
      toast.error(t('messages.required'));
      return;
    }

    setUploading(true);
    try {
      const data = new FormData();
      data.append('image', formData.file);
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);

      await pb.collection('gallery').create(data, { $autoCancel: false });
      
      toast.success(t('messages.imageUploaded'));
      setFormData({ title: '', description: '', category: 'Cleaning', file: null, preview: null });
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
      await pb.collection('gallery').delete(id, { $autoCancel: false });
      toast.success(t('messages.imageDeleted'));
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(t('messages.error'));
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-card border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-6">{t('gallery.uploadTitle')}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div 
            className={`upload-dropzone rounded-xl p-8 text-center cursor-pointer ${dragActive ? 'active' : ''}`}
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
              <div className="relative w-full max-w-md mx-auto aspect-video rounded-lg overflow-hidden">
                <img src={formData.preview} alt="Preview" className="w-full h-full object-cover" />
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
                <p className="text-sm font-medium mb-1">{t('gallery.dropzoneText')}</p>
                <p className="text-xs text-muted-foreground">{t('gallery.dropzoneHint')}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">{t('form.title')} *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder={t('placeholders.title')}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">{t('form.category')}</Label>
              <Select 
                value={formData.category} 
                onValueChange={(val) => setFormData(prev => ({ ...prev, category: val }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('placeholders.selectCategory')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cleaning">Cleaning</SelectItem>
                  <SelectItem value="Security">Security</SelectItem>
                  <SelectItem value="Driver">Driver</SelectItem>
                  <SelectItem value="Pramubakti">Pramubakti</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t('form.description')}</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder={t('placeholders.description')}
              rows={3}
            />
          </div>

          <Button type="submit" disabled={uploading || !formData.file} className="w-full md:w-auto">
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t('buttons.uploading')}
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                {t('buttons.uploadImage')}
              </>
            )}
          </Button>
        </form>
      </div>

      <div className="bg-card border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-6">{t('gallery.manageTitle')}</h2>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
            <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>{t('gallery.emptyState')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <div key={item.id} className="group relative rounded-lg overflow-hidden border bg-muted aspect-square">
                <img 
                  src={pb.files.getURL(item, item.image)} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors"
                      title={t('buttons.delete')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium truncate">{item.title}</p>
                    <p className="text-white/70 text-xs">{item.category}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryForm;
