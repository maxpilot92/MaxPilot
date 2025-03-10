"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import type { StaffData } from "@/types/staff/staff";

interface UseStaffProps {
  userRole?: string;
}

interface UseStaffResult {
  data: StaffData[];
  loading: boolean;
  error: Error | null;
}

export function useStaff({ userRole }: UseStaffProps = {}): UseStaffResult {
  const [result, setResult] = useState<UseStaffResult>({
    data: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchStaff = async () => {
      try {
        // Use the correct API endpoint
        const url = userRole
          ? `/api/user/user-details?userRole=${userRole}`
          : "/api/user/user-details";
        const response = await axios.get(url);

        if (isMounted) {
          setResult({
            data: response.data.data || [],
            loading: false,
            error: null,
          });
        }
      } catch (err) {
        if (isMounted) {
          setResult({
            data: [],
            loading: false,
            error:
              err instanceof Error ? err : new Error("Failed to fetch staff"),
          });
          console.error("Error fetching staff:", err);
        }
      }
    };

    fetchStaff();

    // Cleanup function to prevent state updates if the component unmounts
    return () => {
      isMounted = false;
    };
  }, [userRole]); // Only re-run if userRole changes

  return result;
}
