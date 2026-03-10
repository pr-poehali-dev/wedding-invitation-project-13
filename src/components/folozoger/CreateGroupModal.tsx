import { useState } from 'react';
import { useStore, createGroup, createChannel, searchUsers } from '@/store/folozoger';
import Avatar from './Avatar';
import Icon from '@/components/ui/icon';

interface CreateGroupModalProps {
  type: 'group' | 'channel';
  onClose: () => void;
  onCreated: (chatId: string) => void;
}

export default function CreateGroupModal({ type, onClose, onCreated }: CreateGroupModalProps) {
  const { store } = useStore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [memberQuery, setMemberQuery] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [step, setStep] = useState<'info' | 'members'>(type === 'channel' ? 'info' : 'members');

  const currentUser = store.currentUser;
  if (!currentUser) return null;

  const foundUsers = searchUsers(memberQuery).filter(u => u.id !== currentUser.id);

  const toggleMember = (userId: string) => {
    setSelectedMembers(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleCreate = () => {
    if (!name.trim()) return;
    let chat;
    if (type === 'group') {
      chat = createGroup(name.trim(), description.trim(), selectedMembers, currentUser.id);
    } else {
      chat = createChannel(name.trim(), description.trim(), currentUser.id);
    }
    onCreated(chat.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="w-full max-w-md rounded-2xl animate-scale-in overflow-hidden"
        style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-strong)' }}>
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <button onClick={onClose} style={{ color: 'var(--text-secondary)' }}>
            <Icon name="X" size={20} />
          </button>
          <h2 className="text-base font-semibold flex-1" style={{ color: 'var(--text-primary)' }}>
            {type === 'group' ? '👥 Новая группа' : '📢 Новый канал'}
          </h2>
        </div>

        <div className="p-4 space-y-4">
          {/* Avatar placeholder */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center cursor-pointer"
              style={{ background: 'var(--bg-tertiary)', border: '2px dashed var(--border-strong)' }}>
              <Icon name="Camera" size={28} style={{ color: 'var(--text-muted)' } as React.CSSProperties} />
            </div>
          </div>

          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--text-secondary)' }}>
              {type === 'group' ? 'Название группы' : 'Название канала'}
            </label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={type === 'group' ? 'Название группы...' : 'Название канала...'}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')}
            />
          </div>

          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--text-secondary)' }}>Описание (необязательно)</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Коротко о чём этот чат..."
              rows={2}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')}
            />
          </div>

          {type === 'group' && (
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--text-secondary)' }}>Добавить участников</label>
              <input
                value={memberQuery}
                onChange={e => setMemberQuery(e.target.value)}
                placeholder="Поиск по нику..."
                className="w-full px-4 py-3 rounded-xl text-sm outline-none mb-2"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              />
              {selectedMembers.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedMembers.map(id => {
                    const user = store.users.find(u => u.id === id);
                    if (!user) return null;
                    return (
                      <span key={id} className="flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                        style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                        {user.displayName}
                        <button onClick={() => toggleMember(id)}><Icon name="X" size={10} /></button>
                      </span>
                    );
                  })}
                </div>
              )}
              {memberQuery && (
                <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)', maxHeight: 200, overflowY: 'auto' }}>
                  {foundUsers.length === 0 ? (
                    <div className="px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Пользователи не найдены</div>
                  ) : foundUsers.map(user => (
                    <button key={user.id} onClick={() => toggleMember(user.id)}
                      className="w-full flex items-center gap-3 px-4 py-3 transition-all"
                      style={{ background: selectedMembers.includes(user.id) ? 'var(--accent-light)' : 'transparent' }}
                      onMouseEnter={e => { if (!selectedMembers.includes(user.id)) e.currentTarget.style.background = 'var(--bg-tertiary)'; }}
                      onMouseLeave={e => { if (!selectedMembers.includes(user.id)) e.currentTarget.style.background = 'transparent'; }}
                    >
                      <Avatar name={user.displayName} size={36} online={user.online} />
                      <div className="flex-1 text-left">
                        <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{user.displayName}</div>
                        <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>@{user.username}</div>
                      </div>
                      {selectedMembers.includes(user.id) && (
                        <Icon name="Check" size={16} style={{ color: 'var(--accent)' } as React.CSSProperties} />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleCreate}
            disabled={!name.trim()}
            className="w-full py-3 rounded-xl font-semibold text-sm transition-all"
            style={{
              background: name.trim() ? 'var(--accent)' : 'var(--bg-tertiary)',
              color: name.trim() ? '#fff' : 'var(--text-muted)',
            }}
            onMouseEnter={e => { if (name.trim()) (e.currentTarget.style.background = 'var(--accent-hover)'); }}
            onMouseLeave={e => { if (name.trim()) (e.currentTarget.style.background = 'var(--accent)'); }}
          >
            {type === 'group' ? 'Создать группу' : 'Создать канал'}
          </button>
        </div>
      </div>
    </div>
  );
}
