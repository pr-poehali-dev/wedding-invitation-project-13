import { useState, useEffect, useCallback } from 'react';

export interface User {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatar: string;
  phone: string;
  online: boolean;
  lastSeen: string;
  createdAt: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  timestamp: string;
  read: boolean;
  edited?: boolean;
  replyTo?: string;
}

export interface Chat {
  id: string;
  type: 'private' | 'group' | 'channel';
  name: string;
  avatar: string;
  members: string[];
  admins: string[];
  owner: string;
  description: string;
  createdAt: string;
  pinned?: boolean;
  unreadCount?: number;
  noLeave?: boolean;
}

export interface FolozogerStore {
  currentUser: User | null;
  users: User[];
  chats: Chat[];
  messages: Record<string, Message[]>;
}

const ADMIN_USERNAME = 'CoNNectioN';
const SYSTEM_CHANNEL_ID = 'folozoger-news-channel';

const defaultStore = (): FolozogerStore => {
  const adminUser: User = {
    id: 'admin-connection',
    username: ADMIN_USERNAME,
    displayName: 'CoNNectioN',
    bio: 'Администратор Folozoger',
    avatar: '',
    phone: '+7 000 000-00-01',
    online: true,
    lastSeen: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  const newsChannel: Chat = {
    id: SYSTEM_CHANNEL_ID,
    type: 'channel',
    name: 'Новости Folozoger',
    avatar: '',
    members: ['admin-connection'],
    admins: ['admin-connection'],
    owner: 'admin-connection',
    description: 'Официальный канал новостей Folozoger',
    createdAt: new Date().toISOString(),
    pinned: true,
    noLeave: true,
  };

  const welcomeMessage: Message = {
    id: 'msg-welcome-1',
    chatId: SYSTEM_CHANNEL_ID,
    senderId: 'admin-connection',
    text: '👋 Добро пожаловать в Folozoger! Здесь публикуются все официальные новости и обновления платформы.',
    timestamp: new Date().toISOString(),
    read: false,
  };

  return {
    currentUser: null,
    users: [adminUser],
    chats: [newsChannel],
    messages: {
      [SYSTEM_CHANNEL_ID]: [welcomeMessage],
    },
  };
};

function loadStore(): FolozogerStore {
  try {
    const raw = localStorage.getItem('folozoger_store');
    if (raw) {
      const parsed = JSON.parse(raw);
      const def = defaultStore();
      const hasNewsChannel = parsed.chats?.some((c: Chat) => c.id === SYSTEM_CHANNEL_ID);
      if (!hasNewsChannel) {
        parsed.chats = [def.chats[0], ...(parsed.chats || [])];
        parsed.messages = { ...def.messages, ...(parsed.messages || {}) };
      }
      if (!parsed.users?.some((u: User) => u.username === ADMIN_USERNAME)) {
        parsed.users = [def.users[0], ...(parsed.users || [])];
      }
      return parsed;
    }
  } catch (e) {
    console.warn('Store load error', e);
  }
  return defaultStore();
}

function saveStore(store: FolozogerStore) {
  localStorage.setItem('folozoger_store', JSON.stringify(store));
}

let globalStore: FolozogerStore = loadStore();
const listeners: Set<() => void> = new Set();

function notifyListeners() {
  listeners.forEach(fn => fn());
}

export function getStore(): FolozogerStore {
  return globalStore;
}

export function useStore() {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const update = () => forceUpdate(n => n + 1);
    listeners.add(update);
    return () => { listeners.delete(update); };
  }, []);

  const dispatch = useCallback((updater: (store: FolozogerStore) => FolozogerStore) => {
    globalStore = updater(globalStore);
    saveStore(globalStore);
    notifyListeners();
  }, []);

  return { store: globalStore, dispatch };
}

