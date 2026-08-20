"use client";

import { Plus, Table2, Trash2 } from "lucide-react";
import { STEPS } from "@/lib/constants";
import { formatNumber } from "@/lib/calc";
import {
  MTO_CATEGORIES,
  createMtoRow,
  formatLbs,
  lineTotalLbs,
  mtoTotals,
} from "@/lib/mto";
import { useProjectStore } from "@/store/useProjectStore";
import { Button, Card, Input, Select, Stat, StepHeading } from "../ui";

const compactInput = "min-w-0 py-1.5 text-xs";

export default function GenerateMtoStep() {
  const step = STEPS[3];
  const items = useProjectStore((s) => s.mto.items);
  const addMtoRow = useProjectStore((s) => s.addMtoRow);
  const removeMtoRow = useProjectStore((s) => s.removeMtoRow);
  const updateMtoItem = useProjectStore((s) => s.updateMtoItem);
  const totals = mtoTotals(items);

  function addRow(category = "Structural") {
    addMtoRow(createMtoRow({ category }));
  }

  return (
    <div>
      <StepHeading
        icon={Table2}
        title={step.title}
        description={step.description}
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => addRow("Misc")}>
              <Plus className="h-4 w-4" />
              Misc
            </Button>
            <Button onClick={() => addRow("Structural")}>
              <Plus className="h-4 w-4" />
              Add row
            </Button>
          </div>
        }
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <Stat
          label="Total structural weight"
          value={formatLbs(totals.structural)}
          hint={`${items.filter((i) => i.category === "Structural").length} lines`}
        />
        <Stat
          label="Total misc weight"
          value={formatLbs(totals.misc)}
          hint={`${items.filter((i) => i.category === "Misc").length} lines`}
        />
        <Stat
          label="Grand total"
          value={formatLbs(totals.grand)}
          hint={`${formatNumber(totals.qty)} pcs`}
        />
      </div>

      <Card className="overflow-hidden">
        {items.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <p className="text-sm text-zinc-400">
              No takeoff lines yet. Add a structural or misc row to start the
              MTO.
            </p>
            <Button className="mt-5" onClick={() => addRow("Structural")}>
              <Plus className="h-4 w-4" />
              Add row
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="bg-steel-950/60 text-[11px] uppercase tracking-[0.14em] text-zinc-500">
                <tr>
                  <th className="px-3 py-3 font-medium">Category</th>
                  <th className="px-3 py-3 font-medium">Description</th>
                  <th className="px-3 py-3 font-medium">Section / size</th>
                  <th className="px-3 py-3 font-medium">Weight / unit (lbs)</th>
                  <th className="px-3 py-3 font-medium">Quantity</th>
                  <th className="px-3 py-3 font-medium">Total weight</th>
                  <th className="px-3 py-3 font-medium">
                    <span className="sr-only">Delete</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-t border-white/6">
                    <td className="px-3 py-2">
                      <Select
                        className={`${compactInput} w-[132px]`}
                        value={item.category}
                        onChange={(e) =>
                          updateMtoItem(item.id, { category: e.target.value })
                        }
                      >
                        {MTO_CATEGORIES.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </Select>
                    </td>
                    <td className="px-3 py-2">
                      <Input
                        className={`${compactInput} min-w-[180px]`}
                        placeholder="W12x26 Beam"
                        value={item.description}
                        onChange={(e) =>
                          updateMtoItem(item.id, {
                            description: e.target.value,
                          })
                        }
                      />
                    </td>
                    <td className="px-3 py-2">
                      <Input
                        className={`${compactInput} w-[130px] font-mono`}
                        placeholder="W12x26"
                        value={item.size}
                        onChange={(e) =>
                          updateMtoItem(item.id, { size: e.target.value })
                        }
                      />
                    </td>
                    <td className="px-3 py-2">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        className={`${compactInput} w-[120px] font-mono`}
                        value={item.weight}
                        onChange={(e) =>
                          updateMtoItem(item.id, {
                            weight: Number(e.target.value),
                          })
                        }
                      />
                    </td>
                    <td className="px-3 py-2">
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        className={`${compactInput} w-[90px] font-mono`}
                        value={item.qty}
                        onChange={(e) =>
                          updateMtoItem(item.id, {
                            qty: Number(e.target.value),
                          })
                        }
                      />
                    </td>
                    <td className="px-3 py-2 font-mono text-xs text-amber-300">
                      {formatLbs(lineTotalLbs(item))}
                    </td>
                    <td className="px-3 py-2">
                      <Button
                        variant="danger"
                        className="px-2 py-1"
                        onClick={() => removeMtoRow(item.id)}
                        aria-label="Delete row"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-white/10 bg-steel-950/40 text-xs">
                  <td className="px-3 py-3 font-semibold text-zinc-300" colSpan={4}>
                    Totals
                  </td>
                  <td className="px-3 py-3 font-mono text-zinc-400">
                    {formatNumber(totals.qty)}
                  </td>
                  <td className="px-3 py-3 font-mono text-amber-300" colSpan={2}>
                    {formatLbs(totals.grand)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
