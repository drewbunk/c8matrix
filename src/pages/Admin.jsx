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
  Plus, Trash2, Save, ArrowLeft, Eye, GripVertical, Lock, Video, Image, FolderOpen, Users, Upload, Copy, Music
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';

function AdminLogin({ onLogin, storedPassword }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === storedPassword) {
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
          <div className="flex gap-2 mt-1">
            <Input
              value={formData.backgroundMusicUrl || ''}
              onChange={(e) => handleChange('backgroundMusicUrl', e.target.value)}
              placeholder="https://example.com/music.mp3"
              className="bg-zinc-800 border-zinc-700 text-white flex-1"
            />
            <input
              type="file"
              accept="audio/*"
              className="hidden"
              id="music-file-upload"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;

                if (!file.type.startsWith('audio/')) {
                  toast.error('Please select an audio file');
                  return;
                }

                try {
                  toast.info('Uploading music...');
                  const { file_url } = await base44.integrations.Core.UploadFile({ file });
                  handleChange('backgroundMusicUrl', file_url);
                  toast.success('Music uploaded! URL updated.');
                } catch (error) {
                  console.error('Upload error:', error);
                  toast.error('Failed to upload music');
                }
              }}
            />
            <label htmlFor="music-file-upload">
              <Button
                type="button"
                as="span"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/5 cursor-pointer"
              >
                <Upload size={16} className="mr-2" />
                Upload MP3
              </Button>
            </label>
          </div>
          <p className="text-xs text-white/40 mt-1">
            Click "Upload MP3" or paste a direct MP3 URL
          </p>
        </div>
      </div>

      <div className="space-y-4 pt-6 border-t border-zinc-800">
        <h3 className="text-lg font-semibold text-white">Admin Password</h3>
        <div>
          <Label className="text-white/60">Change Admin Password</Label>
          <Input
            type="password"
            value={formData.adminPassword || ''}
            onChange={(e) => handleChange('adminPassword', e.target.value)}
            placeholder="Enter new password"
            className="bg-zinc-800 border-zinc-700 text-white mt-1"
          />
          <p className="text-xs text-white/40 mt-1">
            Update the password for accessing this admin dashboard
          </p>
        </div>
      </div>

      <div className="space-y-4 pt-6 border-t border-zinc-800">
        <h3 className="text-lg font-semibold text-white">SMS Alerts</h3>

        <div>
          <Label className="text-white/60">Alert Phone Number</Label>
          <Input
            type="tel"
            value={formData.alertPhoneNumber || ''}
            onChange={(e) => handleChange('alertPhoneNumber', e.target.value)}
            placeholder="+15551234567"
            className="bg-zinc-800 border-zinc-700 text-white mt-1"
          />
          <p className="text-xs text-white/40 mt-1">
            Enter phone number with country code (e.g., +1 for US)
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 p-4 bg-zinc-800/50 rounded-lg">
            <Switch
              checked={formData.alertOnMessages || false}
              onCheckedChange={(v) => handleChange('alertOnMessages', v)}
            />
            <Label className="text-white/80">Alert me when new contact messages are received</Label>
          </div>

          <div className="flex items-center gap-3 p-4 bg-zinc-800/50 rounded-lg">
            <Switch
              checked={formData.alertOnPayments || false}
              onCheckedChange={(v) => handleChange('alertOnPayments', v)}
            />
            <Label className="text-white/80">Alert me when payments are successful</Label>
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <p className="text-blue-400 text-sm">
            📱 To receive SMS alerts, set your Twilio credentials in the app secrets (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER)
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
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={formData[field.key] || ''}
                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                        className="bg-zinc-800 border-zinc-700 text-white mt-1 flex-1"
                        placeholder={field.placeholder}
                      />
                      {field.fileUpload && (
                        <>
                          <input
                            type="file"
                            accept={field.key === 'thumbnailUrl' || field.key === 'imageUrl' ? 'image/*' : '*'}
                            className="hidden"
                            id={`upload-${field.key}`}
                            onChange={async (e) => {
                              const file = e.target.files[0];
                              if (!file) return;

                              try {
                                toast.info('Uploading file...');
                                const { file_url } = await base44.integrations.Core.UploadFile({ file });
                                setFormData({ ...formData, [field.key]: file_url });
                                toast.success('File uploaded! URL updated.');
                              } catch (error) {
                                console.error('Upload error:', error);
                                toast.error('Failed to upload file');
                              }
                            }}
                          />
                          <label htmlFor={`upload-${field.key}`}>
                            <Button
                              type="button"
                              as="span"
                              variant="outline"
                              className="border-white/20 text-white hover:bg-white/5 cursor-pointer mt-1"
                            >
                              <Upload size={16} className="mr-2" />
                              Upload
                            </Button>
                          </label>
                        </>
                      )}
                    </div>
                  </div>
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

  const { data: settings } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: () => base44.entities.SiteSettings.list(),
  });

  const storedPassword = settings?.[0]?.adminPassword || 'c8matrix2024';

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    if (auth === 'true') setIsAuthenticated(true);
  }, []);

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} storedPassword={storedPassword} />;
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
    { key: 'fileUrl', label: 'File URL', type: 'text', fileUpload: true },
    { key: 'fileType', label: 'File Type', type: 'select', options: ['pdf', 'image', 'video', 'youtube', 'document'] },
    { key: 'thumbnailUrl', label: 'Thumbnail URL (optional)', type: 'text', fileUpload: true },
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
            <TabsTrigger value="investors" className="data-[state=active]:bg-white data-[state=active]:text-black">
              <Users className="w-4 h-4 mr-2" />
              Investor Inquiries
            </TabsTrigger>
            <TabsTrigger value="media" className="data-[state=active]:bg-white data-[state=active]:text-black">
              <Image className="w-4 h-4 mr-2" />
              Media Manager
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

          <TabsContent value="investors">
            <InvestorInquiriesPanel />
          </TabsContent>

          <TabsContent value="media">
            <MediaManagerPanel />
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

