import { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import ProtectedRoute from './components/ProtectedRoute';
import CourseList from './components/CourseList';
import EventCalendar from './components/EventCalendar';
import QuizList from './components/QuizList';
import AuthService from './services/AuthService';

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
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Chargement...</div>;
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
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ marginBottom: '2rem', borderBottom: '2px solid #007bff', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ margin: 0 }}>Dashboard JSP</h1>
              <p style={{ margin: '0.5rem 0', color: '#666' }}>
                Bienvenue, {user.prenom} {user.nom} !
              </p>
              {user.grade && (
                <p style={{ margin: 0, color: '#007bff', fontWeight: 'bold' }}>
                  Grade : {typeof user.grade === 'object' ? user.grade.titre : user.grade}
                </p>
              )}
            </div>
            <button
              onClick={handleLogout}
              style={{
                padding: '0.5rem 1rem',
                background: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Déconnexion
            </button>
          </div>
        </header>

        <section style={{ marginBottom: '2rem' }}>
          <EventCalendar />
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2>Mes cours</h2>
          <CourseList />
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <QuizList />
        </section>

        {process.env.NODE_ENV === 'development' && (
          <details style={{ marginTop: '2rem', padding: '1rem', background: '#f5f5f5', borderRadius: '4px' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>Debug : Profil utilisateur</summary>
            <pre style={{ overflow: 'auto', maxHeight: '400px' }}>
              {JSON.stringify(user, null, 2)}
            </pre>
          </details>
        )}
      </div>
    </ProtectedRoute>
  );
}

export default App;

