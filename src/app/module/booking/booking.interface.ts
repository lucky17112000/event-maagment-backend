export interface IcreateBookingPayload {
  ideaId: string;
  seatCount: number;
}

export interface IUpdateBookingStatusPayload {
  bookingId: string;
  status: "ATTENDED" | "NO_SHOW";
}

export interface ICreateSeatConfigPayload {
  ideaId: string;
  totalSeats: number;
  startTime: string;
  endTime: string;
  venue?: string;
}
