"use client";

import { DollarSign } from "lucide-react";
import { STEPS } from "@/lib/constants";
import { bidBreakdown, money } from "@/lib/calc";
import { useProjectStore } from "@/store/useProjectStore";
import { Card, Field, Input, StepHeading, Textarea } from "../ui";

export default function PricingStep() {
  const step = STEPS[7];
  const hours = useProjectStore((s) => s.hours);
  const pricing = useProjectStore((s) => s.pricing);
  const connections = useProjectStore((s) => s.connections);
  const setPricing = useProjectStore((s) => s.setPricing);
  const breakdown = bidBreakdown({ hours, pricing, connections });

  const rows = [
    { label: "Labor", value: breakdown.labor },
    { label: "Connection allowances", value: breakdown.connCost },
    { label: "Expenses", value: breakdown.expenses },
    { label: "Subtotal", value: breakdown.sub, emphasis: true },
    { label: `Contingency (${pricing.contingencyPct || 0}%)`, value: breakdown.contingency },
    { label: `Markup (${pricing.markupPct || 0}%)`, value: breakdown.markup },
  ];

  return (
    <div>
      <StepHeading
        icon={DollarSign}
        title={step.title}
        description={step.description}
      />

      <div className="grid gap-5 lg:grid-cols-5">
        <Card className="p-5 lg:col-span-2">
          <div className="grid gap-4">
            <Field label="Contingency (%)">
              <Input
                type="number"
                min="0"
                step="0.5"
                value={pricing.contingencyPct}
                onChange={(e) =>
                  setPricing({ contingencyPct: Number(e.target.value) })
                }
              />
            </Field>
            <Field label="Markup (%)">
              <Input
                type="number"
                min="0"
                step="0.5"
                value={pricing.markupPct}
                onChange={(e) =>
                  setPricing({ markupPct: Number(e.target.value) })
                }
              />
            </Field>
            <Field label="Expenses ($)" hint="Travel, prints, software, courier">
              <Input
                type="number"
                min="0"
                step="50"
                value={pricing.expenses}
                onChange={(e) =>
                  setPricing({ expenses: Number(e.target.value) })
                }
              />
            </Field>
            <Field label="Pricing notes">
              <Textarea
                value={pricing.notes}
                placeholder="Price valid 30 days. Escalation excluded. Connection design by others if not listed."
                onChange={(e) => setPricing({ notes: e.target.value })}
              />
            </Field>
          </div>
        </Card>

        <Card className="p-6 lg:col-span-3">
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Bid total
          </div>
          <div className="mt-1 font-mono text-4xl font-semibold tracking-tight text-amber-400">
            {money(breakdown.total)}
          </div>
          <ul className="mt-6 space-y-2">
            {rows.map((row) => (
              <li
                key={row.label}
                className={`flex items-center justify-between border-b border-white/6 py-2 text-sm ${
                  row.emphasis ? "text-zinc-100" : "text-zinc-400"
                }`}
              >
                <span>{row.label}</span>
                <span className="font-mono">{money(row.value)}</span>
              </li>
            ))}
            <li className="flex items-center justify-between pt-3 text-base font-semibold text-zinc-50">
              <span>Grand total</span>
              <span className="font-mono text-amber-400">
                {money(breakdown.total)}
              </span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
