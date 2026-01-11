import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Plus, Edit, Trash2, Sparkles, RefreshCw, Tags, FileText, Save, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

export default function BlogAdmin() {
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    metaDescription: '',
    tags: [],
    featuredImageUrl: '',
    status: 'draft',
    author: '',
  });

  const queryClient = useQueryClient();

  const { data: posts = [] } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: () => base44.entities.BlogPost.list('-created_date'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => {
      const postData = {
        ...data,
        publishedDate: data.status === 'published' ? new Date().toISOString() : null,
        readTimeMinutes: Math.ceil(data.content.split(' ').length / 200),
      };
      return base44.entities.BlogPost.create(postData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      toast.success('Blog post created');
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => {
      const postData = {
        ...data,
        readTimeMinutes: Math.ceil(data.content.split(' ').length / 200),
      };
      return base44.entities.BlogPost.update(id, postData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      toast.success('Blog post updated');
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.BlogPost.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      toast.success('Blog post deleted');
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      metaDescription: '',
      tags: [],
      featuredImageUrl: '',
      status: 'draft',
      author: '',
    });
    setShowForm(false);
    setEditingPost(null);
    setShowPreview(false);
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug || '',
      content: post.content,
      excerpt: post.excerpt || '',
      metaDescription: post.metaDescription || '',
      tags: post.tags || [],
      featuredImageUrl: post.featuredImageUrl || '',
      status: post.status,
      author: post.author || '',
    });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingPost) {
      updateMutation.mutate({ id: editingPost.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleAI = async (action) => {
    setAiLoading(true);
    try {
      const { data } = await base44.functions.invoke('blogAI', {
        action,
        prompt: action === 'generate' ? formData.title : null,
        content: formData.content,
      });

      if (data.success) {
        switch (action) {
          case 'generate':
            setFormData({ ...formData, content: data.result });
            toast.success('Blog post generated!');
            break;
          case 'rewrite':
            setFormData({ ...formData, content: data.result });
            toast.success('Content rewritten!');
            break;
          case 'generateSEO':
            setFormData({
              ...formData,
              tags: data.result.tags,
              metaDescription: data.result.metaDescription,
              excerpt: data.result.excerpt,
            });
            toast.success('SEO metadata generated!');
            break;
        }
      }
    } catch (error) {
      toast.error('AI operation failed');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Blog Posts</h1>
            <p className="text-white/60">AI-powered content creation and management</p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-white text-black hover:bg-white/90 rounded-full"
          >
            <Plus size={18} className="mr-2" />
            New Post
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <motion.form
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="bg-zinc-900 border border-white/10 rounded-2xl p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">
                {editingPost ? 'Edit Post' : 'New Post'}
              </h2>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPreview(!showPreview)}
                  className="border-white/20 text-white hover:bg-white/5"
                >
                  <Eye size={18} className="mr-2" />
                  {showPreview ? 'Edit' : 'Preview'}
                </Button>
              </div>
            </div>

            {!showPreview ? (
              <div className="space-y-4">
                {/* Title & Slug */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Input
                      placeholder="Blog Post Title *"
                      value={formData.title}
                      onChange={(e) => {
                        const title = e.target.value;
                        setFormData({
                          ...formData,
                          title,
                          slug: formData.slug || generateSlug(title),
                        });
                      }}
                      required
                      className="bg-black border-white/20 text-white"
                    />
                  </div>
                  <Input
                    placeholder="URL Slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="bg-black border-white/20 text-white"
                  />
                </div>

                {/* AI Generate from Title */}
                {formData.title && !formData.content && (
                  <Button
                    type="button"
                    onClick={() => handleAI('generate')}
                    disabled={aiLoading}
                    className="bg-purple-600 hover:bg-purple-700 rounded-full"
                  >
                    <Sparkles size={18} className="mr-2" />
                    {aiLoading ? 'Generating...' : 'Generate Post from Title'}
                  </Button>
                )}

                {/* Content */}
                <div className="relative">
                  <Textarea
                    placeholder="Blog post content (markdown supported) *"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                    className="bg-black border-white/20 text-white min-h-[300px] font-mono text-sm"
                  />
                  {formData.content && (
                    <div className="flex gap-2 mt-2">
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleAI('rewrite')}
                        disabled={aiLoading}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <RefreshCw size={16} className="mr-2" />
                        Rewrite with AI
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleAI('generateSEO')}
                        disabled={aiLoading}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Tags size={16} className="mr-2" />
                        Generate SEO
                      </Button>
                    </div>
                  )}
                </div>

                {/* Excerpt & Meta */}
                <Textarea
                  placeholder="Excerpt (short summary)"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="bg-black border-white/20 text-white"
                  rows={2}
                />

                <Input
                  placeholder="Meta Description (for SEO)"
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  className="bg-black border-white/20 text-white"
                  maxLength={160}
                />

                {/* Tags */}
                <Input
                  placeholder="Tags (comma-separated)"
                  value={formData.tags.join(', ')}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                    })
                  }
                  className="bg-black border-white/20 text-white"
                />

                {/* Author & Image */}
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Author Name"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="bg-black border-white/20 text-white"
                  />
                  <Input
                    placeholder="Featured Image URL"
                    value={formData.featuredImageUrl}
                    onChange={(e) => setFormData({ ...formData, featuredImageUrl: e.target.value })}
                    className="bg-black border-white/20 text-white"
                  />
                </div>

                {/* Status */}
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger className="bg-black border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="bg-white text-black hover:bg-white/90">
                    <Save size={18} className="mr-2" />
                    {editingPost ? 'Update' : 'Create'} Post
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm} className="border-white/20 text-white hover:bg-white/5">
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="prose prose-invert max-w-none">
                <h1>{formData.title}</h1>
                {formData.author && <p className="text-white/60">By {formData.author}</p>}
                {formData.featuredImageUrl && (
                  <img src={formData.featuredImageUrl} alt={formData.title} className="rounded-lg w-full" />
                )}
                <ReactMarkdown>{formData.content}</ReactMarkdown>
              </div>
            )}
          </motion.form>
        )}

        {/* Posts List */}
        <div className="space-y-4">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-zinc-900 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{post.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      post.status === 'published' ? 'bg-green-500/20 text-green-400' :
                      post.status === 'archived' ? 'bg-gray-500/20 text-gray-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {post.status}
                    </span>
                  </div>
                  {post.excerpt && <p className="text-white/60 mb-2">{post.excerpt}</p>}
                  {post.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {post.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-white/5 rounded text-xs text-white/60">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-white/40 text-sm">
                    {post.readTimeMinutes} min read • {new Date(post.created_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleEdit(post)}
                    className="border-white/20 text-white hover:bg-white/5"
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => deleteMutation.mutate(post.id)}
                    className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}

          {posts.length === 0 && (
            <div className="text-center py-20">
              <FileText size={64} className="mx-auto mb-4 text-white/20" />
              <p className="text-white/40">No blog posts yet. Create your first post with AI assistance!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}