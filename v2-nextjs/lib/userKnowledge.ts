export const USER_KNOWLEDGE_STORAGE_KEY = 'rorschach_user_knowledge_sources';

export type UserKnowledgeSource = {
  id: string;
  title: string;
  content: string;
};

export function loadUserKnowledgeSources(): UserKnowledgeSource[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(USER_KNOWLEDGE_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UserKnowledgeSource[]) : [];
  } catch {
    return [];
  }
}

export function saveUserKnowledgeSources(sources: UserKnowledgeSource[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_KNOWLEDGE_STORAGE_KEY, JSON.stringify(sources));
}

export function toChatKnowledgePayload(sources: UserKnowledgeSource[]): Array<{ title: string; content: string }> {
  return sources.map((s) => ({ title: s.title, content: s.content }));
}
