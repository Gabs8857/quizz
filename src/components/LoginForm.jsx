import { useState } from 'react';
import AuthService from '../services/AuthService';

/**
 * Composant de formulaire de connexion
 */
function LoginForm({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { user } = await AuthService.login(email, password);
      
      if (onLoginSuccess) {
        onLoginSuccess(user);
      } else {
        window.location.href = '/dashboard';
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="lucas.durand@gmail.com"
          required
          disabled={loading}
          style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
        />
      </div>

      <div>
        <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem' }}>Mot de passe</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          disabled={loading}
          style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
        />
      </div>

      {error && (
        <div style={{ color: 'red', padding: '0.5rem', background: '#ffe6e6', borderRadius: '4px' }}>
          {error}
        </div>
      )}

      <button 
        type="submit" 
        disabled={loading}
        style={{
          padding: '0.75rem',
          background: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '1rem',
        }}
      >
        {loading ? 'Connexion...' : 'Se connecter'}
      </button>
    </form>
  );
}

export default LoginForm;
