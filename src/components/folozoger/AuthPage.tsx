import { useState } from 'react';
import { registerUser, loginUser } from '@/store/folozoger';
import Icon from '@/components/ui/icon';

interface AuthPageProps {
  onAuth: () => void;
}

export default function AuthPage({ onAuth }: AuthPageProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 300));

    if (mode === 'register') {
      if (!username.trim() || !displayName.trim() || !password.trim()) {
        setError('Заполните все поля');
        setLoading(false);
        return;
      }
      if (username.length < 3) {
        setError('Ник должен быть не менее 3 символов');
        setLoading(false);
        return;
      }
      const result = registerUser(username.trim(), displayName.trim(), phone.trim(), password);
      if (!result.success) {
        setError(result.error || 'Ошибка регистрации');
        setLoading(false);
        return;
      }
    } else {
      const result = loginUser(username.trim(), password);
      if (!result.success) {
        setError(result.error || 'Ошибка входа');
        setLoading(false);
        return;
      }
    }
    setLoading(false);
    onAuth();
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-secondary)' }}>
      <div className="w-full max-w-sm px-4 animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--accent), #2b5278)' }}>
            <span className="text-3xl font-bold text-white">F</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Folozoger</h1>
          <p style={{ color: 'var(--text-secondary)' }} className="text-sm">
            {mode === 'login' ? 'Войдите в свой аккаунт' : 'Создайте аккаунт'}
          </p>
        </div>

        <div className="rounded-2xl p-6" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-strong)' }}>
          <div className="flex rounded-xl mb-6 p-1" style={{ background: 'var(--bg-secondary)' }}>
            <button
              onClick={() => { setMode('login'); setError(''); }}
              className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: mode === 'login' ? 'var(--accent)' : 'transparent',
                color: mode === 'login' ? '#fff' : 'var(--text-secondary)',
              }}
            >
              Войти
            </button>
            <button
              onClick={() => { setMode('register'); setError(''); }}
              className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: mode === 'register' ? 'var(--accent)' : 'transparent',
                color: mode === 'register' ? '#fff' : 'var(--text-secondary)',
              }}
            >
              Регистрация
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--text-secondary)' }}>Имя пользователя (@ник)</label>
              <input
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="username"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                }}
                onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')}
              />
            </div>

            {mode === 'register' && (
              <>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: 'var(--text-secondary)' }}>Отображаемое имя</label>
                  <input
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    placeholder="Ваше имя"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                    }}
                    onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                    onBlur={e => (e.target.style.borderColor = 'var(--border)')}
                  />
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: 'var(--text-secondary)' }}>Телефон (необязательно)</label>
                  <input
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+7 999 000-00-00"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                    }}
                    onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                    onBlur={e => (e.target.style.borderColor = 'var(--border)')}
                  />
                </div>
              </>
            )}

            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--text-secondary)' }}>Пароль</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                }}
                onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm animate-fade-in"
                style={{ background: 'rgba(229,57,53,0.15)', color: '#ef5350' }}>
                <Icon name="AlertCircle" size={14} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all mt-2"
              style={{
                background: loading ? 'var(--text-muted)' : 'var(--accent)',
                color: '#fff',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={e => { if (!loading) (e.target as HTMLElement).style.background = 'var(--accent-hover)'; }}
              onMouseLeave={e => { if (!loading) (e.target as HTMLElement).style.background = 'var(--accent)'; }}
            >
              {loading ? 'Загрузка...' : mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
            </button>
          </form>
        </div>
        <p className="text-center text-xs mt-4" style={{ color: 'var(--text-muted)' }}>
          Folozoger © 2024 — Современный мессенджер
        </p>
      </div>
    </div>
  );
}
