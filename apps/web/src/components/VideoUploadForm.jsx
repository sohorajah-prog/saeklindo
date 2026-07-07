
import React, { useState, useRef } from 'react';
import { Upload, X, FileVideo, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ALLOWED_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

const VideoUploadForm = ({ record, onUploadSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const existingVideoUrl = record?.video_file ? pb.files.getURL(record, record.video_file) : null;

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateFile = (selectedFile) => {
    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      toast.error('Invalid file type. Please upload MP4, WebM, or MOV.');
      return false;
    }
    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error('File is too large. Maximum size is 100MB.');
      return false;
    }
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && validateFile(droppedFile)) {
      handleFileSelection(droppedFile);
    }
  };

  const handleFileInput = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && validateFile(selectedFile)) {
      handleFileSelection(selectedFile);
    }
  };

  const handleFileSelection = (selectedFile) => {
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const clearSelection = () => {
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getVideoDuration = (fileObj) => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(Math.round(video.duration));
      };
      video.src = URL.createObjectURL(fileObj);
    });
  };

  const handleUpload = async () => {
    if (!file || !record) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate progress since PocketBase JS SDK doesn't natively expose XHR upload progress easily
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) return 90;
        return prev + 10;
      });
    }, 500);

    try {
      const duration = await getVideoDuration(file);
      
      const formData = new FormData();
      formData.append('video_file', file);
      formData.append('video_size', file.size);
      formData.append('video_duration', duration);

      const updatedRecord = await pb.collection('content').update(record.id, formData, { $autoCancel: false });
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      toast.success('Video uploaded successfully!');
      clearSelection();
      
      if (onUploadSuccess) {
        onUploadSuccess(updatedRecord);
      }
    } catch (error) {
      clearInterval(progressInterval);
      console.error('Upload error:', error);
      toast.error('Failed to upload video.');
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleDeleteVideo = async () => {
    if (!record || !record.video_file) return;

    if (!window.confirm('Are you sure you want to remove the current video?')) return;

    setIsUploading(true);
    try {
      // Set the field to null/empty string to delete it
      const updatedRecord = await pb.collection('content').update(record.id, {
        video_file: null,
        video_size: null,
        video_duration: null
      }, { $autoCancel: false });
      
      toast.success('Video removed successfully.');
      if (onUploadSuccess) {
        onUploadSuccess(updatedRecord);
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to remove video.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Existing Video Display */}
      {!file && existingVideoUrl && (
        <div className="bg-card border rounded-xl p-4 shadow-sm">
          <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            Current Hero Video
          </h3>
          <div className="aspect-video bg-black rounded-lg overflow-hidden relative mb-4">
            <video 
              src={existingVideoUrl} 
              controls 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              Size: {formatFileSize(record.video_size || 0)} | 
              Duration: {record.video_duration || 0}s
            </div>
            <Button variant="destructive" size="sm" onClick={handleDeleteVideo} disabled={isUploading}>
              Remove Video
            </Button>
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div 
        className={`upload-dropzone rounded-xl p-8 text-center cursor-pointer ${isDragging ? 'active' : ''} ${file ? 'hidden' : 'block'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileInput}
          accept={ALLOWED_TYPES.join(',')}
          className="hidden"
        />
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="p-4 bg-primary/10 text-primary rounded-full">
            <Upload className="w-8 h-8" />
          </div>
          <div>
            <p className="font-medium text-foreground">Click to upload or drag and drop</p>
            <p className="text-sm text-muted-foreground mt-1">MP4, WebM, or MOV (max. 100MB)</p>
          </div>
        </div>
      </div>

      {/* Selected File Preview */}
      {file && (
        <div className="bg-card border rounded-xl p-4 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 text-primary rounded-lg">
                <FileVideo className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium truncate max-w-[200px] sm:max-w-xs">{file.name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
              </div>
            </div>
            <button 
              onClick={clearSelection}
              disabled={isUploading}
              className="p-1 hover:bg-muted rounded-md text-muted-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {previewUrl && (
            <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4 relative">
              <video 
                src={previewUrl} 
                controls 
                className="w-full h-full object-contain"
              />
            </div>
          )}

          {isUploading && (
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary animate-progress"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <Button 
            onClick={handleUpload} 
            disabled={isUploading} 
            className="w-full"
          >
            {isUploading ? 'Uploading Video...' : 'Upload Video to Hero Section'}
          </Button>
        </div>
      )}

      {/* Info Notice */}
      <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
        <AlertCircle className="w-5 h-5 shrink-0" />
        <p>
          The uploaded video will automatically play in the background of the hero section. For best performance, use compressed MP4 format under 20MB.
        </p>
      </div>
    </div>
  );
};

export default VideoUploadForm;
