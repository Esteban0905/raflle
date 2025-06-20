/*
  # Create asignaciones table for raffle number assignments

  1. New Tables
    - `asignaciones`
      - `id` (uuid, primary key)
      - `nombre` (text, required) - Client name
      - `correo` (text, required) - Client email
      - `whatsapp` (text, required) - Client WhatsApp number
      - `cantidad` (integer, required) - Number of requested numbers
      - `numeros` (jsonb, required) - Array of assigned numbers
      - `fecha` (timestamp, auto-generated) - Assignment timestamp

  2. Security
    - Enable RLS on `asignaciones` table
    - Add policy for public access (needed for the application to function)

  3. Indexes
    - Add index on correo for fast email searches
    - Add index on fecha for chronological queries
*/

CREATE TABLE IF NOT EXISTS asignaciones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  correo text NOT NULL,
  whatsapp text NOT NULL,
  cantidad integer NOT NULL CHECK (cantidad > 0),
  numeros jsonb NOT NULL,
  fecha timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE asignaciones ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public access for the application
CREATE POLICY "Allow public access to asignaciones"
  ON asignaciones
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_asignaciones_correo ON asignaciones(correo);
CREATE INDEX IF NOT EXISTS idx_asignaciones_fecha ON asignaciones(fecha DESC);