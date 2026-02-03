'use client';

import { useState } from 'react';
import { getFirestore, collection, setDoc, doc } from 'firebase/firestore';
import app from '@/services/firebase';
import { fetchParticipants } from '@/services/queries/fetchParticipants';

const db = getFirestore(app);

export default function UploadParticipantsPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function uploadParticipants() {
    setLoading(true);
    setMessage(null);

    try {
      const participants = await fetchParticipants();
      for (const person of participants) {
        const personData = {
          ...person,
          date: person.date.toString(),
        };

        const ref = doc(collection(db, 'participants'), String(person.id));
        await setDoc(ref, personData);
      }

      setMessage('Participantes enviados com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar:', error);
      setMessage('Erro ao enviar participantes.');
    } finally {
      setLoading(false);
    }
  }
  if (process.env.NODE_ENV !== 'development') {
    return (
      <p>Esta página só está disponível em ambiente de desenvolvimento.</p>
    );
  }
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Enviar Participantes para o Firestore</h1>
      <button
        onClick={uploadParticipants}
        disabled={loading}
        style={{
          padding: '1rem 2rem',
          fontSize: '1rem',
          cursor: loading ? 'not-allowed' : 'pointer',
          background: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
        }}
      >
        {loading ? 'Enviando...' : 'Enviar participantes'}
      </button>

      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </div>
  );
}
