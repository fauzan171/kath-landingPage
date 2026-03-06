import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

const BackgroundMusic = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Create audio element with autoplay attributes
    const audio = document.createElement('audio');
    audio.setAttribute('autoplay', 'true');
    audio.setAttribute('loop', 'true');
    audio.setAttribute('preload', 'auto');
    audio.volume = 0.4;
    audio.muted = false;

    // Classical piano music
    audio.src = 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=classical-piano-101-bpm-121529.mp3';

    document.body.appendChild(audio);
    audioRef.current = audio;

    const startPlayback = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }
          })
          .catch((err) => {
            console.log('Autoplay blocked:', err);
          });
      }
    };

    // Try to play immediately
    if (document.readyState === 'complete') {
      startPlayback();
    } else {
      window.addEventListener('load', startPlayback);
    }

    // Keep trying every 2 seconds
    intervalRef.current = setInterval(startPlayback, 2000);

    // Also try on first click anywhere
    const handleFirstClick = () => {
      startPlayback();
    };

    document.addEventListener('click', handleFirstClick, { once: true });
    document.addEventListener('touchstart', handleFirstClick, { once: true });

    // Monitor audio state
    const handlePlaying = () => setIsPlaying(true);
    const handlePause = () => {
      if (audioRef.current && !audioRef.current.ended) {
        setIsPlaying(false);
        // Try to resume if paused unexpectedly
        setTimeout(startPlayback, 1000);
      }
    };

    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('canplay', startPlayback);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      window.removeEventListener('load', startPlayback);
      document.removeEventListener('click', handleFirstClick);
      document.removeEventListener('touchstart', handleFirstClick);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('canplay', startPlayback);
      audio.pause();
      audio.remove();
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
          .catch(() => {});
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
      {/* Track Info */}
      <div className={`
        hidden sm:flex items-center gap-3 px-4 py-2 rounded-full
        bg-kath-dark-gray/80 backdrop-blur-md border border-kath-charcoal/50
        transition-all duration-300 overflow-hidden
        ${isPlaying ? 'opacity-100 max-w-[200px]' : 'opacity-0 max-w-0'}
      `}>
        <div className="w-1.5 h-1.5 rounded-full bg-kath-gold animate-pulse" />
        <span className="font-body text-xs text-kath-off-white/80 truncate">
          Classical Piano
        </span>
      </div>

      {/* Control Button */}
      <button
        onClick={togglePlay}
        className={`
          relative w-12 h-12 rounded-full flex items-center justify-center
          transition-all duration-300 touch-feedback
          ${isPlaying
            ? 'bg-kath-gold text-kath-black shadow-gold'
            : 'bg-kath-dark-gray/80 backdrop-blur-md border border-kath-charcoal/50 text-kath-white hover:border-kath-gold/50'
          }
        `}
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
      >
        {isPlaying ? (
          <div className="flex items-end gap-0.5 h-4">
            <span className="w-0.5 bg-current animate-[bounce_1s_infinite]" style={{ height: '60%' }} />
            <span className="w-0.5 bg-current animate-[bounce_1.2s_infinite]" style={{ height: '100%' }} />
            <span className="w-0.5 bg-current animate-[bounce_0.8s_infinite]" style={{ height: '40%' }} />
          </div>
        ) : (
          <Music className="w-5 h-5" />
        )}
      </button>

      {/* Mute Button */}
      <button
        onClick={toggleMute}
        className="w-10 h-10 rounded-full bg-kath-dark-gray/80 backdrop-blur-md border border-kath-charcoal/50 text-kath-white hover:border-kath-gold/50 transition-all duration-300 flex items-center justify-center touch-feedback"
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>
    </div>
  );
};

export default BackgroundMusic;
