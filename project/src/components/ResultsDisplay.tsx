import React, { useState } from 'react';
import { CheckCircle, User, Mail, Phone, Calendar, Send, MessageCircle, Copy, Check } from 'lucide-react';
import { CopyTextModal } from './CopyTextModal';

interface Assignment {
  nombre: string;
  correo: string;
  whatsapp: string;
  cantidad: number;
  numeros: string[];
  fecha: string;
}

interface ResultsDisplayProps {
  assignment: Assignment;
  onNewRequest: () => void;
  onSearchMode: () => void;
}

export function ResultsDisplay({ assignment, onNewRequest, onSearchMode }: ResultsDisplayProps) {
  const [notifications, setNotifications] = useState({
    email: false,
    whatsapp: false,
    copied: false
  });
  const [showCopyModal, setShowCopyModal] = useState<'email' | 'whatsapp' | null>(null);

  const handleCopyEmail = () => {
    setShowCopyModal('email');
  };

  const handleCopyWhatsApp = () => {
    setShowCopyModal('whatsapp');
  };

  const handleCopyToClipboard = async () => {
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
      setNotifications(prev => ({ ...prev, copied: true }));
      setTimeout(() => setNotifications(prev => ({ ...prev, copied: false })), 3000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  const handleCloseCopyModal = () => {
    setShowCopyModal(null);
  };

  return (
    <>
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-green-600 w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">¡Números Asignados!</h1>
          <p className="text-gray-600 mt-2">Tus números han sido generados exitosamente</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Información del Cliente</h2>
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

        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Tus Números ({assignment.cantidad} números)
          </h2>
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-3">
            {assignment.numeros.map((numero, index) => (
              <div
                key={index}
                className="bg-blue-100 text-blue-800 font-mono font-bold text-lg text-center py-3 px-2 rounded-lg border-2 border-blue-200"
              >
                {numero}
              </div>
            ))}
          </div>
        </div>

        {/* Notification Buttons */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            📤 Copiar Comprobante
          </h3>
          <p className="text-gray-600 text-center mb-6 text-sm">
            Copia el texto listo para enviar por correo o WhatsApp
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={handleCopyEmail}
              className="flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg"
            >
              <Send className="w-5 h-5 mr-2" />
              Copiar Email
            </button>

            <button
              onClick={handleCopyWhatsApp}
              className="flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all bg-green-600 hover:bg-green-700 text-white hover:shadow-lg"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Copiar WhatsApp
            </button>

            <button
              onClick={handleCopyToClipboard}
              className={`flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all ${
                notifications.copied
                  ? 'bg-green-600 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white hover:shadow-lg'
              }`}
            >
              {notifications.copied ? (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  ¡Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5 mr-2" />
                  Copiar Simple
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onNewRequest}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Nueva Solicitud
          </button>
          <button
            onClick={onSearchMode}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Buscar Asignaciones
          </button>
        </div>
      </div>

      {/* Copy Text Modal */}
      {showCopyModal && (
        <CopyTextModal
          isOpen={true}
          assignment={assignment}
          type={showCopyModal}
          onClose={handleCloseCopyModal}
        />
      )}
    </>
  );
}