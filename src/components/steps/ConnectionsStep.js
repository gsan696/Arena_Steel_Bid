"use client";

import { Link2 } from "lucide-react";
import { CONNECTION_TYPES, STEPS } from "@/lib/constants";
import { formatNumber } from "@/lib/calc";
import { useProjectStore } from "@/store/useProjectStore";
import { Card, Field, Input, Select, Stat, StepHeading } from "../ui";

export default function ConnectionsStep() {
  const step = STEPS[5];
  const connections = useProjectStore((s) => s.connections);
  const setConnections = useProjectStore((s) => s.setConnections);
  const count = Number(connections.count) || 0;
  const type = connections.type || "Simple";

  return (
    <div>
      <StepHeading
        icon={Link2}
        title={step.title}
        description={step.description}
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2">
        <Stat
          label="Number of connections"
          value={formatNumber(count)}
        />
        <Stat
          label="Connection type"
          value={type}
          hint={
            type === "Complex"
              ? "Complex connections typically take more detailing time"
              : "Simple shear / standard details"
          }
        />
      </div>

      <Card className="p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Number of connections"
            hint="Total connections to be detailed"
          >
            <Input
              type="number"
              min="0"
              step="1"
              value={connections.count}
              onChange={(e) =>
                setConnections({ count: Number(e.target.value) })
              }
            />
          </Field>
          <Field label="Connection type">
            <Select
              value={type}
              onChange={(e) => setConnections({ type: e.target.value })}
            >
              {CONNECTION_TYPES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </Field>
        </div>
        <p className="mt-4 text-xs leading-5 text-zinc-500">
          Connection counts are stored for the bid report. Hours and fee are
          entered on the next steps.
        </p>
      </Card>
    </div>
  );
}
