import React, { SyntheticEvent, ButtonHTMLAttributes, forwardRef } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Additional class(es) to add to the component. */
  className?: string;
  /** The markup node to insert into the button. */
  children?: React.ReactNode;
  /** The color of the button. */
  color?: "primary" | "secondary" | "tertiary";
  /** If an icon is provided, whether to add the margin to the icon on the left or right side. */
  iconPosition?: "left" | "right";
  /** Whether the button should display as a block level element. */
  block?: boolean;
  /** Whether to show a loading animation inside of the button. */
  loading?: boolean;
  /**
   * The handler to execute when the button is clicked.
   *
   * @param {SyntheticEvent} evt - The React `SyntheticEvent`.
   */
  onClick?: (evt: SyntheticEvent) => void;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      type,
      color = "primary",
      iconPosition,
      block,
      disabled,
      loading,
      onClick,
      ...attrs
    },
    ref
  ) => {
    const classes = classNames(
      "Button",
      { [`Button-${color}`]: color },
      { "Button-block": block },
      { "Button-loading": loading },
      { [`Button-with-icon-${iconPosition}`]: iconPosition },
      className
    );

    return (
      <button
        {...attrs}
        className={classes}
        type={type}
        disabled={disabled}
        onClick={onClick}
        ref={ref}
      >
        {children}
      </button>
    );
  }
);

Button.propTypes = {
  /** Additional class(es) to add to the component. */
  className: PropTypes.string,
  /** The markup node to insert into the button. */
  children: PropTypes.node,
  /** The type of button that is rendered. */
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  /** The color of the button. */
  color: PropTypes.oneOf(["primary", "secondary", "tertiary"]),
  /** If an icon is provided, whether to add the margin to the icon on the left or right side. */
  iconPosition: PropTypes.oneOf(["left", "right"]),
  /** Whether the button should display as a block level element. */
  block: PropTypes.bool,
  /** Whether the button is disabled or not. */
  disabled: PropTypes.bool,
  /** Whether to show a loading animation inside of the button. */
  loading: PropTypes.bool,
  /**
   * The handler to execute when the button is clicked.
   *
   * @param {SyntheticEvent} evt - The React `SyntheticEvent`.
   */
  onClick: PropTypes.func,
};

Button.defaultProps = {
  type: "button",
};

export default Button;
