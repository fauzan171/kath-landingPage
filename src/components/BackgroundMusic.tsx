import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

const BackgroundMusic = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Create audio element
    const audio = new Audio();
    audio.loop = true;
    audio.volume = 0.25; // Low volume for subtle background
    audio.preload = 'auto';

    // Classical piano music - royalty free
    audio.src = 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=classical-piano-101-bpm-121529.mp3';

    audioRef.current = audio;

    audio.addEventListener('canplaythrough', () => {
      // Auto play when loaded
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.log('Autoplay prevented:', error);
            // Try again on any user interaction
            const handleFirstInteraction = () => {
              audio.play().then(() => {
                setIsPlaying(true);
              }).catch(() => {});
              document.removeEventListener('click', handleFirstInteraction);
              document.removeEventListener('touchstart', handleFirstInteraction);
              document.removeEventListener('scroll', handleFirstInteraction);
            };
            document.addEventListener('click', handleFirstInteraction, { once: true });
            document.addEventListener('touchstart', handleFirstInteraction, { once: true });
            document.addEventListener('scroll', handleFirstInteraction, { once: true });
          });
      }
    });

    audio.addEventListener('error', (e) => {
      console.log('Audio loading error:', e);
    });

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
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch((error) => {
              console.log('Play failed:', error);
            });
        }
      }
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
      {/* Track Info - Shows on hover */}
      <div className={`
        hidden sm:flex items-center gap-3 px-4 py-2 rounded-full
        bg-kath-dark-gray/80 backdrop-blur-md border border-kath-charcoal/50
        transition-all duration-300 overflow-hidden
        ${isPlaying ? 'opacity-100 max-w-[200px]' : 'opacity-0 max-w-0'}
      `}>
        <div className="w-1.5 h-1.5 rounded-full bg-kath-gold animate-pulse" />
        <span className="font-body text-xs text-kath-off-white/80 truncate">
          Classical Ambiance
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
