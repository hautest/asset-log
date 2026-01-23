"use client";

import { useState, useCallback } from "react";
import { ChatInterface } from "./ChatInterface";
import { ChatSidebar } from "./ChatSidebar";
import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { AuthButton } from "@/shared/auth/AuthButton";
import { Menu, X, Plus, Loader2 } from "lucide-react";
import {
  getChatSessions,
  createChatSession,
  type ChatSessionSummary,
} from "@/features/chat/server-functions/sessions";
import { toast } from "sonner";

interface ChatContainerProps {
  initialSessions: ChatSessionSummary[];
}

export function ChatContainer({ initialSessions }: ChatContainerProps) {
  const [sessions, setSessions] = useState<ChatSessionSummary[]>(initialSessions);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [currentSessionHasMessages, setCurrentSessionHasMessages] = useState(false);

  const loadSessions = useCallback(async () => {
    try {
      const data = await getChatSessions();
      setSessions(data);
    } catch {
      toast.error("대화 목록을 불러오는데 실패했습니다");
    }
  }, []);

  const handleSelectSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    setCurrentSessionHasMessages(false);
    setIsSidebarOpen(false);
  };

  const handleNewSession = async () => {
    if (currentSessionId && !currentSessionHasMessages) {
      toast.info("현재 대화에 메시지를 입력해주세요");
      setIsSidebarOpen(false);
      return;
    }

    setIsCreating(true);
    try {
      const result = await createChatSession("새 대화");
      if (result) {
        await loadSessions();
        setCurrentSessionId(result.id);
        setCurrentSessionHasMessages(false);
        setIsSidebarOpen(false);
        toast.success("새 대화가 시작되었습니다");
      }
    } catch {
      toast.error("대화 생성에 실패했습니다");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    if (currentSessionId === sessionId) {
      setCurrentSessionId(null);
      setCurrentSessionHasMessages(false);
    }
  };

  const handleFirstMessage = () => {
    loadSessions();
  };

  return (
    <div className="flex-1 min-h-0 flex gap-4">
      {/* Desktop Sidebar */}
      <Card className="hidden md:flex w-72 shrink-0 overflow-hidden">
        <ChatSidebar
          sessions={sessions}
          currentSessionId={currentSessionId}
          canCreateNew={!currentSessionId || currentSessionHasMessages}
          onSelectSession={handleSelectSession}
          onNewSession={(id) => {
            loadSessions();
            setCurrentSessionId(id);
            setCurrentSessionHasMessages(false);
          }}
          onDeleteSession={handleDeleteSession}
        />
      </Card>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`md:hidden fixed inset-y-0 left-0 w-72 bg-white z-50 transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <span className="font-semibold text-slate-800">대화 목록</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <ChatSidebar
          sessions={sessions}
          currentSessionId={currentSessionId}
          canCreateNew={!currentSessionId || currentSessionHasMessages}
          onSelectSession={handleSelectSession}
          onNewSession={(id) => {
            loadSessions();
            setCurrentSessionId(id);
            setCurrentSessionHasMessages(false);
          }}
          onDeleteSession={handleDeleteSession}
        />
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center gap-2 mb-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <AuthButton
            variant="outline"
            onClick={handleNewSession}
            disabled={isCreating}
            className="flex-1"
          >
            {isCreating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            새 대화
          </AuthButton>
        </div>

        <ChatInterface
          sessionId={currentSessionId}
          onFirstMessage={handleFirstMessage}
          onMessagesChange={setCurrentSessionHasMessages}
        />
      </div>
    </div>
  );
}
