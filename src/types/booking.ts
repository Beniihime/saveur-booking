export interface BookingFormData {
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
}

export type BookingStatus = "idle" | "loading" | "success";

export type BookingErrors = Partial<Record<keyof BookingFormData, string>>;
