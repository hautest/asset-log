"use server";

import { db } from "@/shared/db/db";
import { chatSession, chatMessage } from "@/shared/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { getSession } from "@/shared/auth/getSession";

export interface ChatSessionSummary {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function getChatSessions(): Promise<ChatSessionSummary[]> {
  const session = await getSession();
  if (!session) {
    return [];
  }

  const sessions = await db
    .select({
      id: chatSession.id,
      title: chatSession.title,
      createdAt: chatSession.createdAt,
      updatedAt: chatSession.updatedAt,
    })
    .from(chatSession)
    .where(eq(chatSession.userId, session.user.id))
    .orderBy(desc(chatSession.updatedAt));

  return sessions;
}

export async function createChatSession(
  title: string
): Promise<{ id: string } | null> {
  const session = await getSession();
  if (!session) {
    return null;
  }

  const result = await db
    .insert(chatSession)
    .values({
      userId: session.user.id,
      title,
    })
    .returning({ id: chatSession.id });

  
  return result[0] || null;
}

export async function updateChatSessionTitle(
  sessionId: string,
  title: string
): Promise<boolean> {
  const session = await getSession();
  if (!session) {
    return false;
  }

  await db
    .update(chatSession)
    .set({ title })
    .where(
      and(
        eq(chatSession.id, sessionId),
        eq(chatSession.userId, session.user.id)
      )
    );

  
  return true;
}

export async function deleteChatSession(sessionId: string): Promise<boolean> {
  const session = await getSession();
  if (!session) {
    return false;
  }

  await db
    .delete(chatSession)
    .where(
      and(
        eq(chatSession.id, sessionId),
        eq(chatSession.userId, session.user.id)
      )
    );

  
  return true;
}

export interface ChatMessageData {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

export async function getChatMessages(
  sessionId: string
): Promise<ChatMessageData[]> {
  const session = await getSession();
  if (!session) {
    return [];
  }

  const sessionData = await db
    .select({ userId: chatSession.userId })
    .from(chatSession)
    .where(eq(chatSession.id, sessionId))
    .limit(1);

  if (!sessionData[0] || sessionData[0].userId !== session.user.id) {
    return [];
  }

  const messages = await db
    .select({
      id: chatMessage.id,
      role: chatMessage.role,
      content: chatMessage.content,
      createdAt: chatMessage.createdAt,
    })
    .from(chatMessage)
    .where(eq(chatMessage.sessionId, sessionId))
    .orderBy(chatMessage.createdAt);

  return messages;
}

export async function saveChatMessage(
  sessionId: string,
  role: "user" | "assistant",
  content: string
): Promise<{ id: string } | null> {
  const session = await getSession();
  if (!session) {
    return null;
  }

  const sessionData = await db
    .select({ userId: chatSession.userId })
    .from(chatSession)
    .where(eq(chatSession.id, sessionId))
    .limit(1);

  if (!sessionData[0] || sessionData[0].userId !== session.user.id) {
    return null;
  }

  const result = await db
    .insert(chatMessage)
    .values({
      sessionId,
      role,
      content,
    })
    .returning({ id: chatMessage.id });

  await db
    .update(chatSession)
    .set({ updatedAt: new Date() })
    .where(eq(chatSession.id, sessionId));

  return result[0] || null;
}
