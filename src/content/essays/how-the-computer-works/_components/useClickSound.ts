import { useCallback, useEffect, useRef } from "react";

export default function useClickSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(
    () => () => {
      audioRef.current?.pause();
      audioRef.current = null;
    },
    [],
  );

  return useCallback(() => {
    // Load only after interaction. Audio failures must not break the demo.
    const audio = (audioRef.current ??= new Audio("/mouse-click.mp3"));
    audio.volume = 0.25;
    audio.currentTime = 0;
    void audio.play().catch(() => {});
  }, []);
}
