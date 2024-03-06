import React, {
  ChangeEventHandler,
  KeyboardEventHandler,
  useEffect,
  useRef,
} from 'react';
import styles from './styles/textInput.module.css';
import clsx from 'clsx';

type TextInputProps = {
  id?: string;
  name: string;
  label?: string;
  description?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  value?: string;
  maxLength?: number;
  shouldFocus?: boolean;
  labelSibling?: React.ReactElement;
  style?: React.CSSProperties;
  inputStyles?: React.CSSProperties;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onBlur?: ChangeEventHandler<HTMLInputElement>;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
};

function TextInput(props: TextInputProps) {
  const {
    id,
    name,
    label,
    description,
    placeholder,
    disabled,
    error,
    maxLength,
    shouldFocus = false,
    value,
    labelSibling,
    style,
    inputStyles,
    onChange,
    onBlur,
    onKeyDown,
  } = props;

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (shouldFocus) {
      inputRef.current?.focus();
    }
  }, [shouldFocus]);

  return (
    <div
      id={id}
      className={clsx(
        styles.textInput,
        error !== undefined ? styles.inputError : null
      )}
      style={style}>
      <label>
        {label !== '' && label !== undefined ? (
          <div className={styles.label}>
            <div>{label}</div>
            {labelSibling}
          </div>
        ) : null}
        {description ? (
          <div className={styles.description}>{description}</div>
        ) : null}
        <input
          ref={inputRef}
          disabled={disabled}
          type="text"
          name={name}
          placeholder={placeholder}
          value={value}
          maxLength={maxLength}
          onChange={onChange}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
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
