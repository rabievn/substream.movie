import clsx from "clsx";
import { useId, type InputHTMLAttributes, type Ref } from "react";
import styles from "./text-field.module.scss";

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
  ref?: Ref<HTMLInputElement>;
}

export function TextField({ label, hint, error, className, id, ref, ...props }: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className={clsx(styles.root, className)}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        className={clsx(styles.input, error && styles.hasError)}
        aria-invalid={error ? true : undefined}
        aria-describedby={clsx(hintId, errorId) || undefined}
        {...props}
      />
      {hint ? (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
