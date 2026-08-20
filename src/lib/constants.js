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
      "Record how many connections are in the job and whether they are Simple or Complex.",
  },
  {
    id: 6,
    key: "hours",
    label: "HOURS",
    title: "Hours Estimate",
    description:
      "Enter estimated hours for structural and miscellaneous steel. Total hours feeds the pricing step.",
  },
  {
    id: 7,
    key: "pricing",
    label: "PRICING",
    title: "Pricing",
    description:
      "Choose a rate tier. The estimated fee is Total Hours × the selected hourly rate.",
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

export const CONNECTION_TYPES = ["Simple", "Complex"];

export const RATE_TIERS = [
  {
    id: "standard",
    rate: 18,
    label: "Standard Rate ($18/hr) - Low Complexity",
  },
  {
    id: "premium",
    rate: 26,
    label: "Premium Rate ($26/hr) - High Complexity",
  },
];
