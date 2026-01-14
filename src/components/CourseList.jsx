import { useState, useEffect } from 'react';
import AuthService from '../services/AuthService';
import api from '../api/axios';
import CourseDownloadButton from './CourseDownloadButton';

/**
 * Composant pour afficher la liste des cours
 * Affiche les cours suivis et tous les cours disponibles
 */
function CourseList() {
  const [myCourses, setMyCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('my'); // 'my' ou 'all'

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    setError('');

    try {
      // Charger les cours suivis
      const myCoursesData = await AuthService.getMyCourses();
      setMyCourses(Array.isArray(myCoursesData) ? myCoursesData : []);

      // Charger tous les cours disponibles
      const response = await api.get('/cours');
      setAllCourses(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des cours');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (courseId) => {
    try {
      await api.post(`/cours/${courseId}/suivre`);
      // Recharger les cours
      await loadCourses();
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de l\'inscription');
    }
  };

  const handleUnsubscribe = async (courseId) => {
    try {
      await api.delete(`/cours/${courseId}/suivre`);
      // Recharger les cours
      await loadCourses();
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de la désinscription');
    }
  };

  const isSubscribed = (courseId) => {
    return myCourses.some(course => course.id === courseId);
  };

  if (loading) {
    return <div>Chargement des cours...</div>;
  }

  if (error) {
    return (
      <div style={{ color: 'red', padding: '1rem' }}>
        <p>Erreur : {error}</p>
        <button onClick={loadCourses}>Réessayer</button>
      </div>
    );
  }

  const coursesToDisplay = activeTab === 'my' ? myCourses : allCourses;

  return (
    <div style={{ marginTop: '2rem' }}>
      <div style={{ marginBottom: '1rem', borderBottom: '1px solid #ccc' }}>
        <button
          onClick={() => setActiveTab('my')}
          style={{
            padding: '0.5rem 1rem',
            marginRight: '0.5rem',
            border: 'none',
            background: activeTab === 'my' ? '#007bff' : '#f0f0f0',
            color: activeTab === 'my' ? 'white' : 'black',
            cursor: 'pointer',
          }}
        >
          Mes cours ({myCourses.length})
        </button>
        <button
          onClick={() => setActiveTab('all')}
          style={{
            padding: '0.5rem 1rem',
            border: 'none',
            background: activeTab === 'all' ? '#007bff' : '#f0f0f0',
            color: activeTab === 'all' ? 'white' : 'black',
            cursor: 'pointer',
          }}
        >
          Tous les cours ({allCourses.length})
        </button>
      </div>

      {coursesToDisplay.length === 0 ? (
        <p>Aucun cours disponible.</p>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {coursesToDisplay.map((course) => (
            <div
              key={course.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '1rem',
                background: '#f9f9f9',
              }}
            >
              <h3 style={{ marginTop: 0 }}>{course.titre}</h3>
              {course.description && (
                <p style={{ color: '#666' }}>{course.description}</p>
              )}
              {course.type && (
                <p>
                  <strong>Type :</strong> {course.type.libelle || course.type}
                </p>
              )}
              {course.formateur && (
                <p>
                  <strong>Formateur :</strong>{' '}
                  {typeof course.formateur === 'object'
                    ? `${course.formateur.nom || ''} ${course.formateur.prenom || ''}`.trim()
                    : course.formateur}
                </p>
              )}

              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                {isSubscribed(course.id) ? (
                  <>
                    <CourseDownloadButton
                      courseId={course.id}
                      fileName={course.fichier || `cours-${course.id}.pdf`}
                    >
                      📄 Ouvrir
                    </CourseDownloadButton>
                    <button
                      onClick={() => handleUnsubscribe(course.id)}
                      style={{
                        padding: '0.5rem 1rem',
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      Se désinscrire
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleSubscribe(course.id)}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    S'inscrire
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CourseList;


