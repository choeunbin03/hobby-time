// Class domain types
export interface Class {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  durationMinutes: number;
  studioId: string;
}

/** Main page list item: class with studio embedded (for cards/filters) */
export interface ClassListItem {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  studio: {
    id: string;
    name: string;
    location: string;
    description: string;
  };
}

export interface TimeSlot {
  id: string;
  classId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  maxCapacity: number;
  currentBookings: number;
}
