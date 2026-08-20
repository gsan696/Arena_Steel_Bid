import { RATE_TIERS } from "./constants";

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
  return (Number(hours.structural) || 0) + (Number(hours.misc) || 0);
}

export function getRateTier(pricing = {}) {
  return (
    RATE_TIERS.find((tier) => tier.id === pricing.rateTier) || RATE_TIERS[0]
  );
}

export function selectedRate(pricing = {}) {
  return getRateTier(pricing).rate;
}

export function estimatedFee(hours = {}, pricing = {}) {
  return hoursTotal(hours) * selectedRate(pricing);
}

export function bidBreakdown({ hours, pricing }) {
  const structuralHours = Number(hours?.structural) || 0;
  const miscHours = Number(hours?.misc) || 0;
  const hoursSum = structuralHours + miscHours;
  const tier = getRateTier(pricing);
  const total = hoursSum * tier.rate;
  return {
    structuralHours,
    miscHours,
    hours: hoursSum,
    rate: tier.rate,
    rateTier: tier.id,
    rateLabel: tier.label,
    labor: total,
    total,
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
