import {
  getCompanySubscription,
  getCompanyUsers,
  getUserCompanies,
} from "@/services/company.service";
import { useQuery } from "@tanstack/react-query";

export function useUserCompanies(clerkUserId: string) {
  return useQuery({
    queryKey: ["userCompanies", clerkUserId],
    queryFn: () => getUserCompanies(clerkUserId),
    enabled: !!clerkUserId,
  });
}

export function useCompanyUsers(companyId: string) {
  return useQuery({
    queryKey: ["companyUsers", companyId],
    queryFn: () => getCompanyUsers(companyId),
    enabled: !!companyId,
  });
}

export function useCompanySubscription(companyId: string) {
  return useQuery({
    queryKey: ["companySubscription", companyId],
    queryFn: () => getCompanySubscription(companyId),
    enabled: !!companyId,
  });
}
