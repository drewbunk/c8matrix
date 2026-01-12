import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Upload, Image, Video, Trash2, Copy, CheckCircle, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function MediaManager() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedFile, setSelectedFile] = useState(null);

  const queryClient = useQueryClient();

  const { data: mediaFiles = [] } = useQuery({
    queryKey: ['mediaFiles'],
    queryFn: () => base44.entities.MediaFile.list('-created_date'),
  });

  const deleteFileMutation = useMutation({
    mutationFn: (id) => base44.entities.MediaFile.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['mediaFiles']);
      toast.success('File deleted');
      setSelectedFile(null);
    },
  });

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    await uploadFiles(files);
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    await uploadFiles(files);
  };

  const uploadFiles = async (files) => {
    setIsUploading(true);

    for (const file of files) {
      try {
        // Check file type
        const isImage = file.type.startsWith('image/');
        const isVideo = file.type.startsWith('video/');

        if (!isImage && !isVideo) {
          toast.error(`${file.name}: Only images and videos are supported`);
          continue;
        }

        // Upload file
        const { file_url } = await base44.integrations.Core.UploadFile({ file });

        // Save to database
        await base44.entities.MediaFile.create({
          fileName: file.name,
          fileUrl: file_url,
          fileType: isImage ? 'image' : 'video',
          mimeType: file.type,
          fileSize: file.size,
          tags: [],
          usedIn: [],
        });

        toast.success(`${file.name} uploaded`);
      } catch (error) {
        console.error('Upload error:', error);
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    queryClient.invalidateQueries(['mediaFiles']);
    setIsUploading(false);
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard');
  };

  const filteredFiles = mediaFiles.filter((file) => {
    const matchesSearch = file.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || file.fileType === filterType;
    return matchesSearch && matchesType;
  });

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Media Manager</h1>
          <p className="text-white/60">Upload and manage images and videos</p>
        </div>

        {/* Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-12 mb-8 transition-all ${
            isDragging
              ? 'border-white bg-white/5'
              : 'border-white/20 hover:border-white/40'
          }`}
        >
          <div className="text-center">
            <Upload size={48} className="mx-auto mb-4 text-white/40" />
            <h3 className="text-xl font-semibold mb-2">
              {isUploading ? 'Uploading...' : 'Drag & Drop Files Here'}
            </h3>
            <p className="text-white/60 mb-4">or click to browse</p>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
              disabled={isUploading}
            />
            <label htmlFor="file-upload">
              <Button
                as="span"
                disabled={isUploading}
                className="bg-white text-black hover:bg-white/90 rounded-full cursor-pointer"
              >
                Select Files
              </Button>
            </label>
            <p className="text-white/40 text-sm mt-4">
              Supports: JPG, PNG, GIF, MP4, MOV, WebM
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-zinc-900 border-white/10 text-white max-w-sm"
          />
          <div className="flex gap-2">
            {['all', 'image', 'video'].map((type) => (
              <Button
                key={type}
                variant={filterType === type ? 'default' : 'outline'}
                onClick={() => setFilterType(type)}
                className={
                  filterType === type
                    ? 'bg-white text-black'
                    : 'border-white/20 text-white hover:bg-white/5'
                }
              >
                {type === 'all' ? 'All' : type === 'image' ? 'Images' : 'Videos'}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-zinc-900 border border-white/10 rounded-xl p-4">
            <p className="text-white/40 text-sm">Total Files</p>
            <p className="text-2xl font-bold">{mediaFiles.length}</p>
          </div>
          <div className="bg-zinc-900 border border-white/10 rounded-xl p-4">
            <p className="text-white/40 text-sm">Images</p>
            <p className="text-2xl font-bold">
              {mediaFiles.filter((f) => f.fileType === 'image').length}
            </p>
          </div>
          <div className="bg-zinc-900 border border-white/10 rounded-xl p-4">
            <p className="text-white/40 text-sm">Videos</p>
            <p className="text-2xl font-bold">
              {mediaFiles.filter((f) => f.fileType === 'video').length}
            </p>
          </div>
        </div>

        {/* Files Grid */}
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredFiles.map((file) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden hover:border-white/30 transition-all cursor-pointer"
              onClick={() => setSelectedFile(file)}
            >
              <div className="aspect-video bg-black flex items-center justify-center">
                {file.fileType === 'image' ? (
                  <img
                    src={file.fileUrl}
                    alt={file.fileName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Video size={48} className="text-white/40" />
                )}
              </div>
              <div className="p-4">
                <p className="text-sm font-medium truncate mb-1">{file.fileName}</p>
                <p className="text-xs text-white/40">{formatFileSize(file.fileSize)}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredFiles.length === 0 && (
          <div className="text-center py-20">
            <Image size={64} className="mx-auto mb-4 text-white/20" />
            <p className="text-white/40">No media files found</p>
          </div>
        )}
      </div>

      {/* File Detail Modal */}
      <AnimatePresence>
        {selectedFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setSelectedFile(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-zinc-900 border border-white/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{selectedFile.fileName}</h3>
                    <p className="text-white/60">
                      {selectedFile.fileType} • {formatFileSize(selectedFile.fileSize)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedFile(null)}
                    className="text-white/60 hover:text-white"
                  >
                    <X size={24} />
                  </Button>
                </div>

                {/* Preview */}
                <div className="bg-black rounded-xl overflow-hidden mb-6">
                  {selectedFile.fileType === 'image' ? (
                    <img
                      src={selectedFile.fileUrl}
                      alt={selectedFile.fileName}
                      className="w-full"
                    />
                  ) : (
                    <video src={selectedFile.fileUrl} controls className="w-full" />
                  )}
                </div>

                {/* URL */}
                <div className="bg-black rounded-xl p-4 mb-4">
                  <p className="text-white/40 text-sm mb-2">File URL</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-sm text-white/80 break-all">
                      {selectedFile.fileUrl}
                    </code>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => copyToClipboard(selectedFile.fileUrl)}
                      className="shrink-0"
                    >
                      <Copy size={18} />
                    </Button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(selectedFile.fileUrl)}
                    className="border-white/20 text-white hover:bg-white/5"
                  >
                    <Copy size={18} className="mr-2" />
                    Copy URL
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      if (confirm('Delete this file? This cannot be undone.')) {
                        deleteFileMutation.mutate(selectedFile.id);
                      }
                    }}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 size={18} className="mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}