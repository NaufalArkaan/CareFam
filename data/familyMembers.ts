import { FamilyMember } from '../types';

// RUBRIK: Type & Array of Objects (Data dummy awal anggota keluarga)
export const INITIAL_FAMILY_MEMBERS: FamilyMember[] = [
  {
    id: '1',
    name: 'Budi Santoso',
    birthDate: '1980-05-12',
    relationship: 'Kepala Keluarga',
    emergencyContact: '0812-3456-7890',
  },
  {
    id: '2',
    name: 'Siti Rahma',
    birthDate: '1984-08-20',
    relationship: 'Istri',
    emergencyContact: '0812-3456-7891',
  },
  {
    id: '3',
    name: 'Andi Santoso',
    birthDate: '2010-11-15',
    relationship: 'Anak',
  },
];

// In-memory store untuk menjaga state data anggota selama sesi aplikasi aktif
let familyMembersStore: FamilyMember[] = [...INITIAL_FAMILY_MEMBERS];

type StoreListener = () => void;
const listeners: Set<StoreListener> = new Set();

export const subscribeFamilyMembers = (listener: StoreListener): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const getStoredFamilyMembers = (): FamilyMember[] => {
  return [...familyMembersStore];
};

export const addStoredFamilyMember = (newMember: FamilyMember): void => {
  familyMembersStore = [newMember, ...familyMembersStore];
  listeners.forEach((listener) => listener());
};

export const resetStoredFamilyMembers = (): void => {
  familyMembersStore = [...INITIAL_FAMILY_MEMBERS];
  listeners.forEach((listener) => listener());
};

