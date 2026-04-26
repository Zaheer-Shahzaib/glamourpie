import { API_BASE_URL } from "../Services/api";
import { InvoiceStatus, InvoiceType } from "../types/invoice.types";

export const getAvatarUrl = (avatarPath: string | undefined) => {
    if (!avatarPath) return undefined;

    if (avatarPath.startsWith('http')) {
        return avatarPath;
    }

    const path = avatarPath.startsWith('/') ? avatarPath : `/${avatarPath}`;
    return `${API_BASE_URL}${path}`;
};
export const getStatusColor = (status: any): string => {
  switch (status) {
    case "PAID":
      return "green";
    case "UNPAID":
      return "red";
    case "PENDING":
      return "orange";
    case "CANCELLED":
      return "red";
    case "SUBMITTED":
      return "blue";
    case "ACCEPTED":
      return "green";
    case "REJECTED":
      return "red";
    case "DRAFT":
      return "gray";
    default:
      return "gray";
  }
};

export const InvoiceStatusOptions = [
    {value:"PAID", label:"Paid"},
    {value:"UNPAID", label:"Unpaid"},
    {value:"PENDING", label:"Pending"},
    {value:"CANCELLED", label:"Cancelled"},
    {value:"SUBMITTED", label:"Submitted"},
    {value:"ACCEPTED", label:"Accepted"},
    {value:"REJECTED", label:"Rejected"},
    {value:"DRAFT", label:"Draft"},
]
export const getBillingStatusColor = (status: any): string => {
  switch (status) {
    case "paid":
      return "green";
    case "unpaid":
      return "red";
    case "pending":
      return "orange";
    case "CANCELLED":
      return "red";
    case "submitted":
      return "blue";
    case "accepted":
      return "green";
    case "rejected":
      return "red";
    case "draft":
      return "gray";
    default:
      return "gray";
  }
};



export const getTypeColor = (type: InvoiceType): string => {
  switch (type) {
    case "INVOICE":
      return "blue";
    case "CREDIT_NOTE":
      return "orange";
    case "DEBIT_NOTE":
      return "violet";
    default:
      return "gray";
  }
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatCurrency = (amount: number | null | undefined, currency: string): string => {
  const safeAmount = amount || 0;
  return `${currency || ''} ${safeAmount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`.trim();
};