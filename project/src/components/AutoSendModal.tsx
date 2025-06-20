import React, { useState } from 'react';
import { Send, MessageCircle, X, CheckCircle, Clock, Copy } from 'lucide-react';
import { CopyTextModal } from './CopyTextModal';

interface Assignment {
  nombre: string;
  correo: string;
  whatsapp: string;
  cantidad: number;
  numeros: string[];
  fecha: string;
}

interface AutoSendModalProps {
  isOpen: boolean;
  assignment: Assignment;
  onClose: () => void;
  onSendNow: () => void;
  onSendLater: () => void;
}

export function AutoSendModal({ isOpen, assignment, onClose, onSendNow, onSendLater }: AutoSendModalProps) {
  const [showCopyModal, setShowCopyModal] = useState<'email' | 'whatsapp' | null>(null);

  if (!isOpen) return null;

  const handleCopyEmail = () => {
    setShowCopyModal('email');
  };

  const handleCopyWhatsApp = () => {
    setShowCopyModal('whatsapp');
  };

  const handleCloseCopyModal = () => {
    setShowCopyModal(null);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6 rounded-t-xl relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center">
              <div className="bg-white bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold">¡Números Generados!</h2>
              <p className="text-green-100 mt-1">
                {assignment.cantidad} números asignados a {assignment.nombre}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                📤 ¿Cómo quieres enviar el comprobante?
              </h3>
              <p className="text-gray-600 text-sm">
                Te ayudamos a copiar el texto listo para enviar por email o WhatsApp
              </p>
            </div>

            {/* Preview of numbers */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="text-sm text-gray-600 mb-2">Números asignados:</div>
              <div className="flex flex-wrap gap-2">
                {assignment.numeros.slice(0, 6).map((numero, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 font-mono text-xs px-2 py-1 rounded"
                  >
                    {numero}
                  </span>
                ))}
                {assignment.numeros.length > 6 && (
                  <span className="text-gray-500 text-xs px-2 py-1">
                    +{assignment.numeros.length - 6} más
                  </span>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <button
                onClick={handleCopyEmail}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center"
              >
                <Send className="w-4 h-4 mr-2" />
                <span className="mr-2">Copiar texto para Email</span>
                <Copy className="w-4 h-4" />
              </button>

              <button
                onClick={handleCopyWhatsApp}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                <span className="mr-2">Copiar texto para WhatsApp</span>
                <Copy className="w-4 h-4" />
              </button>

              <button
                onClick={onSendLater}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                <Clock className="w-4 h-4 mr-2" />
                Ir a resultados (copiar después)
              </button>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                💡 También podrás copiar el texto más tarde desde la pantalla de resultados
              </p>
            </div>
          </div>
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