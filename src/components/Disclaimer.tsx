import { CLOSING_NOTE, DISCLAIMER_NOTE } from "@/data/analysis-content";

export function Disclaimer() {
  return (
    <section className="space-y-5 text-base leading-8 text-muted">
      <p className="text-foreground">{CLOSING_NOTE}</p>
      <p>{DISCLAIMER_NOTE}</p>
    </section>
  );
}
