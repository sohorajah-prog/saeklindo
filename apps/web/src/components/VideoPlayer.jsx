
import React, { useRef, useEffect } from 'react';

const VideoPlayer = ({ videoUrl, fallbackImage }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    // Ensure video plays especially on mobile devices
    if (videoRef.current && videoUrl) {
      videoRef.current.play().catch(error => {
        console.warn("Autoplay was prevented:", error);
      });
    }
  }, [videoUrl]);

  return (
    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-background">
      {videoUrl ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={videoUrl} type="video/mp4" />
          <source src={videoUrl} type="video/webm" />
          <source src={videoUrl} type="video/quicktime" />
        </video>
      ) : (
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${fallbackImage})` }}
        />
      )}
      
      {/* Overlay to ensure text contrast matches Saeklindo's aesthetic */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-background/90 to-accent/90 mix-blend-multiply" />
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
};

export default VideoPlayer;
