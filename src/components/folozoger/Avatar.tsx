interface AvatarProps {
  name: string;
  avatar?: string;
  size?: number;
  online?: boolean;
  type?: 'private' | 'group' | 'channel';
}

const colors = [
  '#c0392b', '#e74c3c', '#e67e22', '#f39c12',
  '#27ae60', '#2ecc71', '#16a085', '#1abc9c',
  '#2980b9', '#3498db', '#8e44ad', '#9b59b6',
  '#d35400', '#e91e63', '#00bcd4', '#009688',
];

function getColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function getInitials(name: string, type?: string) {
  if (type === 'channel') return '📢';
  if (type === 'group') {
    const words = name.split(' ');
    return words.length > 1
      ? (words[0][0] + words[1][0]).toUpperCase()
      : name.slice(0, 2).toUpperCase();
  }
  const words = name.split(' ');
  return words.length > 1
    ? (words[0][0] + words[1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

export default function Avatar({ name, avatar, size = 48, online, type }: AvatarProps) {
  const initials = getInitials(name, type);
  const color = getColor(name);

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      {avatar ? (
        <img
          src={avatar}
          alt={name}
          className="rounded-full object-cover w-full h-full"
        />
      ) : (
        <div
          className="rounded-full flex items-center justify-center font-semibold text-white"
          style={{
            width: size,
            height: size,
            background: type === 'channel' ? 'linear-gradient(135deg, #2980b9, #1abc9c)' : color,
            fontSize: type === 'channel' ? size * 0.45 : size * 0.35,
            flexShrink: 0,
          }}
        >
          {initials}
        </div>
      )}
      {online && (
        <div
          className="absolute bottom-0 right-0 rounded-full"
          style={{
            width: size * 0.28,
            height: size * 0.28,
            background: 'var(--online)',
            border: '2px solid var(--bg-primary)',
          }}
        />
      )}
    </div>
  );
}
