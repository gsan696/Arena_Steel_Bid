"use client";

import { useState } from "react";
import { Download, ListChecks } from "lucide-react";
import { STEPS } from "@/lib/constants";
import { formatNumber } from "@/lib/calc";
import {
  downloadMtoExcel,
  formatLbs,
  itemsByCategory,
  lineTotalLbs,
  mtoTotals,
} from "@/lib/mto";
import { useProjectStore } from "@/store/useProjectStore";
import { Badge, Button, Callout, Card, Stat, StepHeading } from "../ui";

function ReadOnlyTable({ title, items, empty }) {
  const subtotal = items.reduce((sum, item) => sum + lineTotalLbs(item), 0);
  const qty = items.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
        <h3 className="text-sm font-semibold text-zinc-200">{title}</h3>
        <Badge tone="heat">{formatLbs(subtotal)}</Badge>
      </div>
      {items.length === 0 ? (
        <p className="px-4 py-8 text-sm text-zinc-500">{empty}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-[11px] uppercase tracking-[0.14em] text-zinc-500">
              <tr>
                <th className="px-4 py-2 font-medium">Description</th>
                <th className="px-4 py-2 font-medium">Section / size</th>
                <th className="px-4 py-2 font-medium">Weight / unit</th>
                <th className="px-4 py-2 font-medium">Qty</th>
                <th className="px-4 py-2 font-medium">Total weight</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t border-white/6 text-zinc-300">
                  <td className="px-4 py-2">{item.description || "—"}</td>
                  <td className="px-4 py-2 font-mono text-xs text-amber-300">
                    {item.size || "—"}
                  </td>
                  <td className="px-4 py-2 font-mono text-xs">
                    {formatNumber(item.weight, 2)} lb
                  </td>
                  <td className="px-4 py-2 font-mono text-xs">{item.qty}</td>
                  <td className="px-4 py-2 font-mono text-xs">
                    {formatLbs(lineTotalLbs(item))}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-white/10 bg-steel-950/40 text-xs">
                <td className="px-4 py-3 font-semibold text-zinc-200" colSpan={3}>
                  Total
                </td>
                <td className="px-4 py-3 font-mono text-zinc-400">
                  {formatNumber(qty)}
                </td>
                <td className="px-4 py-3 font-mono text-amber-300">
                  {formatLbs(subtotal)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </Card>
  );
}

export default function ReviewMtoStep() {
  const step = STEPS[4];
  const items = useProjectStore((s) => s.mto.items);
  const projectName = useProjectStore((s) => s.client.projectName);
  const [busy, setBusy] = useState(false);
  const totals = mtoTotals(items);
  const structural = itemsByCategory(items, "Structural");
  const misc = itemsByCategory(items, "Misc");

  async function onDownload() {
    setBusy(true);
    try {
      await downloadMtoExcel(items, projectName);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <StepHeading
        icon={ListChecks}
        title={step.title}
        description={step.description}
        action={
          <Button onClick={onDownload} disabled={!items.length || busy}>
            <Download className="h-4 w-4" />
            {busy ? "Building workbook…" : "Download MTO Excel"}
          </Button>
        }
      />

      {items.length === 0 ? (
        <Callout>
          No MTO lines yet. Go back to Generate MTO, add structural and misc
          rows, then return here to review and export.
        </Callout>
      ) : (
        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat
              label="Total structural weight"
              value={formatLbs(totals.structural)}
            />
            <Stat label="Total misc weight" value={formatLbs(totals.misc)} />
            <Stat label="Grand total" value={formatLbs(totals.grand)} />
          </div>

          <ReadOnlyTable
            title="Main structural steel"
            items={structural}
            empty="No structural lines in this takeoff."
          />
          <ReadOnlyTable
            title="Misc steel"
            items={misc}
            empty="No miscellaneous steel lines in this takeoff."
          />
        </div>
      )}
    </div>
  );
}
