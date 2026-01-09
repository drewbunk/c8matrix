import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Settings, FileText, Briefcase, Layers, ShoppingBag, MessageSquare, 
  Plus, Trash2, Save, ArrowLeft, Eye, GripVertical, Lock, Video, Image, FolderOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

// Simple password protection (you can make this more secure)
const ADMIN_PASSWORD = 'c8matrix2024';

function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('adminAuth', 'true');
      onLogin();
    } else {
      setError('Incorrect password');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
        <CardHeader className="text-center">
          <Lock className="w-12 h-12 text-white/60 mx-auto mb-4" />
          <CardTitle className="text-white text-2xl">Admin Access</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <Button type="submit" className="w-full bg-white text-black hover:bg-white/90">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function SiteSettingsForm() {
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: () => base44.entities.SiteSettings.list(),
  });

  const [formData, setFormData] = useState({});
  const [statsInput, setStatsInput] = useState('');

  useEffect(() => {
    if (settings?.[0]) {
      setFormData(settings[0]);
      if (settings[0].stats) {
        setStatsInput(settings[0].stats.map(s => `${s.value}|${s.label}`).join('\n'));
      }
    }
  }, [settings]);

  const mutation = useMutation({
    mutationFn: async (data) => {
      // Parse stats from text input
      const stats = statsInput.split('\n').filter(Boolean).map(line => {
        const [value, label] = line.split('|');
        return { value: value?.trim(), label: label?.trim() };
      }).filter(s => s.value && s.label);

      const payload = { ...data, stats };

      if (settings?.[0]?.id) {
        return base44.entities.SiteSettings.update(settings[0].id, payload);
      } else {
        return base44.entities.SiteSettings.create(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['siteSettings']);
    },
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) return <div className="text-white/60">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Brand Info</h3>
          <div>
            <Label className="text-white/60">Brand Name</Label>
            <Input
              value={formData.brandName || ''}
              onChange={(e) => handleChange('brandName', e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white mt-1"
            />
          </div>
          <div>
            <Label className="text-white/60">Full Name</Label>
            <Input
              value={formData.fullName || ''}
              onChange={(e) => handleChange('fullName', e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white mt-1"
            />
          </div>
          <div>
            <Label className="text-white/60">Tagline</Label>
            <Input
              value={formData.tagline || ''}
              onChange={(e) => handleChange('tagline', e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white mt-1"
            />
          </div>
          <div>
            <Label className="text-white/60">About Text</Label>
            <Textarea
              value={formData.aboutText || ''}
              onChange={(e) => handleChange('aboutText', e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white mt-1 min-h-[100px]"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Hero Video</h3>
          <div>
            <Label className="text-white/60">Video Type</Label>
            <Select
              value={formData.heroVideoType || 'youtube'}
              onValueChange={(v) => handleChange('heroVideoType', v)}
            >
              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="vimeo">Vimeo</SelectItem>
                <SelectItem value="mp4_url">MP4 URL</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-white/60">Video URL</Label>
            <Input
              value={formData.heroVideoUrl || ''}
              onChange={(e) => handleChange('heroVideoUrl', e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="bg-zinc-800 border-zinc-700 text-white mt-1"
            />
          </div>
          <div>
            <Label className="text-white/60">Poster Image URL (optional)</Label>
            <Input
              value={formData.heroPosterImageUrl || ''}
              onChange={(e) => handleChange('heroPosterImageUrl', e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white mt-1"
            />
          </div>
          <div>
            <Label className="text-white/60">Headshot Image URL</Label>
            <Input
              value={formData.headshotImageUrl || ''}
              onChange={(e) => handleChange('headshotImageUrl', e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white mt-1"
            />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">CTAs</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-white/60">Primary CTA Text</Label>
              <Input
                value={formData.primaryCTAText || ''}
                onChange={(e) => handleChange('primaryCTAText', e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-white/60">Primary CTA Link</Label>
              <Input
                value={formData.primaryCTALink || ''}
                onChange={(e) => handleChange('primaryCTALink', e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white mt-1"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-white/60">Secondary CTA Text</Label>
              <Input
                value={formData.secondaryCTAText || ''}
                onChange={(e) => handleChange('secondaryCTAText', e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-white/60">Secondary CTA Link</Label>
              <Input
                value={formData.secondaryCTALink || ''}
                onChange={(e) => handleChange('secondaryCTALink', e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white mt-1"
              />
            </div>
          </div>
          <div>
            <Label className="text-white/60">Resume PDF URL</Label>
            <Input
              value={formData.resumePdfUrl || ''}
              onChange={(e) => handleChange('resumePdfUrl', e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white mt-1"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Stats (About Section)</h3>
          <div>
            <Label className="text-white/60">Stats (one per line: value|label)</Label>
            <Textarea
              value={statsInput}
              onChange={(e) => setStatsInput(e.target.value)}
              placeholder="30+|Years Automotive Leadership&#10;50K+|Social Community&#10;AI-First|Production Workflows"
              className="bg-zinc-800 border-zinc-700 text-white mt-1 min-h-[100px] font-mono text-sm"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Social & Contact</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label className="text-white/60">Contact Email</Label>
            <Input
              value={formData.contactEmail || ''}
              onChange={(e) => handleChange('contactEmail', e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white mt-1"
            />
          </div>
          <div>
            <Label className="text-white/60">Instagram URL</Label>
            <Input
              value={formData.socialInstagramUrl || ''}
              onChange={(e) => handleChange('socialInstagramUrl', e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white mt-1"
            />
          </div>
          <div>
            <Label className="text-white/60">YouTube URL</Label>
            <Input
              value={formData.socialYouTubeUrl || ''}
              onChange={(e) => handleChange('socialYouTubeUrl', e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white mt-1"
            />
          </div>
          <div>
            <Label className="text-white/60">TikTok URL</Label>
            <Input
              value={formData.socialTikTokUrl || ''}
              onChange={(e) => handleChange('socialTikTokUrl', e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white mt-1"
            />
          </div>
          <div>
            <Label className="text-white/60">LinkedIn URL</Label>
            <Input
              value={formData.socialLinkedInUrl || ''}
              onChange={(e) => handleChange('socialLinkedInUrl', e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white mt-1"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-6 border-t border-zinc-800">
        <h3 className="text-lg font-semibold text-white">Background Music</h3>
        
        <div className="flex items-center gap-3 p-4 bg-zinc-800/50 rounded-lg">
          <Switch
            checked={formData.backgroundMusicEnabled || false}
            onCheckedChange={(v) => handleChange('backgroundMusicEnabled', v)}
          />
          <Label className="text-white/80">Enable background music on site</Label>
        </div>

        <div>
          <Label className="text-white/60">Music URL (MP3)</Label>
          <Input
            value={formData.backgroundMusicUrl || ''}
            onChange={(e) => handleChange('backgroundMusicUrl', e.target.value)}
            placeholder="https://example.com/music.mp3"
            className="bg-zinc-800 border-zinc-700 text-white mt-1"
          />
          <p className="text-xs text-white/40 mt-1">
            Upload your music file and paste the URL here
          </p>
        </div>
      </div>

      <Button 
        onClick={() => mutation.mutate(formData)}
        disabled={mutation.isPending}
        className="bg-white text-black hover:bg-white/90"
      >
        <Save className="w-4 h-4 mr-2" />
        {mutation.isPending ? 'Saving...' : 'Save Settings'}
      </Button>
    </div>
  );
}

function CRUDList({ entityName, schema, renderItem, emptyMessage }) {
  const queryClient = useQueryClient();
  const { data: items, isLoading } = useQuery({
    queryKey: [entityName],
    queryFn: () => base44.entities[entityName].list(),
  });

  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities[entityName].create(data),
    onSuccess: () => {
      queryClient.invalidateQueries([entityName]);
      setEditingItem(null);
      setFormData({});
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities[entityName].update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries([entityName]);
      setEditingItem(null);
      setFormData({});
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities[entityName].delete(id),
    onSuccess: () => queryClient.invalidateQueries([entityName]),
  });

  const handleSave = () => {
    if (editingItem === 'new') {
      createMutation.mutate(formData);
    } else {
      updateMutation.mutate({ id: editingItem, data: formData });
    }
  };

  if (isLoading) return <div className="text-white/60">Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-white/60 text-sm">{items?.length || 0} items</span>
        <Button
          onClick={() => {
            setEditingItem('new');
            setFormData({});
          }}
          className="bg-white text-black hover:bg-white/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New
        </Button>
      </div>

      {editingItem && (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="pt-6">
            {schema.map(field => (
              <div key={field.key} className="mb-4">
                <Label className="text-white/60">{field.label}</Label>
                {field.type === 'textarea' ? (
                  <Textarea
                    value={formData[field.key] || ''}
                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    className="bg-zinc-800 border-zinc-700 text-white mt-1"
                    placeholder={field.placeholder}
                  />
                ) : field.type === 'select' ? (
                  <Select
                    value={formData[field.key] || ''}
                    onValueChange={(v) => setFormData({ ...formData, [field.key]: v })}
                  >
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white mt-1">
                      <SelectValue placeholder={field.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options.map(opt => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : field.type === 'switch' ? (
                  <div className="flex items-center gap-2 mt-1">
                    <Switch
                      checked={formData[field.key] || false}
                      onCheckedChange={(v) => setFormData({ ...formData, [field.key]: v })}
                    />
                    <span className="text-white/60 text-sm">{formData[field.key] ? 'Yes' : 'No'}</span>
                  </div>
                ) : field.type === 'array' ? (
                  <Textarea
                    value={(formData[field.key] || []).join('\n')}
                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value.split('\n').filter(Boolean) })}
                    className="bg-zinc-800 border-zinc-700 text-white mt-1"
                    placeholder={field.placeholder}
                  />
                ) : field.type === 'number' ? (
                  <Input
                    type="number"
                    value={formData[field.key] || ''}
                    onChange={(e) => setFormData({ ...formData, [field.key]: parseInt(e.target.value) || 0 })}
                    className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  />
                ) : (
                  <Input
                    value={formData[field.key] || ''}
                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    className="bg-zinc-800 border-zinc-700 text-white mt-1"
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}
            <div className="flex gap-2">
              <Button onClick={handleSave} className="bg-white text-black hover:bg-white/90">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" onClick={() => setEditingItem(null)} className="border-zinc-700 text-white">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        {items?.map(item => (
          <Card key={item.id} className="bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 transition-colors">
            <CardContent className="py-4 flex items-center justify-between">
              <div className="flex-1">{renderItem(item)}</div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingItem(item.id);
                    setFormData(item);
                  }}
                  className="text-white/60 hover:text-white"
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteMutation.mutate(item.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!items || items.length === 0) && !editingItem && (
        <div className="text-center py-12 text-white/40">
          {emptyMessage}
        </div>
      )}
    </div>
  );
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    if (auth === 'true') setIsAuthenticated(true);
  }, []);

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  const featuredSchema = [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'videoType', label: 'Video Type', type: 'select', options: ['youtube', 'vimeo', 'mp4_url'] },
    { key: 'videoUrl', label: 'Video URL', type: 'text' },
    { key: 'thumbnailUrl', label: 'Thumbnail URL', type: 'text' },
    { key: 'highlightBullets', label: 'Highlight Bullets (one per line)', type: 'array', placeholder: 'Enter bullets' },
    { key: 'isPinned', label: 'Pin to Top', type: 'switch' },
    { key: 'sortOrder', label: 'Sort Order', type: 'number' },
  ];

  const experienceSchema = [
    { key: 'roleTitle', label: 'Role Title', type: 'text' },
    { key: 'companyOrBrand', label: 'Company/Brand', type: 'text' },
    { key: 'startDate', label: 'Start Date', type: 'text', placeholder: 'e.g., Jan 2020' },
    { key: 'endDate', label: 'End Date', type: 'text', placeholder: 'e.g., Present' },
    { key: 'location', label: 'Location', type: 'text' },
    { key: 'bullets', label: 'Responsibilities (one per line)', type: 'array' },
    { key: 'sortOrder', label: 'Sort Order', type: 'number' },
  ];

  const projectSchema = [
    { key: 'name', label: 'Project Name', type: 'text' },
    { key: 'type', label: 'Type', type: 'select', options: ['App', 'Service', 'Content', 'Partnership'] },
    { key: 'shortDescription', label: 'Short Description', type: 'text' },
    { key: 'longDescription', label: 'Long Description', type: 'textarea' },
    { key: 'thumbnailImageUrl', label: 'Thumbnail Image URL', type: 'text' },
    { key: 'linkUrl', label: 'Link URL', type: 'text' },
    { key: 'tags', label: 'Tags (one per line)', type: 'array' },
    { key: 'isFeatured', label: 'Featured', type: 'switch' },
    { key: 'sortOrder', label: 'Sort Order', type: 'number' },
  ];

  const productSchema = [
    { key: 'title', label: 'Product Title', type: 'text' },
    { key: 'priceText', label: 'Price Text', type: 'text', placeholder: 'e.g., $29.99' },
    { key: 'imageUrl', label: 'Image URL', type: 'text' },
    { key: 'productUrl', label: 'Product URL', type: 'text' },
    { key: 'badge', label: 'Badge', type: 'text', placeholder: 'e.g., Best Seller' },
    { key: 'isFeatured', label: 'Featured', type: 'switch' },
    { key: 'sortOrder', label: 'Sort Order', type: 'number' },
  ];

  const aboutPhotoSchema = [
    { key: 'imageUrl', label: 'Image URL', type: 'text' },
    { key: 'sortOrder', label: 'Sort Order', type: 'number' },
  ];

  const portfolioSchema = [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'fileUrl', label: 'File URL', type: 'text' },
    { key: 'fileType', label: 'File Type', type: 'select', options: ['pdf', 'image', 'video', 'document'] },
    { key: 'thumbnailUrl', label: 'Thumbnail URL (optional)', type: 'text' },
    { key: 'category', label: 'Category', type: 'text', placeholder: 'e.g., Presentations, Case Studies' },
    { key: 'sortOrder', label: 'Sort Order', type: 'number' },
  ];

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-white">C8Matrix Admin</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link to={createPageUrl('Home')}>
              <Button variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800">
                <Eye className="w-4 h-4 mr-2" />
                View Site
              </Button>
            </Link>
            <Button
              variant="ghost"
              onClick={() => {
                localStorage.removeItem('adminAuth');
                setIsAuthenticated(false);
              }}
              className="text-white/60 hover:text-white"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <Tabs defaultValue="settings">
          <TabsList className="bg-zinc-900 border border-zinc-800 mb-8">
            <TabsTrigger value="settings" className="data-[state=active]:bg-white data-[state=active]:text-black">
              <Settings className="w-4 h-4 mr-2" />
              Site Settings
            </TabsTrigger>
            <TabsTrigger value="featured" className="data-[state=active]:bg-white data-[state=active]:text-black">
              <Video className="w-4 h-4 mr-2" />
              Featured
            </TabsTrigger>
            <TabsTrigger value="experience" className="data-[state=active]:bg-white data-[state=active]:text-black">
              <Briefcase className="w-4 h-4 mr-2" />
              Experience
            </TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-white data-[state=active]:text-black">
              <Layers className="w-4 h-4 mr-2" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:bg-white data-[state=active]:text-black">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger value="aboutphotos" className="data-[state=active]:bg-white data-[state=active]:text-black">
              <Image className="w-4 h-4 mr-2" />
              About Photos
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="data-[state=active]:bg-white data-[state=active]:text-black">
              <FolderOpen className="w-4 h-4 mr-2" />
              Portfolio
            </TabsTrigger>
            <TabsTrigger value="messages" className="data-[state=active]:bg-white data-[state=active]:text-black">
              <MessageSquare className="w-4 h-4 mr-2" />
              Messages
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Site Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <SiteSettingsForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="featured">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Featured Content</CardTitle>
              </CardHeader>
              <CardContent>
                <CRUDList
                  entityName="FeaturedContent"
                  schema={featuredSchema}
                  renderItem={(item) => (
                    <div>
                      <p className="text-white font-medium">{item.title}</p>
                      <p className="text-white/40 text-sm">{item.videoType} • {item.isPinned ? 'Pinned' : 'Not pinned'}</p>
                    </div>
                  )}
                  emptyMessage="No featured content yet. Add your first video!"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experience">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Experience / Resume</CardTitle>
              </CardHeader>
              <CardContent>
                <CRUDList
                  entityName="Experience"
                  schema={experienceSchema}
                  renderItem={(item) => (
                    <div>
                      <p className="text-white font-medium">{item.roleTitle}</p>
                      <p className="text-white/40 text-sm">{item.companyOrBrand} • {item.startDate} - {item.endDate}</p>
                    </div>
                  )}
                  emptyMessage="No experience entries yet. Add your work history!"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Projects & Offerings</CardTitle>
              </CardHeader>
              <CardContent>
                <CRUDList
                  entityName="Project"
                  schema={projectSchema}
                  renderItem={(item) => (
                    <div>
                      <p className="text-white font-medium">{item.name}</p>
                      <p className="text-white/40 text-sm">{item.type} • {item.isFeatured ? 'Featured' : 'Not featured'}</p>
                    </div>
                  )}
                  emptyMessage="No projects yet. Add your first project or offering!"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Shop Products</CardTitle>
              </CardHeader>
              <CardContent>
                <CRUDList
                  entityName="Product"
                  schema={productSchema}
                  renderItem={(item) => (
                    <div>
                      <p className="text-white font-medium">{item.title}</p>
                      <p className="text-white/40 text-sm">{item.priceText || 'No price'} • {item.badge || 'No badge'}</p>
                    </div>
                  )}
                  emptyMessage="No products yet. Add your first product!"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="aboutphotos">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">About Page Cinematic Photos</CardTitle>
              </CardHeader>
              <CardContent>
                <CRUDList
                  entityName="AboutPhoto"
                  schema={aboutPhotoSchema}
                  renderItem={(item) => (
                    <div className="flex items-center gap-4">
                      <img src={item.imageUrl} alt="Preview" className="w-32 h-16 object-cover rounded" />
                      <p className="text-white/60 text-sm">Order: {item.sortOrder || 0}</p>
                    </div>
                  )}
                  emptyMessage="No photos yet. Add cinematic photos for the About page!"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Portfolio Files</CardTitle>
              </CardHeader>
              <CardContent>
                <CRUDList
                  entityName="Portfolio"
                  schema={portfolioSchema}
                  renderItem={(item) => (
                    <div className="flex items-center gap-4">
                      {item.thumbnailUrl && (
                        <img src={item.thumbnailUrl} alt="Preview" className="w-24 h-16 object-cover rounded" />
                      )}
                      <div>
                        <p className="text-white font-medium">{item.title}</p>
                        <p className="text-white/40 text-sm">{item.fileType} • {item.category || 'Uncategorized'}</p>
                      </div>
                    </div>
                  )}
                  emptyMessage="No portfolio files yet. Add documents, images, or videos!"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <MessagesPanel />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function MessagesPanel() {
  const queryClient = useQueryClient();
  const { data: messages, isLoading } = useQuery({
    queryKey: ['contactSubmissions'],
    queryFn: () => base44.entities.ContactSubmission.list('-created_date'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.ContactSubmission.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['contactSubmissions']),
  });

  if (isLoading) return <div className="text-white/60">Loading...</div>;

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-white">Contact Messages</CardTitle>
      </CardHeader>
      <CardContent>
        {messages?.length > 0 ? (
          <div className="space-y-4">
            {messages.map((msg) => (
              <Card key={msg.id} className="bg-zinc-800 border-zinc-700">
                <CardContent className="py-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-white font-medium">{msg.name}</p>
                      <p className="text-white/40 text-sm">{msg.email}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMutation.mutate(msg.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  {msg.subject && <p className="text-white/60 text-sm mb-2">Subject: {msg.subject}</p>}
                  <p className="text-white/80">{msg.message}</p>
                  <p className="text-white/30 text-xs mt-2">
                    {new Date(msg.created_date).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-white/40">
            No messages yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
}