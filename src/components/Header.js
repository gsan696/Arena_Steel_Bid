"use client";

import { RotateCcw } from "lucide-react";
import { useProjectStore } from "@/store/useProjectStore";
import { bidBreakdown, money } from "@/lib/calc";
import { Button } from "./ui";

function IBeamMark() {
  return (
    <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
      <path
        d="M4 3.5h24v7.2h-7.4v10.6H28V28.5H4v-7.2h7.4V10.7H4V3.5z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Header() {
  const client = useProjectStore((s) => s.client);
  const hours = useProjectStore((s) => s.hours);
  const pricing = useProjectStore((s) => s.pricing);
  const connections = useProjectStore((s) => s.connections);
  const resetProject = useProjectStore((s) => s.resetProject);
  const total = bidBreakdown({ hours, pricing, connections }).total;
  const projectLabel = client.projectName || "Untitled project";

  return (
    <header className="sticky top-0 z-30 border-b border-white/8 bg-[#090b10]/85 backdrop-blur-md">
      <div className="heat-line" />
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500 text-zinc-950 shadow-[0_0_24px_rgba(245,158,11,0.35)]">
            <IBeamMark />
          </div>
          <div>
            <div className="text-[13px] font-semibold tracking-[0.22em] text-zinc-50">
              ARENA STEEL BID
            </div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">
              Detailing estimation wizard
            </div>
          </div>
        </div>

        <div className="hidden items-center gap-6 md:flex">
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">
              Project
            </div>
            <div className="max-w-[220px] truncate text-sm text-zinc-200">
              {projectLabel}
            </div>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">
              Live bid
            </div>
            <div className="font-mono text-sm text-amber-400">
              {money(total)}
            </div>
          </div>
          <Button
            variant="ghost"
            className="text-xs"
            onClick={() => {
              if (
                window.confirm(
                  "Reset this project? Uploads, MTO, hours, and pricing will be cleared."
                )
              ) {
                resetProject();
              }
            }}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </Button>
        </div>
      </div>
    </header>
  );
}
