import type { APIRoute } from "astro";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

export const POST: APIRoute = async ({ request }) => {
  const { text } = await request.json();

  if (!text || typeof text !== "string") {
    return new Response(JSON.stringify({ error: "Text is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const elevenlabs = new ElevenLabsClient({
      apiKey: import.meta.env.ELEVENLABS_API_KEY,
    });

    const audio = await elevenlabs.textToSpeech.convert(
      "JBFqnCBsd6RMkjVDRZzb",
      {
        text,
        modelId: "eleven_multilingual_v2",
        outputFormat: "mp3_44100_128",
      }
    );

    // Convert the stream to a buffer
    const reader = audio.getReader();
    const chunks: Uint8Array[] = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) chunks.push(value);
    }

    // Combine chunks into a single array
    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      result.set(chunk, offset);
      offset += chunk.length;
    }

    return new Response(result, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (error) {
    console.error("ElevenLabs error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate audio" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

