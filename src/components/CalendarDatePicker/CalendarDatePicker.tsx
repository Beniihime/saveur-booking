import { useEffect, useMemo, useState } from "react";
import {
  addMonths,
  clampDate,
  endOfMonth,
  isSameDay,
  startOfMonth,
  toDateInputValue
} from "@/utils/validation";
import styles from "./CalendarDatePicker.module.scss";

const MONTH_LABELS = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь"
];

const WEEKDAY_LABELS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

interface CalendarDatePickerProps {
  errorId?: string;
  invalid?: boolean;
  maxDate: string;
  minDate: string;
  onChange: (date: string) => void;
  value: string;
}

function formatCalendarLabel(value: string) {
  return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long" }).format(
    new Date(`${value}T00:00:00`)
  );
}

function createMonthGrid(month: Date) {
  const firstDay = startOfMonth(month);
  const lastDay = endOfMonth(month);
  const leading = (firstDay.getDay() + 6) % 7;
  const trailing = 6 - ((lastDay.getDay() + 6) % 7);
  const cells: Array<Date | null> = [];

  for (let index = leading; index > 0; index -= 1) {
    cells.push(new Date(firstDay.getFullYear(), firstDay.getMonth(), 1 - index));
  }

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    cells.push(new Date(firstDay.getFullYear(), firstDay.getMonth(), day));
  }

  for (let day = 1; day <= trailing; day += 1) {
    cells.push(new Date(lastDay.getFullYear(), lastDay.getMonth(), lastDay.getDate() + day));
  }

  return cells;
}

export function CalendarDatePicker({
  errorId,
  invalid: _invalid,
  maxDate,
  minDate,
  onChange,
  value
}: CalendarDatePickerProps) {
  const today = useMemo(() => new Date(), []);
  const [calendarMonth, setCalendarMonth] = useState(
    value ? new Date(`${value}T00:00:00`) : today
  );
  const [calendarOpen, setCalendarOpen] = useState(false);
  const calendarCells = useMemo(() => createMonthGrid(calendarMonth), [calendarMonth]);
  const selectedDate = value ? new Date(`${value}T00:00:00`) : null;
  const minCalendarDate = new Date(`${minDate}T00:00:00`);
  const maxCalendarDate = new Date(`${maxDate}T00:00:00`);

  useEffect(() => {
    if (!value) {
      return;
    }

    setCalendarMonth(new Date(`${value}T00:00:00`));
  }, [value]);

  return (
    <div className={styles.root}>
      <button
        aria-describedby={errorId}
        aria-expanded={calendarOpen}
        className={`${styles.trigger} ${value ? styles.triggerFilled : ""}`}
        type="button"
        onClick={() => setCalendarOpen((open) => !open)}
      >
        <span>{value ? formatCalendarLabel(value) : "Выберите дату"}</span>
        <span className={styles.triggerIcon} aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M7 3v3M17 3v3M4 8h16M6 5h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
          </svg>
        </span>
      </button>

      {calendarOpen ? (
        <div className={styles.calendar} aria-label="Выбор даты">
          <div className={styles.header}>
            <button
              type="button"
              onClick={() =>
                setCalendarMonth((month) =>
                  clampDate(addMonths(month, -1), minCalendarDate, maxCalendarDate)
                )
              }
            >
              ‹
            </button>
            <strong>
              {MONTH_LABELS[calendarMonth.getMonth()]} {calendarMonth.getFullYear()}
            </strong>
            <button
              type="button"
              onClick={() =>
                setCalendarMonth((month) =>
                  clampDate(addMonths(month, 1), minCalendarDate, maxCalendarDate)
                )
              }
            >
              ›
            </button>
          </div>

          <div className={styles.weekdays} aria-hidden="true">
            {WEEKDAY_LABELS.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>

          <div className={styles.grid}>
            {calendarCells.map((cell, index) => {
              if (!cell) {
                return <span key={index} className={styles.empty} />;
              }

              const isDisabled = cell < minCalendarDate || cell > maxCalendarDate;
              const isSelected = selectedDate ? isSameDay(cell, selectedDate) : false;

              return (
                <button
                  key={cell.toISOString()}
                  className={`${styles.day} ${isSelected ? styles.daySelected : ""}`}
                  disabled={isDisabled}
                  type="button"
                  onClick={() => {
                    onChange(toDateInputValue(cell));
                    setCalendarOpen(false);
                  }}
                >
                  {cell.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
