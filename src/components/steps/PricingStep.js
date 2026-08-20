"use client";

import { DollarSign } from "lucide-react";
import { RATE_TIERS, STEPS } from "@/lib/constants";
import { bidBreakdown, formatNumber, money } from "@/lib/calc";
import { useProjectStore } from "@/store/useProjectStore";
import { Card, Field, Select, StepHeading } from "../ui";

export default function PricingStep() {
  const step = STEPS[7];
  const hours = useProjectStore((s) => s.hours);
  const pricing = useProjectStore((s) => s.pricing);
  const connections = useProjectStore((s) => s.connections);
  const setPricing = useProjectStore((s) => s.setPricing);
  const breakdown = bidBreakdown({ hours, pricing });
  const tierId = pricing.rateTier || "standard";

  const rows = [
    {
      label: "Structural hours",
      value: `${formatNumber(breakdown.structuralHours, 1)} hrs`,
    },
    {
      label: "Misc hours",
      value: `${formatNumber(breakdown.miscHours, 1)} hrs`,
    },
    {
      label: "Total hours",
      value: `${formatNumber(breakdown.hours, 1)} hrs`,
    },
    {
      label: "Selected rate",
      value: `${money(breakdown.rate, 0)}/hr`,
    },
    {
      label: "Connections",
      value: `${formatNumber(connections.count || 0)} · ${connections.type || "Simple"}`,
    },
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
          <Field label="Rate tier">
            <Select
              value={tierId}
              onChange={(e) => setPricing({ rateTier: e.target.value })}
            >
              {RATE_TIERS.map((tier) => (
                <option key={tier.id} value={tier.id}>
                  {tier.label}
                </option>
              ))}
            </Select>
          </Field>
          <p className="mt-4 text-xs leading-5 text-zinc-500">
            Total estimated fee = total hours × selected rate. Connection type
            is recorded on the bid but does not change this calculation.
          </p>
        </Card>

        <Card className="relative overflow-hidden p-6 lg:col-span-3">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-500/0 via-amber-400 to-amber-500/0" />
          <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
            Total estimated fee
          </div>
          <div className="mt-2 font-mono text-5xl font-semibold tracking-tight text-amber-400">
            {money(breakdown.total, 2)}
          </div>
          <p className="mt-2 text-sm text-zinc-400">
            {formatNumber(breakdown.hours, 1)} hrs × {money(breakdown.rate, 0)}
            /hr
          </p>
          <ul className="mt-6 space-y-2">
            {rows.map((row) => (
              <li
                key={row.label}
                className="flex items-center justify-between border-b border-white/6 py-2 text-sm text-zinc-400"
              >
                <span>{row.label}</span>
                <span className="font-mono text-zinc-200">{row.value}</span>
              </li>
            ))}
            <li className="flex items-center justify-between pt-3 text-base font-semibold text-zinc-50">
              <span>Total estimated fee</span>
              <span className="font-mono text-amber-400">
                {money(breakdown.total, 2)}
              </span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
