import { ExtendedSalon } from "@utils/types";

interface SalonHistoryEntry {
    changedAt: string;
    changes: {
      updated: {
        state: "APPROVED" | "PENDING_APPROVAL" | "SUBMITTED";
      };
      previous: {
        state: "APPROVED" | "PENDING_APPROVAL" | "SUBMITTED";
      };
    };
  }

export function getSalonPreviousChanges(salons: ExtendedSalon[], selectedId: string | null): SalonHistoryEntry["changes"]["previous"][] {
  const selectedSalon = salons.find((salon) => salon.id === selectedId);
  
  if (selectedSalon) {
    const previousChanges = selectedSalon.history && selectedSalon.history.length > 0
      ? selectedSalon.history.map((entry: any) => entry.changes.previous)
      : [];
      
    return previousChanges;
  }
  return [];
}
