"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";
import { Textarea } from "@/shared/ui/textarea";
import { Send, Loader2, Bot, User, Sparkles } from "lucide-react";
import { sendChatMessage } from "@/features/chat/server-functions/chat";
import {
  getChatMessages,
  saveChatMessage,
  updateChatSessionTitle,
} from "@/features/chat/server-functions/sessions";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  sessionId: string | null;
  onFirstMessage?: () => void;
  onMessagesChange?: (hasMessages: boolean) => void;
}

const SUGGESTED_QUESTIONS = [
  "내 총 자산이 얼마야?",
  "자산 비중 분석해줘",
  "내 포트폴리오 구성 알려줘",
  "연봉이 얼마나 올랐어?",
];

export function ChatInterface({
  sessionId,
  onFirstMessage,
  onMessagesChange,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    onMessagesChange?.(messages.length > 0);
  }, [messages.length, onMessagesChange]);

  useEffect(() => {
    if (sessionId) {
      loadMessages(sessionId);
    } else {
      setMessages([]);
    }
  }, [sessionId]);

  const loadMessages = async (sid: string) => {
    setIsLoadingHistory(true);
    try {
      const data = await getChatMessages(sid);
      setMessages(
        data.map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
        })),
      );
    } catch {
      setMessages([]);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading || !sessionId) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmedInput,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      await saveChatMessage(sessionId, "user", trimmedInput);

      if (messages.length === 0) {
        const title =
          trimmedInput.slice(0, 30) + (trimmedInput.length > 30 ? "..." : "");
        await updateChatSessionTitle(sessionId, title);
        onFirstMessage?.();
      }

      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await sendChatMessage(trimmedInput, history);

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      await saveChatMessage(sessionId, "assistant", response);
    } catch {
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "죄송합니다. 오류가 발생했습니다. 다시 시도해주세요.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!sessionId) {
    return (
      <Card className="flex flex-col h-full items-center justify-center">
        <div className="text-center px-4">
          <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mb-4 md:mb-6 shadow-lg mx-auto">
            <Sparkles className="h-7 w-7 md:h-10 md:w-10 text-emerald-600" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-2 md:mb-3">
            AI 자산 어시스턴트
          </h2>
          <p className="text-sm md:text-base text-slate-500 mb-4">
            새 대화를 시작하거나 기존 대화를 선택하세요
          </p>
        </div>
      </Card>
    );
  }

  if (isLoadingHistory) {
    return (
      <Card className="flex flex-col h-full overflow-hidden">
        <div className="flex-1 p-4 md:p-6 space-y-4 md:space-y-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`flex gap-2 md:gap-4 ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
            >
              {i % 2 === 0 && (
                <Skeleton className="w-8 h-8 md:w-10 md:h-10 rounded-full shrink-0" />
              )}
              <Skeleton
                className={`h-16 rounded-2xl ${i % 2 === 0 ? "w-3/4 rounded-bl-md" : "w-2/3 rounded-br-md"}`}
              />
              {i % 2 === 1 && (
                <Skeleton className="w-8 h-8 md:w-10 md:h-10 rounded-full shrink-0" />
              )}
            </div>
          ))}
        </div>
        <div className="border-t bg-slate-50 p-3 md:p-4">
          <div className="flex gap-2 md:gap-3">
            <Skeleton className="flex-1 h-12 rounded-xl" />
            <Skeleton className="h-12 w-12 rounded-xl" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-full overflow-hidden py-0 pt-6">
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-2">
            <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mb-4 md:mb-6 shadow-lg">
              <Sparkles className="h-7 w-7 md:h-10 md:w-10 text-emerald-600" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-2 md:mb-3">
              무엇이든 물어보세요
            </h2>
            <p className="text-sm md:text-base text-slate-500 mb-6 md:mb-8 max-w-md leading-relaxed">
              자산, 포트폴리오, 연봉 데이터를 기반으로 답변해드립니다
            </p>
            <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap md:gap-3 md:justify-center max-w-xl w-full">
              {SUGGESTED_QUESTIONS.map((question) => (
                <button
                  key={question}
                  onClick={() => handleSuggestedQuestion(question)}
                  className="px-3 py-2 md:px-4 md:py-2.5 text-xs md:text-sm bg-slate-100 hover:bg-emerald-100 hover:text-emerald-700 rounded-full text-slate-600 transition-all duration-200 border border-transparent hover:border-emerald-200"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 md:gap-4 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center shrink-0 shadow-sm">
                    <Bot className="h-4 w-4 md:h-5 md:w-5 text-emerald-600" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] md:max-w-[75%] p-3 md:p-4 rounded-2xl ${
                    message.role === "user"
                      ? "bg-emerald-600 text-white rounded-br-md"
                      : "bg-slate-100 text-slate-800 rounded-bl-md"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <div className="text-sm leading-relaxed prose prose-sm prose-slate max-w-none prose-headings:text-slate-800 prose-headings:font-semibold prose-headings:mt-3 prose-headings:mb-2 prose-p:my-1.5 prose-ul:my-1.5 prose-ol:my-1.5 prose-li:my-0.5 prose-strong:text-slate-800">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </p>
                  )}
                </div>
                {message.role === "user" && (
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 shadow-sm">
                    <User className="h-4 w-4 md:h-5 md:w-5 text-emerald-600" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2 md:gap-4 justify-start">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center shrink-0 shadow-sm">
                  <Bot className="h-4 w-4 md:h-5 md:w-5 text-emerald-600" />
                </div>
                <div className="p-3 md:p-4 rounded-2xl rounded-bl-md bg-slate-100">
                  <div className="flex items-center gap-2 md:gap-3 text-slate-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">생각하는 중...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="border-t bg-slate-50 p-3 md:p-4">
        <form
          onSubmit={handleSubmit}
          className="flex gap-2 items-center md:gap-3"
        >
          <Textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="메시지를 입력하세요..."
            className="flex-1 min-h-0 resize-none rounded-xl"
            rows={1}
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-4 md:px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </form>
        <p className="text-xs text-slate-400 mt-2 md:mt-3 text-center hidden md:block">
          Enter로 전송, Shift+Enter로 줄바꿈
        </p>
      </div>
    </Card>
  );
}
