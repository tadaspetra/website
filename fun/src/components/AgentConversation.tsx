import { useConversation } from "@elevenlabs/react";

export default function AgentConversation() {
  const conversation = useConversation({});
  return (
    <div className="flex flex-col gap-4 p-4">
      <button
        className="bg-neutral-100 rounded px-4 py-2 disabled:opacity-50"
        onClick={() =>
          conversation.startSession({
            agentId: "agent_7401k57tnneae4793c54qsf2v3fe",
            connectionType: "websocket",
          })
        }
      >
        Start Conversation
      </button>
      <button
        className="bg-neutral-100 rounded px-4 py-2 disabled:opacity-50"
        onClick={() => conversation.endSession()}
      >
        Stop Conversation
      </button>
      <button
        className="bg-neutral-100 rounded px-4 py-2 disabled:opacity-50"
        onClick={() =>
          conversation.sendUserMessage("Hello, how can you help me today?")
        }
      >
        How can you help me today?
      </button>
      <button
        className="bg-neutral-100 rounded px-4 py-2 disabled:opacity-50"
        onClick={() =>
          conversation.sendUserMessage("What is the weather in Tokyo?")
        }
      >
        Ask about the weather in Tokyo
      </button>
    </div>
  );
}
