"use client";

import { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const formsubmitAction = process.env.NEXT_PUBLIC_FORMSUBMIT_ACTION || "";
  const autoresponseText =
    process.env.NEXT_PUBLIC_FORMSUBMIT_AUTORESPONSE ||
    "Faleminderit! Mesazhi juaj u pranua. Do t’ju kontaktojmë sa më shpejt të jetë e mundur.";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    const form = e.currentTarget;
    const fd = new FormData(form);

    try {
      if (!formsubmitAction) {
        setStatus("error");
        setErrorMsg(
          "Forma nuk është konfiguruar ende. Shto NEXT_PUBLIC_FORMSUBMIT_ACTION në .env.local dhe rifillo frontin."
        );
        return;
      }

      const emailVal = String(fd.get("email") || "").trim();
      const replyToEl = form.querySelector<HTMLInputElement>('input[name="_replyto"]');
      if (replyToEl) replyToEl.value = emailVal;

      setStatus("success");
      form.submit();
    } catch {
      setStatus("error");
      setErrorMsg("Gabim rrjeti. Kontrollo lidhjen dhe provo përsëri.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-xl space-y-5"
      noValidate
      action={formsubmitAction || undefined}
      method={formsubmitAction ? "POST" : undefined}
    >
      {formsubmitAction ? (
        <>
          <input type="hidden" name="_subject" value="Mesazh i ri nga forma e kontaktit" />
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_template" value="table" />
          <input type="hidden" name="_replyto" value="" />
          <input type="hidden" name="_autoresponse" value={autoresponseText} />
        </>
      ) : null}
      <div>
        <label htmlFor="fullName" className="mb-1.5 block text-[15px] font-semibold text-[#1d1d1d]">
          Emri dhe mbiemri <span className="text-red-600">*</span>
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          required
          autoComplete="name"
          className="w-full border border-gray-300 bg-white px-3 py-2.5 text-[15px] text-gray-900 outline-none ring-sky-500 focus:border-sky-500 focus:ring-1"
        />
      </div>

      <div>
        <label htmlFor="mobile" className="mb-1.5 block text-[15px] font-semibold text-[#1d1d1d]">
          Celulari <span className="text-red-600">*</span>
        </label>
        <input
          id="mobile"
          name="mobile"
          type="tel"
          required
          autoComplete="tel"
          className="w-full border border-gray-300 bg-white px-3 py-2.5 text-[15px] text-gray-900 outline-none ring-sky-500 focus:border-sky-500 focus:ring-1"
        />
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-[15px] font-semibold text-[#1d1d1d]">
          Email <span className="text-red-600">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full border border-gray-300 bg-white px-3 py-2.5 text-[15px] text-gray-900 outline-none ring-sky-500 focus:border-sky-500 focus:ring-1"
        />
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-[15px] font-semibold text-[#1d1d1d]">
          Mesazhi
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="w-full resize-y border border-gray-300 bg-white px-3 py-2.5 text-[15px] text-gray-900 outline-none ring-sky-500 focus:border-sky-500 focus:ring-1"
        />
      </div>

      {status === "error" ? (
        <p className="text-[14px] text-red-700" role="alert">
          {errorMsg}
        </p>
      ) : null}

      {status === "success" ? (
        <p className="text-[14px] font-medium text-green-800" role="status">
          Faleminderit! Mesazhi u dërgua.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-sm bg-sky-600 px-8 py-3 text-[15px] font-semibold text-white transition hover:bg-sky-700 disabled:opacity-60"
      >
        {status === "loading" ? "Duke dërguar…" : "Dërgo"}
      </button>
    </form>
  );
}
