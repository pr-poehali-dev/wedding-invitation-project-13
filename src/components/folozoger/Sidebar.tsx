import { useState } from 'react';
import {
  useStore, getUserChats, getChatMessages, getUserById,
  searchUsers, searchChats, getOrCreatePrivateChat, Chat, User, ADMIN_USERNAME
} from '@/store/folozoger';
import Avatar from './Avatar';
import Icon from '@/components/ui/icon';

interface SidebarProps {
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onNewGroup: () => void;
  onNewChannel: () => void;
  onProfile: () => void;
  onSettings: () => void;
  onAdmin: () => void;
  onContacts: () => void;
}

export default function Sidebar({
  activeChatId, onSelectChat, onNewGroup, onNewChannel,
  onProfile, onSettings, onAdmin, onContacts,
}: SidebarProps) {
  const { store } = useStore();
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'private' | 'groups' | 'channels'>('all');

  const currentUser = store.currentUser;
  if (!currentUser) return null;

  const myChats = getUserChats(currentUser.id);

  const filteredChats = activeTab === 'all' ? myChats
    : activeTab === 'private' ? myChats.filter(c => c.type === 'private')
    : activeTab === 'groups' ? myChats.filter(c => c.type === 'group')
    : myChats.filter(c => c.type === 'channel');

  const foundUsers = query ? searchUsers(query).filter(u => u.id !== currentUser.id) : [];
  const foundChats = query ? searchChats(query) : [];

  const getChatName = (chat: Chat) => {
    if (chat.type === 'private') {
      const otherId = chat.members.find(m => m !== currentUser.id);
      const other = otherId ? getUserById(otherId) : null;
      return other?.displayName || other?.username || chat.name;
    }
    return chat.name;
  };

  const getLastMessage = (chatId: string) => {
    const msgs = getChatMessages(chatId);
    if (!msgs.length) return null;
    return msgs[msgs.length - 1];
  };

  const formatTime = (ts: string) => {
    const d = new Date(ts);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 86400000) return d.toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' });
    if (diff < 604800000) return d.toLocaleDateString('ru', { weekday: 'short' });
    return d.toLocaleDateString('ru', { day: '2-digit', month: '2-digit' });
  };

  const handleUserClick = (user: User) => {
    const chat = getOrCreatePrivateChat(currentUser.id, user.id);
    onSelectChat(chat.id);
    setQuery('');
  };

  const tabs = [
    { key: 'all', label: 'Все' },
    { key: 'private', label: 'Личные' },
    { key: 'groups', label: 'Группы' },
    { key: 'channels', label: 'Каналы' },
  ] as const;

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:opacity-80"
          style={{ color: 'var(--accent)' }}
        >
          <Icon name="Menu" size={22} />
        </button>
        <div className="flex-1 relative">
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' } as React.CSSProperties} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Поиск..."
            className="w-full pl-9 pr-3 py-2 rounded-xl text-sm outline-none"
            style={{
              background: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              border: 'none',
            }}
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
              <Icon name="X" size={14} />
            </button>
          )}
        </div>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-8 h-8 rounded-full flex items-center justify-center"
        >
          <Avatar name={currentUser.displayName} size={32} online={true} />
        </button>
      </div>

      {/* Dropdown menu */}
      {menuOpen && (
        <div className="absolute top-16 left-2 z-50 w-64 rounded-2xl shadow-2xl animate-scale-in overflow-hidden"
          style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-strong)' }}>
          <div className="p-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="flex items-center gap-3 px-2 py-1">
              <Avatar name={currentUser.displayName} size={40} online={true} />
              <div>
                <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{currentUser.displayName}</div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>@{currentUser.username}</div>
              </div>
            </div>
          </div>
          {[
            { icon: 'User', label: 'Профиль', action: () => { onProfile(); setMenuOpen(false); } },
            { icon: 'Users', label: 'Создать группу', action: () => { onNewGroup(); setMenuOpen(false); } },
            { icon: 'Megaphone', label: 'Создать канал', action: () => { onNewChannel(); setMenuOpen(false); } },
            { icon: 'Contact', label: 'Контакты', action: () => { onContacts(); setMenuOpen(false); } },
            { icon: 'Settings', label: 'Настройки', action: () => { onSettings(); setMenuOpen(false); } },
            ...(currentUser.username === ADMIN_USERNAME
              ? [{ icon: 'Shield', label: 'Админ-панель', action: () => { onAdmin(); setMenuOpen(false); } }]
              : []),
          ].map(item => (
            <button key={item.label} onClick={item.action}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm transition-all text-left"
              style={{ color: 'var(--text-primary)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-tertiary)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <Icon name={item.icon as 'User'} size={18} style={{ color: 'var(--accent)' } as React.CSSProperties} />
              {item.label}
            </button>
          ))}
        </div>
      )}

      {menuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
      )}

      {/* Tabs */}
      <div className="flex px-2 pt-2 gap-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all"
            style={{
              background: activeTab === tab.key ? 'var(--accent)' : 'var(--bg-tertiary)',
              color: activeTab === tab.key ? '#fff' : 'var(--text-secondary)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search results */}
      {query && (
        <div className="flex-1 overflow-y-auto py-2">
          {foundUsers.length > 0 && (
            <div>
              <div className="px-4 py-1 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Пользователи</div>
              {foundUsers.map(user => (
                <button key={user.id} onClick={() => handleUserClick(user)}
                  className="w-full flex items-center gap-3 px-4 py-3 transition-all"
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-tertiary)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <Avatar name={user.displayName} size={42} online={user.online} />
                  <div className="flex-1 min-w-0 text-left">
                    <div className="font-medium text-sm truncate" style={{ color: 'var(--text-primary)' }}>{user.displayName}</div>
                    <div className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>@{user.username}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
          {foundChats.length > 0 && (
            <div>
              <div className="px-4 py-1 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Чаты и каналы</div>
              {foundChats.map(chat => (
                <button key={chat.id} onClick={() => { onSelectChat(chat.id); setQuery(''); }}
                  className="w-full flex items-center gap-3 px-4 py-3 transition-all"
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-tertiary)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <Avatar name={chat.name} size={42} type={chat.type} />
                  <div className="flex-1 min-w-0 text-left">
                    <div className="font-medium text-sm truncate" style={{ color: 'var(--text-primary)' }}>{chat.name}</div>
                    <div className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                      {chat.type === 'channel' ? 'Канал' : chat.type === 'group' ? 'Группа' : 'Чат'} · {chat.members.length} участников
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
          {foundUsers.length === 0 && foundChats.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <Icon name="SearchX" size={40} style={{ color: 'var(--text-muted)' } as React.CSSProperties} />
              <p style={{ color: 'var(--text-muted)' }} className="text-sm">Ничего не найдено</p>
            </div>
          )}
        </div>
      )}

      {/* Chat list */}
      {!query && (
        <div className="flex-1 overflow-y-auto py-1">
          {filteredChats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <Icon name="MessageCircle" size={40} style={{ color: 'var(--text-muted)' } as React.CSSProperties} />
              <p style={{ color: 'var(--text-muted)' }} className="text-sm">Нет чатов</p>
            </div>
          ) : (
            filteredChats
              .sort((a, b) => {
                if (a.pinned && !b.pinned) return -1;
                if (!a.pinned && b.pinned) return 1;
                const aLast = getLastMessage(a.id)?.timestamp || a.createdAt;
                const bLast = getLastMessage(b.id)?.timestamp || b.createdAt;
                return new Date(bLast).getTime() - new Date(aLast).getTime();
              })
              .map(chat => {
                const lastMsg = getLastMessage(chat.id);
                const chatName = getChatName(chat);
                const isActive = chat.id === activeChatId;
                const senderId = lastMsg?.senderId;
                const sender = senderId ? getUserById(senderId) : null;
                const isOwnMsg = senderId === currentUser.id;

                return (
                  <button
                    key={chat.id}
                    onClick={() => onSelectChat(chat.id)}
                    className="w-full flex items-center gap-3 px-3 py-3 transition-all relative"
                    style={{
                      background: isActive ? 'var(--accent-light)' : 'transparent',
                      borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--bg-tertiary)'; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <div className="relative">
                      <Avatar name={chatName} size={48} type={chat.type !== 'private' ? chat.type : undefined}
                        online={chat.type === 'private' ? store.users.find(u => u.id === chat.members.find(m => m !== currentUser.id))?.online : undefined}
                      />
                      {chat.pinned && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                          style={{ background: 'var(--accent)', fontSize: 9 }}>
                          📌
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{chatName}</span>
                        {lastMsg && <span className="text-xs flex-shrink-0" style={{ color: 'var(--text-muted)' }}>{formatTime(lastMsg.timestamp)}</span>}
                      </div>
                      <div className="text-xs truncate mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                        {lastMsg ? (
                          <>
                            {isOwnMsg ? 'Вы: ' : sender ? `${sender.displayName}: ` : ''}
                            {lastMsg.text}
                          </>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>Нет сообщений</span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
          )}
        </div>
      )}

      {/* Compose button */}
      <div className="p-4">
        <button
          onClick={onNewGroup}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{ background: 'var(--accent)', color: '#fff' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent-hover)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'var(--accent)')}
        >
          <Icon name="Plus" size={16} />
          Новый чат
        </button>
      </div>
    </div>
  );
}
