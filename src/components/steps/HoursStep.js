"use client";

import { Clock } from "lucide-react";
import { STEPS } from "@/lib/constants";
import {
  estimateHoursFromTons,
  formatNumber,
  hoursTotal,
  laborCost,
  money,
  totalTons,
} from "@/lib/calc";
import { useProjectStore } from "@/store/useProjectStore";
import { Button, Card, Field, Input, Stat, StepHeading } from "../ui";

const HOUR_FIELDS = [
  { key: "modeling", label: "Modeling" },
  { key: "detailing", label: "Detailing" },
  { key: "checking", label: "Checking" },
  { key: "connectionDesign", label: "Connection design" },
  { key: "projectManagement", label: "Project management" },
];

export default function HoursStep() {
  const step = STEPS[6];
  const hours = useProjectStore((s) => s.hours);
  const setHours = useProjectStore((s) => s.setHours);
  const items = useProjectStore((s) => s.mto.items);
  const tons = totalTons(items);
  const totalHrs = hoursTotal(hours);
  const labor = laborCost(hours);

  function estimate() {
    setHours(estimateHoursFromTons(tons));
  }

  return (
    <div>
      <StepHeading
        icon={Clock}
        title={step.title}
        description={step.description}
        action={
          <Button variant="outline" onClick={estimate} disabled={!items.length}>
            Estimate from MTO
          </Button>
        }
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <Stat label="MTO tonnage" value={`${formatNumber(tons, 2)} t`} />
        <Stat label="Total hours" value={formatNumber(totalHrs, 1)} />
        <Stat label="Labor" value={money(labor)} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            {HOUR_FIELDS.map((field) => (
              <Field key={field.key} label={`${field.label} (hrs)`}>
                <Input
                  type="number"
                  min="0"
                  step="0.5"
                  value={hours[field.key]}
                  onChange={(e) =>
                    setHours({ [field.key]: Number(e.target.value) })
                  }
                />
              </Field>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <Field label="Blended hourly rate" hint="Applied to all disciplines">
            <Input
              type="number"
              min="0"
              step="1"
              value={hours.hourlyRate}
              onChange={(e) =>
                setHours({ hourlyRate: Number(e.target.value) })
              }
            />
          </Field>
          <p className="mt-4 text-xs leading-5 text-zinc-500">
            Estimate from MTO uses ~16 hours per ton split across modeling,
            detailing, checking, connection design, and PM.
          </p>
        </Card>
      </div>
    </div>
  );
}
