import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { CloudUpload, FileVideo, X, Check, TriangleAlert } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function UploadVideo() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  if (user && user.role === 'viewer') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
          <TriangleAlert className="w-12 h-12 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Access Restricted</h2>
        <p className="text-gray-400 max-w-md">
          Your account role (<span className="uppercase text-red-400 font-mono text-sm border border-red-500/30 px-1 rounded bg-red-500/10">{user.role}</span>) does not have permission to upload videos.
        </p>
      </div>
    );
  }

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title) return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('file', file);

    setUploading(true);
    try {
      await api.post('/videos/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        },
      });
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Upload Video</h1>
        <p className="text-gray-400 mt-1 text-sm">Share your content with the platform</p>
      </div>

      <div className="glass-card p-8">
        <form onSubmit={handleUpload} className="space-y-8">
          
          {/* File Drop Zone */}
          <div 
            className={`relative border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-all cursor-pointer group
              ${dragActive ? 'border-red-500 bg-red-500/5' : 'border-white/10 hover:border-red-500/50 hover:bg-neutral-800/50'}
              ${file ? 'border-emerald-500/50 bg-emerald-500/5' : ''}
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload').click()}
          >
            <input
              id="file-upload"
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleFileChange}
            />
            
            {file ? (
              <>
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
                  <FileVideo className="w-8 h-8 text-emerald-500" />
                </div>
                <p className="text-emerald-400 font-medium text-lg text-center mb-1 truncate max-w-full px-4">{file.name}</p>
                <p className="text-gray-500 text-sm">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                <button 
                  type="button"
                  onClick={(e) => {e.stopPropagation(); setFile(null);}} 
                  className="mt-4 text-xs bg-neutral-800 hover:bg-red-900/30 text-gray-400 hover:text-red-400 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
                >
                  <X className="w-3 h-3" /> Remove File
                </button>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <CloudUpload className="w-8 h-8 text-gray-400 group-hover:text-red-500 transition-colors" />
                </div>
                <h3 className="text-lg font-medium text-white mb-1">Drag video here</h3>
                <p className="text-gray-500 text-sm mb-4">or click to browse from computer</p>
                <span className="bg-neutral-800 text-gray-300 text-xs px-3 py-1 rounded-full border border-white/5">MP4, MOV, AVI</span>
              </>
            )}
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 ml-1">Title</label>
              <input
                type="text"
                required
                className="block w-full px-4 py-3 bg-neutral-950/50 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all sm:text-sm"
                placeholder="Give your video a catchy title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 ml-1">Description</label>
              <textarea
                rows={4}
                className="block w-full px-4 py-3 bg-neutral-950/50 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all sm:text-sm resize-none"
                placeholder="What is this video about?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          {progress > 0 && (
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-red-600 bg-red-200">
                    {progress === 100 ? 'Completed' : 'Uploading'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-red-600">
                    {progress}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-neutral-800">
                <div 
                  style={{ width: `${progress}%` }} 
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-600 transition-all duration-300 ease-out"
                ></div>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={uploading || !file || !title}
              className="flex items-center gap-2 bg-red-600 text-white px-8 py-3 rounded-lg font-semibold transition-all hover:bg-red-700 hover:shadow-lg hover:shadow-red-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                 <>Uploading...</> 
              ) : (
                 <>
                   Upload Video <Check className="w-4 h-4" />
                 </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
