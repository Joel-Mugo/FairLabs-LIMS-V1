
import type { User } from './types';

// This is a mock user database. In a real application, this would be stored securely.
export const users: (User & { id: number; password?: string })[] = [
  { 
    id: 1,
    name: 'Rhoda Mwikali', 
    username: 'rmwikali',
    password: 'password123',
    role: 'QC Manager',
    avatar: 'RM'
  },
  { 
    id: 2,
    name: 'Kevin Masinde', 
    username: 'kmasinde',
    password: 'password123',
    role: 'Analyst',
    avatar: 'KM'
  },
  { 
    id: 3,
    name: 'Admin User', 
    username: 'admin',
    password: 'password123',
    role: 'Admin',
    avatar: 'AD'
  },
  {
    id: 4,
    name: 'John Doe',
    username: 'jdoe',
    password: 'password123',
    role: 'Viewer',
    avatar: 'JD'
  }
];

    
