import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../Context/useAuth";
import {
  fetchOrders,
  fetchOrderStats,
} from "../Services/order-services";
import { OrderQueryParams } from "../types/order.types";

/**
 * Fetches a page of Amazon orders.
 *
 * Cache behaviour:
 *   - staleTime inherited from QueryClient (5 min by default)
 *   - Each unique combination of (token + params) gets its own cache entry
 *   - Navigating away and back within 5 min shows data instantly with NO API call
 */
export const useOrders = (params: OrderQueryParams = {}) => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => fetchOrders(token!, params),
    enabled: !!token,
    // Keep previous page data visible while loading next page (pagination UX)
    placeholderData: (prev) => prev,
  });
};

/**
 * Fetches order statistics (totals, revenue, counts).
 *
 * Cached independently from the order list so that navigating to another
 * page and back does not trigger a fresh Amazon stats request.
 */
export const useOrderStats = () => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["orderStats"],
    queryFn: () => fetchOrderStats(token!),
    enabled: !!token,
    staleTime: 1000 * 60 * 10, // Stats change less often — cache for 10 min
  });
};
