import { InputHTMLAttributes, forwardRef } from 'react';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helpText, required, className = '', id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className={styles.formGroup}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
            {required && <span className={styles.required}>*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`${styles.input} ${error ? styles.inputError : ''} ${className}`}
          {...props}
        />
        {error && <span className={styles.errorMessage}>{error}</span>}
        {helpText && !error && <span className={styles.helpText}>{helpText}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
