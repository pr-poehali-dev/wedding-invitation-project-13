import { useState } from 'react';
import { useStore, deleteUser, deleteChat, updateUserProfile, User, Chat, ADMIN_USERNAME } from '@/store/folozoger';
import Avatar from './Avatar';
import Icon from '@/components/ui/icon';

interface AdminPanelProps {
  onBack: () => void;
}

type Tab = 'users' | 'chats' | 'stats';

export default function AdminPanel({ onBack }: AdminPanelProps) {
  const { store } = useStore();
  const [tab, setTab] = useState<Tab>('stats');
  const [userQuery, setUserQuery] = useState('');
  const [chatQuery, setChatQuery] = useState('');
  const [confirm, setConfirm] = useState<{ type: 'user' | 'chat'; id: string; name: string } | null>(null);

  const currentUser = store.currentUser;
  if (!currentUser || currentUser.username !== ADMIN_USERNAME) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4" style={{ background: 'var(--bg-primary)' }}>
        <Icon name="ShieldX" size={60} style={{ color: 'var(--danger)' } as React.CSSProperties} />
        <p style={{ color: 'var(--danger)' }} className="font-semibold">Доступ запрещён</p>
        <button onClick={onBack} style={{ color: 'var(--accent)' }}>Назад</button>
      </div>
    );
  }

  const filteredUsers = store.users.filter(u =>
    !userQuery || u.username.toLowerCase().includes(userQuery.toLowerCase()) ||
    u.displayName.toLowerCase().includes(userQuery.toLowerCase())
  );

  const filteredChats = store.chats.filter(c =>
    !chatQuery || c.name.toLowerCase().includes(chatQuery.toLowerCase())
  );

  const totalMessages = Object.values(store.messages).reduce((sum, msgs) => sum + msgs.length, 0);

  const stats = [
    { label: 'Пользователей', value: store.users.length, icon: 'Users', color: '#3498db' },
    { label: 'Чатов', value: store.chats.filter(c => c.type === 'private').length, icon: 'MessageCircle', color: '#2ecc71' },
    { label: 'Групп', value: store.chats.filter(c => c.type === 'group').length, icon: 'Users2', color: '#e67e22' },
    { label: 'Каналов', value: store.chats.filter(c => c.type === 'channel').length, icon: 'Megaphone', color: '#9b59b6' },
    { label: 'Сообщений', value: totalMessages, icon: 'Mail', color: '#1abc9c' },
    { label: 'Онлайн', value: store.users.filter(u => u.online).length, icon: 'Wifi', color: '#27ae60' },
  ];

  return (
    <div className="flex flex-col h-full animate-fade-in" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
        <button onClick={onBack} style={{ color: 'var(--accent)' }}>
          <Icon name="ArrowLeft" size={22} />
        </button>
        <div className="flex-1">
          <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Админ-панель</h2>
          <p className="text-xs" style={{ color: 'var(--accent)' }}>@{currentUser.username}</p>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: 'var(--accent-light)' }}>
          <Icon name="Shield" size={12} style={{ color: 'var(--accent)' } as React.CSSProperties} />
          <span className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>ADMIN</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b" style={{ borderColor: 'var(--border)' }}>
        {([['stats', '📊 Статистика'], ['users', '👥 Пользователи'], ['chats', '💬 Чаты']] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className="flex-1 py-3 text-sm font-medium transition-all"
            style={{
              color: tab === key ? 'var(--accent)' : 'var(--text-secondary)',
              borderBottom: tab === key ? '2px solid var(--accent)' : '2px solid transparent',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Stats */}
        {tab === 'stats' && (
          <div className="p-4">
            <div className="grid grid-cols-2 gap-3 mb-4">
              {stats.map(stat => (
                <div key={stat.label} className="rounded-2xl p-4" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name={stat.icon as 'Users'} size={18} style={{ color: stat.color } as React.CSSProperties} />
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{stat.label}</span>
                  </div>
                  <div className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl p-4" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}>
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Последние регистрации</h3>
              {[...store.users].reverse().slice(0, 5).map(user => (
                <div key={user.id} className="flex items-center gap-3 py-2">
                  <Avatar name={user.displayName} size={32} online={user.online} />
                  <div className="flex-1">
                    <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{user.displayName}</div>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>@{user.username}</div>
                  </div>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {new Date(user.createdAt).toLocaleDateString('ru')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users */}
        {tab === 'users' && (
          <div>
            <div className="px-4 py-2" style={{ borderBottom: '1px solid var(--border)' }}>
              <input
                value={userQuery}
                onChange={e => setUserQuery(e.target.value)}
                placeholder="Поиск пользователей..."
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: 'none' }}
              />
            </div>
            {filteredUsers.map(user => (
              <div key={user.id} className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                <Avatar name={user.displayName} size={40} online={user.online} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{user.displayName}</span>
                    {user.username === ADMIN_USERNAME && (
                      <span className="px-1.5 py-0.5 rounded text-xs font-bold" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>ADMIN</span>
                    )}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>@{user.username}</div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateUserProfile(user.id, { online: !user.online })}
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
                    title={user.online ? 'Отключить' : 'Включить'}
                  >
                    <Icon name={user.online ? 'WifiOff' : 'Wifi'} size={14} />
                  </button>
                  {user.username !== ADMIN_USERNAME && (
                    <button
                      onClick={() => setConfirm({ type: 'user', id: user.id, name: user.displayName })}
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(229,57,53,0.1)', color: 'var(--danger)' }}
                    >
                      <Icon name="Trash2" size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Chats */}
        {tab === 'chats' && (
          <div>
            <div className="px-4 py-2" style={{ borderBottom: '1px solid var(--border)' }}>
              <input
                value={chatQuery}
                onChange={e => setChatQuery(e.target.value)}
                placeholder="Поиск чатов..."
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: 'none' }}
              />
            </div>
            {filteredChats.map(chat => {
              const msgCount = (store.messages[chat.id] || []).length;
              return (
                <div key={chat.id} className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                  <Avatar name={chat.name} type={chat.type !== 'private' ? chat.type : undefined} size={40} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{chat.name}</span>
                      {chat.noLeave && <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>📌</span>}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {chat.type === 'private' ? 'Личный' : chat.type === 'group' ? 'Группа' : 'Канал'} ·
                      {chat.members.length} участников · {msgCount} сообщ.
                    </div>
                  </div>
                  {!chat.noLeave && (
                    <button
                      onClick={() => setConfirm({ type: 'chat', id: chat.id, name: chat.name })}
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(229,57,53,0.1)', color: 'var(--danger)' }}
                    >
                      <Icon name="Trash2" size={14} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirm dialog */}
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="rounded-2xl p-6 w-80 animate-scale-in"
            style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-strong)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(229,57,53,0.15)' }}>
                <Icon name="AlertTriangle" size={20} style={{ color: 'var(--danger)' } as React.CSSProperties} />
              </div>
              <div>
                <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                  Удалить {confirm.type === 'user' ? 'пользователя' : 'чат'}?
                </div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{confirm.name}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirm(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
              >
                Отмена
              </button>
              <button
                onClick={() => {
                  if (confirm.type === 'user') deleteUser(confirm.id);
                  else deleteChat(confirm.id);
                  setConfirm(null);
                }}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                style={{ background: 'var(--danger)', color: '#fff' }}
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
