export const personas = {
  admin: {
    email: 'admin@caresync.dev',
    password: 'Password123!',
    displayName: 'Admin',
    role: 'admin',
  },
  doctor: {
    email: 'dr.smith@caresync.dev',
    password: 'Password123!',
    displayName: 'Dr. Smith',
    role: 'doctor',
  },
  patient: {
    email: 'jane.doe@caresync.dev',
    password: 'Password123!',
    displayName: 'Jane',
    role: 'patient',
  },
} as const;

export type PersonaName = keyof typeof personas;
export type Persona = (typeof personas)[PersonaName];
