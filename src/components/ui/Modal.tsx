"use client";

import { useEffect, useRef, type MouseEvent, type ReactNode } from "react";
import { LuX } from "react-icons/lu";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  /** The pop-up's name for screen readers, e.g. "Contact". Never shown on screen. */
  label: string;
  /** Optional text for a header strip, e.g. "Project". Without it there is no strip, only the close button. */
  title?: string;
  /** "side": a panel from the right (a bottom sheet on phones). "center": a centred box. */
  variant?: "side" | "center";
  children: ReactNode;
};

/*
  A pop-up built on the browser's <dialog> element. Opening it with
  showModal() gives, with no code of ours: focus moved inside and kept
  there, the rest of the page made inert, Esc to close, and focus returned
  to whatever opened it. The look and the animation are in globals.css.
*/
export function Modal({ open, onClose, label, title, variant = "side", children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  // React decides whether the pop-up should be open; this keeps the real
  // <dialog> in step with that decision.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      // showModal() focuses the first button, the close button. Move focus to
      // the content instead: no stray focus ring on open, and the arrow keys
      // scroll the panel straight away. Tab still reaches the close button.
      bodyRef.current?.scrollTo(0, 0);
      bodyRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // The dimmed backdrop belongs to the <dialog>, so a click on it arrives
  // with the dialog itself as the target. A click on the content does not.
  function handleClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) onClose();
  }

  const closeButton = (
    <button
      type="button"
      onClick={onClose}
      aria-label="Close"
      className="flex h-7 w-7 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-elevated hover:text-text-primary"
    >
      <LuX aria-hidden="true" className="h-4 w-4" />
    </button>
  );

  return (
    <dialog
      ref={dialogRef}
      aria-label={label}
      // Fires however the dialog closes, including the Esc key.
      onClose={onClose}
      onClick={handleClick}
      className={`modal ${variant === "side" ? "modal-side" : "modal-center"}`}
    >
      {title ? (
        <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-3">
          <p className="truncate text-xs font-medium uppercase tracking-[0.12em] text-text-dim">{title}</p>
          {closeButton}
        </div>
      ) : (
        // No strip: the close button floats in the top-right corner, over the content.
        <div className="absolute right-3 top-3 z-10">{closeButton}</div>
      )}
      <div
        ref={bodyRef}
        tabIndex={-1}
        className="overflow-y-auto overscroll-contain p-5 outline-none"
      >
        {children}
      </div>
    </dialog>
  );
}
