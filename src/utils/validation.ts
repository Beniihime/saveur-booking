import type { BookingFormData } from "@/types/booking";

const NAME_PATTERN = /^[A-Za-zА-Яа-яЁё\s-]+$/;

export const TIME_SLOTS = [
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00"
] as const;

export type TimeSlot = (typeof TIME_SLOTS)[number];

export function toDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function addDays(date: Date, days: number): Date {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

export function addMonths(date: Date, months: number): Date {
  const nextDate = new Date(date);
  nextDate.setMonth(nextDate.getMonth() + months);
  return nextDate;
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function isSameDay(left: Date, right: Date): boolean {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

export function clampDate(date: Date, minDate: Date, maxDate: Date): Date {
  if (date < minDate) {
    return new Date(minDate);
  }

  if (date > maxDate) {
    return new Date(maxDate);
  }

  return new Date(date);
}

export function validateName(value: string): string | null {
  const trimmed = value.trim();

  if (!trimmed) {
    return "Укажите имя гостя";
  }

  if (trimmed.length < 2) {
    return "Имя должно быть не короче 2 символов";
  }

  if (!NAME_PATTERN.test(trimmed)) {
    return "Используйте только буквы, пробелы и дефис";
  }

  return null;
}

export function validatePhone(value: string): string | null {
  const digits = value.replace(/\D/g, "");

  if (digits.length === 11 && (digits[0] === "7" || digits[0] === "8")) {
    return null;
  }

  return "Введите корректный номер: +7 или 8, 10 цифр";
}

export function formatPhoneInput(value: string): string {
  const digits = value.replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  const normalized = digits[0] === "8" ? `7${digits.slice(1)}` : digits;
  const phoneDigits = normalized.startsWith("7")
    ? normalized.slice(1, 11)
    : normalized.slice(0, 10);

  const parts = [
    phoneDigits.slice(0, 3),
    phoneDigits.slice(3, 6),
    phoneDigits.slice(6, 8),
    phoneDigits.slice(8, 10)
  ];

  let result = "+7";

  if (parts[0]) {
    result += ` (${parts[0]}`;
  }

  if (parts[0]?.length === 3) {
    result += ")";
  }

  if (parts[1]) {
    result += ` ${parts[1]}`;
  }

  if (parts[2]) {
    result += `-${parts[2]}`;
  }

  if (parts[3]) {
    result += `-${parts[3]}`;
  }

  return result;
}

export function validateDate(value: string, today = new Date()): string | null {
  if (!value) {
    return "Выберите дату";
  }

  const selectedDate = new Date(`${value}T00:00:00`);
  const minDate = new Date(`${toDateInputValue(today)}T00:00:00`);
  const maxDate = new Date(`${toDateInputValue(addDays(today, 90))}T00:00:00`);

  if (Number.isNaN(selectedDate.getTime())) {
    return "Выберите корректную дату";
  }

  if (selectedDate < minDate) {
    return "Дата не может быть раньше сегодня";
  }

  if (selectedDate > maxDate) {
    return "Дата не может быть позднее 90 дней";
  }

  return null;
}

export function validateTime(value: string): string | null {
  if (!value) {
    return "Выберите время";
  }

  if (!TIME_SLOTS.includes(value as TimeSlot)) {
    return "Выберите время с 12:00 до 22:00";
  }

  return null;
}

export function validateGuests(value: unknown): string | null {
  const guests = Number(value);

  if (!Number.isInteger(guests)) {
    return "Укажите целое количество гостей";
  }

  if (guests < 1 || guests > 12) {
    return "Количество гостей должно быть от 1 до 12";
  }

  return null;
}

export function validateBookingForm(data: BookingFormData): boolean {
  return (
    validateName(data.name) === null &&
    validatePhone(data.phone) === null &&
    validateDate(data.date) === null &&
    validateTime(data.time) === null &&
    validateGuests(data.guests) === null
  );
}
