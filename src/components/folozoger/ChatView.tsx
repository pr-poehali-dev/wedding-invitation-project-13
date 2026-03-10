import { useState, useRef, useEffect } from 'react';
import {
  useStore, sendMessage, deleteMessage, getChatMessages,
  getUserById, leaveChat, Chat, Message, ADMIN_USERNAME, SYSTEM_CHANNEL_ID
} from '@/store/folozoger';
import Avatar from './Avatar';
import Icon from '@/components/ui/icon';

interface ChatViewProps {
  chatId: string;
  onBack?: () => void;
  onChatInfo?: (chat: Chat) => void;
}

export default function ChatView({ chatId, onBack, onChatInfo }: ChatViewProps) {
  const { store } = useStore();
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; msg: Message } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const currentUser = store.currentUser;
  const chat = store.chats.find(c => c.id === chatId);
  const messages = getChatMessages(chatId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, chatId]);

  useEffect(() => {
    setReplyTo(null);
    setText('');
  }, [chatId]);

  if (!currentUser || !chat) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="text-center animate-fade-in">
          <div className="text-6xl mb-4">💬</div>
          <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Folozoger</h2>
          <p style={{ color: 'var(--text-muted)' }} className="text-sm">Выберите чат, чтобы начать общение</p>
        </div>
      </div>
    );
  }

  const getChatName = () => {
    if (chat.type === 'private') {
      const otherId = chat.members.find(m => m !== currentUser.id);
      const other = otherId ? getUserById(otherId) : null;
      return other?.displayName || other?.username || chat.name;
    }
    return chat.name;
  };

  const getSubtitle = () => {
    if (chat.type === 'private') {
      const otherId = chat.members.find(m => m !== currentUser.id);
      const other = otherId ? getUserById(otherId) : null;
      if (!other) return 'Пользователь удалён';
      return other.online ? 'в сети' : `был(а) ${new Date(other.lastSeen).toLocaleString('ru', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}`;
    }
    if (chat.type === 'channel') return `${chat.members.length} подписчиков`;
    return `${chat.members.length} участников`;
  };

  const canSend = () => {
    if (chat.type === 'channel') {
      return chat.owner === currentUser.id || chat.admins.includes(currentUser.id);
    }
    return true;
  };

  const isAdmin = chat.admins.includes(currentUser.id) || chat.owner === currentUser.id || currentUser.username === ADMIN_USERNAME;

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(chatId, text.trim(), currentUser.id);
    setText('');
    setReplyTo(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleContextMenu = (e: React.MouseEvent, msg: Message) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, msg });
  };

  const handleDeleteMsg = (msg: Message) => {
    deleteMessage(chatId, msg.id, currentUser.id);
    setContextMenu(null);
  };

  const formatTime = (ts: string) => {
    return new Date(ts).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleDateString('ru', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const groupedMessages = () => {
    const groups: { date: string; messages: Message[] }[] = [];
    let currentDate = '';
    messages.forEach(msg => {
      const date = formatDate(msg.timestamp);
      if (date !== currentDate) {
        currentDate = date;
        groups.push({ date, messages: [msg] });
      } else {
        groups[groups.length - 1].messages.push(msg);
      }
    });
    return groups;
  };

  const canLeave = !chat.noLeave && chat.id !== SYSTEM_CHANNEL_ID && chat.type !== 'private' && chat.owner !== currentUser.id;

  const otherUserId = chat.type === 'private' ? chat.members.find(m => m !== currentUser.id) : null;
  const otherUser = otherUserId ? getUserById(otherUserId) : null;

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--bg-primary)' }} onClick={() => setContextMenu(null)}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-primary)' }}>
        {onBack && (
          <button onClick={onBack} className="mr-1" style={{ color: 'var(--accent)' }}>
            <Icon name="ArrowLeft" size={20} />
          </button>
        )}
        <button onClick={() => onChatInfo && onChatInfo(chat)} className="flex items-center gap-3 flex-1 min-w-0">
          <Avatar
            name={getChatName()}
            type={chat.type !== 'private' ? chat.type : undefined}
            online={otherUser?.online}
            size={40}
          />
          <div className="flex-1 min-w-0 text-left">
            <div className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{getChatName()}</div>
            <div className="text-xs truncate" style={{ color: otherUser?.online ? 'var(--accent)' : 'var(--text-secondary)' }}>
              {getSubtitle()}
            </div>
          </div>
        </button>
        <div className="flex items-center gap-1">
          {canLeave && (
            <button
              onClick={() => leaveChat(chatId, currentUser.id)}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
              style={{ color: 'var(--danger)' }}
              title="Покинуть"
            >
              <Icon name="LogOut" size={18} />
            </button>
          )}
          <button className="w-9 h-9 rounded-full flex items-center justify-center" style={{ color: 'var(--text-secondary)' }}>
            <Icon name="Phone" size={18} />
          </button>
          <button className="w-9 h-9 rounded-full flex items-center justify-center" style={{ color: 'var(--text-secondary)' }}>
            <Icon name="Search" size={18} />
          </button>
          <button className="w-9 h-9 rounded-full flex items-center justify-center" style={{ color: 'var(--text-secondary)' }}>
            <Icon name="MoreVertical" size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-2 py-16">
            <div className="text-4xl">👋</div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {chat.type === 'channel' ? 'В канале пока нет постов' : 'Начните общение первым!'}
            </p>
          </div>
        )}
        {groupedMessages().map(group => (
          <div key={group.date}>
            <div className="flex justify-center my-3">
              <span className="px-3 py-1 rounded-full text-xs" style={{ background: 'rgba(0,0,0,0.3)', color: 'var(--text-secondary)' }}>
                {group.date}
              </span>
            </div>
            {group.messages.map((msg, idx) => {
              const isOwn = msg.senderId === currentUser.id;
              const sender = getUserById(msg.senderId);
              const showAvatar = !isOwn && chat.type !== 'private' &&
                (idx === 0 || group.messages[idx - 1]?.senderId !== msg.senderId);
              const replyMsg = msg.replyTo ? messages.find(m => m.id === msg.replyTo) : null;

              return (
                <div
                  key={msg.id}
                  className={`flex mb-1 animate-message-in ${isOwn ? 'justify-end' : 'justify-start'}`}
                  onContextMenu={e => handleContextMenu(e, msg)}
                >
                  {!isOwn && chat.type !== 'private' && (
                    <div className="w-8 mr-2 flex-shrink-0">
                      {showAvatar && sender && <Avatar name={sender.displayName} size={32} />}
                    </div>
                  )}
                  <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                    {!isOwn && chat.type !== 'private' && showAvatar && sender && (
                      <span className="text-xs font-semibold mb-1 px-1" style={{ color: 'var(--accent)' }}>
                        {sender.displayName}
                      </span>
                    )}
                    <div
                      className="px-3 py-2 rounded-2xl text-sm"
                      style={{
                        background: isOwn ? 'var(--bg-message-out)' : 'var(--bg-message-in)',
                        color: 'var(--text-primary)',
                        borderRadius: isOwn ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        wordBreak: 'break-word',
                      }}
                    >
                      {replyMsg && (
                        <div className="mb-1 px-2 py-1 rounded-lg text-xs border-l-2" style={{ borderColor: 'var(--accent)', background: 'rgba(0,0,0,0.2)', color: 'var(--text-secondary)' }}>
                          {replyMsg.text.slice(0, 60)}{replyMsg.text.length > 60 ? '...' : ''}
                        </div>
                      )}
                      {msg.text}
                      <div className="flex items-center justify-end gap-1 mt-0.5">
                        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>{formatTime(msg.timestamp)}</span>
                        {isOwn && <Icon name="CheckCheck" size={12} style={{ color: 'rgba(255,255,255,0.5)' } as React.CSSProperties} />}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Context menu */}
      {contextMenu && (
        <div
          className="fixed z-50 rounded-xl shadow-2xl animate-scale-in overflow-hidden"
          style={{
            left: Math.min(contextMenu.x, window.innerWidth - 200),
            top: Math.min(contextMenu.y, window.innerHeight - 150),
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-strong)',
            minWidth: 160,
          }}
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={() => { setReplyTo(contextMenu.msg); setContextMenu(null); inputRef.current?.focus(); }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm transition-all"
            style={{ color: 'var(--text-primary)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-tertiary)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <Icon name="Reply" size={16} style={{ color: 'var(--accent)' } as React.CSSProperties} />
            Ответить
          </button>
          {(contextMenu.msg.senderId === currentUser.id || isAdmin) && (
            <button
              onClick={() => handleDeleteMsg(contextMenu.msg)}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm transition-all"
              style={{ color: 'var(--danger)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(229,57,53,0.1)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <Icon name="Trash2" size={16} />
              Удалить
            </button>
          )}
        </div>
      )}

      {/* Reply preview */}
      {replyTo && (
        <div className="flex items-center gap-3 px-4 py-2" style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
          <div className="flex-1 border-l-2 pl-3 py-0.5" style={{ borderColor: 'var(--accent)' }}>
            <div className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>
              {getUserById(replyTo.senderId)?.displayName}
            </div>
            <div className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{replyTo.text}</div>
          </div>
          <button onClick={() => setReplyTo(null)} style={{ color: 'var(--text-muted)' }}>
            <Icon name="X" size={16} />
          </button>
        </div>
      )}

      {/* Input */}
      {canSend() ? (
        <div className="flex items-end gap-2 px-3 py-3" style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
          <button className="w-9 h-9 flex-shrink-0 flex items-center justify-center" style={{ color: 'var(--text-muted)' }}>
            <Icon name="Paperclip" size={20} />
          </button>
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Сообщение..."
              rows={1}
              className="w-full px-4 py-2.5 rounded-2xl text-sm outline-none resize-none"
              style={{
                background: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                border: 'none',
                maxHeight: 120,
                lineHeight: '1.5',
              }}
              onInput={e => {
                const t = e.target as HTMLTextAreaElement;
                t.style.height = 'auto';
                t.style.height = Math.min(t.scrollHeight, 120) + 'px';
              }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!text.trim()}
            className="w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center transition-all"
            style={{
              background: text.trim() ? 'var(--accent)' : 'var(--bg-tertiary)',
              color: text.trim() ? '#fff' : 'var(--text-muted)',
            }}
          >
            <Icon name="Send" size={18} />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-center py-4" style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {chat.noLeave ? '📌 Только администраторы могут писать в этот канал' : 'Только администраторы могут писать'}
          </p>
        </div>
      )}
    </div>
  );
}
