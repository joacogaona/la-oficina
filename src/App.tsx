import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useState } from "react";
import { ValidationError, useForm } from "@formspree/react";

export type LetterRequest = {
  nombre: string;
  barrio: string;
  email: string;
};

const FORMSPREE_FORM_ID = "mredjdzd";
const FORMSPREE_ENDPOINT = `https://formspree.io/f/${FORMSPREE_FORM_ID}`;

const initialForm: LetterRequest = {
  nombre: "",
  barrio: "",
  email: "",
};

function App() {
  const [form, setForm] = useState<LetterRequest>(initialForm);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [formspreeState, submitLetterRequest, resetLetterRequest] =
    useForm<LetterRequest>(FORMSPREE_FORM_ID);

  useEffect(() => {
    if (!formspreeState.succeeded) {
      return;
    }

    setForm(initialForm);
    setShowSuccessToast(true);
    setIsFormOpen(false);
  }, [formspreeState.succeeded]);

  useEffect(() => {
    if (!showSuccessToast) {
      return;
    }

    const toastTimer = window.setTimeout(() => {
      setShowSuccessToast(false);
    }, 5200);

    return () => {
      window.clearTimeout(toastTimer);
    };
  }, [showSuccessToast]);

  const updateField =
    (field: keyof LetterRequest) =>
      (event: ChangeEvent<HTMLInputElement>) => {
        setShowSuccessToast(false);
        resetLetterRequest();
        setForm((current) => ({
          ...current,
          [field]: event.target.value,
        }));
      };

  const openForm = () => {
    setShowSuccessToast(false);
    resetLetterRequest();
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const request: LetterRequest = {
      nombre: form.nombre.trim(),
      barrio: form.barrio.trim(),
      email: form.email.trim(),
    };

    await submitLetterRequest(request);
  };

  return (
    <main className="relative h-dvh overflow-hidden bg-ink text-ivory">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(245,234,212,0.08),rgba(7,6,5,0)_26rem)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(180deg,rgba(7,6,5,0),#070605)]" />

      <section className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <h1 className="max-w-4xl font-display text-[clamp(2.75rem,7vw,6.6rem)] font-medium leading-[0.9] text-ivory">
          La Oficina de los Últimos Cuentos
        </h1>
        <p className="mt-7 max-w-xl font-body text-[1.55rem] leading-8 text-parchment sm:text-3xl sm:leading-10">
          Para quienes sospechan que la magia todavía existe y prefiere viajar
          en sobre cerrado.
        </p>
        <button
          type="button"
          onClick={openForm}
          className="mt-10 border border-ivory/35 bg-ink px-7 py-3 font-fell text-sm uppercase tracking-[0.12em] text-ivory hover:border-ivory/65 focus:outline-none focus:ring-2 focus:ring-ivory/30"
        >
          SOLICITAR UNA CARTA
        </button>
        <p className="mt-5 font-body text-xl italic leading-7 text-parchment/80 sm:text-2xl">
          Una interrupción analógica en medio del ruido digital.
        </p>
      </section>

      {showSuccessToast ? (
        <div
          className="pointer-events-none fixed inset-x-0 bottom-6 z-30 flex justify-center px-5"
          role="status"
          aria-live="polite"
        >
          <div className="w-full max-w-md border border-ivory/20 bg-soot px-5 py-4 text-left shadow-[0_18px_60px_rgba(0,0,0,0.45)]">
            <p className="font-fell text-xs uppercase tracking-[0.12em] text-parchment/70">
              Solicitud enviada
            </p>
            <p className="mt-1 font-body text-lg leading-6 text-ivory">
              Tu solicitud fue registrada. La Oficina responderá cuando lo
              considere oportuno.
            </p>
          </div>
        </div>
      ) : null}

      {isFormOpen ? (
        <div
          className="absolute inset-0 z-20 flex items-center justify-center bg-ink px-5 py-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="request-title"
        >
          <div className="max-h-full w-full max-w-md overflow-y-auto border border-ivory/15 bg-soot p-6 sm:p-8">
            <div className="flex items-start justify-between gap-6">
              <div>
                <h2
                  id="request-title"
                  className="font-display text-4xl font-medium leading-none text-ivory"
                >
                  Solicitar carta
                </h2>
                <p className="mt-3 font-body text-xl leading-7 text-parchment">
                  Si la Oficina acepta tu solicitud, recibirás noticias del
                  mensajero.
                </p>
              </div>
              <button
                type="button"
                onClick={closeForm}
                className="border border-ivory/15 px-3 py-1 font-fell text-xl leading-none text-parchment hover:border-ivory/45 hover:text-ivory focus:outline-none focus:ring-2 focus:ring-ivory/30"
                aria-label="Cerrar formulario"
              >
                ×
              </button>
            </div>

            <form
              action={FORMSPREE_ENDPOINT}
              className="mt-8 space-y-5"
              method="POST"
              onSubmit={handleSubmit}
            >
              <label className="block">
                <span className="font-fell text-xs uppercase tracking-[0.1em] text-parchment/70">
                  Nombre
                </span>
                <input
                  required
                  name="nombre"
                  value={form.nombre}
                  onChange={updateField("nombre")}
                  className="mt-2 w-full border border-ivory/15 bg-ink px-4 py-3 font-body text-xl text-ivory outline-none focus:border-ivory/50"
                  autoComplete="name"
                />
                <ValidationError<LetterRequest>
                  className="mt-2 font-body text-base leading-5 text-wax"
                  errors={formspreeState.errors}
                  field="nombre"
                />
              </label>

              <label className="block">
                <span className="font-fell text-xs uppercase tracking-[0.1em] text-parchment/70">
                  Email
                </span>
                <input
                  required
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={updateField("email")}
                  className="mt-2 w-full border border-ivory/15 bg-ink px-4 py-3 font-body text-xl text-ivory outline-none focus:border-ivory/50"
                  autoComplete="email"
                />
                <ValidationError<LetterRequest>
                  className="mt-2 font-body text-base leading-5 text-wax"
                  errors={formspreeState.errors}
                  field="email"
                />
              </label>

              <label className="block">
                <span className="font-fell text-xs uppercase tracking-[0.1em] text-parchment/70">
                  Barrio
                </span>
                <input
                  required
                  name="barrio"
                  value={form.barrio}
                  onChange={updateField("barrio")}
                  className="mt-2 w-full border border-ivory/15 bg-ink px-4 py-3 font-body text-xl text-ivory outline-none focus:border-ivory/50"
                  autoComplete="address-level2"
                />
                <ValidationError<LetterRequest>
                  className="mt-2 font-body text-base leading-5 text-wax"
                  errors={formspreeState.errors}
                  field="barrio"
                />
              </label>

              <ValidationError<LetterRequest>
                className="font-body text-base leading-5 text-wax"
                errors={formspreeState.errors}
              />

              <button
                type="submit"
                disabled={formspreeState.submitting}
                className="w-full border border-wax bg-wax px-6 py-3 font-fell text-sm uppercase tracking-[0.12em] text-ivory focus:outline-none focus:ring-2 focus:ring-wax/50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {formspreeState.submitting
                  ? "ENVIANDO SOLICITUD"
                  : "ENVIAR SOLICITUD"}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </main>
  );
}

export default App;
