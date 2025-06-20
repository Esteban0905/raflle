import React, { useState } from 'react';
import { ClientForm } from './components/ClientForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { AdminSearch } from './components/AdminSearch';
import { AutoSendModal } from './components/AutoSendModal';
import { generateUniqueNumbers, saveAssignment } from './lib/numberGenerator';

type AppState = 'form' | 'results' | 'search';

interface Assignment {
  nombre: string;
  correo: string;
  whatsapp: string;
  cantidad: number;
  numeros: string[];
  fecha: string;
}

function App() {
  const [currentState, setCurrentState] = useState<AppState>('form');
  const [currentAssignment, setCurrentAssignment] = useState<Assignment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAutoSendModal, setShowAutoSendModal] = useState(false);

  const handleFormSubmit = async (formData: {
    nombre: string;
    correo: string;
    whatsapp: string;
    cantidad: number;
  }) => {
    setIsLoading(true);
    setError('');

    try {
      // Generate unique numbers
      const numbers = await generateUniqueNumbers(formData.cantidad);
      
      // Save to database
      await saveAssignment(
        formData.nombre,
        formData.correo,
        formData.whatsapp,
        formData.cantidad,
        numbers
      );

      // Create assignment object for display
      const assignment: Assignment = {
        ...formData,
        numeros: numbers,
        fecha: new Date().toISOString()
      };

      setCurrentAssignment(assignment);
      
      // Show auto-send modal instead of going directly to results
      setShowAutoSendModal(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error generating numbers';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutoSendNow = () => {
    // Just close modal and go to results - the modal handles the copying
    setShowAutoSendModal(false);
    setCurrentState('results');
  };

  const handleAutoSendLater = () => {
    setShowAutoSendModal(false);
    setCurrentState('results');
  };

  const handleCloseModal = () => {
    setShowAutoSendModal(false);
    setCurrentState('results');
  };

  const handleNewRequest = () => {
    setCurrentState('form');
    setCurrentAssignment(null);
    setError('');
    setShowAutoSendModal(false);
  };

  const handleSearchMode = () => {
    setCurrentState('search');
    setError('');
    setShowAutoSendModal(false);
  };

  const handleBackToForm = () => {
    setCurrentState('form');
    setError('');
    setShowAutoSendModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      {error && (
        <div className="max-w-md mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-center">{error}</p>
          <button
            onClick={() => setError('')}
            className="mt-2 w-full text-red-600 hover:text-red-800 text-sm underline"
          >
            Cerrar
          </button>
        </div>
      )}

      {currentState === 'form' && (
        <ClientForm 
          onSubmit={handleFormSubmit} 
          isLoading={isLoading}
          onSearchMode={handleSearchMode}
        />
      )}

      {currentState === 'results' && currentAssignment && (
        <ResultsDisplay
          assignment={currentAssignment}
          onNewRequest={handleNewRequest}
          onSearchMode={handleSearchMode}
        />
      )}

      {currentState === 'search' && (
        <AdminSearch onBack={handleBackToForm} />
      )}

      {/* Auto-send Modal */}
      {currentAssignment && (
        <AutoSendModal
          isOpen={showAutoSendModal}
          assignment={currentAssignment}
          onClose={handleCloseModal}
          onSendNow={handleAutoSendNow}
          onSendLater={handleAutoSendLater}
        />
      )}
    </div>
  );
}

export default App;