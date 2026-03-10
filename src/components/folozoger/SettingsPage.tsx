import { useState } from 'react';
import { useStore, logoutUser } from '@/store/folozoger';
import Icon from '@/components/ui/icon';

interface SettingsPageProps {
  onBack: () => void;
}

const sections = [
  {
    title: 'Аккаунт',
    items: [
      { icon: 'Lock', label: 'Конфиденциальность', desc: 'Управление настройками приватности' },
      { icon: 'Bell', label: 'Уведомления', desc: 'Звуки, вибрация, приоритеты' },
      { icon: 'Shield', label: 'Безопасность', desc: 'Двухфакторная аутентификация, сессии' },
    ],
  },
  {
    title: 'Приложение',
    items: [
      { icon: 'Palette', label: 'Тема оформления', desc: 'Тёмная, светлая, авто' },
      { icon: 'Globe', label: 'Язык', desc: 'Русский' },
      { icon: 'Smartphone', label: 'Устройства', desc: 'Активные сессии' },
    ],
  },
  {
    title: 'Данные',
    items: [
      { icon: 'Database', label: 'Хранилище', desc: 'Управление загруженными файлами' },
      { icon: 'Download', label: 'Экспорт данных', desc: 'Скачать свои данные' },
      { icon: 'Trash2', label: 'Удалить аккаунт', desc: 'Безвозвратное удаление', danger: true },
    ],
  },
];

export default function SettingsPage({ onBack }: SettingsPageProps) {
  const { store } = useStore();
  const [notifications, setNotifications] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [preview, setPreview] = useState(true);

  const currentUser = store.currentUser;
  if (!currentUser) return null;

  return (
    <div className="flex flex-col h-full animate-fade-in" style={{ background: 'var(--bg-primary)' }}>
      <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
        <button onClick={onBack} style={{ color: 'var(--accent)' }}>
          <Icon name="ArrowLeft" size={22} />
        </button>
        <h2 className="text-base font-semibold flex-1" style={{ color: 'var(--text-primary)' }}>Настройки</h2>
      </div>

      <div className="overflow-y-auto flex-1 px-4 py-4 space-y-4">
        {/* Quick toggles */}
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          <div className="px-4 py-2" style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Быстрые настройки</span>
          </div>
          {[
            { label: 'Уведомления', desc: 'Показывать уведомления', state: notifications, set: setNotifications, icon: 'Bell' },
            { label: 'Звуки', desc: 'Звуки при сообщениях', state: sounds, set: setSounds, icon: 'Volume2' },
            { label: 'Предпросмотр', desc: 'Показывать текст в уведомлениях', state: preview, set: setPreview, icon: 'Eye' },
          ].map((item, i, arr) => (
            <div key={item.label}
              className="flex items-center gap-4 px-4 py-3"
              style={{ background: 'var(--bg-tertiary)', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <Icon name={item.icon as 'Bell'} size={18} style={{ color: 'var(--accent)' } as React.CSSProperties} />
              <div className="flex-1">
                <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.label}</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.desc}</div>
              </div>
              <button
                onClick={() => item.set(!item.state)}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                style={{ background: item.state ? 'var(--accent)' : 'var(--bg-secondary)' }}
              >
                <span
                  className="inline-block h-4 w-4 rounded-full bg-white transition-transform"
                  style={{ transform: item.state ? 'translateX(24px)' : 'translateX(4px)' }}
                />
              </button>
            </div>
          ))}
        </div>

        {sections.map(section => (
          <div key={section.title} className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <div className="px-4 py-2" style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{section.title}</span>
            </div>
            {section.items.map((item, i, arr) => (
              <button
                key={item.label}
                className="w-full flex items-center gap-4 px-4 py-3 transition-all text-left"
                style={{
                  background: 'var(--bg-tertiary)',
                  borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                  color: (item as {danger?: boolean}).danger ? 'var(--danger)' : 'var(--text-primary)',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-primary)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg-tertiary)')}
              >
                <Icon
                  name={item.icon as 'Lock'}
                  size={18}
                  style={{ color: (item as {danger?: boolean}).danger ? 'var(--danger)' : 'var(--accent)' } as React.CSSProperties}
                />
                <div className="flex-1">
                  <div className="text-sm font-medium">{item.label}</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.desc}</div>
                </div>
                <Icon name="ChevronRight" size={16} style={{ color: 'var(--text-muted)' } as React.CSSProperties} />
              </button>
            ))}
          </div>
        ))}

        <div className="rounded-2xl px-4 py-3 text-center" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Folozoger</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Версия 1.0.0 · 2024</p>
        </div>

        <button
          onClick={logoutUser}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium"
          style={{ background: 'rgba(229,57,53,0.1)', color: 'var(--danger)', border: '1px solid rgba(229,57,53,0.2)' }}
        >
          <Icon name="LogOut" size={18} />
          Выйти
        </button>
      </div>
    </div>
  );
}
