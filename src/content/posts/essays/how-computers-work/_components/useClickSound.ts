import { useCallback, useEffect, useRef } from "react";

interface ClickSoundOptions {
  volume?: number;
}

export default function useClickSound(options: ClickSoundOptions = {}) {
  const audioPoolRef = useRef<HTMLAudioElement[]>([]);
  const audioIndexRef = useRef(0);
  const { volume = 0.6 } = options;

  useEffect(() => {
    if (audioPoolRef.current.length > 0) return;

    const poolSize = 4;
    const pool = Array.from({ length: poolSize }, () => {
      const audio = new Audio("/mouse-click.mp3");
      audio.preload = "auto";
      audio.load();
      return audio;
    });

    audioPoolRef.current = pool;
  }, []);

  return useCallback(() => {
    if (audioPoolRef.current.length === 0) return;

    const index = audioIndexRef.current % audioPoolRef.current.length;
    audioIndexRef.current = index + 1;
    const audio = audioPoolRef.current[index];
    audio.volume = volume;
    audio.currentTime = 0;
    void audio.play();
  }, [volume]);
}
