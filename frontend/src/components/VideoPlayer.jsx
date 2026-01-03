import { useRef, useEffect } from 'react';

export default function VideoPlayer({ videoId }) {
  const videoRef = useRef(null);
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [videoId]);

  return (
    <video
      ref={videoRef}
      controls
      className="w-full rounded-lg shadow-lg"
      poster="/placeholder-video.png"
    >
      <source src={`http://127.0.0.1:8000/api/videos/${videoId}/stream/?token=${token}`} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}
