import React, { useState } from 'react';
import { Search, User, Mail, Phone, Calendar, Hash, ArrowLeft, Filter, Send, MessageCircle, Copy, Check } from 'lucide-react';
import { getAssignmentsByEmail, getAssignmentsByWhatsApp, getAssignmentsByNumber } from '../lib/numberGenerator';
import { CopyTextModal } from './CopyTextModal';
import type { Assignment } from '../lib/supabase';

interface AdminSearchProps {
  onBack: () => void;
}

type SearchType = 'email' | 'whatsapp' | 'number';

export function AdminSearch({ onBack }: AdminSearchProps) {
  const [searchType, setSearchType] = useState<SearchType>('email');
  const [searchValue, setSearchValue] = useState('');
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [notifications, setNotifications] = useState<Record<string, { email: boolean; whatsapp: boolean; copied: boolean }>>({});
  const [showCopyModal, setShowCopyModal] = useState<{ assignmentId: string; type: 'email' | 'whatsapp' } | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchValue.trim()) return;

    setIsLoading(true);
    setError('');
    setHasSearched(true);

    try {
      let data: Assignment[] = [];
      
      switch (searchType) {
        case 'email':
          data = await getAssignmentsByEmail(searchValue.toLowerCase().trim());
          break;
        case 'whatsapp':
          data = await getAssignmentsByWhatsApp(searchValue.trim());
          break;
        case 'number':
          // Validate number input
          const numberValue = searchValue.trim();
          if (!/^\d{1,3}$/.test(numberValue)) {
            setError('Por favor ingresa un número válido (1-3 dígitos)');
            setAssignments([]);
            setIsLoading(false);
            return;
          }
          data = await getAssignmentsByNumber(numberValue);
          break;
      }
      
      setAssignments(data || []);
    } catch (err) {
      console.error('Search error:', err);
      setError(`Error al buscar asignaciones: ${err instanceof Error ? err.message : 'Error desconocido'}`);
      setAssignments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyNotification = (assignment: Assignment, type: 'email' | 'whatsapp') => {
    setShowCopyModal({ assignmentId: assignment.id, type });
  };

  const handleCopyToClipboard = async (assignment: Assignment) => {
    const assignmentId = assignment.id;

    try {
      const numerosFormateados = assignment.numeros.join(', ');
      const fechaFormateada = new Date(assignment.fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const text = `🎟️ NÚMEROS DE RIFA ASIGNADOS

Nombre: ${assignment.nombre}
Correo: ${assignment.correo}
WhatsApp: ${assignment.whatsapp}
Cantidad: ${assignment.cantidad} números
Fecha: ${fechaFormateada}

Números asignados: ${numerosFormateados}`;

      await navigator.clipboard.writeText(text);
      
      setNotifications(prev => ({
        ...prev,
        [assignmentId]: {
          ...prev[assignmentId],
          copied: true
        }
      }));

      setTimeout(() => {
        setNotifications(prev => ({
          ...prev,
          [assignmentId]: {
            ...prev[assignmentId],
            copied: false
          }
        }));
      }, 3000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  const handleCloseCopyModal = () => {
    setShowCopyModal(null);
  };

  const getPlaceholder = () => {
    switch (searchType) {
      case 'email':
        return 'correo@ejemplo.com';
      case 'whatsapp':
        return '+1234567890';
      case 'number':
        return '123';
      default:
        return '';
    }
  };

  const getInputType = () => {
    switch (searchType) {
      case 'email':
        return 'email';
      case 'whatsapp':
        return 'tel';
      case 'number':
        return 'number';
      default:
        return 'text';
    }
  };

  const getSearchLabel = () => {
    switch (searchType) {
      case 'email':
        return 'Correo Electrónico';
      case 'whatsapp':
        return 'Número de WhatsApp';
      case 'number':
        return 'Número Específico (1-999)';
      default:
        return '';
    }
  };

  const getResultsTitle = () => {
    if (assignments.length === 0) return 'No se encontraron resultados';
    
    switch (searchType) {
      case 'email':
        return `Asignaciones para: ${searchValue}`;
      case 'whatsapp':
        return `Asignaciones para WhatsApp: ${searchValue}`;
      case 'number':
        return `¿Quién tiene el número ${searchValue.padStart(3, '0')}?`;
      default:
        return 'Resultados de búsqueda';
    }
  };

  const currentAssignment = showCopyModal ? assignments.find(a => a.id === showCopyModal.assignmentId) : null;

  return (
    <>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </button>

          <div className="text-center mb-8">
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-blue-600 w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Búsqueda Avanzada</h1>
            <p className="text-gray-600 mt-2">Encuentra asignaciones por correo, WhatsApp o número específico</p>
          </div>

          <div className="max-w-2xl mx-auto">
            {/* Selector de tipo de búsqueda */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Filter className="inline w-4 h-4 mr-2" />
                Tipo de búsqueda
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSearchType('email');
                    setSearchValue('');
                    setHasSearched(false);
                    setAssignments([]);
                    setError('');
                  }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    searchType === 'email'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <Mail className="w-5 h-5 mx-auto mb-2" />
                  <div className="font-medium">Correo</div>
                  <div className="text-xs opacity-75">Buscar por email</div>
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setSearchType('whatsapp');
                    setSearchValue('');
                    setHasSearched(false);
                    setAssignments([]);
                    setError('');
                  }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    searchType === 'whatsapp'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <Phone className="w-5 h-5 mx-auto mb-2" />
                  <div className="font-medium">WhatsApp</div>
                  <div className="text-xs opacity-75">Buscar por teléfono</div>
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setSearchType('number');
                    setSearchValue('');
                    setHasSearched(false);
                    setAssignments([]);
                    setError('');
                  }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    searchType === 'number'
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <Hash className="w-5 h-5 mx-auto mb-2" />
                  <div className="font-medium">Número</div>
                  <div className="text-xs opacity-75">Buscar número específico</div>
                </button>
              </div>
            </div>

            {/* Formulario de búsqueda */}
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getSearchLabel()}
                </label>
                <div className="flex gap-3">
                  <input
                    type={getInputType()}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder={getPlaceholder()}
                    min={searchType === 'number' ? '0' : undefined}
                    max={searchType === 'number' ? '999' : undefined}
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                      searchType === 'email' ? 'bg-blue-600 hover:bg-blue-700' :
                      searchType === 'whatsapp' ? 'bg-green-600 hover:bg-green-700' :
                      'bg-purple-600 hover:bg-purple-700'
                    } text-white`}
                  >
                    {isLoading ? 'Buscando...' : 'Buscar'}
                  </button>
                </div>
              </div>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-center">{error}</p>
              </div>
            )}
          </div>
        </div>

        {hasSearched && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">{getResultsTitle()}</h2>
              <p className="text-gray-600">
                {assignments.length === 0 
                  ? `No se encontraron asignaciones para la búsqueda realizada.`
                  : `Se encontraron ${assignments.length} resultado${assignments.length !== 1 ? 's' : ''}.`
                }
              </p>
            </div>

            {assignments.length > 0 && assignments.map((assignment) => (
              <div key={assignment.id} className="bg-white rounded-lg shadow-lg p-8">
                <div className="border-b border-gray-200 pb-6 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-gray-700">{assignment.nombre}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-gray-700">{assignment.correo}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-gray-700">{assignment.whatsapp}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-gray-700">
                        {new Date(assignment.fecha).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Hash className="w-5 h-5 mr-2" />
                    Números Asignados ({assignment.cantidad} números)
                    {searchType === 'number' && (
                      <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                        Contiene: {searchValue.padStart(3, '0')}
                      </span>
                    )}
                  </h3>
                  <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-3">
                    {assignment.numeros.map((numero, index) => (
                      <div
                        key={index}
                        className={`font-mono font-bold text-lg text-center py-3 px-2 rounded-lg border-2 ${
                          searchType === 'number' && numero === searchValue.padStart(3, '0')
                            ? 'bg-purple-200 text-purple-900 border-purple-400 ring-2 ring-purple-300'
                            : 'bg-blue-100 text-blue-800 border-blue-200'
                        }`}
                      >
                        {numero}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notification buttons for each assignment */}
                <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3 text-center">
                    📤 Copiar Comprobante
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={() => handleCopyNotification(assignment, 'email')}
                      className="flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium transition-all bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Send className="w-4 h-4 mr-1" />
                      Copiar Email
                    </button>

                    <button
                      onClick={() => handleCopyNotification(assignment, 'whatsapp')}
                      className="flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium transition-all bg-green-600 hover:bg-green-700 text-white"
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Copiar WhatsApp
                    </button>

                    <button
                      onClick={() => handleCopyToClipboard(assignment)}
                      className={`flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        notifications[assignment.id]?.copied
                          ? 'bg-green-600 text-white'
                          : 'bg-purple-600 hover:bg-purple-700 text-white'
                      }`}
                    >
                      {notifications[assignment.id]?.copied ? (
                        <>
                          <Check className="w-4 h-4 mr-1" />
                          ¡Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-1" />
                          Copiar Simple
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Copy Text Modal */}
      {showCopyModal && currentAssignment && (
        <CopyTextModal
          isOpen={true}
          assignment={currentAssignment}
          type={showCopyModal.type}
          onClose={handleCloseCopyModal}
        />
      )}
    </>
  );
}