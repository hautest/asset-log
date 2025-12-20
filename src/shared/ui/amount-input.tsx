"use client";

import { useRef, useCallback, type ChangeEvent } from "react";
import { Input } from "./input";
import { cn } from "@/shared/utils";

interface AmountInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
  id?: string;
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

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const input = e.target;
      const rawValue = input.value;
      const cursorPosition = input.selectionStart ?? 0;

      // 커서 위치 이전의 숫자 개수 계산
      const beforeCursor = rawValue.slice(0, cursorPosition);
      const digitsBeforeCursor = beforeCursor.replace(/[^0-9]/g, "").length;

      // 숫자만 추출하여 값 업데이트
      const numericValue = rawValue.replace(/[^0-9]/g, "");
      const newValue = numericValue ? Number(numericValue) : 0;
      onChange(newValue);

      // 새로운 포맷된 값에서 커서 위치 계산
      requestAnimationFrame(() => {
        if (!inputRef.current) return;

        const formattedValue = formatAmount(newValue);
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

        // 모든 숫자를 지운 경우
        if (digitsBeforeCursor === 0) {
          newCursorPosition = 0;
        }

        inputRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
      });
    },
    [onChange]
  );

  return (
    <Input
      ref={inputRef}
      id={id}
      type="text"
      inputMode="numeric"
      placeholder={placeholder}
      value={formatAmount(value)}
      onChange={handleChange}
      className={cn("text-right", className)}
    />
  );
}
