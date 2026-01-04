import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import VideoPlayer from '../components/VideoPlayer';
import { io } from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';
import { Search, Filter, Play, AlertTriangle, Loader2, Trash2, X, AlertOctagon } from 'lucide-react';

export default function Dashboard() {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchVideos();
    const socketUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://127.0.0.1:8000';
    const socket = io(socketUrl);

    socket.on('connect', () => {
      console.log('Connected to socket');
    });

    socket.on('video_status', (data) => {
      setVideos((prev) =>
        prev.map((v) => (v.id === data.id ? { ...v, status: data.status } : v))
      );
    });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    let result = videos;
    if (search) {
      result = result.filter(v => 
        v.title.toLowerCase().includes(search.toLowerCase()) || 
        v.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (statusFilter !== 'all') {
      result = result.filter(v => v.status === statusFilter);
    }
    setFilteredVideos(result);
  }, [videos, search, statusFilter]);

  const fetchVideos = async () => {
    try {
      const response = await api.get('/videos/');
      setVideos(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await api.delete(`/videos/${id}/`);
        setVideos(prev => prev.filter(v => v.id !== id));
        if (selectedVideo && selectedVideo.id === id) {
          setSelectedVideo(null);
        }
      } catch (err) {
        alert('Failed to delete video');
      }
    }
  };

  return (
    <div className="pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            {user?.role === 'admin' ? 'Admin Dashboard' : 'My Library'}
          </h1>
          <p className="text-gray-400 mt-1 text-sm">Manage and watch your uploaded content</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          {/* Search */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-500 group-focus-within:text-red-500 transition-colors" />
            </div>
            <input 
              type="text" 
              placeholder="Search videos..." 
              className="w-full sm:w-64 pl-9 pr-4 py-2.5 bg-neutral-900/50 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filter */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-gray-500 group-focus-within:text-red-500 transition-colors" />
            </div>
            <select 
              className="w-full sm:w-48 pl-9 pr-8 py-2.5 bg-neutral-900/50 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all appearance-none cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all" className="bg-neutral-900">All Status</option>
              <option value="safe" className="bg-neutral-900">Safe</option>
              <option value="flagged" className="bg-neutral-900">Flagged</option>
              <option value="processing" className="bg-neutral-900">Processing</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      {filteredVideos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <div 
              key={video.id} 
              className="group glass-card overflow-hidden hover:border-red-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-red-900/10 hover:-translate-y-1"
            >
              {/* Thumbnail / Status */}
              <div 
                className="aspect-video bg-neutral-900 relative flex items-center justify-center cursor-pointer group-hover:bg-neutral-800 transition-colors"
                onClick={() => setSelectedVideo(video)}
              >
                {video.status === 'processing' ? (
                   <div className="flex flex-col items-center gap-2">
                     <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
                     <span className="text-xs font-medium text-yellow-500 uppercase tracking-wider">Processing</span>
                   </div>
                ) : video.status === 'flagged' ? (
                   <div className="flex flex-col items-center gap-2">
                     <AlertOctagon className="w-10 h-10 text-red-500/80" />
                     <span className="text-xs font-medium text-red-500 uppercase tracking-wider">Flagged Content</span>
                   </div>
                ) : (
                   <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm group-hover:bg-red-600 group-hover:scale-110 transition-all duration-300">
                     <Play className="w-5 h-5 text-white ml-1" />
                   </div>
                )}
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent opacity-60"></div>
              </div>

              {/* Content */}
              <div className="p-5 relative">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-semibold text-lg text-white mb-1 line-clamp-1 group-hover:text-red-400 transition-colors">{video.title}</h3>
                    <p className="text-xs text-gray-500">by {video.uploaded_by}</p>
                  </div>
                  
                  {/* Status Badge */}
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                    video.status === 'safe' 
                      ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                      : video.status === 'flagged' 
                      ? 'bg-red-500/10 text-red-500 border-red-500/20' 
                      : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                  }`}>
                    {video.status}
                  </span>
                </div>

                {/* Delete Button */}
                {(user?.role === 'admin' || user?.role === 'editor') && (
                  <button 
                    onClick={(e) => handleDelete(e, video.id)}
                    className="absolute bottom-4 right-4 text-gray-500 hover:text-red-500 transition-colors p-2 hover:bg-white/5 rounded-full opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="Delete Video"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-neutral-900/20 rounded-2xl border border-dashed border-white/5">
          <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <VideoPlayer className="w-8 h-8 text-gray-600" videoId="dummy" /> 
            {/* Note: Using play icon from lucide actually, but keeping VideoPlayer import for real player usage */}
            <Play className="w-8 h-8 text-gray-600" />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">No videos found</h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            {search || statusFilter !== 'all' ? "Try adjusting your filters" : "Upload your first video to get started"}
          </p>
        </div>
      )}

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-neutral-950/90 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl relative">
            <button 
              onClick={() => setSelectedVideo(null)} 
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-red-600 text-white rounded-full backdrop-blur-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="p-1">
              {selectedVideo.status === 'safe' ? (
                <VideoPlayer videoId={selectedVideo.id} />
              ) : (
                <div className="aspect-video bg-neutral-950 flex flex-col items-center justify-center text-center p-8">
                  {selectedVideo.status === 'processing' ? (
                     <>
                        <Loader2 className="w-12 h-12 text-yellow-500 animate-spin mb-4" />
                        <h3 className="text-xl font-bold text-white">Analysis in Progress</h3>
                        <p className="text-gray-400 mt-2">This video is currently being analyzed for content safety.</p>
                     </>
                  ) : (
                     <>
                        <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
                        <h3 className="text-xl font-bold text-white">Content Blocked</h3>
                        <p className="text-gray-400 mt-2 max-w-md">This video has been flagged as unsafe and cannot be played.</p>
                     </>
                  )}
                </div>
              )}
            </div>
            
            <div className="p-6 bg-neutral-900">
              <h2 className="text-2xl font-bold text-white mb-2">{selectedVideo.title}</h2>
               <p className="text-gray-400 text-sm leading-relaxed">{selectedVideo.description || "No description provided."}</p>
               <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-500 font-mono">
                 <span>ID: {selectedVideo.id}</span>
                 <span className="uppercase">{selectedVideo.status}</span>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
