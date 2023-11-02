// Modal.tsx
import React, { useEffect, useRef, useState } from "react";
import Button from "../Button";
import TextButton from "../TextButton";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  focusableRefs?: React.RefObject<HTMLElement>[];
}

const Modal: React.FC<ModalProps> = ({
  children,
  onClose,
  focusableRefs = [],
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const [focusIndex, setFocusIndex] = useState(0);

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };
  const handleKeyDown = (event: React.KeyboardEvent) => {
    const focusableElements = [
      ...focusableRefs,
      cancelButtonRef.current,
      closeButtonRef.current,
    ].filter((el) => el !== null);

    if (event.key === "Escape") {
      onClose();
    }

    if (event.key === "Tab") {
      event.preventDefault();
      const i = (focusIndex + 1) % focusableElements.length;
      const element = focusableElements[i];
      if (element instanceof HTMLElement) {
        element.focus();
      } else if (element && element.current instanceof HTMLElement) {
        element.current.focus();
      }
      setFocusIndex(i);
    }
  };

  useEffect(() => {
    setFocusIndex(0);
  }, [focusableRefs]);

  useEffect(() => {
    if (focusableRefs[0]) {
      focusableRefs[0].current?.focus();
    } else {
      closeButtonRef.current?.focus();
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="modal" ref={modalRef} onKeyDown={handleKeyDown}>
      <div className="modal-content">
        <Button className="close" onClick={onClose} ref={closeButtonRef}>
          &times;
        </Button>
        {children}
        <TextButton
          className="cancel"
          ref={cancelButtonRef}
          onClick={onClose}
          href="#"
        >
          Cancel
        </TextButton>
      </div>
    </div>
  );
};

export default Modal;
