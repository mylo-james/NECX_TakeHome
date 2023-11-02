import React, {
  useState,
  forwardRef,
  ForwardRefRenderFunction,
  useImperativeHandle,
} from "react";
import classNames from "classnames";

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  error: string;
  touched: boolean;
  ref: React.Ref<PasswordInputRef>;
}

export interface PasswordInputRef {
  passwordRef: React.Ref<HTMLInputElement>;
  showRef: React.RefObject<HTMLButtonElement>;
}

const PasswordInput: ForwardRefRenderFunction<
  PasswordInputRef,
  PasswordInputProps
> = ({ value, onChange, label, error, touched }, forwardedRef) => {
  const [showPassword, setShowPassword] = useState(false);
  const lowerLabel = label.toLowerCase();
  const passwordRef = React.useRef<HTMLInputElement>(null);
  const showRef = React.useRef<HTMLButtonElement>(null);

  const handleShowHideClick = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  useImperativeHandle(forwardedRef, () => ({
    passwordRef: passwordRef,
    showRef: showRef,
  }));

  return (
    <>
      <label htmlFor={lowerLabel}>{label}</label>
      <div className="password-input-container">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={handlePasswordChange}
          id={lowerLabel}
          className="password-input"
          ref={passwordRef}
        />
        <button
          ref={showRef}
          type="button"
          className="show-hide"
          onClick={handleShowHideClick}
        >
          {showPassword ? (
            <i className="fa-solid fa-eye-slash"></i>
          ) : (
            <i className="fa-regular fa-eye"></i>
          )}
        </button>
      </div>
      <div className={classNames("error-text")}>
        {error && touched ? <p>{error}</p> : null}
      </div>
    </>
  );
};

export default forwardRef<PasswordInputRef, PasswordInputProps>(PasswordInput);
