import { MemberStatus } from "@utils/types";

export const checkCurrentPlan = (planName: string, memberType: MemberStatus) => {
  return planName?.includes(memberType);
};
  
export const calculateSavings = (monthlyPrice: string, annualPrice: string): string => {
  const monthlyCost = parseFloat(monthlyPrice);
  const annualCost = parseFloat(annualPrice);
  const yearlyCost = monthlyCost * 12;
  const savings = yearlyCost - annualCost;
  return savings.toFixed(2);
};