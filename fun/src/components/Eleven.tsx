import { useState } from "react";

export default function Eleven() {
  const [text, setText] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  const handleAudio = async () => {
    if (!text.trim()) return;

    setIsPlaying(true);
    try {
      const response = await fetch("/api/speak", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate audio");
      }

      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);

      const audioElement = new Audio(url);
      audioElement.play();

      audioElement.onended = () => {
        URL.revokeObjectURL(url);
        setIsPlaying(false);
      };
    } catch (error) {
      console.error("Error playing audio:", error);
      setIsPlaying(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <textarea
        className="border border-neutral-200 rounded p-2"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to speak..."
      />
      <button
        className="bg-neutral-100 rounded px-4 py-2 disabled:opacity-50"
        onClick={handleAudio}
        disabled={isPlaying || !text.trim()}
      >
        {isPlaying ? "Playing..." : "Play"}
      </button>
    </div>
  );
}
