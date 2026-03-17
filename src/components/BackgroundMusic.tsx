import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Music } from '../icons';

const BackgroundMusic = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Create audio element tapi jangan autoplay
    const audio = new Audio();
    audio.loop = true;
    audio.volume = 0.4;
    audio.preload = 'auto';

    // Classical piano music
    audio.src = 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=classical-piano-101-bpm-121529.mp3';

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch((err) => console.log('Play failed:', err));
      }
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const newMuted = !isMuted;
      audioRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
      {/* Main Play/Music Button */}
      <button
        onClick={togglePlay}
        className={`
          relative w-14 h-14 rounded-full flex items-center justify-center
          transition-all duration-300 touch-feedback
          ${isPlaying
            ? 'bg-kath-gold text-kath-black shadow-gold scale-110'
            : 'bg-kath-dark-gray/90 backdrop-blur-md border-2 border-kath-gold/50 text-kath-gold hover:border-kath-gold hover:bg-kath-gold/10'
          }
        `}
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
      >
        {isPlaying ? (
          <div className="flex items-end gap-0.5 h-5">
            <span className="w-1 bg-current animate-[bounce_1s_infinite]" style={{ height: '60%' }} />
            <span className="w-1 bg-current animate-[bounce_1.2s_infinite]" style={{ height: '100%' }} />
            <span className="w-1 bg-current animate-[bounce_0.8s_infinite]" style={{ height: '40%' }} />
          </div>
        ) : (
          <Music className="w-6 h-6" />
        )}
      </button>

      {/* Mute Button - hanya muncul saat playing */}
      {isPlaying && (
        <button
          onClick={toggleMute}
          className="w-10 h-10 rounded-full bg-kath-dark-gray/80 backdrop-blur-md border border-kath-charcoal/50 text-kath-white hover:border-kath-gold/50 transition-all duration-300 flex items-center justify-center touch-feedback"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      )}
    </div>
  );
};

export default BackgroundMusic;
