import { useMemo } from "react";
import { useForm } from "react-hook-form";
import type { BookingFormData } from "@/types/booking";
import {
  addDays,
  formatPhoneInput,
  toDateInputValue,
  validateDate,
  validateGuests,
  validateName,
  validatePhone,
  validateTime
} from "@/utils/validation";
import { CalendarDatePicker } from "@/components/CalendarDatePicker/CalendarDatePicker";
import { TimeSelect } from "@/components/TimeSelect/TimeSelect";
import styles from "./BookingForm.module.scss";

interface BookingFormProps {
  isSubmitting: boolean;
  onSubmit: (data: BookingFormData) => void;
}

const defaultValues: BookingFormData = {
  name: "",
  phone: "",
  date: "",
  time: "",
  guests: 2
};

function asFormValidation(result: string | null) {
  return result ?? true;
}

export function BookingForm({ isSubmitting, onSubmit }: BookingFormProps) {
  const today = useMemo(() => new Date(), []);
  const minDate = toDateInputValue(today);
  const maxDate = toDateInputValue(addDays(today, 90));

  const {
    formState: { errors },
    handleSubmit,
    register,
    watch,
    setValue
  } = useForm<BookingFormData>({
    defaultValues,
    mode: "onBlur",
    reValidateMode: "onBlur"
  });

  return (
    <form className={styles.form} noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.header}>
        <h2>Детали бронирования</h2>
        <p>Все поля обязательны</p>
      </div>

      <div className={styles.field}>
        <label htmlFor="name">Имя гостя</label>
        <input
          id="name"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
          placeholder="Анна"
          type="text"
          {...register("name", { validate: (value) => asFormValidation(validateName(value)) })}
        />
        {errors.name?.message ? (
          <span id="name-error" className={styles.error}>
            {errors.name.message}
          </span>
        ) : null}
      </div>

      <div className={styles.field}>
        <label htmlFor="phone">Телефон</label>
        <input
          id="phone"
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? "phone-error" : undefined}
          inputMode="tel"
          maxLength={18}
          placeholder="+7 (999) 123-45-67"
          type="tel"
          {...register("phone", {
            onChange: (event) => {
              const maskedValue = formatPhoneInput(event.target.value);
              setValue("phone", maskedValue, {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: false
              });
            },
            validate: (value) => asFormValidation(validatePhone(value))
          })}
        />
        {errors.phone?.message ? (
          <span id="phone-error" className={styles.error}>
            {errors.phone.message}
          </span>
        ) : null}
      </div>

      <div className={styles.grid}>
        <div className={styles.field}>
          <label htmlFor="date">Дата</label>
          <input
            id="date"
            type="hidden"
            {...register("date", {
              validate: (value) => asFormValidation(validateDate(value, today))
            })}
          />
          <CalendarDatePicker
            errorId={errors.date ? "date-error" : undefined}
            invalid={Boolean(errors.date)}
            maxDate={maxDate}
            minDate={minDate}
            onChange={(date) =>
              setValue("date", date, {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true
              })
            }
            value={watch("date")}
          />
          {errors.date?.message ? (
            <span id="date-error" className={styles.error}>
              {errors.date.message}
            </span>
          ) : null}
        </div>

        <div className={styles.field}>
          <label htmlFor="time">Время</label>
          <input
            id="time"
            type="hidden"
            {...register("time", { validate: (value) => asFormValidation(validateTime(value)) })}
          />
          <TimeSelect
            errorId={errors.time ? "time-error" : undefined}
            invalid={Boolean(errors.time)}
            onChange={(time) =>
              setValue("time", time, {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true
              })
            }
            value={watch("time")}
          />
          {errors.time?.message ? (
            <span id="time-error" className={styles.error}>
              {errors.time.message}
            </span>
          ) : null}
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="guests">Количество гостей</label>
        <input
          id="guests"
          aria-invalid={Boolean(errors.guests)}
          aria-describedby={errors.guests ? "guests-error" : undefined}
          inputMode="numeric"
          max={12}
          min={1}
          type="number"
          {...register("guests", {
            setValueAs: (value) => Number(value),
            validate: (value) => asFormValidation(validateGuests(value))
          })}
        />
        {errors.guests?.message ? (
          <span id="guests-error" className={styles.error}>
            {errors.guests.message}
          </span>
        ) : null}
      </div>

      <button className={styles.submit} disabled={isSubmitting} type="submit">
        {isSubmitting ? (
          <>
            <span className={styles.spinner} aria-hidden="true" />
            Бронирую...
          </>
        ) : (
          "Забронировать"
        )}
      </button>
    </form>
  );
}
