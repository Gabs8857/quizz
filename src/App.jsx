import { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import ProtectedRoute from './components/ProtectedRoute';
import QuizList from './components/QuizList';
import AuthService from './services/AuthService';
import './styles/quiz.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (AuthService.isAuthenticated()) {
        try {
          const currentUser = await AuthService.getCurrentUser();
          setUser(currentUser);
        } catch (error) {
          console.error('Erreur:', error);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    AuthService.logout();
    setUser(null);
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  if (!user) {
    return (
      <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
        <h1>Connexion JSP</h1>
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="app-container">
        <header className="header">
          <div className="header-content">
            <div className="header-title">
              <div>
                <h1>Dashboard JSP</h1>
                <div className="user-info">
                  Bienvenue, {user.prenom} {user.nom}
                  {user.grade && (
                    <span style={{ marginLeft: '1rem', fontWeight: 'bold' }}>
                      • Grade : {typeof user.grade === 'object' ? user.grade.titre : user.grade}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button onClick={handleLogout} className="btn-logout">
              Déconnexion
            </button>
          </div>
        </header>

        <main className="main-content">
          <QuizList />
        </main>
      </div>
    </ProtectedRoute>
  );
}

export default App;
