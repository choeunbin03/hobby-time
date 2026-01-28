// Reservation domain types
export type ReservationStatus = "CONFIRMED" | "PENDING" | "APPROVED" | "CANCELLED";

export interface Reservation {
  id: string;
  userId: string;
  sessionId: string;
  headCount: number;
  status: ReservationStatus;
}

export interface ReservationListItem {
  id: string;
  classId: string;
  className: string;
  timeSlotId: string;
  date: string;
  startTime: string;
  guests: number;
  status: ReservationStatus;
  studioName: string;
  createdAt: string;
}
