import { supabase } from './supabase';

export async function generateUniqueNumbers(quantity: number): Promise<string[]> {
  // Get all existing numbers from database
  const { data: existingAssignments, error } = await supabase
    .from('asignaciones')
    .select('numeros');

  if (error) {
    throw new Error('Error fetching existing numbers');
  }

  // Extract all assigned numbers from all assignments
  const assignedNumbers = new Set<string>();
  existingAssignments?.forEach(assignment => {
    if (assignment.numeros && Array.isArray(assignment.numeros)) {
      assignment.numeros.forEach((num: string) => assignedNumbers.add(num));
    }
  });

  // Generate all possible numbers (000-999)
  const allNumbers: string[] = [];
  for (let i = 0; i <= 999; i++) {
    allNumbers.push(i.toString().padStart(3, '0'));
  }

  // Filter out already assigned numbers
  const availableNumbers = allNumbers.filter(num => !assignedNumbers.has(num));

  if (availableNumbers.length < quantity) {
    throw new Error(`Only ${availableNumbers.length} numbers available, but ${quantity} requested`);
  }

  // Randomly select the requested quantity
  const selectedNumbers: string[] = [];
  const shuffled = [...availableNumbers];
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, quantity).sort();
}

export async function saveAssignment(
  nombre: string,
  correo: string,
  whatsapp: string,
  cantidad: number,
  numeros: string[]
): Promise<void> {
  const { error } = await supabase
    .from('asignaciones')
    .insert({
      nombre,
      correo,
      whatsapp,
      cantidad,
      numeros
    });

  if (error) {
    throw new Error('Error saving assignment');
  }
}

export async function getAssignmentsByEmail(email: string) {
  const { data, error } = await supabase
    .from('asignaciones')
    .select('*')
    .eq('correo', email)
    .order('fecha', { ascending: false });

  if (error) {
    throw new Error('Error fetching assignments');
  }

  return data;
}

export async function getAssignmentsByWhatsApp(whatsapp: string) {
  const { data, error } = await supabase
    .from('asignaciones')
    .select('*')
    .eq('whatsapp', whatsapp)
    .order('fecha', { ascending: false });

  if (error) {
    throw new Error('Error fetching assignments by WhatsApp');
  }

  return data;
}

export async function getAssignmentsByNumber(number: string) {
  try {
    // Format the number to ensure it's 3 digits with leading zeros
    const formattedNumber = number.padStart(3, '0');
    
    // Use a more compatible approach for searching in JSONB arrays
    const { data, error } = await supabase
      .from('asignaciones')
      .select('*')
      .or(`numeros.cs.{${formattedNumber}}`)
      .order('fecha', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      
      // Fallback: Get all assignments and filter client-side
      const { data: allData, error: fallbackError } = await supabase
        .from('asignaciones')
        .select('*')
        .order('fecha', { ascending: false });

      if (fallbackError) {
        throw new Error('Error fetching assignments by number');
      }

      // Filter client-side
      const filteredData = allData?.filter(assignment => 
        assignment.numeros && 
        Array.isArray(assignment.numeros) && 
        assignment.numeros.includes(formattedNumber)
      ) || [];

      return filteredData;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAssignmentsByNumber:', error);
    
    // Final fallback: Get all and filter
    try {
      const formattedNumber = number.padStart(3, '0');
      const { data: allData, error: fallbackError } = await supabase
        .from('asignaciones')
        .select('*')
        .order('fecha', { ascending: false });

      if (fallbackError) {
        throw new Error('Error fetching assignments by number');
      }

      const filteredData = allData?.filter(assignment => 
        assignment.numeros && 
        Array.isArray(assignment.numeros) && 
        assignment.numeros.includes(formattedNumber)
      ) || [];

      return filteredData;
    } catch (fallbackError) {
      throw new Error('Error fetching assignments by number');
    }
  }
}