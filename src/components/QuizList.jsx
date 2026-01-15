import { useState, useEffect } from 'react';
import api from '../api/axios';
import Quiz from './Quiz';
import '../styles/quiz.css';

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
    loadQuizzes();
  };

  const handleBack = () => {
    setSelectedQuiz(null);
  };

  if (selectedQuiz) {
    return (
      <div>
        <button onClick={handleBack} className="btn-secondary" style={{ marginBottom: '1rem' }}>
          ← Retour à la liste
        </button>
        <Quiz quizId={selectedQuiz.id} onComplete={handleQuizComplete} />
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Chargement des quiz...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <strong>Erreur :</strong> {error}
        <button onClick={loadQuizzes} className="btn-primary" style={{ marginLeft: '1rem' }}>
          Réessayer
        </button>
      </div>
    );
  }

  if (quizzes.length === 0) {
    return <div className="loading">Aucun quiz disponible pour le moment.</div>;
  }

  const quizIcons = ['🚑', '🔥', '💊', '🏥', '⛑️', '🚨', '📋', '🎯', '✅'];

  return (
    <div>
      <h2 style={{ fontSize: '2rem', color: '#1E1E5C', marginBottom: '1rem' }}>Quiz disponibles</h2>
      <div className="quiz-grid">
        {quizzes.map((quiz, index) => (
          <div
            key={quiz.id}
            className={`quiz-card ${index % 2 === 0 ? '' : 'blue'}`}
            onClick={() => handleQuizSelect(quiz)}
          >
            <div className="quiz-icon">
              {quizIcons[index % quizIcons.length]}
            </div>
            <div className="quiz-title">
              {quiz.titre || quiz.nom || `Quiz #${quiz.id}`}
            </div>
            {quiz.description && (
              <div className="quiz-description">
                {quiz.description}
              </div>
            )}
            {quiz.nombreQuestions && (
              <div className="quiz-info">
                📝 {quiz.nombreQuestions} question{quiz.nombreQuestions > 1 ? 's' : ''}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuizList;
