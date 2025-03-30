"use client";
import { useOnBoardingStore } from "@/store/onBoardingStore";
import axios from "axios";
import { useEffect } from "react";

export default function Dashboard() {
  const { onBoardingStates } = useOnBoardingStore();

  useEffect(() => {
    const storeUserData = async () => {
      const { email, fullName, companyId } = onBoardingStates;
      console.log("User data:", onBoardingStates);
      const payload = {
        personalDetails: {
          email,
          fullName,
        },
        role: "Admin",
        companyId,
      };
      try {
        const response = await axios.post("/api/user/user-details", payload);

        console.log("User details response:", response.data);
      } catch (error) {
        console.log("Error fetching user details:", error);
      }
    };
    storeUserData();
  });

  return <>dashboard</>;
}
