import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../Context/useAuth";
import { fetchOrders, fetchOrderStats } from "../Services/order-services";
import { OrderQueryParams } from "../types/order.types";

/**
 * Fetches a single SP-API page of orders.
 * Pass nextToken for subsequent pages; date window is handled by the backend.
 */
export const useOrders = (params: OrderQueryParams = {}) => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => fetchOrders(token!, params),
    enabled: !!token,
    staleTime: 1000 * 60 * 60 * 2, // 2 hours
    placeholderData: (previousData) => previousData,
  });
};

/**
 * Fetches order statistics (totals, revenue, counts).
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
