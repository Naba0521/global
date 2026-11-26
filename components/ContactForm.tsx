"use client";

import { FormEvent } from "react";
import { t } from "@/lib/content";
import type { Locale } from "@/lib/locale";

export function ContactForm({ locale }: { locale: Locale }) {
  const copy = t(locale);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const lines = [
      `${copy.contact.name}: ${data.get("name") ?? ""}`,
      `${copy.contact.company}: ${data.get("company") ?? ""}`,
      `${copy.contact.type}: ${data.get("type") ?? ""}`,
      `${copy.contact.date}: ${data.get("date") ?? ""}`,
      "",
      String(data.get("message") ?? ""),
    ];
    const subject = encodeURIComponent("Global Stage Group");
    const body = encodeURIComponent(lines.join("\n"));
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <Field label={copy.contact.name} name="name" required />
      <Field label={copy.contact.company} name="company" />
      <label className="grid gap-2 text-xs tracking-[0.16em] text-mist">
        {copy.contact.type}
        <select
          name="type"
          className="border border-white/15 bg-transparent px-3 py-3 text-base tracking-normal text-paper"
        >
          <option className="bg-ink">{copy.workPage.concert}</option>
          <option className="bg-ink">{copy.workPage.festival}</option>
          <option className="bg-ink">{copy.workPage.exhibition}</option>
          <option className="bg-ink">{copy.workPage.broadcast}</option>
        </select>
      </label>
      <Field label={copy.contact.date} name="date" />
      <label className="grid gap-2 text-xs tracking-[0.16em] text-mist">
        {copy.contact.message}
        <textarea
          name="message"
          rows={5}
          className="border border-white/15 bg-transparent px-3 py-3 text-base tracking-normal text-paper"
        />
      </label>
      <button
        type="submit"
        className="mt-2 border border-ember px-4 py-3 text-sm tracking-[0.16em] text-ember"
      >
        {copy.contact.send}
      </button>
      <p className="text-sm text-mist">{copy.contact.note}</p>
    </form>
  );
}

function Field({
  label,
  name,
  required,
}: {
  label: string;
  name: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2 text-xs tracking-[0.16em] text-mist">
      {label}
      <input
        name={name}
        required={required}
        className="border border-white/15 bg-transparent px-3 py-3 text-base tracking-normal text-paper"
      />
    </label>
  );
}
