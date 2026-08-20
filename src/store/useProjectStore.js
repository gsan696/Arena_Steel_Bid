"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STEPS } from "@/lib/constants";

const emptyClient = {
  name: "",
  company: "",
  email: "",
  phone: "",
  projectName: "",
  projectNumber: "",
  location: "",
  bidDueDate: "",
};

const emptyAnalysis = {
  status: "idle",
  progress: 0,
  drawingCount: 0,
  sheets: [],
  memberSummary: [],
  notes: "",
};

const emptyReview = {
  scopeConfirmed: false,
  exclusions: "",
  comments: "",
};

const emptyMto = {
  status: "idle",
  items: [],
  generatedAt: null,
};

const emptyMtoReview = {
  approved: false,
  notes: "",
};

const emptyConnections = {
  typicalShear: 0,
  moment: 0,
  braced: 0,
  basePlates: 0,
  notes: "",
};

const emptyHours = {
  modeling: 0,
  detailing: 0,
  checking: 0,
  connectionDesign: 0,
  projectManagement: 0,
  hourlyRate: 85,
};

const emptyPricing = {
  contingencyPct: 10,
  markupPct: 15,
  expenses: 0,
  notes: "",
};

const emptyBidDocuments = {
  includeCover: true,
  includeMto: true,
  includeHours: true,
  includePricing: true,
  includeExclusions: true,
  coverNotes: "",
};

export const initialProjectState = {
  currentStep: 0,
  maxStepReached: 0,
  client: { ...emptyClient },
  files: [],
  analysis: { ...emptyAnalysis },
  review: { ...emptyReview },
  mto: { ...emptyMto },
  mtoReview: { ...emptyMtoReview },
  connections: { ...emptyConnections },
  hours: { ...emptyHours },
  pricing: { ...emptyPricing },
  bidDocuments: { ...emptyBidDocuments },
};

export const useProjectStore = create(
  persist(
    (set, get) => ({
      ...initialProjectState,

      setStep: (step) => {
        const max = STEPS.length - 1;
        const target = Math.max(0, Math.min(step, max));
        const { maxStepReached } = get();
        if (target > maxStepReached) return;
        set({ currentStep: target });
      },

      nextStep: () => {
        const { currentStep, maxStepReached } = get();
        const next = Math.min(currentStep + 1, STEPS.length - 1);
        set({
          currentStep: next,
          maxStepReached: Math.max(maxStepReached, next),
        });
      },

      prevStep: () => {
        const { currentStep } = get();
        set({ currentStep: Math.max(currentStep - 1, 0) });
      },

      updateClient: (patch) =>
        set((state) => ({ client: { ...state.client, ...patch } })),

      addFiles: (fileMetas) =>
        set((state) => ({ files: [...state.files, ...fileMetas] })),

      removeFile: (id) =>
        set((state) => ({
          files: state.files.filter((file) => file.id !== id),
        })),

      setAnalysis: (patch) =>
        set((state) => ({ analysis: { ...state.analysis, ...patch } })),

      setReview: (patch) =>
        set((state) => ({ review: { ...state.review, ...patch } })),

      setMto: (patch) =>
        set((state) => ({ mto: { ...state.mto, ...patch } })),

      updateMtoItem: (id, patch) =>
        set((state) => ({
          mto: {
            ...state.mto,
            items: state.mto.items.map((item) =>
              item.id === id ? { ...item, ...patch } : item
            ),
          },
        })),

      setMtoReview: (patch) =>
        set((state) => ({ mtoReview: { ...state.mtoReview, ...patch } })),

      setConnections: (patch) =>
        set((state) => ({
          connections: { ...state.connections, ...patch },
        })),

      setHours: (patch) =>
        set((state) => ({ hours: { ...state.hours, ...patch } })),

      setPricing: (patch) =>
        set((state) => ({ pricing: { ...state.pricing, ...patch } })),

      setBidDocuments: (patch) =>
        set((state) => ({
          bidDocuments: { ...state.bidDocuments, ...patch },
        })),

      resetProject: () => set({ ...initialProjectState }),
    }),
    {
      name: "arena-steel-bid-store",
      version: 1,
    }
  )
);
