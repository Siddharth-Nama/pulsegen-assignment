import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import VideoPlayer from '../components/VideoPlayer';
import { io } from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';

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
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary-900">
          {user?.role === 'admin' ? 'Admin Dashboard' : 'My Videos'}
        </h1>
        <div className="flex space-x-4 mt-4 md:mt-0">
           <input 
             type="text" 
             placeholder="Search videos..." 
             className="border border-gray-300 rounded-md px-4 py-2"
             value={search}
             onChange={(e) => setSearch(e.target.value)}
           />
           <select 
             className="border border-gray-300 rounded-md px-4 py-2"
             value={statusFilter}
             onChange={(e) => setStatusFilter(e.target.value)}
           >
             <option value="all">All Status</option>
             <option value="safe">Safe</option>
             <option value="flagged">Flagged</option>
             <option value="processing">Processing</option>
           </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredVideos.map((video) => (
          <div key={video.id} className="bg-white rounded-lg shadow overflow-hidden group hover:shadow-xl transition-all duration-300 relative">
            <div className="aspect-w-16 aspect-h-9 bg-gray-200 flex items-center justify-center cursor-pointer" onClick={() => setSelectedVideo(video)}>
              {video.status === 'processing' ? (
                 <span className="text-yellow-600 font-semibold animate-pulse">Processing...</span>
              ) : video.status === 'flagged' ? (
                 <span className="text-red-600 font-bold">Flagged Content</span>
              ) : (
                 <span className="text-green-600 font-semibold">Play Video</span>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg truncate">{video.title}</h3>
              <p className="text-sm text-gray-500 mt-1">Status: <span className={`uppercase font-bold ${video.status === 'safe' ? 'text-green-600' : video.status === 'flagged' ? 'text-red-600' : 'text-yellow-500'}`}>{video.status}</span></p>
              <p className="text-xs text-gray-400 mt-1">Uploaded by: {video.uploaded_by}</p>
            </div>
            {(user?.role === 'admin' || user?.role === 'editor') && (
              <button 
                onClick={(e) => handleDelete(e, video.id)}
                className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>

      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl p-4 relative">
            <button onClick={() => setSelectedVideo(null)} className="absolute top-2 right-2 text-gray-500 hover:text-black">
              Close
            </button>
            <h2 className="text-xl font-bold mb-4">{selectedVideo.title}</h2>
            {selectedVideo.status === 'safe' ? (
              <VideoPlayer videoId={selectedVideo.id} />
            ) : (
              <div className="h-64 flex items-center justify-center bg-gray-100 rounded text-gray-500">
                {selectedVideo.status === 'processing' ? 'Processing...' : 'Content Flagged as Unsafe'}
              </div>
            )}
            <div className="mt-4 text-sm text-gray-600">
               <p>{selectedVideo.description}</p>
               <p className="mt-2 text-xs text-gray-400">ID: {selectedVideo.id}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