export function registerUser(username: string, displayName: string, phone: string, password: string): { success: boolean; error?: string } {
  const store = getStore();
  if (store.users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
    return { success: false, error: 'Пользователь с таким ником уже существует' };
  }
  const newUser: User = {
    id: `user-${Date.now()}`,
    username,
    displayName,
    bio: '',
    avatar: '',
    phone,
    online: true,
    lastSeen: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem(`folozoger_pwd_${username.toLowerCase()}`, password);

  const updatedStore = {
    ...store,
    users: [...store.users, newUser],
    currentUser: newUser,
    chats: store.chats.map(c =>
      c.id === SYSTEM_CHANNEL_ID
        ? { ...c, members: [...c.members, newUser.id] }
        : c
    ),
  };
  globalStore = updatedStore;
  saveStore(globalStore);
  notifyListeners();
  return { success: true };
}

export function loginUser(username: string, password: string): { success: boolean; error?: string } {
  const store = getStore();
  const user = store.users.find(u => u.username.toLowerCase() === username.toLowerCase());
  if (!user) return { success: false, error: 'Пользователь не найден' };
  const storedPwd = localStorage.getItem(`folozoger_pwd_${username.toLowerCase()}`);
  if (storedPwd !== null && storedPwd !== password) {
    return { success: false, error: 'Неверный пароль' };
  }
  const updatedStore = {
    ...store,
    currentUser: { ...user, online: true },
    users: store.users.map(u => u.id === user.id ? { ...u, online: true } : u),
    chats: store.chats.map(c =>
      c.id === SYSTEM_CHANNEL_ID && !c.members.includes(user.id)
        ? { ...c, members: [...c.members, user.id] }
        : c
    ),
  };
  globalStore = updatedStore;
  saveStore(globalStore);
  notifyListeners();
  return { success: true };
}

export function logoutUser() {
  const store = getStore();
  if (!store.currentUser) return;
  const updatedStore = {
    ...store,
    currentUser: null,
    users: store.users.map(u =>
      u.id === store.currentUser!.id ? { ...u, online: false, lastSeen: new Date().toISOString() } : u
    ),
  };
  globalStore = updatedStore;
  saveStore(globalStore);
  notifyListeners();
}

export function sendMessage(chatId: string, text: string, senderId: string): Message | null {
  const store = getStore();
  const chat = store.chats.find(c => c.id === chatId);
  if (!chat) return null;

  if (chat.type === 'channel' && chat.owner !== senderId && !chat.admins.includes(senderId)) {
    return null;
  }

  const msg: Message = {
    id: `msg-${Date.now()}-${Math.random()}`,
    chatId,
    senderId,
    text,
    timestamp: new Date().toISOString(),
    read: false,
  };

  const updatedMessages = {
    ...store.messages,
    [chatId]: [...(store.messages[chatId] || []), msg],
  };

  globalStore = { ...store, messages: updatedMessages };
  saveStore(globalStore);
  notifyListeners();
  return msg;
}

export function createGroup(name: string, description: string, members: string[], ownerId: string): Chat {
  const store = getStore();
  const group: Chat = {
    id: `group-${Date.now()}`,
    type: 'group',
    name,
    avatar: '',
    members: [...new Set([ownerId, ...members])],
    admins: [ownerId],
    owner: ownerId,
    description,
    createdAt: new Date().toISOString(),
  };
  globalStore = { ...store, chats: [...store.chats, group] };
  saveStore(globalStore);
  notifyListeners();
  return group;
}

export function createChannel(name: string, description: string, ownerId: string): Chat {
  const store = getStore();
  const channel: Chat = {
    id: `channel-${Date.now()}`,
    type: 'channel',
    name,
    avatar: '',
    members: [ownerId],
    admins: [ownerId],
    owner: ownerId,
    description,
    createdAt: new Date().toISOString(),
  };
  globalStore = { ...store, chats: [...store.chats, channel] };
  saveStore(globalStore);
  notifyListeners();
  return channel;
}

export function getOrCreatePrivateChat(userId1: string, userId2: string): Chat {
  const store = getStore();
  const existing = store.chats.find(
    c => c.type === 'private' &&
    c.members.includes(userId1) &&
    c.members.includes(userId2) &&
    c.members.length === 2
  );
  if (existing) return existing;

  const user2 = store.users.find(u => u.id === userId2);
  const chat: Chat = {
    id: `private-${userId1}-${userId2}-${Date.now()}`,
    type: 'private',
    name: user2?.displayName || user2?.username || 'Пользователь',
    avatar: user2?.avatar || '',
    members: [userId1, userId2],
    admins: [],
    owner: userId1,
    description: '',
    createdAt: new Date().toISOString(),
  };
  globalStore = { ...store, chats: [...store.chats, chat] };
  saveStore(globalStore);
  notifyListeners();
  return chat;
}

export function deleteMessage(chatId: string, messageId: string, userId: string) {
  const store = getStore();
  const chat = store.chats.find(c => c.id === chatId);
  if (!chat) return;
  const isAdmin = chat.admins.includes(userId) || chat.owner === userId || userId === 'admin-connection';
  const msgs = store.messages[chatId] || [];
  const msg = msgs.find(m => m.id === messageId);
  if (!msg) return;
  if (msg.senderId !== userId && !isAdmin) return;
  globalStore = {
    ...store,
    messages: {
      ...store.messages,
      [chatId]: msgs.filter(m => m.id !== messageId),
    },
  };
  saveStore(globalStore);
  notifyListeners();
}

export function updateUserProfile(userId: string, updates: Partial<User>) {
  const store = getStore();
  const updatedUsers = store.users.map(u => u.id === userId ? { ...u, ...updates } : u);
  const updatedCurrentUser = store.currentUser?.id === userId
    ? { ...store.currentUser, ...updates }
    : store.currentUser;
  globalStore = { ...store, users: updatedUsers, currentUser: updatedCurrentUser };
  saveStore(globalStore);
  notifyListeners();
}

export function deleteUser(userId: string) {
  const store = getStore();
  globalStore = {
    ...store,
    users: store.users.filter(u => u.id !== userId),
    chats: store.chats.map(c => ({ ...c, members: c.members.filter(m => m !== userId) })),
  };
  saveStore(globalStore);
  notifyListeners();
}

export function deleteChat(chatId: string) {
  const store = getStore();
  const msgs = { ...store.messages };
  delete msgs[chatId];
  globalStore = {
    ...store,
    chats: store.chats.filter(c => c.id !== chatId),
    messages: msgs,
  };
  saveStore(globalStore);
  notifyListeners();
}

export function leaveChat(chatId: string, userId: string) {
  const store = getStore();
  const chat = store.chats.find(c => c.id === chatId);
  if (!chat || chat.noLeave) return;
  globalStore = {
    ...store,
    chats: store.chats.map(c =>
      c.id === chatId ? { ...c, members: c.members.filter(m => m !== userId) } : c
    ),
  };
  saveStore(globalStore);
  notifyListeners();
}

export function joinChat(chatId: string, userId: string) {
  const store = getStore();
  globalStore = {
    ...store,
    chats: store.chats.map(c =>
      c.id === chatId && !c.members.includes(userId)
        ? { ...c, members: [...c.members, userId] }
        : c
    ),
  };
  saveStore(globalStore);
  notifyListeners();
}

export function getUserById(id: string): User | undefined {
  return getStore().users.find(u => u.id === id);
}

export function getChatMessages(chatId: string): Message[] {
  return getStore().messages[chatId] || [];
}

export function getUserChats(userId: string): Chat[] {
  return getStore().chats.filter(c => c.members.includes(userId));
}

export function searchUsers(query: string): User[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return getStore().users.filter(u =>
    u.username.toLowerCase().includes(q) ||
    u.displayName.toLowerCase().includes(q)
  );
}

export function searchChats(query: string): Chat[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return getStore().chats.filter(c =>
    c.name.toLowerCase().includes(q)
  );
}

export { ADMIN_USERNAME, SYSTEM_CHANNEL_ID };