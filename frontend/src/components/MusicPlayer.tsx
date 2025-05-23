import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { tracks } from '../data/tracks';

const MusicPlayer: React.FC = () => {
  const { state, togglePlay, setTrack, setVolume } = useAppContext();
  const { isPlaying, currentTrack, volume, isAdmin } = state;
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const intervalRef = useRef<number>();
  
  // Format time in MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Handle track change
  const handleNextTrack = () => {
    if (!currentTrack) return;
    const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    setTrack(tracks[nextIndex]);
  };
  
  const handlePrevTrack = () => {
    if (!currentTrack) return;
    const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    setTrack(tracks[prevIndex]);
  };
  
  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };
  
  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume / 100;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };
  
  // Update progress
  const startProgressTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      if (audioRef.current && !audioRef.current.paused) {
        const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
        setProgress(currentProgress);
        
        if (audioRef.current.ended) {
          handleNextTrack();
        }
      }
    }, 1000);
  };
  
  // Handle seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTo = Number(e.target.value);
    setProgress(seekTo);
    if (audioRef.current) {
      audioRef.current.currentTime = (seekTo / 100) * audioRef.current.duration;
    }
  };
  
  useEffect(() => {
    if (!currentTrack) return;
    
    setShowPlayer(true);
    
    if (isPlaying) {
      audioRef.current?.play().catch(error => {
        console.error("Audio playback error:", error);
      });
      startProgressTimer();
    } else {
      audioRef.current?.pause();
      clearInterval(intervalRef.current);
    }
    
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentTrack]);
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);
  
  // Only admins can control the music
  const isControlEnabled = isAdmin;
  
  if (!showPlayer || !currentTrack) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-90 backdrop-blur-sm border-t border-gray-800 z-50 transform transition-transform duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center py-3">
          {/* Track Info */}
          <div className="flex items-center flex-1 min-w-0">
            <div className="h-12 w-12 mr-3 overflow-hidden rounded">
              <img 
                src={currentTrack.coverArt} 
                alt={currentTrack.title} 
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 truncate">
              <p className="text-white font-medium truncate">{currentTrack.title}</p>
              <p className="text-gray-400 text-sm">{currentTrack.artist}</p>
            </div>
          </div>
          
          {/* Playback Controls */}
          <div className="flex items-center justify-center space-x-4 flex-1">
            <button 
              className={`text-gray-400 hover:text-white transition-colors ${!isControlEnabled && 'opacity-50 cursor-not-allowed'}`}
              onClick={isControlEnabled ? handlePrevTrack : undefined}
              disabled={!isControlEnabled}
            >
              <SkipBack size={20} />
            </button>
            
            <button 
              className={`bg-purple-600 hover:bg-purple-700 rounded-full p-2 text-white transition-all transform hover:scale-105 ${!isControlEnabled && 'opacity-50 cursor-not-allowed'}`}
              onClick={isControlEnabled ? togglePlay : undefined}
              disabled={!isControlEnabled}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
            </button>
            
            <button 
              className={`text-gray-400 hover:text-white transition-colors ${!isControlEnabled && 'opacity-50 cursor-not-allowed'}`}
              onClick={isControlEnabled ? handleNextTrack : undefined}
              disabled={!isControlEnabled}
            >
              <SkipForward size={20} />
            </button>
          </div>
          
          {/* Volume & Progress */}
          <div className="flex-1 flex items-center justify-end">
            <div className="hidden md:flex items-center space-x-2 mr-4">
              <button 
                className={`text-gray-400 hover:text-white transition-colors ${!isControlEnabled && 'opacity-50 cursor-not-allowed'}`}
                onClick={isControlEnabled ? toggleMute : undefined}
                disabled={!isControlEnabled}
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                disabled={!isControlEnabled}
                className={`w-20 accent-purple-600 ${!isControlEnabled && 'opacity-50 cursor-not-allowed'}`}
              />
            </div>
            
            <div className="hidden md:flex items-center space-x-2 w-48">
              <span className="text-xs text-gray-400">
                {audioRef.current ? formatTime(audioRef.current.currentTime) : '0:00'}
              </span>
              
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleSeek}
                className="flex-1 accent-purple-600 cursor-pointer"
              />
              
              <span className="text-xs text-gray-400">
                {formatTime(currentTrack.duration)}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={currentTrack.audioUrl}
        onEnded={handleNextTrack}
        onTimeUpdate={() => {
          if (audioRef.current) {
            const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
            setProgress(currentProgress);
          }
        }}
      />
    </div>
  );
};

export default MusicPlayer;