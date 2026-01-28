// Reservation domain types
export type ReservationStatus = "CONFIRMED" | "PENDING" | "APPROVED" | "CANCELLED";

export interface Reservation {
  id: string;
  userId: string;
  sessionId: string;
  headCount: number;
  status: ReservationStatus;
}
