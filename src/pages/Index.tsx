import { useState, useEffect } from 'react';
import { useStore } from '@/store/folozoger';
import { Chat } from '@/store/folozoger';
import AuthPage from '@/components/folozoger/AuthPage';
import Sidebar from '@/components/folozoger/Sidebar';
import ChatView from '@/components/folozoger/ChatView';
import ProfilePage from '@/components/folozoger/ProfilePage';
import SettingsPage from '@/components/folozoger/SettingsPage';
import AdminPanel from '@/components/folozoger/AdminPanel';
import ContactsPage from '@/components/folozoger/ContactsPage';
import CreateGroupModal from '@/components/folozoger/CreateGroupModal';
import ChatInfoModal from '@/components/folozoger/ChatInfoModal';
import Icon from '@/components/ui/icon';

type View = 'chats' | 'profile' | 'settings' | 'admin' | 'contacts';

export default function Index() {
  const { store } = useStore();
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [view, setView] = useState<View>('chats');
  const [createModal, setCreateModal] = useState<'group' | 'channel' | null>(null);
  const [chatInfoModal, setChatInfoModal] = useState<Chat | null>(null);
  const [mobileShowChat, setMobileShowChat] = useState(false);

  useEffect(() => {
    if (store.currentUser && !activeChatId) {
      const news = store.chats.find(c => c.id === 'folozoger-news-channel');
      if (news) setActiveChatId(news.id);
    }
  }, [store.currentUser]);

  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
    setView('chats');
    setMobileShowChat(true);
  };

  const handleCreated = (chatId: string) => {
    setActiveChatId(chatId);
    setView('chats');
    setMobileShowChat(true);
  };

  if (!store.currentUser) {
    return <AuthPage onAuth={() => {}} />;
  }

  const renderRightPanel = () => {
    if (view === 'profile') return <ProfilePage onBack={() => setView('chats')} />;
    if (view === 'settings') return <SettingsPage onBack={() => setView('chats')} />;
    if (view === 'admin') return <AdminPanel onBack={() => setView('chats')} />;
    if (view === 'contacts') return <ContactsPage onBack={() => setView('chats')} onChat={handleSelectChat} />;

    if (!activeChatId) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center h-full" style={{ background: 'var(--bg-primary)' }}>
          <div className="text-center animate-fade-in">
            <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, var(--accent), #1a3a5c)' }}>
              <span className="text-4xl font-bold text-white">F</span>
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Folozoger</h2>
            <p className="text-sm max-w-xs" style={{ color: 'var(--text-muted)' }}>
              Выберите чат слева или найдите пользователя через поиск
            </p>
            <div className="flex gap-3 mt-6 justify-center">
              <button
                onClick={() => setCreateModal('group')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
                style={{ background: 'var(--accent)', color: '#fff' }}
              >
                <Icon name="Users" size={16} />
                Новая группа
              </button>
              <button
                onClick={() => setCreateModal('channel')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
                style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
              >
                <Icon name="Megaphone" size={16} />
                Канал
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <ChatView
        chatId={activeChatId}
        onBack={() => { setMobileShowChat(false); }}
        onChatInfo={(chat) => setChatInfoModal(chat)}
      />
    );
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-secondary)', fontFamily: "'Golos Text', sans-serif" }}>
      {/* Sidebar */}
      <div className={`
        flex-shrink-0 w-full sm:w-80 lg:w-96 flex flex-col
        ${mobileShowChat && view === 'chats' ? 'hidden sm:flex' : 'flex'}
      `} style={{ height: '100vh' }}>
        <Sidebar
          activeChatId={activeChatId}
          onSelectChat={handleSelectChat}
          onNewGroup={() => setCreateModal('group')}
          onNewChannel={() => setCreateModal('channel')}
          onProfile={() => { setView('profile'); setMobileShowChat(true); }}
          onSettings={() => { setView('settings'); setMobileShowChat(true); }}
          onAdmin={() => { setView('admin'); setMobileShowChat(true); }}
          onContacts={() => { setView('contacts'); setMobileShowChat(true); }}
        />
      </div>

      {/* Divider */}
      <div className="hidden sm:block w-px flex-shrink-0" style={{ background: 'var(--border)' }} />

      {/* Right panel */}
      <div className={`
        flex-1 flex flex-col overflow-hidden
        ${!mobileShowChat && view === 'chats' ? 'hidden sm:flex' : 'flex'}
      `} style={{ height: '100vh' }}>
        {renderRightPanel()}
      </div>

      {/* Mobile bottom nav */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 flex items-center justify-around py-2 z-30"
        style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
        {([
          { icon: 'MessageCircle', label: 'Чаты', key: 'chats', action: () => { setView('chats'); setMobileShowChat(false); } },
          { icon: 'Contact', label: 'Контакты', key: 'contacts', action: () => { setView('contacts'); setMobileShowChat(true); } },
          { icon: 'User', label: 'Профиль', key: 'profile', action: () => { setView('profile'); setMobileShowChat(true); } },
          { icon: 'Settings', label: 'Настройки', key: 'settings', action: () => { setView('settings'); setMobileShowChat(true); } },
        ] as const).map(item => (
          <button key={item.key} onClick={item.action}
            className="flex flex-col items-center gap-0.5 px-3 py-1"
            style={{ color: view === item.key ? 'var(--accent)' : 'var(--text-muted)' }}>
            <Icon name={item.icon} size={22} />
            <span className="text-xs">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Modals */}
      {createModal && (
        <CreateGroupModal
          type={createModal}
          onClose={() => setCreateModal(null)}
          onCreated={handleCreated}
        />
      )}
      {chatInfoModal && (
        <ChatInfoModal
          chat={chatInfoModal}
          onClose={() => setChatInfoModal(null)}
        />
      )}
    </div>
  );
}
