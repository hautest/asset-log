import { getChatSessions } from "@/features/chat/server-functions/sessions";
import { ChatContainer } from "./ChatContainer";

export async function ChatContainerWrapper() {
  const sessions = await getChatSessions();

  return <ChatContainer initialSessions={sessions} />;
}
