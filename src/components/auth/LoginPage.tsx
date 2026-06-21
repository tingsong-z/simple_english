import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import './LoginPage.css';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const { users, createUser, login } = useAuthStore();
  const navigate = useNavigate();

  const handleCreate = () => {
    const name = username.trim();
    if (!name) return;
    createUser(name);
    setUsername('');
    navigate('/', { replace: true });
  };

  const handleSelect = (userId: string) => {
    login(userId);
    navigate('/', { replace: true });
  };

  return (
    <div className="login-page">
      <h1 className="login-page__title">Ogden 850</h1>
      <p className="login-page__subtitle">选择一个用户开始学习，或创建一个新用户</p>

      <div className="login-page__form">
        <input
          className="login-page__input"
          type="text"
          placeholder="输入用户名…"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          maxLength={20}
          autoFocus
        />
        <button className="login-page__btn" onClick={handleCreate}>
          进入
        </button>
      </div>

      {users.length > 0 && (
        <div className="login-page__users">
          <div className="login-page__users-title">已有用户</div>
          {users.map((user) => (
            <div
              key={user.id}
              className="login-page__user-card"
              onClick={() => handleSelect(user.id)}
            >
              <span className="login-page__user-name">{user.username}</span>
              <span className="login-page__user-arrow">→</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
