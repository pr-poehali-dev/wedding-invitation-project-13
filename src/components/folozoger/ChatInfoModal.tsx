import { useStore, leaveChat, getUserById, Chat, ADMIN_USERNAME, SYSTEM_CHANNEL_ID, joinChat } from '@/store/folozoger';
import Avatar from './Avatar';
import Icon from '@/components/ui/icon';

interface ChatInfoModalProps {
  chat: Chat;
  onClose: () => void;
}

export default function ChatInfoModal({ chat, onClose }: ChatInfoModalProps) {
  const { store } = useStore();
  const currentUser = store.currentUser;
  if (!currentUser) return null;

  const isAdmin = chat.admins.includes(currentUser.id) || chat.owner === currentUser.id || currentUser.username === ADMIN_USERNAME;
  const canLeave = !chat.noLeave && chat.id !== SYSTEM_CHANNEL_ID && chat.type !== 'private' && chat.owner !== currentUser.id;
  const isMember = chat.members.includes(currentUser.id);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)' }}
      onClick={onClose}>
      <div className="w-full max-w-md rounded-t-2xl sm:rounded-2xl animate-fade-in overflow-hidden"
        style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-strong)', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}
        onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="relative">
          <div className="h-24 w-full" style={{ background: 'linear-gradient(135deg, var(--accent), #1a3a5c)' }} />
          <div className="absolute -bottom-10 left-4">
            <Avatar name={chat.name} type={chat.type !== 'private' ? chat.type : undefined} size={72} />
          </div>
          <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.4)', color: '#fff' }}>
            <Icon name="X" size={16} />
          </button>
        </div>

        <div className="pt-12 px-4 pb-4 overflow-y-auto flex-1">
          <div className="mb-4">
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{chat.name}</h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {chat.type === 'channel' ? `📢 Канал · ${chat.members.length} подписчиков`
                : chat.type === 'group' ? `👥 Группа · ${chat.members.length} участников`
                : '💬 Личная переписка'}
            </p>
            {chat.noLeave && (
              <div className="flex items-center gap-1.5 mt-1">
                <Icon name="Pin" size={12} style={{ color: 'var(--accent)' } as React.CSSProperties} />
                <span className="text-xs" style={{ color: 'var(--accent)' }}>Системный канал — нельзя покинуть</span>
              </div>
            )}
          </div>

          {chat.description && (
            <div className="mb-4 px-3 py-3 rounded-xl" style={{ background: 'var(--bg-tertiary)' }}>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{chat.description}</p>
            </div>
          )}

          {/* Members */}
          {chat.type !== 'private' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Участники ({chat.members.length})
                </span>
              </div>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {chat.members.map(memberId => {
                  const member = getUserById(memberId);
                  if (!member) return null;
                  const isOwner = chat.owner === memberId;
                  const isAdm = chat.admins.includes(memberId);
                  return (
                    <div key={memberId} className="flex items-center gap-3 px-2 py-2 rounded-xl"
                      style={{ background: 'var(--bg-tertiary)' }}>
                      <Avatar name={member.displayName} size={36} online={member.online} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{member.displayName}</div>
                        <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>@{member.username}</div>
                      </div>
                      {isOwner && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,180,0,0.2)', color: '#ffb400' }}>Владелец</span>}
                      {!isOwner && isAdm && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>Админ</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-4 space-y-2">
            {!isMember && (
              <button
                onClick={() => { joinChat(chat.id, currentUser.id); onClose(); }}
                className="w-full py-3 rounded-xl font-semibold text-sm"
                style={{ background: 'var(--accent)', color: '#fff' }}
              >
                {chat.type === 'channel' ? 'Подписаться' : 'Вступить'}
              </button>
            )}
            {canLeave && isMember && (
              <button
                onClick={() => { leaveChat(chat.id, currentUser.id); onClose(); }}
                className="w-full py-3 rounded-xl font-semibold text-sm"
                style={{ background: 'rgba(229,57,53,0.1)', color: 'var(--danger)', border: '1px solid rgba(229,57,53,0.2)' }}
              >
                {chat.type === 'channel' ? 'Отписаться' : 'Покинуть группу'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
