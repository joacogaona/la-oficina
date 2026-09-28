import { useEffect, useId, useRef } from "react";
import type {
  ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, ReactNode,
  SelectHTMLAttributes, TextareaHTMLAttributes,
} from "react";

export type OfficeTheme = "paper" | "night";
const classes = (...values: Array<string | undefined | false>) => values.filter(Boolean).join(" ");

export function BrandSignature({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span {...props} className={classes("office-signature", className)} role="img" aria-label="La Oficina de los Últimos Cuentos">
      <span aria-hidden="true">LA OFICINA <small>DE LOS</small><br /><span>ÚLTIMOS CUENTOS.</span></span>
    </span>
  );
}

export function Eyebrow({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p {...props} className={classes("office-eyebrow", className)} />;
}

export function Button({
  variant = "primary", pending = false, pendingLabel = "Enviando…", disabled,
  type = "button", className, children, ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "quiet";
  pending?: boolean;
  pendingLabel?: string;
}) {
  return <button {...props} type={type} disabled={disabled || pending} aria-busy={pending || undefined}
    className={classes("office-button", "office-button--" + variant, className)}>
    {pending ? pendingLabel : children}
  </button>;
}

type FieldContent = { label: string; hint?: string; error?: string };
function FieldMessages({ id, hint, error }: { id: string; hint?: string; error?: string }) {
  return <>
    {hint && <p id={id + "-hint"} className="office-field__hint">{hint}</p>}
    {error && <p id={id + "-error"} className="office-field__error">{error}</p>}
  </>;
}
function describedBy(id: string, hint?: string, error?: string, extra?: string) {
  return [hint && id + "-hint", error && id + "-error", extra].filter(Boolean).join(" ") || undefined;
}

export function TextField({ label, hint, error, id: suppliedId, className, required, ...props }:
  InputHTMLAttributes<HTMLInputElement> & FieldContent) {
  const generatedId = useId();
  const id = suppliedId || generatedId;
  return <div className="office-field">
    <label className="office-field__label" htmlFor={id}>{label}{!required && <span className="office-field__optional"> (opcional)</span>}</label>
    <input {...props} id={id} required={required} className={classes("office-input", className)}
      aria-invalid={error ? true : props["aria-invalid"]}
      aria-describedby={describedBy(id, hint, error, props["aria-describedby"])} />
    <FieldMessages id={id} hint={hint} error={error} />
  </div>;
}

export function TextAreaField({ label, hint, error, id: suppliedId, className, required, ...props }:
  TextareaHTMLAttributes<HTMLTextAreaElement> & FieldContent) {
  const generatedId = useId();
  const id = suppliedId || generatedId;
  return <div className="office-field">
    <label className="office-field__label" htmlFor={id}>{label}{!required && <span className="office-field__optional"> (opcional)</span>}</label>
    <textarea rows={4} {...props} id={id} required={required} className={classes("office-input", className)}
      aria-invalid={error ? true : props["aria-invalid"]}
      aria-describedby={describedBy(id, hint, error, props["aria-describedby"])} />
    <FieldMessages id={id} hint={hint} error={error} />
  </div>;
}

export function SelectField({ label, hint, error, id: suppliedId, className, required, children, ...props }:
  SelectHTMLAttributes<HTMLSelectElement> & FieldContent) {
  const generatedId = useId();
  const id = suppliedId || generatedId;
  return <div className="office-field">
    <label className="office-field__label" htmlFor={id}>{label}{!required && <span className="office-field__optional"> (opcional)</span>}</label>
    <select {...props} id={id} required={required} className={classes("office-input", className)}
      aria-invalid={error ? true : props["aria-invalid"]}
      aria-describedby={describedBy(id, hint, error, props["aria-describedby"])}>{children}</select>
    <FieldMessages id={id} hint={hint} error={error} />
  </div>;
}

export function CheckboxField({ label, hint, error, id: suppliedId, className, ...props }:
  Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & FieldContent) {
  const generatedId = useId();
  const id = suppliedId || generatedId;
  return <div className="office-field">
    <label className={classes("office-checkbox", className)} htmlFor={id}>
      <input {...props} id={id} type="checkbox" aria-invalid={error ? true : props["aria-invalid"]}
        aria-describedby={describedBy(id, hint, error, props["aria-describedby"])} />
      <span>{label}</span>
    </label>
    <FieldMessages id={id} hint={hint} error={error} />
  </div>;
}

export function Notice({ title, children, tone = "info", className, ...props }:
  HTMLAttributes<HTMLDivElement> & { title: string; tone?: "info" | "success" | "error" }) {
  return <div {...props} className={classes("office-notice", "office-notice--" + tone, className)}
    role={tone === "error" ? "alert" : "status"} aria-atomic="true">
    <p className="office-notice__title">{title}</p>
    <div>{children}</div>
  </div>;
}

export function EditorialQuote({ children, source, className, ...props }:
  HTMLAttributes<HTMLQuoteElement> & { source?: string }) {
  return <blockquote {...props} className={classes("office-quote", className)}>
    <p>{children}</p>{source && <cite>{source}</cite>}
  </blockquote>;
}

export function PaperCard({ tone = "paper", className, ...props }:
  HTMLAttributes<HTMLElement> & { tone?: "paper" | "red" | "olive" | "blue" | "night" }) {
  return <article {...props} data-office-theme={tone === "night" ? "night" : "paper"}
    className={classes("office-card", "office-card--" + tone, className)} />;
}

/** Envelope front: sender lines top left, the stamp with the "L." of the signature top right, and the address (children) bottom right. */
export function Envelope({ className, children, ...props }: HTMLAttributes<HTMLElement>) {
  return <PaperCard {...props} className={classes("office-envelope", "office-surface", className)}>
    <div className="office-envelope-sender" aria-hidden="true"><Eyebrow>Remitente</Eyebrow><span /><span /></div>
    <span className="office-envelope-stamp" aria-hidden="true">L.</span>
    {children}
  </PaperCard>;
}

/** Native modal: focus containment, Escape, inert background and focus restoration. */
export function Dialog({ open, onClose, title, description, children, theme = "paper" }: {
  open: boolean; onClose: () => void; title: string; description?: string;
  children: ReactNode; theme?: OfficeTheme;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const id = useId();
  useEffect(() => {
    const element = ref.current;
    if (!element || !open) return;
    const priorOverflow = document.body.style.overflow;
    element.showModal();
    titleRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      element.close();
      document.body.style.overflow = priorOverflow;
    };
  }, [open]);
  return <dialog ref={ref} className="office-dialog" data-office-theme={theme}
    aria-labelledby={id + "-title"} aria-describedby={description ? id + "-description" : undefined}
    onCancel={event => { event.preventDefault(); onClose(); }}
    onKeyDown={event => {
      if (event.key !== "Tab") return;
      const focusable = [...event.currentTarget.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )].filter(element => element.getClientRects().length > 0);
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) { event.preventDefault(); titleRef.current?.focus(); return; }
      if (event.shiftKey && (document.activeElement === first || document.activeElement === titleRef.current)) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    }}>
    <div className="office-dialog__header">
      <h2 ref={titleRef} tabIndex={-1} id={id + "-title"}>{title}</h2>
      <Button variant="quiet" onClick={onClose} aria-label="Cerrar formulario">×</Button>
    </div>
    {description && <p id={id + "-description"} className="office-dialog__description">{description}</p>}
    {children}
  </dialog>;
}
