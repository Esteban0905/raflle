import React, { useState } from 'react';
import { Copy, Check, Mail, MessageCircle, X } from 'lucide-react';

interface Assignment {
  nombre: string;
  correo: string;
  whatsapp: string;
  cantidad: number;
  numeros: string[];
  fecha: string;
}

interface CopyTextModalProps {
  isOpen: boolean;
  assignment: Assignment;
  type: 'email' | 'whatsapp';
  onClose: () => void;
}

export function CopyTextModal({ isOpen, assignment, type, onClose }: CopyTextModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const numerosFormateados = assignment.numeros.join(', ');
  const fechaFormateada = new Date(assignment.fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const emailContent = {
    subject: `🎟️ Tus números de rifa han sido asignados`,
    body: `Hola ${assignment.nombre},

¡Excelente! Tus números para la rifa han sido asignados exitosamente.

📋 DETALLES DE TU ASIGNACIÓN:
• Nombre: ${assignment.nombre}
• Correo: ${assignment.correo}
• WhatsApp: ${assignment.whatsapp}
• Cantidad de números: ${assignment.cantidad}
• Fecha de asignación: ${fechaFormateada}

🎯 TUS NÚMEROS ASIGNADOS:
${numerosFormateados}

¡Guarda este correo como comprobante de tu participación!

¡Mucha suerte! 🍀`
  };

  const whatsappContent = `🎟️ *NÚMEROS DE RIFA ASIGNADOS*

Hola *${assignment.nombre}*,

¡Excelente! Tus números para la rifa han sido asignados exitosamente.

📋 *DETALLES DE TU ASIGNACIÓN:*
• Nombre: ${assignment.nombre}
• Correo: ${assignment.correo}
• WhatsApp: ${assignment.whatsapp}
• Cantidad de números: ${assignment.cantidad}
• Fecha: ${fechaFormateada}

🎯 *TUS NÚMEROS ASIGNADOS:*
${numerosFormateados}

¡Guarda este mensaje como comprobante de tu participación!

¡Mucha suerte! 🍀`;

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isEmail = type === 'email';
  const content = isEmail ? emailContent.body : whatsappContent;
  const title = isEmail ? 'Contenido del Email' : 'Mensaje de WhatsApp';
  const icon = isEmail ? Mail : MessageCircle;
  const bgColor = isEmail ? 'from-blue-500 to-blue-600' : 'from-green-500 to-green-600';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className={`bg-gradient-to-r ${bgColor} text-white p-6 relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center">
            {React.createElement(icon, { className: "w-6 h-6 mr-3" })}
            <div>
              <h2 className="text-xl font-bold">{title}</h2>
              <p className="text-white text-opacity-90 text-sm">
                Copia este texto y pégalo en tu aplicación
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {isEmail && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Asunto del correo:
              </label>
              <div className="bg-gray-50 rounded-lg p-3 border">
                <div className="flex items-center justify-between">
                  <span className="text-gray-800 flex-1">{emailContent.subject}</span>
                  <button
                    onClick={() => handleCopy(emailContent.subject)}
                    className="ml-2 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
                    title="Copiar asunto"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isEmail ? 'Contenido del mensaje:' : 'Mensaje completo:'}
            </label>
            <div className="bg-gray-50 rounded-lg p-4 border relative">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans leading-relaxed">
                {content}
              </pre>
              <button
                onClick={() => handleCopy(content)}
                className="absolute top-3 right-3 p-2 bg-white text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg shadow-sm transition-colors border"
                title="Copiar mensaje completo"
              >
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Copy button */}
          <div className="flex gap-3">
            <button
              onClick={() => handleCopy(content)}
              className={`flex-1 bg-gradient-to-r ${bgColor} hover:opacity-90 text-white font-medium py-3 px-4 rounded-lg transition-all flex items-center justify-center`}
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  ¡Copiado al portapapeles!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5 mr-2" />
                  Copiar {isEmail ? 'Email' : 'WhatsApp'}
                </>
              )}
            </button>
            
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
            >
              Cerrar
            </button>
          </div>

          {/* Instructions */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">📝 Instrucciones:</h4>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Haz clic en "Copiar {isEmail ? 'Email' : 'WhatsApp'}" para copiar el texto</li>
              <li>2. Abre tu aplicación de {isEmail ? 'correo electrónico' : 'WhatsApp'}</li>
              <li>3. {isEmail ? 'Crea un nuevo correo y pega el contenido' : 'Busca el contacto y pega el mensaje'}</li>
              <li>4. {isEmail ? `Usa el asunto: "${emailContent.subject}"` : 'Envía el mensaje'}</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}