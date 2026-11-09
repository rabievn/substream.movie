import clsx from "clsx";
import { useId, type Ref, type SelectHTMLAttributes } from "react";
import styles from "./text-field.module.scss";

export interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: readonly { value: string; label: string }[];
  ref?: Ref<HTMLSelectElement>;
}

/** Native select (best mobile UX and accessibility), styled like TextField. */
export function SelectField({ label, options, className, id, ref, ...props }: SelectFieldProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;

  return (
    <div className={clsx(styles.root, className)}>
      <label htmlFor={selectId} className={styles.label}>
        {label}
      </label>
      <select ref={ref} id={selectId} className={styles.input} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
