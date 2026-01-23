"use client";

import { useState } from "react";
import { AuthButton } from "@/shared/auth/AuthButton";
import { Plus, MessageSquare, Trash2, Loader2 } from "lucide-react";
import {
  createChatSession,
  deleteChatSession,
  type ChatSessionSummary,
} from "@/features/chat/server-functions/sessions";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

interface ChatSidebarProps {
  sessions: ChatSessionSummary[];
  currentSessionId: string | null;
  canCreateNew: boolean;
  onSelectSession: (sessionId: string) => void;
  onNewSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
}

export function ChatSidebar({
  sessions,
  currentSessionId,
  canCreateNew,
  onSelectSession,
  onNewSession,
  onDeleteSession,
}: ChatSidebarProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleNewChat = async () => {
    if (!canCreateNew) {
      toast.info("현재 대화에 메시지를 입력해주세요");
      return;
    }

    setIsCreating(true);
    try {
      const result = await createChatSession("새 대화");
      if (result) {
        onNewSession(result.id);
        toast.success("새 대화가 시작되었습니다");
      }
    } catch {
      toast.error("대화 생성에 실패했습니다");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    setDeletingId(sessionId);
    try {
      await deleteChatSession(sessionId);
      onDeleteSession(sessionId);
      toast.success("대화가 삭제되었습니다");
    } catch {
      toast.error("삭제에 실패했습니다");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b">
        <AuthButton
          onClick={handleNewChat}
          disabled={isCreating}
          className="w-full bg-emerald-600 hover:bg-emerald-700"
        >
          {isCreating ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Plus className="h-4 w-4 mr-2" />
          )}
          새 대화
        </AuthButton>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {sessions.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-4">
            대화 내역이 없습니다
          </p>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              className={`group flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors ${
                currentSessionId === session.id
                  ? "bg-emerald-100 text-emerald-700"
                  : "hover:bg-slate-100 text-slate-700"
              }`}
            >
              <MessageSquare className="h-4 w-4 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{session.title}</p>
                <p className="text-xs text-slate-400">
                  {formatDistanceToNow(new Date(session.updatedAt), {
                    addSuffix: true,
                    locale: ko,
                  })}
                </p>
              </div>
              <button
                onClick={(e) => handleDelete(e, session.id)}
                disabled={deletingId === session.id}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-all"
              >
                {deletingId === session.id ? (
                  <Loader2 className="h-4 w-4 animate-spin text-red-500" />
                ) : (
                  <Trash2 className="h-4 w-4 text-red-500" />
                )}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
