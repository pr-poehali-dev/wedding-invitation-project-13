import { useState } from 'react';
import { useStore, updateUserProfile, logoutUser } from '@/store/folozoger';
import Avatar from './Avatar';
import Icon from '@/components/ui/icon';

interface ProfilePageProps {
  onBack: () => void;
}

export default function ProfilePage({ onBack }: ProfilePageProps) {
  const { store } = useStore();
  const currentUser = store.currentUser;
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [saved, setSaved] = useState(false);

  if (!currentUser) return null;

  const handleSave = () => {
    updateUserProfile(currentUser.id, { displayName, bio, phone });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col h-full animate-fade-in" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
        <button onClick={onBack} style={{ color: 'var(--accent)' }}>
          <Icon name="ArrowLeft" size={22} />
        </button>
        <h2 className="text-base font-semibold flex-1" style={{ color: 'var(--text-primary)' }}>Мой профиль</h2>
        <button
          onClick={() => editing ? handleSave() : setEditing(true)}
          style={{ color: 'var(--accent)' }}
          className="text-sm font-medium"
        >
          {editing ? 'Сохранить' : 'Изменить'}
        </button>
      </div>

      <div className="overflow-y-auto flex-1">
        {/* Avatar section */}
        <div className="flex flex-col items-center py-8 px-4"
          style={{ background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)' }}>
          <div className="relative mb-4">
            <Avatar name={currentUser.displayName} size={100} online={true} />
            {editing && (
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'var(--accent)', color: '#fff' }}>
                <Icon name="Camera" size={14} />
              </button>
            )}
          </div>
          <h1 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{currentUser.displayName}</h1>
          <p className="text-sm" style={{ color: 'var(--accent)' }}>@{currentUser.username}</p>
          {currentUser.online && (
            <div className="flex items-center gap-1.5 mt-2">
              <div className="w-2 h-2 rounded-full" style={{ background: 'var(--online)' }} />
              <span className="text-xs" style={{ color: 'var(--online)' }}>В сети</span>
            </div>
          )}
        </div>

        {/* Info cards */}
        <div className="px-4 pb-6 space-y-3">
          {editing ? (
            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              <div className="px-4 py-3" style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border)' }}>
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Имя</label>
                <input
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  className="w-full bg-transparent outline-none mt-1 text-sm"
                  style={{ color: 'var(--text-primary)' }}
                />
              </div>
              <div className="px-4 py-3" style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border)' }}>
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>О себе</label>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  rows={3}
                  placeholder="Расскажите о себе..."
                  className="w-full bg-transparent outline-none mt-1 text-sm resize-none"
                  style={{ color: 'var(--text-primary)' }}
                />
              </div>
              <div className="px-4 py-3" style={{ background: 'var(--bg-tertiary)' }}>
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Телефон</label>
                <input
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-transparent outline-none mt-1 text-sm"
                  style={{ color: 'var(--text-primary)' }}
                />
              </div>
            </div>
          ) : (
            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              {[
                { icon: 'Info', label: 'О себе', value: currentUser.bio || 'Не указано' },
                { icon: 'AtSign', label: 'Ник', value: `@${currentUser.username}` },
                { icon: 'Phone', label: 'Телефон', value: currentUser.phone || 'Не указан' },
                { icon: 'Calendar', label: 'Регистрация', value: new Date(currentUser.createdAt).toLocaleDateString('ru', { day: 'numeric', month: 'long', year: 'numeric' }) },
              ].map((item, i, arr) => (
                <div key={item.label}
                  className="flex items-center gap-4 px-4 py-3"
                  style={{
                    background: 'var(--bg-tertiary)',
                    borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                  }}>
                  <Icon name={item.icon as 'Info'} size={18} style={{ color: 'var(--accent)' } as React.CSSProperties} />
                  <div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.label}</div>
                    <div className="text-sm" style={{ color: 'var(--text-primary)' }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {saved && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl animate-fade-in"
              style={{ background: 'rgba(67,160,71,0.15)', color: '#66bb6a' }}>
              <Icon name="Check" size={16} />
              Профиль сохранён
            </div>
          )}

          <button
            onClick={logoutUser}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all"
            style={{ background: 'rgba(229,57,53,0.1)', color: 'var(--danger)', border: '1px solid rgba(229,57,53,0.2)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(229,57,53,0.2)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(229,57,53,0.1)')}
          >
            <Icon name="LogOut" size={18} />
            Выйти из аккаунта
          </button>
        </div>
      </div>
    </div>
  );
}
