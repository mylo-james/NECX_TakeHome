import React, { forwardRef } from "react";
import classNames from "classnames";

type TextButtonProps = {
  className?: string;
  children?: React.ReactNode;
  href?: string;
  iconPosition?: string;
  block?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onClick?: (
    event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement, MouseEvent>
  ) => void;
} & React.AnchorHTMLAttributes<HTMLAnchorElement> &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

const TextButton = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  TextButtonProps
>(
  (
    {
      className,
      children,
      href,
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
      "TextButton",
      { "TextButton-block": block },
      { "TextButton-loading": loading },
      { [`TextButton-with-icon-${iconPosition}`]: iconPosition },
      className
    );

    const Tag = href ? "a" : "button";
    const opts: any = {
      className: classes,
      disabled,
      onClick,
      ...attrs,
    };

    if (href) {
      opts.href = href;
    }

    return React.createElement(Tag, { ...opts, ref }, children);
  }
);

TextButton.displayName = "TextButton";

export default TextButton;
