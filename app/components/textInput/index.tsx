import clsx from 'clsx';
import React, {
  ChangeEventHandler,
  FocusEventHandler,
  KeyboardEventHandler,
  useEffect,
  useRef,
} from 'react';
import styles from './styles/textInput.module.css';

type TextInputProps = {
  id?: string;
  name: string;
  label?: string;
  description?: React.ReactNode;
  placeholder?: string;
  type?: 'text' | 'password' | 'number';
  min?: number;
  max?: number;
  disabled?: boolean;
  error?: string;
  value?: string;
  maxLength?: number;
  shouldFocus?: boolean;
  labelSibling?: React.ReactElement;
  style?: React.CSSProperties;
  inputStyles?: React.CSSProperties;
  labelStyles?: React.CSSProperties;
  descriptionStyles?: React.CSSProperties;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  onFocus?: FocusEventHandler<HTMLInputElement>;
};

function TextInput(props: TextInputProps) {
  const {
    id,
    name,
    label,
    description,
    placeholder,
    type = 'text',
    min,
    max,
    disabled,
    error,
    maxLength,
    shouldFocus = false,
    value,
    labelSibling,
    style,
    inputStyles,
    labelStyles,
    descriptionStyles,
    onChange,
    onBlur,
    onKeyDown,
    onFocus,
  } = props;

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (shouldFocus) {
      inputRef.current?.focus();
    }
  }, [shouldFocus]);

  return (
    <div
      className={clsx(
        styles.textInput,
        error !== undefined ? styles.inputError : null
      )}
      style={style}>
      <label htmlFor={id}>
        {label !== '' && label !== undefined ? (
          <div
            className={styles.label}
            style={labelStyles}>
            <div>{label}</div>
            {labelSibling}
          </div>
        ) : null}
        {description ? (
          <div
            className={styles.description}
            style={descriptionStyles}>
            {description}
          </div>
        ) : null}
        <input
          id={id}
          ref={inputRef}
          disabled={disabled}
          type={type}
          name={name}
          min={min}
          max={max}
          placeholder={placeholder}
          value={value}
          maxLength={maxLength}
          onChange={onChange}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          style={inputStyles}
          autoComplete="off"
        />
        {Boolean(error) ? (
          <div className={styles.errorText}>{error}</div>
        ) : null}
      </label>
    </div>
  );
}

export { TextInput };
