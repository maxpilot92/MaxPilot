"use client";
import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useOnBoardingStore } from "@/store/onBoardingStore";

export default function OnboardingPage() {
  const { user } = useUser();
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    managerEmail: "",
    accountType: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setOnBoardingStates } = useOnBoardingStore();

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        User not found
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post("/api/sign-up", {
        email: user.emailAddresses[0].emailAddress,
        fullName: formData.fullName,
        companyName: formData.companyName,
        accountType: formData.accountType,
        role: "staff",
        subRoles: "Admin",
        managerEmail: formData.managerEmail,
      });
      console.log("Sign up response:", response.data);
      setOnBoardingStates({
        fullName: formData.fullName,
        companyName: formData.companyName,
        managerEmail: formData.managerEmail,
        accountType: formData.accountType,
        companyId: response.data.data.public_metadata.companyId,
        email: user.emailAddresses[0].emailAddress,
        role: response.data.data.public_metadata.role,
        subRoles: "Admin",
      });
      router.push("/users/dashboard");
    } catch (error) {
      console.error("Error updating user metadata:", error);
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Complete Your Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium mb-1">
            Full Name *
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="companyName"
            className="block text-sm font-medium mb-1"
          >
            Company Name *
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="managerEmail"
            className="block text-sm font-medium mb-1"
          >
            Manager Email
          </label>
          <input
            type="email"
            id="managerEmail"
            name="managerEmail"
            value={formData.managerEmail}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="managerEmail"
            className="block text-sm font-medium mb-1"
          >
            Account Type
          </label>
          <input
            type="text"
            id="managerEmail"
            name="managerEmail"
            value={formData.accountType}
            onChange={(e) =>
              setFormData({ ...formData, accountType: e.target.value })
            }
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 rounded text-white ${
            isSubmitting ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isSubmitting ? "Processing..." : "Complete Registration"}
        </button>
      </form>
    </div>
  );
}
