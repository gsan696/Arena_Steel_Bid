"use client";

import { useRef } from "react";
import { Table2 } from "lucide-react";
import { STEPS } from "@/lib/constants";
import { formatNumber, lineWeightLbs, totalTons } from "@/lib/calc";
import { SAMPLE_MTO } from "@/lib/sampleData";
import { useProjectStore } from "@/store/useProjectStore";
import { Badge, Button, Card, Stat, StepHeading } from "../ui";

export default function GenerateMtoStep() {
  const step = STEPS[3];
  const mto = useProjectStore((s) => s.mto);
  const setMto = useProjectStore((s) => s.setMto);
  const setMtoReview = useProjectStore((s) => s.setMtoReview);
  const analysis = useProjectStore((s) => s.analysis);
  const runningRef = useRef(false);
  const tons = totalTons(mto.items);
  const pieces = mto.items.reduce((s, i) => s + (Number(i.qty) || 0), 0);

  async function generate() {
    if (runningRef.current) return;
    runningRef.current = true;
    setMto({ status: "generating" });
    await new Promise((resolve) => setTimeout(resolve, 700));
    setMto({
      status: "complete",
      items: SAMPLE_MTO.map((item) => ({ ...item })),
      generatedAt: new Date().toISOString(),
    });
    setMtoReview({ approved: false, notes: "" });
    runningRef.current = false;
  }

  return (
    <div>
      <StepHeading
        icon={Table2}
        title={step.title}
        description={step.description}
        action={
          <Button onClick={generate} disabled={mto.status === "generating"}>
            {mto.status === "generating"
              ? "Generating…"
              : mto.status === "complete"
                ? "Regenerate MTO"
                : "Generate MTO"}
          </Button>
        }
      />

      {mto.status === "idle" ? (
        <Card className="px-6 py-12 text-center text-sm text-zinc-400">
          Generate a material takeoff from the reviewed drawing scope
          {analysis.status === "complete"
            ? ` (${analysis.drawingCount} sheets).`
            : ". Sample members will be used if analysis was skipped."}
        </Card>
      ) : null}

      {mto.status === "generating" ? (
        <Card className="p-6 text-sm text-zinc-400">
          Rolling up members by mark, grade, and length…
        </Card>
      ) : null}

      {mto.status === "complete" ? (
        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat label="Line items" value={formatNumber(mto.items.length)} />
            <Stat label="Pieces" value={formatNumber(pieces)} />
            <Stat label="Tonnage" value={`${formatNumber(tons, 2)} t`} />
          </div>

          <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
              <div className="text-sm font-semibold">MTO preview</div>
              <Badge tone="heat">
                {mto.generatedAt
                  ? new Date(mto.generatedAt).toLocaleString()
                  : "Generated"}
              </Badge>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-[11px] uppercase tracking-[0.14em] text-zinc-500">
                  <tr>
                    <th className="px-4 py-2 font-medium">Mark</th>
                    <th className="px-4 py-2 font-medium">Description</th>
                    <th className="px-4 py-2 font-medium">Grade</th>
                    <th className="px-4 py-2 font-medium">Qty</th>
                    <th className="px-4 py-2 font-medium">Length</th>
                    <th className="px-4 py-2 font-medium">Weight</th>
                  </tr>
                </thead>
                <tbody>
                  {mto.items.map((item) => (
                    <tr
                      key={item.id}
                      className="border-t border-white/6 text-zinc-300"
                    >
                      <td className="px-4 py-2 font-mono text-xs text-amber-300">
                        {item.mark}
                      </td>
                      <td className="px-4 py-2">{item.description}</td>
                      <td className="px-4 py-2">{item.grade}</td>
                      <td className="px-4 py-2 font-mono text-xs">{item.qty}</td>
                      <td className="px-4 py-2 font-mono text-xs">
                        {item.length}
                        {item.unit === "lb/ea" ? " ea" : " ft"}
                      </td>
                      <td className="px-4 py-2 font-mono text-xs">
                        {formatNumber(lineWeightLbs(item))} lb
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
