"use client";

import { useRef, useState } from "react";
import { FileUp, Trash2, Upload } from "lucide-react";
import { STEPS } from "@/lib/constants";
import { formatBytes } from "@/lib/calc";
import { useProjectStore } from "@/store/useProjectStore";
import { Badge, Button, Card, Field, Input, StepHeading } from "../ui";

export default function UploadStep() {
  const step = STEPS[0];
  const client = useProjectStore((s) => s.client);
  const files = useProjectStore((s) => s.files);
  const updateClient = useProjectStore((s) => s.updateClient);
  const addFiles = useProjectStore((s) => s.addFiles);
  const removeFile = useProjectStore((s) => s.removeFile);
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  function ingestFiles(fileList) {
    const incoming = Array.from(fileList || []).map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()
        .toString(16)
        .slice(2)}`,
      name: file.name,
      size: file.size,
      type: file.type || "unknown",
      lastModified: file.lastModified,
    }));
    if (incoming.length) addFiles(incoming);
  }

  return (
    <div>
      <StepHeading
        icon={Upload}
        title={step.title}
        description={step.description}
      />

      <div className="grid gap-5 lg:grid-cols-5">
        <Card className="p-5 lg:col-span-3">
          <h3 className="mb-4 text-sm font-semibold tracking-wide text-zinc-200">
            Project & client
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Project name">
              <Input
                value={client.projectName}
                placeholder="North Yard Warehouse"
                onChange={(e) => updateClient({ projectName: e.target.value })}
              />
            </Field>
            <Field label="Project number">
              <Input
                value={client.projectNumber}
                placeholder="ASB-2026-014"
                onChange={(e) =>
                  updateClient({ projectNumber: e.target.value })
                }
              />
            </Field>
            <Field label="Client name">
              <Input
                value={client.name}
                placeholder="Jordan Hale"
                onChange={(e) => updateClient({ name: e.target.value })}
              />
            </Field>
            <Field label="Company">
              <Input
                value={client.company}
                placeholder="Hale Structural"
                onChange={(e) => updateClient({ company: e.target.value })}
              />
            </Field>
            <Field label="Email">
              <Input
                type="email"
                value={client.email}
                placeholder="jordan@halestructural.com"
                onChange={(e) => updateClient({ email: e.target.value })}
              />
            </Field>
            <Field label="Phone">
              <Input
                value={client.phone}
                placeholder="(555) 014-2200"
                onChange={(e) => updateClient({ phone: e.target.value })}
              />
            </Field>
            <Field label="Location">
              <Input
                value={client.location}
                placeholder="Fort Worth, TX"
                onChange={(e) => updateClient({ location: e.target.value })}
              />
            </Field>
            <Field label="Bid due date">
              <Input
                type="date"
                value={client.bidDueDate}
                onChange={(e) => updateClient({ bidDueDate: e.target.value })}
              />
            </Field>
          </div>
        </Card>

        <Card className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold tracking-wide text-zinc-200">
              Drawing set
            </h3>
            <Badge>{files.length} files</Badge>
          </div>

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              ingestFiles(e.dataTransfer.files);
            }}
            className={`flex w-full flex-col items-center justify-center rounded-xl border border-dashed px-4 py-10 text-center transition ${
              dragOver
                ? "border-amber-400 bg-amber-500/10"
                : "border-white/12 bg-steel-950/50 hover:border-amber-500/40"
            }`}
          >
            <FileUp className="mb-3 h-7 w-7 text-amber-400" />
            <div className="text-sm font-medium text-zinc-200">
              Drop PDF, DWG, or IFC files
            </div>
            <div className="mt-1 text-xs text-zinc-500">
              or click to browse the drawing set
            </div>
          </button>
          <input
            ref={inputRef}
            type="file"
            multiple
            className="hidden"
            accept=".pdf,.dwg,.dxf,.ifc,.rvt,.nwd,.xlsx,.xls"
            onChange={(e) => {
              ingestFiles(e.target.files);
              e.target.value = "";
            }}
          />

          <ul className="mt-4 space-y-2">
            {files.length === 0 ? (
              <li className="text-xs text-zinc-500">
                No files yet. You can still continue — analysis will use a
                sample set if nothing is uploaded.
              </li>
            ) : (
              files.map((file) => (
                <li
                  key={file.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-white/8 bg-steel-950/40 px-3 py-2"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm text-zinc-200">
                      {file.name}
                    </div>
                    <div className="text-[11px] text-zinc-500">
                      {formatBytes(file.size)}
                    </div>
                  </div>
                  <Button
                    variant="danger"
                    className="px-2 py-1"
                    onClick={() => removeFile(file.id)}
                    aria-label={`Remove ${file.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))
            )}
          </ul>
        </Card>
      </div>
    </div>
  );
}
