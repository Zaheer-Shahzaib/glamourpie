import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../Context/useAuth";
import { fetchOrders, fetchOrderStats } from "../Services/order-services";

import { OrderQueryParams } from "../types/order.types";

/**
 * Fetches a single page of orders from the backend.
 * Uses query parameters for pagination and filtering.
 */
export const useOrders = (params: OrderQueryParams = {}) => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => fetchOrders(token!, params),
    enabled: !!token,
    staleTime: 1000 * 60 * 60 * 2, // 2 hour
  });
};

/**
 * Fetches order statistics (totals, revenue, counts).
 * Derived from the same full order list so it stays consistent with the table.
 */
export const useOrderStats = () => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["orderStats"],
    queryFn: () => fetchOrderStats(token!),
    enabled: !!token,
    staleTime: 1000 * 60 * 60 * 2, // 2 hours
  });
};