function InvestorInquiriesPanel() {
  const queryClient = useQueryClient();
  const { data: inquiries, isLoading } = useQuery({
    queryKey: ['investorInquiries'],
    queryFn: () => base44.entities.InvestorInquiry.list('-created_date'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.InvestorInquiry.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['investorInquiries']),
  });

  if (isLoading) return <div className="text-white/60">Loading...</div>;

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-white">Investor Inquiries</CardTitle>
      </CardHeader>
      <CardContent>
        {inquiries?.length > 0 ? (
          <div className="space-y-4">
            {inquiries.map((inquiry) => (
              <Card key={inquiry.id} className="bg-zinc-800 border-zinc-700">
                <CardContent className="py-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-white font-semibold text-lg">{inquiry.name}</p>
                      <p className="text-white/40 text-sm">{inquiry.email}</p>
                      {inquiry.company && (
                        <p className="text-white/60 text-sm mt-1">
                          Company: {inquiry.company}
                        </p>
                      )}
                      {inquiry.investmentFocus && (
                        <p className="text-emerald-400/80 text-sm mt-1">
                          Focus: {inquiry.investmentFocus}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMutation.mutate(inquiry.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="bg-zinc-900/50 rounded-lg p-3 mt-3">
                    <p className="text-white/80 text-sm leading-relaxed">{inquiry.message}</p>
                  </div>
                  <p className="text-white/30 text-xs mt-3">
                    {new Date(inquiry.created_date).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-white/40">
            No investor inquiries yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function MediaManagerPanel() {
  const queryClient = useQueryClient();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const { data: mediaFiles = [] } = useQuery({
    queryKey: ['mediaFiles'],
    queryFn: () => base44.entities.MediaFile.list('-created_date'),
  });

  const deleteMutation = useMutation({
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
        const isImage = file.type.startsWith('image/');
        const isVideo = file.type.startsWith('video/');
        const isAudio = file.type.startsWith('audio/');

        if (!isImage && !isVideo && !isAudio) {
          toast.error(`${file.name}: Only images, videos, and audio files supported`);
          continue;
        }

        const { file_url } = await base44.integrations.Core.UploadFile({ file });

        let fileType = 'image';
        if (isVideo) fileType = 'video';
        if (isAudio) fileType = 'audio';

        await base44.entities.MediaFile.create({
          fileName: file.name,
          fileUrl: file_url,
          fileType,
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

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (fileType) => {
    if (fileType === 'image') return Image;
    if (fileType === 'video') return Video;
    if (fileType === 'audio') return Music;
    return FolderOpen;
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-white">Media Manager</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 transition-all ${
            isDragging
              ? 'border-white bg-white/5'
              : 'border-zinc-700 hover:border-zinc-600'
          }`}
        >
          <div className="text-center">
            <Upload size={40} className="mx-auto mb-3 text-white/40" />
            <h4 className="text-lg font-semibold text-white mb-2">
              {isUploading ? 'Uploading...' : 'Drag & Drop Files Here'}
            </h4>
            <p className="text-white/60 text-sm mb-4">Images, Videos, or Audio (MP3)</p>
            <input
              type="file"
              multiple
              accept="image/*,video/*,audio/*"
              onChange={handleFileSelect}
              className="hidden"
              id="media-upload"
              disabled={isUploading}
            />
            <label htmlFor="media-upload">
              <Button
                as="span"
                disabled={isUploading}
                className="bg-white text-black hover:bg-white/90 rounded-lg cursor-pointer"
              >
                Select Files
              </Button>
            </label>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-zinc-800/50 rounded-lg p-3">
            <p className="text-white/40 text-xs">Total Files</p>
            <p className="text-xl font-bold text-white">{mediaFiles.length}</p>
          </div>
          <div className="bg-zinc-800/50 rounded-lg p-3">
            <p className="text-white/40 text-xs">Images</p>
            <p className="text-xl font-bold text-white">
              {mediaFiles.filter((f) => f.fileType === 'image').length}
            </p>
          </div>
          <div className="bg-zinc-800/50 rounded-lg p-3">
            <p className="text-white/40 text-xs">Videos/Audio</p>
            <p className="text-xl font-bold text-white">
              {mediaFiles.filter((f) => f.fileType === 'video' || f.fileType === 'audio').length}
            </p>
          </div>
        </div>

        {/* Files List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {mediaFiles.map((file) => {
            const FileIcon = getFileIcon(file.fileType);
            return (
              <Card key={file.id} className="bg-zinc-800 border-zinc-700">
                <CardContent className="py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <FileIcon size={20} className="text-white/60 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-white text-sm font-medium truncate">{file.fileName}</p>
                        <p className="text-white/40 text-xs">
                          {file.fileType} • {formatFileSize(file.fileSize)}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(file.fileUrl)}
                        className="text-white/60 hover:text-white"
                      >
                        <Copy size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          if (confirm('Delete this file?')) {
                            deleteMutation.mutate(file.id);
                          }
                        }}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                  {selectedFile?.id === file.id && (
                    <div className="mt-3 pt-3 border-t border-zinc-700">
                      <code className="text-xs text-white/60 break-all">{file.fileUrl}</code>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {mediaFiles.length === 0 && (
          <div className="text-center py-8 text-white/40">
            No files uploaded yet. Drag and drop files above!
          </div>
        )}
      </CardContent>
    </Card>
  );
}