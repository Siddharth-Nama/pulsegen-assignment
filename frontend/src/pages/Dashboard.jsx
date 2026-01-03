import { useState, useEffect } from 'react';
import api from '../services/api';
import VideoPlayer from '../components/VideoPlayer';
import { io } from 'socket.io-client';

export default function Dashboard() {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    fetchVideos();
    const socket = io('http://127.0.0.1:8000');

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

  const fetchVideos = async () => {
    try {
      const response = await api.get('/videos/');
      setVideos(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-primary-900 mb-8">My Videos</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div key={video.id} className="bg-white rounded-lg shadow overflow-hidden group hover:shadow-xl transition-all duration-300">
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
            </div>
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
          </div>
        </div>
      )}
    </div>
  );
}
