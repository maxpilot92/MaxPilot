"use client";
import { StaffTabs } from "@/components/staff-tabs";
import { StaffInput } from "@/types/staff/staff";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const params = useParams();
  const [data, setData] = useState<StaffInput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getStaffData() {
      try {
        setLoading(true);
        setError(null);

        // Log the ID to ensure it's correct
        console.log("Fetching data for ID:", params.id);

        const response = await axios.get(
          `/api/user/staff/personal-details/${params.id}`,
          {
            // Add headers if needed
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // Log the full response to debug
        console.log("API Response:", response);

        if (response.data && response.data.data) {
          setData(response.data.data);
        } else {
          throw new Error("No data received from API");
        }
      } catch (error) {
        // Properly log the error
        console.error("Error fetching staff data:", error);
        if (axios.isAxiosError(error)) {
          setError(error.response?.data?.message || error.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      getStaffData();
    }
  }, [params.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>No staff data found</div>;
  }

  return (
    <div>
      <StaffTabs data={data} />
    </div>
  );
}
