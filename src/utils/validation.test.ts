import { describe, expect, it } from "vitest";
import {
  formatPhoneInput,
  validateDate,
  validateGuests,
  validateName,
  validatePhone,
  validateTime
} from "./validation";

const today = new Date("2026-06-15T10:00:00");

describe("booking validation", () => {
  it("validates guest name", () => {
    expect(validateName("Анна-Мария")).toBeNull();
    expect(validateName("A")).toBe("Имя должно быть не короче 2 символов");
    expect(validateName("Анна 123")).toBe("Используйте только буквы, пробелы и дефис");
  });

  it("validates Russian phone numbers after normalization", () => {
    expect(validatePhone("+7 (999) 123-45-67")).toBeNull();
    expect(validatePhone("8-999-123-45-67")).toBeNull();
    expect(validatePhone("+1 999 123 45 67")).toBe("Введите корректный номер: +7 или 8, 10 цифр");
  });

  it("formats phone input as a mask", () => {
    expect(formatPhoneInput("8")).toBe("+7");
    expect(formatPhoneInput("8999")).toBe("+7 (999)");
    expect(formatPhoneInput("89991234567")).toBe("+7 (999) 123-45-67");
  });

  it("validates booking date range", () => {
    expect(validateDate("2026-06-15", today)).toBeNull();
    expect(validateDate("2026-09-13", today)).toBeNull();
    expect(validateDate("2026-06-14", today)).toBe("Дата не может быть раньше сегодня");
    expect(validateDate("2026-09-14", today)).toBe("Дата не может быть позднее 90 дней");
  });

  it("validates time slots", () => {
    expect(validateTime("12:00")).toBeNull();
    expect(validateTime("22:00")).toBeNull();
    expect(validateTime("23:00")).toBe("Выберите время с 12:00 до 22:00");
  });

  it("validates guest count", () => {
    expect(validateGuests(1)).toBeNull();
    expect(validateGuests(12)).toBeNull();
    expect(validateGuests(0)).toBe("Количество гостей должно быть от 1 до 12");
    expect(validateGuests(1.5)).toBe("Укажите целое количество гостей");
  });
});
