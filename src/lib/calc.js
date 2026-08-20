import { CONNECTION_RATES } from "./constants";

export function lineWeightLbs(item) {
  const qty = Number(item.qty) || 0;
  const weight = Number(item.weight) || 0;
  return qty * weight;
}

export function totalLbs(items = []) {
  return items.reduce((sum, item) => sum + lineWeightLbs(item), 0);
}

export function totalTons(items = []) {
  return totalLbs(items) / 2000;
}

export function hoursTotal(hours = {}) {
  return (
    (Number(hours.modeling) || 0) +
    (Number(hours.detailing) || 0) +
    (Number(hours.checking) || 0) +
    (Number(hours.connectionDesign) || 0) +
    (Number(hours.projectManagement) || 0)
  );
}

export function laborCost(hours = {}) {
  return hoursTotal(hours) * (Number(hours.hourlyRate) || 0);
}

export function connectionCost(connections = {}) {
  return (
    (Number(connections.typicalShear) || 0) * CONNECTION_RATES.typicalShear +
    (Number(connections.moment) || 0) * CONNECTION_RATES.moment +
    (Number(connections.braced) || 0) * CONNECTION_RATES.braced +
    (Number(connections.basePlates) || 0) * CONNECTION_RATES.basePlates
  );
}

export function bidBreakdown({ hours, pricing, connections }) {
  const labor = laborCost(hours);
  const connCost = connectionCost(connections);
  const expenses = Number(pricing?.expenses) || 0;
  const sub = labor + connCost + expenses;
  const contingency =
    sub * ((Number(pricing?.contingencyPct) || 0) / 100);
  const afterCont = sub + contingency;
  const markup = afterCont * ((Number(pricing?.markupPct) || 0) / 100);
  return {
    labor,
    connCost,
    expenses,
    sub,
    contingency,
    markup,
    total: afterCont + markup,
  };
}

export function money(value, digits = 0) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(Number(value) || 0);
}

export function formatNumber(value, digits = 0) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(Number(value) || 0);
}

export function formatBytes(bytes) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );
  return `${(bytes / 1024 ** i).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export function estimateHoursFromTons(tons) {
  const t = Math.max(Number(tons) || 0, 0);
  const round = (n) => Math.max(1, Math.round(n));
  if (t === 0) {
    return {
      modeling: 0,
      detailing: 0,
      checking: 0,
      connectionDesign: 0,
      projectManagement: 0,
    };
  }
  return {
    modeling: round(t * 2.4),
    detailing: round(t * 8.2),
    checking: round(t * 3.1),
    connectionDesign: round(t * 1.6),
    projectManagement: round(t * 1.2),
  };
}
