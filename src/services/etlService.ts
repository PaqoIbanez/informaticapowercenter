import type { IFlatExtractionData } from "../interfaces";

export const getEtlData = async (): Promise<IFlatExtractionData> => {
  const response = await fetch("/extraction.json");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};
