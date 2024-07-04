import clsx from 'clsx';
import React, {
  ChangeEvent,
  KeyboardEventHandler,
  useEffect,
  useRef,
} from 'react';
import styles from './styles/textArea.module.css';

type TextInputProps = {
  id?: string;
  name: string;
  label?: string;
  placeholder?: string;
  error?: string;
  value?: string;
  maxLength?: number;
  shouldFocus?: boolean;
  labelSibling?: React.ReactElement;
  containerStyles?: React.CSSProperties;
  inputStyles?: React.CSSProperties;
  labelStyles?: React.CSSProperties;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown?: KeyboardEventHandler<HTMLTextAreaElement>;
};

function TextArea(props: TextInputProps) {
  const {
    id,
    name,
    label,
    placeholder,
    error,
    maxLength,
    shouldFocus = false,
    value,
    labelSibling,
    containerStyles,
    inputStyles,
    labelStyles,
    onChange,
    onKeyDown,
  } = props;

  const inputRef = useRef<HTMLTextAreaElement>(null);

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
      style={containerStyles}>
      <label htmlFor={id}>
        {label !== undefined ? (
          <div
            className={styles.label}
            style={labelStyles}>
            <div>{label}</div>
            {labelSibling}
          </div>
        ) : null}
        <textarea
          id={id}
          ref={inputRef}
          name={name}
          placeholder={placeholder}
          value={value}
          maxLength={maxLength}
          onChange={onChange}
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

export { TextArea };
