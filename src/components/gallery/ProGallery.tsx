import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Image as ImageIcon, 
  Upload, 
  Folder, 
  Grid, 
  List, 
  Search,
  Tag,
  Trash2,
  Edit3,
  Plus,
  X,
  Filter,
  ChevronDown,
  Save,
  FolderPlus
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface GalleryItem {
  id: string;
  url: string;
  caption: string | null;
  tags: string[];
  folder: string | null;
  type: 'image' | 'video';
  created_at: string;
}

interface FolderStats {
  folder: string;
  count: number;
}

const ProGallery = () => {
  const { businessId } = useParams();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [folders, setFolders] = useState<FolderStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [uploading, setUploading] = useState(false);
  const [newFolder, setNewFolder] = useState('');
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editCaption, setEditCaption] = useState('');
  const [editTags, setEditTags] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const fetchGalleryItems = useCallback(async () => {
    if (!businessId) return;

    let query = supabase
      .from('business_gallery')
      .select('*')
      .eq('business_id', businessId);

    if (currentFolder) {
      query = query.eq('folder', currentFolder);
    }

    if (searchQuery) {
      query = query.or(`caption.ilike.%${searchQuery}%,tags.cs.{${searchQuery}}`);
    }

    if (filterType !== 'all') {
      query = query.eq('type', filterType);
    }

    // Add sorting
    if (sortBy === 'date') {
      query = query.order('created_at', { ascending: sortOrder === 'asc' });
    } else {
      query = query.order('caption', { ascending: sortOrder === 'asc' });
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching gallery items:', error);
    } else {
      setItems(data || []);
    }

    // Fetch folder statistics
    const { data: folderStats } = await supabase
      .from('business_gallery')
      .select('folder, count(*)')
      .eq('business_id', businessId)
      .not('folder', 'is', null)
      .group('folder');

    setFolders(folderStats || []);
    setLoading(false);
  }, [businessId, currentFolder, searchQuery, filterType, sortBy, sortOrder]);

  useEffect(() => {
    fetchGalleryItems();
  }, [fetchGalleryItems]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !businessId) return;

    setUploading(true);
    const uploadPromises = Array.from(files).map(async (file) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `gallery/${businessId}/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('business-media')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        return null;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('business-media')
        .getPublicUrl(filePath);

      // Create gallery item
      const { error: dbError } = await supabase
        .from('business_gallery')
        .insert({
          business_id: businessId,
          url: publicUrl,
          type: file.type.startsWith('image/') ? 'image' : 'video',
          folder: currentFolder,
          tags: []
        });

      if (dbError) {
        console.error('Error creating gallery item:', dbError);
        return null;
      }

      return publicUrl;
    });

    await Promise.all(uploadPromises);
    setUploading(false);
    fetchGalleryItems();
  };

  const handleCreateFolder = async () => {
    if (!newFolder.trim() || !businessId) return;

    const { error } = await supabase
      .from('business_gallery')
      .insert({
        business_id: businessId,
        folder: newFolder.trim(),
        type: 'folder',
        url: ''
      });

    if (error) {
      console.error('Error creating folder:', error);
    } else {
      setNewFolder('');
      setShowNewFolderInput(false);
      fetchGalleryItems();
    }
  };

  const handleDeleteSelected = async () => {
    if (!window.confirm('Are you sure you want to delete the selected items?')) return;

    const deletePromises = Array.from(selectedItems).map(async (id) => {
      const item = items.find(i => i.id === id);
      if (!item) return;

      // Delete from storage if it's a media file
      if (item.url) {
        const filePath = item.url.split('/').pop();
        if (filePath) {
          await supabase.storage
            .from('business-media')
            .remove([`gallery/${businessId}/${filePath}`]);
        }
      }

      // Delete from database
      return supabase
        .from('business_gallery')
        .delete()
        .eq('id', id);
    });

    await Promise.all(deletePromises);
    setSelectedItems(new Set());
    fetchGalleryItems();
  };

  const handleUpdateItem = async (id: string) => {
    const { error } = await supabase
      .from('business_gallery')
      .update({
        caption: editCaption,
        tags: editTags.split(',').map(tag => tag.trim()).filter(Boolean)
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating item:', error);
    } else {
      setEditingItem(null);
      fetchGalleryItems();
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Gallery Management</h1>
          <p className="text-gray-600">Organize and manage your business photos and videos</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setView(view === 'grid' ? 'list' : 'grid')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title={view === 'grid' ? 'Switch to list view' : 'Switch to grid view'}
          >
            {view === 'grid' ? <List className="h-5 w-5" /> : <Grid className="h-5 w-5" />}
          </button>
          {selectedItems.size > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
            >
              <Trash2 className="h-5 w-5" />
              <span>Delete Selected ({selectedItems.size})</span>
            </button>
          )}
        </div>
      </div>

      {/* Search and Upload */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by caption or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <div className="flex items-center space-x-4">
          <label className="flex-1">
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
              <Upload className="h-5 w-5" />
              <span>{uploading ? 'Uploading...' : 'Upload Files'}</span>
            </div>
          </label>
          <button
            onClick={() => setShowNewFolderInput(true)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <FolderPlus className="h-5 w-5" />
            <span>New Folder</span>
          </button>
        </div>
      </div>

      {/* Filters and Sorting */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <Filter className="h-5 w-5" />
          <span>Filters</span>
          <ChevronDown className={`h-4 w-4 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
        
        <div className="flex items-center space-x-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'name')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronDown className={`h-5 w-5 transform transition-transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center space-x-4">
            <span className="font-medium">Type:</span>
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-lg ${filterType === 'all' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('image')}
              className={`px-4 py-2 rounded-lg ${filterType === 'image' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
            >
              Images
            </button>
            <button
              onClick={() => setFilterType('video')}
              className={`px-4 py-2 rounded-lg ${filterType === 'video' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
            >
              Videos
            </button>
          </div>
        </div>
      )}

      {/* Folders */}
      {folders.length > 0 && (
        <div className="flex items-center space-x-4 overflow-x-auto py-2">
          <button
            onClick={() => setCurrentFolder(null)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap ${
              !currentFolder ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
            }`}
          >
            <ImageIcon className="h-5 w-5" />
            <span>All Items</span>
          </button>
          {folders.map((folder) => (
            <button
              key={folder.folder}
              onClick={() => setCurrentFolder(folder.folder)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap ${
                currentFolder === folder.folder ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
              }`}
            >
              <Folder className="h-5 w-5" />
              <span>{folder.folder}</span>
              <span className="text-sm text-gray-500">({folder.count})</span>
            </button>
          ))}
        </div>
      )}

      {/* New Folder Input */}
      {showNewFolderInput && (
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newFolder}
            onChange={(e) => setNewFolder(e.target.value)}
            placeholder="Enter folder name"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <button
            onClick={handleCreateFolder}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create
          </button>
          <button
            onClick={() => {
              setNewFolder('');
              setShowNewFolderInput(false);
            }}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Gallery Grid/List */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className={`group relative aspect-square rounded-lg overflow-hidden ${
                selectedItems.has(item.id) ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {item.type === 'image' ? (
                <img
                  src={item.url}
                  alt={item.caption || ''}
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={item.url}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute inset-0 p-4 flex flex-col justify-between text-white">
                  <div className="flex justify-between">
                    <button
                      onClick={() => {
                        const newSelected = new Set(selectedItems);
                        if (selectedItems.has(item.id)) {
                          newSelected.delete(item.id);
                        } else {
                          newSelected.add(item.id);
                        }
                        setSelectedItems(newSelected);
                      }}
                      className="p-1 hover:bg-white/20 rounded"
                    >
                      {selectedItems.has(item.id) ? 'Deselect' : 'Select'}
                    </button>
                    <button
                      onClick={() => {
                        setEditingItem(item.id);
                        setEditCaption(item.caption || '');
                        setEditTags(item.tags?.join(', ') || '');
                      }}
                      className="p-1 hover:bg-white/20 rounded"
                    >
                      <Edit3 className="h-5 w-5" />
                    </button>
                  </div>
                  {item.caption && <p className="text-sm">{item.caption}</p>}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="flex items-center space-x-1 text-xs bg-white/20 px-2 py-1 rounded"
                        >
                          <Tag className="h-3 w-3" />
                          <span>{tag}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className={`flex items-center space-x-4 p-4 rounded-lg ${
                selectedItems.has(item.id) ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
            >
              <div className="h-16 w-16 rounded-lg overflow-hidden">
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt={item.caption || ''}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <video
                    src={item.url}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium">{item.caption || 'Untitled'}</p>
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center space-x-1 text-xs bg-gray-100 px-2 py-1 rounded"
                      >
                        <Tag className="h-3 w-3" />
                        <span>{tag}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    const newSelected = new Set(selectedItems);
                    if (selectedItems.has(item.id)) {
                      newSelected.delete(item.id);
                    } else {
                      newSelected.add(item.id);
                    }
                    setSelectedItems(newSelected);
                  }}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  {selectedItems.has(item.id) ? 'Deselect' : 'Select'}
                </button>
                <button
                  onClick={() => {
                    setEditingItem(item.id);
                    setEditCaption(item.caption || '');
                    setEditTags(item.tags?.join(', ') || '');
                  }}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <Edit3 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Edit Item</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Caption
                </label>
                <input
                  type="text"
                  value={editCaption}
                  onChange={(e) => setEditCaption(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateItem(editingItem)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProGallery;