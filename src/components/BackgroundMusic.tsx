import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

// Note: For production, you should:
// 1. Host your own classical music files
// 2. Use royalty-free music from sources like:
//    - Musopen.org (public domain classical)
//    - Free Music Archive
//    - Incompetech.com (Kevin MacLeod)
//    - Or purchase premium royalty-free music

const BackgroundMusic = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [userInteracted, setUserInteracted] = useState(false);

  useEffect(() => {
    // Create audio element
    const audio = new Audio();
    audio.loop = true;
    audio.volume = 0.3; // Start with low volume for subtle background
    audio.preload = 'auto';

    // Use a royalty-free classical music URL
    // For demo, using a placeholder - replace with actual classical music URL
    audio.src = 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=classical-piano-101-bpm-121529.mp3';

    audioRef.current = audio;

    audio.addEventListener('canplaythrough', () => {
      setIsLoaded(true);
    });

    audio.addEventListener('error', (e) => {
      console.log('Audio loading error:', e);
    });

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Handle user interaction for autoplay
  useEffect(() => {
    const handleInteraction = () => {
      if (!userInteracted && audioRef.current && isLoaded) {
        setUserInteracted(true);
        setShowWelcome(false);

        // Try to play after user interaction
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch((error) => {
              console.log('Autoplay prevented:', error);
              setIsPlaying(false);
            });
        }
      }
    };

    // Listen for any user interaction
    document.addEventListener('click', handleInteraction, { once: true });
    document.addEventListener('touchstart', handleInteraction, { once: true });
    document.addEventListener('scroll', handleInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('scroll', handleInteraction);
    };
  }, [isLoaded, userInteracted]);

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

  const handleWelcomeClick = () => {
    setShowWelcome(false);
    setUserInteracted(true);
    if (audioRef.current && isLoaded) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(console.error);
    }
  };

  return (
    <>
      {/* Welcome Modal for Music */}
      {showWelcome && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-kath-black/90 backdrop-blur-xl transition-opacity duration-500">
          <div className="text-center px-6 max-w-md">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-kath-gold to-kath-gold-dark flex items-center justify-center animate-pulse-gold">
              <Music className="w-8 h-8 text-kath-black" />
            </div>
            <h2 className="font-display text-3xl sm:text-4xl text-kath-white mb-3">
              Enhance Your Experience
            </h2>
            <p className="font-body text-kath-off-white/70 text-sm mb-8 leading-relaxed">
              Immerse yourself in the KATH experience with our curated classical ambiance.
              Premium events deserve premium atmosphere.
            </p>
            <button
              onClick={handleWelcomeClick}
              className="w-full px-8 py-4 bg-gradient-to-r from-kath-gold to-kath-gold-dark text-kath-black font-body text-sm uppercase tracking-wider rounded-full transition-all duration-300 hover:shadow-gold hover:scale-105 touch-feedback"
            >
              Enter with Ambiance
            </button>
            <button
              onClick={() => {
                setShowWelcome(false);
                setUserInteracted(true);
              }}
              className="mt-4 font-body text-kath-off-white/50 text-sm hover:text-kath-gold transition-colors"
            >
              Continue Without Music
            </button>
          </div>
        </div>
      )}

      {/* Music Control Button */}
      {!showWelcome && (
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
      )}
    </>
  );
};

export default BackgroundMusic;
