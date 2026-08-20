"use client";

import { ClipboardCheck } from "lucide-react";
import { STEPS } from "@/lib/constants";
import { useProjectStore } from "@/store/useProjectStore";
import {
  Callout,
  Card,
  Field,
  Stat,
  StepHeading,
  Textarea,
} from "../ui";

export default function ReviewStep() {
  const step = STEPS[2];
  const analysis = useProjectStore((s) => s.analysis);
  const review = useProjectStore((s) => s.review);
  const setReview = useProjectStore((s) => s.setReview);
  const files = useProjectStore((s) => s.files);
  const client = useProjectStore((s) => s.client);
  const analyzed = analysis.status === "complete";

  return (
    <div>
      <StepHeading
        icon={ClipboardCheck}
        title={step.title}
        description={step.description}
      />

      {!analyzed ? (
        <Callout>
          Analysis has not been run yet. You can still record exclusions, but
          detected scope will be empty until you go back and analyze the
          drawing set.
        </Callout>
      ) : null}

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat
          label="Project"
          value={client.projectName || "Untitled"}
          hint={client.company || "No client company"}
        />
        <Stat
          label="Files uploaded"
          value={String(files.length)}
          hint={analyzed ? `${analysis.drawingCount} sheets parsed` : "Not analyzed"}
        />
        <Stat
          label="Scope status"
          value={review.scopeConfirmed ? "Confirmed" : "Pending"}
        />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card className="p-5">
          <Field
            label="Exclusions"
            hint="Items not in this bid — deck, joists, stairs, AES, etc."
          >
            <Textarea
              value={review.exclusions}
              placeholder="Open-web joists, metal deck, stairs, architecturally exposed steel, and field painting excluded."
              onChange={(e) => setReview({ exclusions: e.target.value })}
            />
          </Field>
          <div className="mt-4">
            <Field label="Reviewer comments">
              <Textarea
                value={review.comments}
                placeholder="Confirm moment-frame grid lines and whether canopies are in scope."
                onChange={(e) => setReview({ comments: e.target.value })}
              />
            </Field>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-3 text-sm font-semibold text-zinc-200">
            Scope lock
          </h3>
          <p className="mb-4 text-sm leading-6 text-zinc-400">
            Confirm that sheet count, member groups, and exclusions are
            acceptable. The MTO generator will use this reviewed scope.
          </p>
          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-white/10 bg-steel-950/40 px-4 py-3">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 accent-amber-500"
              checked={review.scopeConfirmed}
              onChange={(e) =>
                setReview({ scopeConfirmed: e.target.checked })
              }
            />
            <span className="text-sm text-zinc-200">
              Scope is confirmed. Proceed to generate the material takeoff.
            </span>
          </label>
          {analyzed && analysis.notes ? (
            <p className="mt-4 text-xs leading-5 text-zinc-500">
              {analysis.notes}
            </p>
          ) : null}
        </Card>
      </div>
    </div>
  );
}
