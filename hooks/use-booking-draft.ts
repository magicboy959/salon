"use client";

import { useMemo, useState } from "react";
import type { BookingInput } from "@/lib/validations";

export function useBookingDraft(initial: Partial<BookingInput> = {}) {
  const [draft, setDraft] = useState<Partial<BookingInput>>(initial);
  const progress = useMemo(() => {
    const required = ["customerName", "email", "phone", "serviceIds", "date", "time", "paymentMethod"];
    const completed = required.filter((key) => Boolean(draft[key as keyof BookingInput])).length;
    return Math.round((completed / required.length) * 100);
  }, [draft]);

  return { draft, setDraft, progress };
}
