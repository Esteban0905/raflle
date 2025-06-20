// Notification utilities for sending assignments via email and WhatsApp

export interface NotificationData {
  nombre: string;
  correo: string;
  whatsapp: string;
  cantidad: number;
  numeros: string[];
  fecha: string;
}

export async function sendEmailNotification(data: NotificationData): Promise<boolean> {
  try {
    // Format numbers for display
    const numerosFormateados = data.numeros.join(', ');
    const fechaFormateada = new Date(data.fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Create email content
    const subject = `🎟️ Tus números de rifa han sido asignados`;
    const body = `Hola ${data.nombre},

¡Excelente! Tus números para la rifa han sido asignados exitosamente.

📋 DETALLES DE TU ASIGNACIÓN:
• Nombre: ${data.nombre}
• Correo: ${data.correo}
• WhatsApp: ${data.whatsapp}
• Cantidad de números: ${data.cantidad}
• Fecha de asignación: ${fechaFormateada}

🎯 TUS NÚMEROS ASIGNADOS:
${numerosFormateados}

¡Guarda este correo como comprobante de tu participación!

¡Mucha suerte! 🍀`;

    // Create mailto link
    const mailtoLink = `mailto:${data.correo}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open email client
    window.open(mailtoLink, '_blank');
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

export async function sendWhatsAppNotification(data: NotificationData): Promise<boolean> {
  try {
    // Clean WhatsApp number (remove non-digits)
    const cleanNumber = data.whatsapp.replace(/\D/g, '');
    
    // Format numbers for display
    const numerosFormateados = data.numeros.join(', ');
    const fechaFormateada = new Date(data.fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Create WhatsApp message
    const message = `🎟️ *NÚMEROS DE RIFA ASIGNADOS*

Hola *${data.nombre}*,

¡Excelente! Tus números para la rifa han sido asignados exitosamente.

📋 *DETALLES DE TU ASIGNACIÓN:*
• Nombre: ${data.nombre}
• Correo: ${data.correo}
• WhatsApp: ${data.whatsapp}
• Cantidad de números: ${data.cantidad}
• Fecha: ${fechaFormateada}

🎯 *TUS NÚMEROS ASIGNADOS:*
${numerosFormateados}

¡Guarda este mensaje como comprobante de tu participación!

¡Mucha suerte! 🍀`;

    // Create WhatsApp link
    const whatsappLink = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp
    window.open(whatsappLink, '_blank');
    
    return true;
  } catch (error) {
    console.error('Error sending WhatsApp:', error);
    return false;
  }
}

export function copyToClipboard(data: NotificationData): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const numerosFormateados = data.numeros.join(', ');
      const fechaFormateada = new Date(data.fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const text = `🎟️ NÚMEROS DE RIFA ASIGNADOS

Nombre: ${data.nombre}
Correo: ${data.correo}
WhatsApp: ${data.whatsapp}
Cantidad: ${data.cantidad} números
Fecha: ${fechaFormateada}

Números asignados: ${numerosFormateados}`;

      navigator.clipboard.writeText(text).then(() => {
        resolve(true);
      }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        resolve(true);
      });
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      resolve(false);
    }
  });
}