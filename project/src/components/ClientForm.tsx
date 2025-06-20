import React, { useState } from 'react';
import { User, Mail, Phone, Hash, Loader2, Search } from 'lucide-react';

interface ClientFormProps {
  onSubmit: (data: {
    nombre: string;
    correo: string;
    whatsapp: string;
    cantidad: number;
  }) => Promise<void>;
  isLoading: boolean;
  onSearchMode: () => void;
}

export function ClientForm({ onSubmit, isLoading, onSearchMode }: ClientFormProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    whatsapp: '',
    cantidad: 1
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }

    if (!formData.correo.trim()) {
      newErrors.correo = 'El correo es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      newErrors.correo = 'Ingresa un correo válido';
    }

    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = 'El número de WhatsApp es obligatorio';
    }

    if (formData.cantidad < 1) {
      newErrors.cantidad = 'La cantidad debe ser al menos 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const isFormValid = formData.nombre.trim() && 
                     formData.correo.trim() && 
                     formData.whatsapp.trim() && 
                     formData.cantidad >= 1 &&
                     Object.keys(errors).length === 0;

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Hash className="text-blue-600 w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Generador de Números</h1>
        <p className="text-gray-600 mt-2">Solicita tus números para la rifa</p>
      </div>

      {/* Botón de búsqueda */}
      <div className="mb-6">
        <button
          onClick={onSearchMode}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
        >
          <Search className="w-5 h-5 mr-2" />
          Buscar números asignados
        </button>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="inline w-4 h-4 mr-2" />
              Nombre completo
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.nombre ? 'border-red-300' : 'border-gray-300'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="Ingresa tu nombre completo"
            />
            {errors.nombre && (
              <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="inline w-4 h-4 mr-2" />
              Correo electrónico
            </label>
            <input
              type="email"
              value={formData.correo}
              onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.correo ? 'border-red-300' : 'border-gray-300'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="correo@ejemplo.com"
            />
            {errors.correo && (
              <p className="text-red-500 text-sm mt-1">{errors.correo}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="inline w-4 h-4 mr-2" />
              Número de WhatsApp
            </label>
            <input
              type="tel"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.whatsapp ? 'border-red-300' : 'border-gray-300'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="+1234567890"
            />
            {errors.whatsapp && (
              <p className="text-red-500 text-sm mt-1">{errors.whatsapp}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Hash className="inline w-4 h-4 mr-2" />
              Cantidad de números
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={formData.cantidad}
              onChange={(e) => setFormData({ ...formData, cantidad: parseInt(e.target.value) || 1 })}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.cantidad ? 'border-red-300' : 'border-gray-300'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
            {errors.cantidad && (
              <p className="text-red-500 text-sm mt-1">{errors.cantidad}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
              isFormValid && !isLoading
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="animate-spin w-5 h-5 mr-2" />
                Generando números...
              </div>
            ) : (
              'Generar números'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}