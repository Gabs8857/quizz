import { useState, useEffect } from 'react';
import api from '../api/axios';
import Quiz from './Quiz';

/**
 * Composant pour afficher la liste des quiz disponibles
 */
function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/quiz');
      setQuizzes(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des quiz');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuizSelect = (quiz) => {
    setSelectedQuiz(quiz);
  };

  const handleQuizComplete = () => {
    setSelectedQuiz(null);
    loadQuizzes(); // Recharger la liste après avoir terminé un quiz
  };

  const handleBack = () => {
    setSelectedQuiz(null);
  };

  // Si un quiz est sélectionné, afficher le composant Quiz
  if (selectedQuiz) {
    return (
      <div>
        <button
          onClick={handleBack}
          style={{
            marginBottom: '1rem',
            padding: '0.5rem 1rem',
            background: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          ← Retour à la liste
        </button>
        <Quiz quizId={selectedQuiz.id} onComplete={handleQuizComplete} />
      </div>
    );
  }

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Chargement des quiz...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '1rem', background: '#ffe6e6', color: '#d32f2f', borderRadius: '4px' }}>
        <strong>Erreur :</strong> {error}
        <button
          onClick={loadQuizzes}
          style={{
            marginLeft: '1rem',
            padding: '0.5rem 1rem',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (quizzes.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
        Aucun quiz disponible pour le moment.
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Quiz disponibles</h2>
        <button
          onClick={loadQuizzes}
          style={{
            padding: '0.5rem 1rem',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.9rem',
          }}
        >
          🔄 Actualiser
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            style={{
              padding: '1.5rem',
              border: '1px solid #ddd',
              borderRadius: '8px',
              background: 'white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            }}
            onClick={() => handleQuizSelect(quiz)}
          >
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#007bff' }}>
              {quiz.titre || quiz.nom || `Quiz #${quiz.id}`}
            </h3>
            {quiz.description && (
              <p style={{ margin: '0 0 1rem 0', color: '#666', fontSize: '0.9rem' }}>
                {quiz.description}
              </p>
            )}
            {quiz.nombreQuestions && (
              <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: '#888' }}>
                📝 {quiz.nombreQuestions} question{quiz.nombreQuestions > 1 ? 's' : ''}
              </p>
            )}
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
              <button
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuizSelect(quiz);
                }}
              >
                Commencer le quiz
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuizList;
