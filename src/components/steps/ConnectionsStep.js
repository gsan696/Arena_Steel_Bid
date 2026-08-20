"use client";

import { Link2 } from "lucide-react";
import { STEPS, CONNECTION_RATES } from "@/lib/constants";
import { connectionCost, money } from "@/lib/calc";
import { SAMPLE_CONNECTIONS } from "@/lib/sampleData";
import { useProjectStore } from "@/store/useProjectStore";
import { Button, Card, Field, Input, Stat, StepHeading, Textarea } from "../ui";

const FIELDS = [
  {
    key: "typicalShear",
    label: "Typical shear",
    hint: `Allowance ${money(CONNECTION_RATES.typicalShear)} ea`,
  },
  {
    key: "moment",
    label: "Moment connections",
    hint: `Allowance ${money(CONNECTION_RATES.moment)} ea`,
  },
  {
    key: "braced",
    label: "Braced frame",
    hint: `Allowance ${money(CONNECTION_RATES.braced)} ea`,
  },
  {
    key: "basePlates",
    label: "Base plates",
    hint: `Allowance ${money(CONNECTION_RATES.basePlates)} ea`,
  },
];

export default function ConnectionsStep() {
  const step = STEPS[5];
  const connections = useProjectStore((s) => s.connections);
  const setConnections = useProjectStore((s) => s.setConnections);
  const mtoItems = useProjectStore((s) => s.mto.items);
  const cost = connectionCost(connections);

  return (
    <div>
      <StepHeading
        icon={Link2}
        title={step.title}
        description={step.description}
        action={
          <Button
            variant="outline"
            onClick={() => setConnections({ ...SAMPLE_CONNECTIONS })}
          >
            Load typical counts
          </Button>
        }
      />

      <div className="mb-5">
        <Stat
          label="Connection allowance"
          value={money(cost)}
          hint={
            mtoItems.length
              ? "Based on current connection quantities"
              : "Load typical counts or enter quantities manually"
          }
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FIELDS.map((field) => (
          <Card key={field.key} className="p-4">
            <Field label={field.label} hint={field.hint}>
              <Input
                type="number"
                min="0"
                value={connections[field.key]}
                onChange={(e) =>
                  setConnections({ [field.key]: Number(e.target.value) })
                }
              />
            </Field>
          </Card>
        ))}
      </div>

      <Card className="mt-5 p-5">
        <Field label="Connection notes">
          <Textarea
            value={connections.notes}
            placeholder="Moment connections at rigid frame grid lines. Typical shear tabs elsewhere."
            onChange={(e) => setConnections({ notes: e.target.value })}
          />
        </Field>
      </Card>
    </div>
  );
}
