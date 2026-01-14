import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import AuthService from '../services/AuthService';

/**
 * Composant pour afficher le planning des événements avec FullCalendar
 */
function EventCalendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    setError('');

    try {
      const eventsData = await AuthService.getMyEvents();
      
      // Transformer les données de l'API au format FullCalendar
      const formattedEvents = Array.isArray(eventsData) 
        ? eventsData.map(event => ({
            id: event.id?.toString() || Math.random().toString(),
            title: event.titre || event.nom || 'Événement sans titre',
            start: event.dateDebut || event.date_debut || event.start,
            end: event.dateFin || event.date_fin || event.end,
            allDay: event.allDay || false,
            backgroundColor: event.couleur || '#3788d8',
            borderColor: event.couleur || '#3788d8',
            textColor: '#ffffff',
            extendedProps: {
              description: event.description || event.descriptif || '',
              lieu: event.lieu || event.adresse || '',
              formateur: event.formateur || '',
            },
          }))
        : [];
      
      setEvents(formattedEvents);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des événements');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event;
    const extendedProps = event.extendedProps;
    
    const details = [
      extendedProps.description && `Description: ${extendedProps.description}`,
      extendedProps.lieu && `Lieu: ${extendedProps.lieu}`,
      extendedProps.formateur && `Formateur: ${extendedProps.formateur}`,
    ].filter(Boolean).join('\n');

    if (details) {
      alert(`${event.title}\n\n${details}`);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        Chargement du planning...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '1rem', background: '#ffe6e6', color: '#d32f2f', borderRadius: '4px' }}>
        <strong>Erreur :</strong> {error}
        <button
          onClick={loadEvents}
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

  return (
    <div style={{ padding: '1rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Mon planning</h2>
        <button
          onClick={loadEvents}
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
      
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        events={events}
        eventClick={handleEventClick}
        locale={frLocale}
        firstDay={1} // Lundi comme premier jour
        height="auto"
        eventDisplay="block"
        editable={false}
        selectable={false}
        dayMaxEvents={true}
        moreLinkClick="popover"
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }}
        slotMinTime="06:00:00"
        slotMaxTime="22:00:00"
        allDaySlot={true}
        weekends={true}
      />
    </div>
  );
}

export default EventCalendar;
