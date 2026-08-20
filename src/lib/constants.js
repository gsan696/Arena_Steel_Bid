export const STEPS = [
  {
    id: 0,
    key: "upload",
    label: "UPLOAD",
    title: "Upload Drawings",
    description:
      "Enter project information and upload structural drawings, models, and specifications.",
  },
  {
    id: 1,
    key: "analyze",
    label: "ANALYZE",
    title: "Analyze Drawings",
    description:
      "Parse sheets, classify drawing types, and extract framing scope from the uploaded set.",
  },
  {
    id: 2,
    key: "review",
    label: "REVIEW",
    title: "Review Scope",
    description:
      "Confirm detected scope, note exclusions, and lock assumptions before generating the MTO.",
  },
  {
    id: 3,
    key: "generate-mto",
    label: "GENERATE MTO",
    title: "Generate MTO",
    description:
      "Add takeoff lines by category. Total weight is quantity × weight per unit, rolled up for Structural and Misc.",
  },
  {
    id: 4,
    key: "review-mto",
    label: "REVIEW MTO",
    title: "Review MTO",
    description:
      "Verify marks, grades, lengths, and quantities before connections and hours are estimated.",
  },
  {
    id: 5,
    key: "connections",
    label: "CONNECTIONS",
    title: "Connections",
    description:
      "Quantify typical shear, moment, braced-frame, and base-plate connections for the bid.",
  },
  {
    id: 6,
    key: "hours",
    label: "HOURS",
    title: "Hours Estimate",
    description:
      "Estimate modeling, detailing, checking, connection design, and project management hours.",
  },
  {
    id: 7,
    key: "pricing",
    label: "PRICING",
    title: "Pricing",
    description:
      "Apply labor rates, connection allowances, contingency, and markup to produce the bid total.",
  },
  {
    id: 8,
    key: "bid-documents",
    label: "BID DOCUMENTS",
    title: "Bid Documents",
    description:
      "Assemble the proposal package and export PDF and Excel deliverables for the client.",
  },
];

export const CONNECTION_RATES = {
  typicalShear: 125,
  moment: 450,
  braced: 280,
  basePlates: 200,
};
