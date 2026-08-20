"use client";

import { ListChecks } from "lucide-react";
import { STEPS } from "@/lib/constants";
import { formatNumber, lineWeightLbs, totalTons } from "@/lib/calc";
import { useProjectStore } from "@/store/useProjectStore";
import { Callout, Card, Field, Input, Stat, StepHeading, Textarea } from "../ui";

export default function ReviewMtoStep() {
  const step = STEPS[4];
  const mto = useProjectStore((s) => s.mto);
  const mtoReview = useProjectStore((s) => s.mtoReview);
  const updateMtoItem = useProjectStore((s) => s.updateMtoItem);
  const setMtoReview = useProjectStore((s) => s.setMtoReview);
  const items = mto.items || [];
  const tons = totalTons(items);

  return (
    <div>
      <StepHeading
        icon={ListChecks}
        title={step.title}
        description={step.description}
      />

      {items.length === 0 ? (
        <Callout>
          No MTO has been generated yet. Go back to Generate MTO, then return
          here to edit quantities and approve the takeoff.
        </Callout>
      ) : (
        <>
          <div className="mb-5 grid gap-3 sm:grid-cols-3">
            <Stat label="Line items" value={formatNumber(items.length)} />
            <Stat label="Tonnage" value={`${formatNumber(tons, 2)} t`} />
            <Stat
              label="Approval"
              value={mtoReview.approved ? "Approved" : "In review"}
            />
          </div>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="text-[11px] uppercase tracking-[0.14em] text-zinc-500">
                  <tr>
                    <th className="px-3 py-2 font-medium">Mark</th>
                    <th className="px-3 py-2 font-medium">Description</th>
                    <th className="px-3 py-2 font-medium">Size</th>
                    <th className="px-3 py-2 font-medium">Grade</th>
                    <th className="px-3 py-2 font-medium">Qty</th>
                    <th className="px-3 py-2 font-medium">Length</th>
                    <th className="px-3 py-2 font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-t border-white/6">
                      <td className="px-3 py-2 font-mono text-xs text-amber-300">
                        {item.mark}
                      </td>
                      <td className="px-3 py-2 text-zinc-300">
                        {item.description}
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          className="min-w-[110px] py-1.5 font-mono text-xs"
                          value={item.size}
                          onChange={(e) =>
                            updateMtoItem(item.id, { size: e.target.value })
                          }
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          className="min-w-[90px] py-1.5 font-mono text-xs"
                          value={item.grade}
                          onChange={(e) =>
                            updateMtoItem(item.id, { grade: e.target.value })
                          }
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          type="number"
                          min="0"
                          className="w-[80px] py-1.5 font-mono text-xs"
                          value={item.qty}
                          onChange={(e) =>
                            updateMtoItem(item.id, {
                              qty: Number(e.target.value),
                            })
                          }
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          type="number"
                          min="0"
                          step="0.1"
                          className="w-[90px] py-1.5 font-mono text-xs"
                          value={item.length}
                          onChange={(e) =>
                            updateMtoItem(item.id, {
                              length: Number(e.target.value),
                            })
                          }
                        />
                      </td>
                      <td className="px-3 py-2 font-mono text-xs text-zinc-400">
                        {formatNumber(lineWeightLbs(item))} lb
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <Card className="p-5">
              <Field label="Review notes">
                <Textarea
                  value={mtoReview.notes}
                  placeholder="Adjusted B3 quantity to match roof plan. Cap plates confirmed A36."
                  onChange={(e) => setMtoReview({ notes: e.target.value })}
                />
              </Field>
            </Card>
            <Card className="p-5">
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-white/10 bg-steel-950/40 px-4 py-3">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 accent-amber-500"
                  checked={mtoReview.approved}
                  onChange={(e) =>
                    setMtoReview({ approved: e.target.checked })
                  }
                />
                <span className="text-sm text-zinc-200">
                  MTO is approved. Use these quantities for connections, hours,
                  and pricing.
                </span>
              </label>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
