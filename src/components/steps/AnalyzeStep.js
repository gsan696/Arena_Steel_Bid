"use client";

import { useEffect, useRef } from "react";
import { ScanSearch } from "lucide-react";
import { STEPS } from "@/lib/constants";
import { formatNumber } from "@/lib/calc";
import { buildSampleAnalysis } from "@/lib/sampleData";
import { useProjectStore } from "@/store/useProjectStore";
import { Badge, Button, Card, Stat, StepHeading } from "../ui";

export default function AnalyzeStep() {
  const step = STEPS[1];
  const files = useProjectStore((s) => s.files);
  const analysis = useProjectStore((s) => s.analysis);
  const setAnalysis = useProjectStore((s) => s.setAnalysis);
  const runningRef = useRef(false);

  useEffect(() => {
    return () => {
      runningRef.current = false;
    };
  }, []);

  async function runAnalysis() {
    if (runningRef.current) return;
    runningRef.current = true;
    setAnalysis({ status: "running", progress: 0 });

    for (let i = 8; i <= 100; i += 8) {
      await new Promise((resolve) => setTimeout(resolve, 90));
      if (!runningRef.current) return;
      setAnalysis({ status: "running", progress: Math.min(i, 100) });
    }

    setAnalysis(buildSampleAnalysis(files.length));
    runningRef.current = false;
  }

  const sheets = analysis.sheets || [];
  const summary = analysis.memberSummary || [];

  return (
    <div>
      <StepHeading
        icon={ScanSearch}
        title={step.title}
        description={step.description}
        action={
          <Button
            onClick={runAnalysis}
            disabled={analysis.status === "running"}
          >
            {analysis.status === "running"
              ? "Analyzing…"
              : analysis.status === "complete"
                ? "Re-run analysis"
                : "Run analysis"}
          </Button>
        }
      />

      {analysis.status === "idle" ? (
        <Card className="px-6 py-12 text-center">
          <p className="text-sm text-zinc-400">
            Run analysis to parse the drawing set
            {files.length ? ` (${files.length} file${files.length === 1 ? "" : "s"})` : ""}.
            If no files were uploaded, a representative sample building will be used.
          </p>
        </Card>
      ) : null}

      {analysis.status === "running" ? (
        <Card className="p-6">
          <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.16em] text-zinc-500">
            <span>Extracting sheets & member geometry</span>
            <span className="font-mono text-amber-400">{analysis.progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/8">
            <div
              className="h-full rounded-full bg-amber-500 transition-all"
              style={{ width: `${analysis.progress}%` }}
            />
          </div>
        </Card>
      ) : null}

      {analysis.status === "complete" ? (
        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat
              label="Sheets parsed"
              value={formatNumber(analysis.drawingCount)}
            />
            <Stat
              label="Member groups"
              value={formatNumber(summary.length)}
            />
            <Stat
              label="Est. tonnage"
              value={`${formatNumber(
                summary.reduce((s, m) => s + m.tons, 0),
                1
              )} t`}
            />
          </div>

          <div className="grid gap-5 lg:grid-cols-5">
            <Card className="overflow-hidden lg:col-span-3">
              <div className="border-b border-white/8 px-4 py-3 text-sm font-semibold">
                Detected sheets
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-[11px] uppercase tracking-[0.14em] text-zinc-500">
                    <tr>
                      <th className="px-4 py-2 font-medium">Sheet</th>
                      <th className="px-4 py-2 font-medium">Title</th>
                      <th className="px-4 py-2 font-medium">Type</th>
                      <th className="px-4 py-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sheets.map((sheet) => (
                      <tr
                        key={sheet.id}
                        className="border-t border-white/6 text-zinc-300"
                      >
                        <td className="px-4 py-2 font-mono text-xs text-amber-300">
                          {sheet.number}
                        </td>
                        <td className="px-4 py-2">{sheet.title}</td>
                        <td className="px-4 py-2">{sheet.type}</td>
                        <td className="px-4 py-2">
                          <Badge
                            tone={
                              sheet.status === "Needs Review" ? "warn" : "good"
                            }
                          >
                            {sheet.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card className="p-4 lg:col-span-2">
              <div className="mb-3 text-sm font-semibold">Member summary</div>
              <ul className="space-y-2">
                {summary.map((row) => (
                  <li
                    key={row.id}
                    className="flex items-center justify-between rounded-lg bg-steel-950/50 px-3 py-2 text-sm"
                  >
                    <span className="text-zinc-300">{row.category}</span>
                    <span className="font-mono text-xs text-zinc-400">
                      {row.pieces} pcs · {row.tons.toFixed(1)} t
                    </span>
                  </li>
                ))}
              </ul>
              {analysis.notes ? (
                <p className="mt-4 text-xs leading-5 text-zinc-500">
                  {analysis.notes}
                </p>
              ) : null}
            </Card>
          </div>
        </div>
      ) : null}
    </div>
  );
}
