import React, {
  ChangeEventHandler,
  KeyboardEventHandler,
} from 'react';
import styles from './styles/textArea.module.css';
import clsx from 'clsx';

type TextInputProps = {
  id?: string;
  name: string;
  label?: string;
  placeholder?: string;
  error?: string;
  value?: string;
  maxLength?: number;
  labelSibling?: React.ReactElement;
  containerStyles?: React.CSSProperties;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
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
    value,
    labelSibling,
    containerStyles,
    onChange,
    onKeyDown,
  } = props;

  return (
    <div
      id={id}
      className={clsx(
        styles.textInput,
        error !== undefined ? styles.inputError : null
      )}
      style={containerStyles}>
      <label>
        {label !== undefined ? (
          <div className={styles.label}>
            <div>{label}</div>
            {labelSibling}
          </div>
        ) : null}
        <textarea
          name={name}
          placeholder={placeholder}
          value={value}
          maxLength={maxLength}
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
        {Boolean(error) ? (
          <div className={styles.errorText}>{error}</div>
        ) : null}
      </label>
    </div>
  );
}

export { TextArea };
