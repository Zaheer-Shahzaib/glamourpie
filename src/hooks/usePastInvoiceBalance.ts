import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../Context/useAuth";
import { getPastInvoiceBalance } from "../Services/past-invoice-services";

export const pastInvoiceBalanceQueryKey = (token: string | null) =>
  ["pastInvoiceBalance", token] as const;

export function usePastInvoiceBalance() {
  const { token } = useAuth();
  return useQuery({
    queryKey: pastInvoiceBalanceQueryKey(token),
    queryFn: () => getPastInvoiceBalance(token!),
    enabled: !!token,
    staleTime: 1000 * 60 * 10,
  });
}

export function useHasHistoricalAccess(): boolean {
  const { data } = usePastInvoiceBalance();
  if (!data?.success) return false;
  return Boolean(
    data.hasHistoricalAccess ??
      (data.pastInvoiceBalance?.purchasedQuantity ?? 0) > 0,
  );
}
