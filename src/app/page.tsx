"use client";

import { useEffect, useState } from "react";
import { BookingForm } from "@/components/BookingForm/BookingForm";
import { ConfirmationScreen } from "@/components/ConfirmationScreen/ConfirmationScreen";
import type { BookingFormData, BookingStatus } from "@/types/booking";
import styles from "./page.module.scss";

export default function Home() {
  const [status, setStatus] = useState<BookingStatus>("idle");
  const [booking, setBooking] = useState<BookingFormData | null>(null);
  const [panelMode, setPanelMode] = useState<"default" | "returning">("default");

  const handleSubmit = (data: BookingFormData) => {
    setStatus("loading");

    window.setTimeout(() => {
      setBooking(data);
      setStatus("success");
    }, 1500);
  };

  const handleReset = () => {
    setBooking(null);
    setStatus("idle");
    setPanelMode("returning");
  };

  const isSuccess = status === "success" && booking !== null;

  useEffect(() => {
    if (panelMode !== "returning") {
      return;
    }

    const timer = window.setTimeout(() => {
      setPanelMode("default");
    }, 460);

    return () => window.clearTimeout(timer);
  }, [panelMode]);

  return (
    <main className={styles.page}>
      <header className={styles.topbar} aria-label="SAVEUR">
        <span className={styles.logo}>SAVEUR</span>
        <span className={styles.service}>Бронирование столов</span>
      </header>

      <section className={styles.shell} aria-labelledby="page-title">
        <div className={styles.intro}>
          <span className={styles.rule} aria-hidden="true" />
          <h1 id="page-title">Вечер начинается со столика</h1>
          <p>
            SAVEUR бережно держит темп ужина: сезонное меню и
            спокойная посадка к выбранному времени
          </p>

          <div className={styles.atmosphere} aria-hidden="true">
            <div className={styles.tableScene}>
              <span className={styles.plate} />
              <span className={styles.glass} />
              <span className={styles.cutlery} />
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div
            className={[
              styles.panel,
              isSuccess ? styles.panelSuccess : "",
              panelMode === "returning" ? styles.panelReturning : ""
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {isSuccess ? (
              <ConfirmationScreen booking={booking} onReset={handleReset} />
            ) : (
              <BookingForm isSubmitting={status === "loading"} onSubmit={handleSubmit} />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
