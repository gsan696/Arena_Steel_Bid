"use client";

import { Clock } from "lucide-react";
import { STEPS } from "@/lib/constants";
import { formatNumber, hoursTotal } from "@/lib/calc";
import { categoryWeight } from "@/lib/mto";
import { useProjectStore } from "@/store/useProjectStore";
import { Card, Field, Input, Stat, StepHeading } from "../ui";

export default function HoursStep() {
  const step = STEPS[6];
  const hours = useProjectStore((s) => s.hours);
  const setHours = useProjectStore((s) => s.setHours);
  const items = useProjectStore((s) => s.mto.items);
  const totalHrs = hoursTotal(hours);
  const structuralLbs = categoryWeight(items, "Structural");
  const miscLbs = categoryWeight(items, "Misc");

  return (
    <div>
      <StepHeading
        icon={Clock}
        title={step.title}
        description={step.description}
      />

      <div className="mb-5">
        <Stat
          label="Total hours"
          value={formatNumber(totalHrs, 1)}
          hint="Structural + misc"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="p-5">
          <Field
            label="Estimated hours: structural"
            hint={
              items.length
                ? `MTO structural weight ${formatNumber(structuralLbs, 2)} lb`
                : "Hours to model and detail main framing"
            }
          >
            <Input
              type="number"
              min="0"
              step="0.5"
              value={hours.structural}
              onChange={(e) =>
                setHours({ structural: Number(e.target.value) })
              }
            />
          </Field>
        </Card>
        <Card className="p-5">
          <Field
            label="Estimated hours: misc"
            hint={
              items.length
                ? `MTO misc weight ${formatNumber(miscLbs, 2)} lb`
                : "Hours for miscellaneous steel"
            }
          >
            <Input
              type="number"
              min="0"
              step="0.5"
              value={hours.misc}
              onChange={(e) => setHours({ misc: Number(e.target.value) })}
            />
          </Field>
        </Card>
      </div>
    </div>
  );
}
