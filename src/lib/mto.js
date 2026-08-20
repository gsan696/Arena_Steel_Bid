import { formatNumber } from "./calc";

export const MTO_CATEGORIES = ["Structural", "Misc"];

export function createMtoRow(overrides = {}) {
  const id =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `mto-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  return {
    id,
    category: "Structural",
    description: "",
    size: "",
    weight: 0,
    qty: 1,
    ...overrides,
  };
}

export function lineTotalLbs(item) {
  return (Number(item?.qty) || 0) * (Number(item?.weight) || 0);
}

export function itemsByCategory(items = [], category) {
  return items.filter((item) => item.category === category);
}

export function categoryWeight(items = [], category) {
  return itemsByCategory(items, category).reduce(
    (sum, item) => sum + lineTotalLbs(item),
    0
  );
}

export function mtoTotals(items = []) {
  const structural = categoryWeight(items, "Structural");
  const misc = categoryWeight(items, "Misc");
  return {
    structural,
    misc,
    grand: structural + misc,
    qty: items.reduce((sum, item) => sum + (Number(item.qty) || 0), 0),
  };
}

function sheetFromItems(XLSX, items) {
  const header = [
    "Description",
    "Section/Size",
    "Weight per Unit (lbs)",
    "Quantity",
    "Total Weight (lbs)",
  ];
  const body = items.map((item) => [
    item.description || "",
    item.size || "",
    Number(item.weight) || 0,
    Number(item.qty) || 0,
    lineTotalLbs(item),
  ]);
  const qty = items.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
  const total = items.reduce((sum, item) => sum + lineTotalLbs(item), 0);
  const aoa = [header, ...body, ["TOTAL", "", "", qty, total]];
  const sheet = XLSX.utils.aoa_to_sheet(aoa);
  sheet["!cols"] = [
    { wch: 36 },
    { wch: 18 },
    { wch: 22 },
    { wch: 12 },
    { wch: 20 },
  ];
  return sheet;
}

export async function downloadMtoExcel(items = [], projectName = "") {
  const XLSXmod = await import("xlsx");
  const XLSX = XLSXmod.default ?? XLSXmod;
  const wb = XLSX.utils.book_new();
  const structural = itemsByCategory(items, "Structural");
  const misc = itemsByCategory(items, "Misc");

  XLSX.utils.book_append_sheet(
    wb,
    sheetFromItems(XLSX, structural, "Main Structural Steel"),
    "Main Structural Steel"
  );
  XLSX.utils.book_append_sheet(
    wb,
    sheetFromItems(XLSX, misc, "Misc Steel"),
    "Misc Steel"
  );

  const raw = projectName || "arena-steel-bid";
  const slug = raw
    .replace(/[^a-z0-9-_]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
  XLSX.writeFile(wb, `${slug || "arena-steel-bid"}-MTO.xlsx`);
}

export function formatLbs(value) {
  return `${formatNumber(value, 2)} lb`;
}
