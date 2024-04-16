import React, { forwardRef } from 'react';

type TextAreaProps = {
  appendInnerIcon?: React.ReactNode;
  autoComplete?: 'on' | 'off';
  autoFocus?: boolean;
  onBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  value: string;
  // label: string;
  placeholder?: string;
  id: string; // e.g. "input-773"
  name: string;
  /** Determines TextArea Theme/Style */
  variant?: 'outlined' | 'underlined' |'default';
  errorMessages?: string[];
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea({ appendInnerIcon, autoComplete = 'on', autoFocus = false, onBlur, onChange, placeholder, value, id, name, variant = 'default', errorMessages }: TextAreaProps, ref) {
  return (
    <div className="text-field_root">
      <div className={`text-field_control ${'v_' + variant} ${value.length ? 'active' : ''}`}>
        <div className={`text-field ${'v_' + variant} ${value.length ? 'active' : ''}`}>
          {/* <label htmlFor={id}>{label}</label> */}
          <textarea
            required
            autoComplete={autoComplete}
            autoFocus={autoFocus}
            id={id}
            name={name}
            placeholder={placeholder}
            ref={ref}
            tabIndex={0}
            value={value}
            onBlur={onBlur}
            onChange={onChange}
          />
        </div>
        {/* PREFIX */}

        {/* SUFFIX */}

        {/* PREPEND INNER ICON */}

        {/* PREPEND ICON */}

        {/* APPEND INNER ICON */}
        {appendInnerIcon &&
        <div className="append-inner">
          {appendInnerIcon}
        </div>
        }
        {/* APPEND ICON */}
      </div>
      <div className="v-input__details">
        <div aria-live="polite" className="v-messages" id={`${id}-messages`} role="alert">
          {/* HINTS [] */}
          {/* ERROR MESSAGES */}
          {errorMessages && errorMessages.map((errorMsg, index) => {
            return (
              <p className="error" key={`${id}-error-${index}`}>{errorMsg}</p>
            );
          })}

        </div>
      </div>
    </div>
  );
});

export default TextArea;