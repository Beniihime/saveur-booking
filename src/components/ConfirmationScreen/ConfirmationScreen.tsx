import type { BookingFormData } from "@/types/booking";
import styles from "./ConfirmationScreen.module.scss";

interface ConfirmationScreenProps {
  booking: BookingFormData;
  onReset: () => void;
}

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  year: "numeric"
});

function formatDate(value: string) {
  return dateFormatter.format(new Date(`${value}T00:00:00`));
}

function formatGuests(value: number) {
  if (value === 1) {
    return "1 гость";
  }

  if (value >= 2 && value <= 4) {
    return `${value} гостя`;
  }

  return `${value} гостей`;
}

export function ConfirmationScreen({ booking, onReset }: ConfirmationScreenProps) {
  return (
    <section className={styles.confirmation} aria-labelledby="confirmation-title">
      <div className={styles.icon} aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>

      <div className={styles.copy}>
        <h2 id="confirmation-title">Столик забронирован</h2>
        <p>Мы сохранили детали бронирования. До встречи в SAVEUR.</p>
      </div>

      <dl className={styles.summary}>
        <div>
          <dt>Гость</dt>
          <dd>{booking.name}</dd>
        </div>
        <div>
          <dt>Дата</dt>
          <dd>{formatDate(booking.date)}</dd>
        </div>
        <div>
          <dt>Время</dt>
          <dd>{booking.time}</dd>
        </div>
        <div>
          <dt>Гости</dt>
          <dd>{formatGuests(booking.guests)}</dd>
        </div>
      </dl>

      <button type="button" onClick={onReset}>
        Забронировать ещё
      </button>
    </section>
  );
}
