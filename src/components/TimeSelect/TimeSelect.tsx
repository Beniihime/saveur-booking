import { TIME_SLOTS } from "@/utils/validation";
import styles from "./TimeSelect.module.scss";

interface TimeSelectProps {
  errorId?: string;
  invalid?: boolean;
  onChange: (time: string) => void;
  value: string;
}

export function TimeSelect({ errorId, invalid, onChange, value }: TimeSelectProps) {
  return (
    <div className={styles.root}>
      <select
        aria-describedby={errorId}
        aria-invalid={invalid}
        className={`${styles.select} ${value ? styles.selectFilled : ""}`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">Выберите время</option>
        {TIME_SLOTS.map((slot) => (
          <option key={slot} value={slot}>
            {slot}
          </option>
        ))}
      </select>
      <span className={styles.triggerIcon} aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </span>
    </div>
  );
}
