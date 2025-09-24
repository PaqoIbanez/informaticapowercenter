import { useState, useEffect } from "react";
import type { IFlatExtractionData } from "../interfaces";
import { getEtlData } from "../services/etlService";

export const useEtlData = () => {
  const [data, setData] = useState<IFlatExtractionData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const jsonData = await getEtlData();
        setData(jsonData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { data, loading, error };
};