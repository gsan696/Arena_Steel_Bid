"use client";

import { useState } from "react";
import { Download, FileText, Sheet } from "lucide-react";
import { STEPS } from "@/lib/constants";
import {
  bidBreakdown,
  formatNumber,
  hoursTotal,
  lineWeightLbs,
  money,
  totalTons,
} from "@/lib/calc";
import { useProjectStore } from "@/store/useProjectStore";
import { Badge, Button, Card, Field, StepHeading, Textarea } from "../ui";

const TOGGLES = [
  { key: "includeCover", label: "Cover / proposal letter" },
  { key: "includeMto", label: "Material takeoff" },
  { key: "includeHours", label: "Hours breakdown" },
  { key: "includePricing", label: "Pricing summary" },
  { key: "includeExclusions", label: "Exclusions & notes" },
];

function fileBase(client) {
  const raw = client.projectNumber || client.projectName || "arena-steel-bid";
  return raw.replace(/[^a-z0-9-_]+/gi, "-").replace(/-+/g, "-").toLowerCase();
}

export default function BidDocumentsStep() {
  const step = STEPS[8];
  const store = useProjectStore();
  const { client, mto, hours, pricing, connections, review, bidDocuments, setBidDocuments } =
    store;
  const [busy, setBusy] = useState("");
  const breakdown = bidBreakdown({ hours, pricing });
  const tons = totalTons(mto.items);

  async function exportPdf() {
    setBusy("pdf");
    try {
      const { jsPDF } = await import("jspdf");
      const autoTable = (await import("jspdf-autotable")).default;
      const doc = new jsPDF({ unit: "pt", format: "letter" });
      let y = 56;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("ARENA STEEL BID", 48, y);
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      y += 18;
      doc.text("Structural Steel Detailing Proposal", 48, y);
      y += 28;

      if (bidDocuments.includeCover) {
        doc.setFont("helvetica", "bold");
        doc.text("Project", 48, y);
        doc.setFont("helvetica", "normal");
        y += 16;
        const lines = [
          `Project: ${client.projectName || "Untitled"}`,
          `Number: ${client.projectNumber || "—"}`,
          `Client: ${client.name || "—"} / ${client.company || "—"}`,
          `Location: ${client.location || "—"}`,
          `Bid due: ${client.bidDueDate || "—"}`,
        ];
        lines.forEach((line) => {
          doc.text(line, 48, y);
          y += 14;
        });
        if (bidDocuments.coverNotes) {
          y += 6;
          const wrapped = doc.splitTextToSize(bidDocuments.coverNotes, 500);
          doc.text(wrapped, 48, y);
          y += wrapped.length * 14 + 8;
        }
      }

      if (bidDocuments.includeMto && mto.items.length) {
        y += 8;
        autoTable(doc, {
          startY: y,
          head: [["Category", "Description", "Size", "Qty", "Unit wt", "Total (lb)"]],
          body: mto.items.map((item) => [
            item.category,
            item.description,
            item.size,
            String(item.qty),
            formatNumber(item.weight, 2),
            formatNumber(lineWeightLbs(item), 2),
          ]),
          styles: { fontSize: 8 },
          headStyles: { fillColor: [180, 110, 20] },
        });
        y = doc.lastAutoTable.finalY + 20;
      }

      if (bidDocuments.includeHours) {
        doc.setFont("helvetica", "bold");
        doc.text(
          `Hours: Structural ${formatNumber(breakdown.structuralHours, 1)}  |  Misc ${formatNumber(breakdown.miscHours, 1)}  |  Total ${formatNumber(hoursTotal(hours), 1)}`,
          48,
          y
        );
        y += 18;
      }

      if (bidDocuments.includePricing) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.text(`Total estimated fee  ${money(breakdown.total, 2)}`, 48, y);
        y += 16;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(
          `${breakdown.rateLabel}  |  ${formatNumber(breakdown.hours, 1)} hrs × ${money(breakdown.rate, 0)}/hr  |  ${formatNumber(connections.count || 0)} ${connections.type || "Simple"} connections  |  ${formatNumber(tons, 2)} t`,
          48,
          y
        );
        y += 20;
      }

      if (bidDocuments.includeExclusions && review.exclusions) {
        doc.setFont("helvetica", "bold");
        doc.text("Exclusions", 48, y);
        y += 14;
        doc.setFont("helvetica", "normal");
        const wrapped = doc.splitTextToSize(review.exclusions, 500);
        doc.text(wrapped, 48, y);
      }

      doc.save(`${fileBase(client)}-proposal.pdf`);
    } finally {
      setBusy("");
    }
  }

  async function exportExcel() {
    setBusy("xlsx");
    try {
      const XLSX = await import("xlsx");
      const wb = XLSX.utils.book_new();

      const projectSheet = XLSX.utils.json_to_sheet([
        {
          Project: client.projectName,
          Number: client.projectNumber,
          Client: client.name,
          Company: client.company,
          Location: client.location,
          BidDue: client.bidDueDate,
          Total: breakdown.total,
        },
      ]);
      XLSX.utils.book_append_sheet(wb, projectSheet, "Project");

      if (bidDocuments.includeMto) {
        const mtoSheet = XLSX.utils.json_to_sheet(
          mto.items.map((item) => ({
            Category: item.category,
            Description: item.description,
            "Section/Size": item.size,
            "Weight per Unit (lbs)": item.weight,
            Quantity: item.qty,
            "Total Weight (lbs)": lineWeightLbs(item),
          }))
        );
        XLSX.utils.book_append_sheet(wb, mtoSheet, "MTO");
      }

      if (bidDocuments.includeHours || bidDocuments.includePricing) {
        const priceSheet = XLSX.utils.json_to_sheet([
          {
            StructuralHours: breakdown.structuralHours,
            MiscHours: breakdown.miscHours,
            TotalHours: breakdown.hours,
            RateTier: breakdown.rateLabel,
            HourlyRate: breakdown.rate,
            ConnectionCount: connections.count,
            ConnectionType: connections.type,
            TotalEstimatedFee: breakdown.total,
          },
        ]);
        XLSX.utils.book_append_sheet(wb, priceSheet, "Pricing");
      }

      XLSX.writeFile(wb, `${fileBase(client)}-bid.xlsx`);
    } finally {
      setBusy("");
    }
  }

  return (
    <div>
      <StepHeading
        icon={FileText}
        title={step.title}
        description={step.description}
      />

      <div className="grid gap-5 lg:grid-cols-5">
        <Card className="p-5 lg:col-span-3">
          <h3 className="mb-4 text-sm font-semibold text-zinc-200">
            Package contents
          </h3>
          <ul className="space-y-2">
            {TOGGLES.map((item) => (
              <li key={item.key}>
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/8 bg-steel-950/40 px-3 py-2.5 text-sm text-zinc-200">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-amber-500"
                    checked={bidDocuments[item.key]}
                    onChange={(e) =>
                      setBidDocuments({ [item.key]: e.target.checked })
                    }
                  />
                  {item.label}
                </label>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <Field label="Cover notes">
              <Textarea
                value={bidDocuments.coverNotes}
                placeholder="We are pleased to submit this detailing proposal based on the issued-for-bid structural set."
                onChange={(e) =>
                  setBidDocuments({ coverNotes: e.target.value })
                }
              />
            </Field>
          </div>
        </Card>

        <Card className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-200">Deliverables</h3>
            <Badge tone="heat">{money(breakdown.total, 2)}</Badge>
          </div>
          <p className="mb-5 text-sm leading-6 text-zinc-400">
            Export a proposal PDF and an Excel workbook from the current
            wizard state. Nothing is sent off-device.
          </p>
          <div className="flex flex-col gap-3">
            <Button onClick={exportPdf} disabled={busy === "pdf"}>
              <Download className="h-4 w-4" />
              {busy === "pdf" ? "Building PDF…" : "Export PDF"}
            </Button>
            <Button
              variant="outline"
              onClick={exportExcel}
              disabled={busy === "xlsx"}
            >
              <Sheet className="h-4 w-4" />
              {busy === "xlsx" ? "Building workbook…" : "Export Excel"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
