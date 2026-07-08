import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Edit2, Loader2, Briefcase, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import { useTranslation } from '@/hooks/useTranslation.js';

const CareersForm = () => {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editId, setEditId] = useState(null);

  const initialFormState = {
    title: '',
    title_en: '',
    description: '',
    description_en: '',
    requirements: '',
    requirements_en: '',
    type: '',
    type_en: '',
    location: '',
    applyUrl: '',
    isActive: true
  };

  const [formData, setFormData] = useState(initialFormState);

  const fetchItems = async () => {
    try {
      const records = await pb.collection('careers').getList(1, 50, {
        sort: '-created',
        $autoCancel: false
      });
      setItems(records.items);
    } catch (error) {
      console.error('Error fetching careers:', error);
      toast.error(t('messages.error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleEdit = (item) => {
    setEditId(item.id);
    setFormData({
      title: item.title,
      title_en: item.title_en || '',
      description: item.description,
      description_en: item.description_en || '',
      requirements: item.requirements || '',
      requirements_en: item.requirements_en || '',
      type: item.type || '',
      type_en: item.type_en || '',
      location: item.location || '',
      applyUrl: item.applyUrl || '',
      isActive: item.isActive === undefined ? true : item.isActive
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditId(null);
    setFormData(initialFormState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast.error(t('messages.required'));
      return;
    }

    setUploading(true);
    try {
      const data = {
        title: formData.title,
        title_en: formData.title_en || formData.title,
        description: formData.description,
        description_en: formData.description_en || formData.description,
        requirements: formData.requirements,
        requirements_en: formData.requirements_en || formData.requirements,
        type: formData.type,
        type_en: formData.type_en || formData.type,
        location: formData.location,
        applyUrl: formData.applyUrl,
        isActive: formData.isActive
      };

      if (editId) {
        await pb.collection('careers').update(editId, data, { $autoCancel: false });
        toast.success(t('messages.careerUpdated') || 'Career updated successfully');
      } else {
        await pb.collection('careers').create(data, { $autoCancel: false });
        toast.success(t('messages.careerAdded') || 'Career added successfully');
      }
      
      cancelEdit();
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
      await pb.collection('careers').delete(id, { $autoCancel: false });
      toast.success(t('messages.careerDeleted') || 'Career deleted successfully');
      setItems(items.filter(item => item.id !== id));
      if (editId === id) cancelEdit();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(t('messages.error'));
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-card border rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {editId ? t('buttons.edit') + ' ' + t('careers.title') : t('careers.addTitle')}
          </h2>
          {editId && (
            <Button variant="outline" size="sm" onClick={cancelEdit}>
              {t('buttons.cancel')}
            </Button>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg border">
            <div className="space-y-2">
              <Label htmlFor="title">{t('form.title')} (ID) *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Contoh: Cleaning Staff"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title_en">{t('form.title')} (EN)</Label>
              <Input
                id="title_en"
                value={formData.title_en}
                onChange={(e) => setFormData(prev => ({ ...prev, title_en: e.target.value }))}
                placeholder="e.g. Cleaning Staff"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg border">
            <div className="space-y-2">
              <Label htmlFor="description">{t('form.description')} (ID) *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Deskripsi pekerjaan"
                rows={4}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description_en">{t('form.description')} (EN)</Label>
              <Textarea
                id="description_en"
                value={formData.description_en}
                onChange={(e) => setFormData(prev => ({ ...prev, description_en: e.target.value }))}
                placeholder="Job description"
                rows={4}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg border">
            <div className="space-y-2">
              <Label htmlFor="requirements">{t('form.requirements')} (ID)</Label>
              <Textarea
                id="requirements"
                value={formData.requirements}
                onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
                placeholder="Persyaratan pekerjaan"
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="requirements_en">{t('form.requirements')} (EN)</Label>
              <Textarea
                id="requirements_en"
                value={formData.requirements_en}
                onChange={(e) => setFormData(prev => ({ ...prev, requirements_en: e.target.value }))}
                placeholder="Job requirements"
                rows={4}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg border">
            <div className="space-y-2">
              <Label htmlFor="type">{t('form.type')} (ID)</Label>
              <Input
                id="type"
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                placeholder="Penuh Waktu"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type_en">{t('form.type')} (EN)</Label>
              <Input
                id="type_en"
                value={formData.type_en}
                onChange={(e) => setFormData(prev => ({ ...prev, type_en: e.target.value }))}
                placeholder="Full-time"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">{t('form.location')}</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Bekasi"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg border">
            <div className="space-y-2">
              <Label htmlFor="applyUrl">{t('form.applyUrl')}</Label>
              <Input
                id="applyUrl"
                value={formData.applyUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, applyUrl: e.target.value }))}
                placeholder="hr@saeklindo.com atau https://form..."
              />
            </div>
            <div className="space-y-2 flex flex-col justify-center pt-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="w-4 h-4 text-primary bg-background border-input rounded focus:ring-primary"
                />
                <span className="text-sm font-medium">{t('form.isActive')}</span>
              </label>
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
                {editId ? t('buttons.save') : t('buttons.addCareer', 'Add Career')}
              </>
            )}
          </Button>
        </form>
      </div>

      <div className="bg-card border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-6">{t('careers.manageTitle')}</h2>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
            <LayoutGrid className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>{t('careers.noCareers')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {items.map((item) => (
              <div key={item.id} className={`relative rounded-lg overflow-hidden border flex flex-row items-center p-4 gap-4 transition-colors ${editId === item.id ? 'bg-primary/5 border-primary/50' : 'bg-background'}`}>
                <div className="w-12 h-12 shrink-0 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-muted-foreground/50" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg truncate">{item.title}</h3>
                    {!item.isActive && (
                      <span className="px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded-full">Inactive</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">{item.description}</p>
                  <p className="text-xs text-primary font-medium mt-1 line-clamp-1">
                    {[item.type, item.location].filter(Boolean).join(' • ')}
                  </p>
                </div>
                
                <div className="flex flex-col md:flex-row gap-2 shrink-0">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 bg-primary/10 text-primary rounded-md hover:bg-primary hover:text-primary-foreground transition-colors"
                    title={t('buttons.edit')}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 bg-destructive/10 text-destructive rounded-md hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    title={t('buttons.delete')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CareersForm;
