"use client";

import { useState, useRef, useCallback, useEffect, type ChangeEvent } from "react";
import { Input } from "./input";
import { cn } from "@/shared/utils";

interface AmountInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}

function formatWithCommas(value: string): string {
  if (!value) return "";
  const reversed = value.split("").reverse();
  const withCommas: string[] = [];
  for (let i = 0; i < reversed.length; i++) {
    if (i > 0 && i % 3 === 0) {
      withCommas.push(",");
    }
    withCommas.push(reversed[i]!);
  }
  return withCommas.reverse().join("");
}

function formatAmount(value: number): string {
  if (value === 0) return "";
  return value.toLocaleString();
}

export function AmountInput({
  value,
  onChange,
  placeholder = "0",
  className,
  id,
}: AmountInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [displayValue, setDisplayValue] = useState(() => formatAmount(value));
  const isTypingRef = useRef(false);

  useEffect(() => {
    if (!isTypingRef.current) {
      setDisplayValue(formatAmount(value));
    }
  }, [value]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      isTypingRef.current = true;
      const input = e.target;
      const rawValue = input.value;
      const cursorPosition = input.selectionStart ?? 0;

      const beforeCursor = rawValue.slice(0, cursorPosition);
      const digitsBeforeCursor = beforeCursor.replace(/[^0-9]/g, "").length;

      const numericString = rawValue.replace(/[^0-9]/g, "");
      const formattedValue = formatWithCommas(numericString);

      setDisplayValue(formattedValue);
      onChange(numericString ? Number(numericString) : 0);

      requestAnimationFrame(() => {
        if (!inputRef.current) return;

        let newCursorPosition = 0;
        let digitCount = 0;

        for (let i = 0; i < formattedValue.length; i++) {
          const char = formattedValue[i];
          if (char && /[0-9]/.test(char)) {
            digitCount++;
          }
          if (digitCount === digitsBeforeCursor) {
            newCursorPosition = i + 1;
            break;
          }
        }

        if (digitsBeforeCursor === 0) {
          newCursorPosition = 0;
        }

        inputRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
      });
    },
    [onChange]
  );

  const handleBlur = useCallback(() => {
    isTypingRef.current = false;
    setDisplayValue(formatAmount(value));
  }, [value]);

  return (
    <Input
      ref={inputRef}
      id={id}
      type="text"
      inputMode="numeric"
      placeholder={placeholder}
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      className={cn("text-right", className)}
    />
  );
}
