import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { DatesRangeValue } from "@mantine/dates";
import {
  MissingInvoiceRow,
  MissingLookupPagination,
} from "../types/missing-invoice.types";
import { useAuth } from "./useAuth";

const STORAGE_KEY = "runanalytic.invoiceUploadSession.v1";

export type HistoricalDateLookup = {
  type: "dateRange";
  start: string;
  end: string;
};

export type MissingLookupKind =
  | { type: "manual"; orderIdsText: string }
  | { type: "excel" }
  | null;

type PersistedSession = {
  historical: {
    rows: MissingInvoiceRow[];
    dateRange: [string | null, string | null];
    lastLookup: HistoricalDateLookup | null;
    datePageTokens: (string | undefined)[];
    datePageIndex: number;
    dateRangePagination: MissingLookupPagination | null;
  };
  missing: {
    rows: MissingInvoiceRow[];
    orderIdsText: string;
    lastLookup: MissingLookupKind;
  };
};

const defaultHistorical = (): PersistedSession["historical"] => ({
  rows: [],
  dateRange: [null, null],
  lastLookup: null,
  datePageTokens: [undefined],
  datePageIndex: 0,
  dateRangePagination: null,
});

const defaultMissing = (): PersistedSession["missing"] => ({
  rows: [],
  orderIdsText: "",
  lastLookup: null,
});

const loadPersisted = (): PersistedSession | null => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedSession;
  } catch {
    return null;
  }
};

type HistoricalSlice = PersistedSession["historical"];
type MissingSlice = PersistedSession["missing"];

type HistoricalContextValue = HistoricalSlice & {
  setRows: Dispatch<SetStateAction<MissingInvoiceRow[]>>;
  setDateRange: Dispatch<SetStateAction<DatesRangeValue<string>>>;
  setLastLookup: Dispatch<SetStateAction<HistoricalDateLookup | null>>;
  setDatePageTokens: Dispatch<SetStateAction<(string | undefined)[]>>;
  setDatePageIndex: Dispatch<SetStateAction<number>>;
  setDateRangePagination: Dispatch<
    SetStateAction<MissingLookupPagination | null>
  >;
  resetHistoricalSession: () => void;
};

type MissingContextValue = MissingSlice & {
  setRows: Dispatch<SetStateAction<MissingInvoiceRow[]>>;
  setOrderIdsText: Dispatch<SetStateAction<string>>;
  setLastLookup: Dispatch<SetStateAction<MissingLookupKind>>;
  resetMissingSession: () => void;
};

const HistoricalContext = createContext<HistoricalContextValue | null>(null);
const MissingContext = createContext<MissingContextValue | null>(null);

export function InvoiceUploadSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token } = useAuth();
  const initial = loadPersisted();

  const [historical, setHistorical] = useState<HistoricalSlice>(
    () => initial?.historical ?? defaultHistorical(),
  );
  const [missing, setMissing] = useState<MissingSlice>(
    () => initial?.missing ?? defaultMissing(),
  );

  useEffect(() => {
    if (token) return;
    setHistorical(defaultHistorical());
    setMissing(defaultMissing());
    sessionStorage.removeItem(STORAGE_KEY);
  }, [token]);

  useEffect(() => {
    if (!token) return;
    const payload: PersistedSession = { historical, missing };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [token, historical, missing]);

  const resetHistoricalSession = useCallback(() => {
    setHistorical(defaultHistorical());
  }, []);

  const resetMissingSession = useCallback(() => {
    setMissing(defaultMissing());
  }, []);

  const historicalValue = useMemo<HistoricalContextValue>(
    () => ({
      ...historical,
      setRows: (updater) =>
        setHistorical((prev) => ({
          ...prev,
          rows: typeof updater === "function" ? updater(prev.rows) : updater,
        })),
      setDateRange: (updater) =>
        setHistorical((prev) => {
          const next =
            typeof updater === "function"
              ? updater(prev.dateRange as DatesRangeValue<string>)
              : updater;
          return {
            ...prev,
            dateRange: [next[0] ?? null, next[1] ?? null],
          };
        }),
      setLastLookup: (updater) =>
        setHistorical((prev) => ({
          ...prev,
          lastLookup:
            typeof updater === "function" ? updater(prev.lastLookup) : updater,
        })),
      setDatePageTokens: (updater) =>
        setHistorical((prev) => ({
          ...prev,
          datePageTokens:
            typeof updater === "function"
              ? updater(prev.datePageTokens)
              : updater,
        })),
      setDatePageIndex: (updater) =>
        setHistorical((prev) => ({
          ...prev,
          datePageIndex:
            typeof updater === "function"
              ? updater(prev.datePageIndex)
              : updater,
        })),
      setDateRangePagination: (updater) =>
        setHistorical((prev) => ({
          ...prev,
          dateRangePagination:
            typeof updater === "function"
              ? updater(prev.dateRangePagination)
              : updater,
        })),
      resetHistoricalSession,
    }),
    [historical, resetHistoricalSession],
  );

  const missingValue = useMemo<MissingContextValue>(
    () => ({
      ...missing,
      setRows: (updater) =>
        setMissing((prev) => ({
          ...prev,
          rows: typeof updater === "function" ? updater(prev.rows) : updater,
        })),
      setOrderIdsText: (updater) =>
        setMissing((prev) => ({
          ...prev,
          orderIdsText:
            typeof updater === "function"
              ? updater(prev.orderIdsText)
              : updater,
        })),
      setLastLookup: (updater) =>
        setMissing((prev) => ({
          ...prev,
          lastLookup:
            typeof updater === "function" ? updater(prev.lastLookup) : updater,
        })),
      resetMissingSession,
    }),
    [missing, resetMissingSession],
  );

  return (
    <HistoricalContext.Provider value={historicalValue}>
      <MissingContext.Provider value={missingValue}>
        {children}
      </MissingContext.Provider>
    </HistoricalContext.Provider>
  );
}

export function useHistoricalUploadSession(): HistoricalContextValue {
  const ctx = useContext(HistoricalContext);
  if (!ctx) {
    throw new Error(
      "useHistoricalUploadSession must be used within InvoiceUploadSessionProvider",
    );
  }
  return ctx;
}

export function useMissingUploadSession(): MissingContextValue {
  const ctx = useContext(MissingContext);
  if (!ctx) {
    throw new Error(
      "useMissingUploadSession must be used within InvoiceUploadSessionProvider",
    );
  }
  return ctx;
}
