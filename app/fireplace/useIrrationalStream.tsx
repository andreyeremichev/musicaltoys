// useIrrationalStream.ts
import { useEffect, useState } from "react";
import { DIGITS, TICK_MS, TOTAL_STEPS } from "./constants";

export function useIrrationalStream() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStep((s) => (s + 1) % TOTAL_STEPS);
    }, TICK_MS);

    return () => clearInterval(id);
  }, []);

  const digit = Number(DIGITS[step]);

  return { step, digit };
}