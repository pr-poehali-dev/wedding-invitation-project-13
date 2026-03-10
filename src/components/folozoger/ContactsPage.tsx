import { useStore, getOrCreatePrivateChat } from '@/store/folozoger';
import Avatar from './Avatar';
import Icon from '@/components/ui/icon';
import { useState } from 'react';

interface ContactsPageProps {
  onBack: () => void;
  onChat: (chatId: string) => void;
}

export default function ContactsPage({ onBack, onChat }: ContactsPageProps) {
  const { store } = useStore();
  const [query, setQuery] = useState('');
  const currentUser = store.currentUser;
  if (!currentUser) return null;

  const allUsers = store.users.filter(u => u.id !== currentUser.id);
  const filtered = query
    ? allUsers.filter(u =>
        u.username.toLowerCase().includes(query.toLowerCase()) ||
        u.displayName.toLowerCase().includes(query.toLowerCase())
      )
    : allUsers;

  const sortedUsers = [...filtered].sort((a, b) => a.displayName.localeCompare(b.displayName, 'ru'));

  const grouped: Record<string, typeof sortedUsers> = {};
  sortedUsers.forEach(user => {
    const letter = user.displayName[0].toUpperCase();
    if (!grouped[letter]) grouped[letter] = [];
    grouped[letter].push(user);
  });

  return (
    <div className="flex flex-col h-full animate-fade-in" style={{ background: 'var(--bg-primary)' }}>
      <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
        <button onClick={onBack} style={{ color: 'var(--accent)' }}>
          <Icon name="ArrowLeft" size={22} />
        </button>
        <h2 className="text-base font-semibold flex-1" style={{ color: 'var(--text-primary)' }}>Контакты</h2>
        <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
          {allUsers.length}
        </span>
      </div>

      <div className="px-4 py-2" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="relative">
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' } as React.CSSProperties} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Поиск контактов..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm outline-none"
            style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: 'none' }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {sortedUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <Icon name="UserX" size={40} style={{ color: 'var(--text-muted)' } as React.CSSProperties} />
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Контакты не найдены</p>
          </div>
        ) : (
          Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b, 'ru')).map(([letter, users]) => (
            <div key={letter}>
              <div className="sticky top-0 px-4 py-1" style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
                <span className="text-xs font-bold" style={{ color: 'var(--accent)' }}>{letter}</span>
              </div>
              {users.map(user => (
                <button
                  key={user.id}
                  onClick={() => { const chat = getOrCreatePrivateChat(currentUser.id, user.id); onChat(chat.id); }}
                  className="w-full flex items-center gap-3 px-4 py-3 transition-all"
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-tertiary)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <Avatar name={user.displayName} size={44} online={user.online} />
                  <div className="flex-1 min-w-0 text-left">
                    <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{user.displayName}</div>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      @{user.username}
                      {user.online && <span className="ml-2" style={{ color: 'var(--online)' }}>· в сети</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                      <Icon name="MessageCircle" size={14} />
                    </button>
                  </div>
                </button>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
