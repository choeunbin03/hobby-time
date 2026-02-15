import { Database } from './database';

export type Class = Database['public']['Tables']['classes']['Row'];
export type Studio = Database['public']['Tables']['studios']['Row'];
export type Session = Database['public']['Tables']['class_sessions']['Row'];

// Join Type for Class List
export interface ClassWithStudio extends Class {
  studios: Pick<Studio, 'name' | 'location_text' | 'region_code'> | null;
}

// Join Type for Class Detail
export interface ClassDetail extends Class {
  studios: Studio | null;
}

export interface TimeSlot {
  id: string;
  classId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  maxCapacity: number;
  currentBookings: number;
}

export type ClassListItem = ClassWithStudio;

export type Reservation = Database['public']['Tables']['reservations']['Row'];

// Join Type for My Reservations
// The query will look like:
// .select('*, class_sessions(*, classes(*, studios(*)))')
export interface ReservationWithDetails extends Reservation {
  class_sessions: (Session & {
    classes: (Class & {
      studios: Studio | null;
    }) | null;
  }) | null;
}
