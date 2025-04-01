"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/../public/logo.svg";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { OAuthStrategy } from "@clerk/types";
import axios from "axios";
import { slides } from "@/lib/slides";

export default function SignupPage() {
  // State variables
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [managerEmail, setManagerEmail] = useState("");
  const [accountType, setAccountType] = useState<"business" | "employee">(
    "business"
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationStep, setVerificationStep] = useState<
    "initial" | "verification"
  >("initial");

  // Refs
  const slideContainerRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);

  // Hooks
  const { isLoaded, signUp } = useSignUp();
  const router = useRouter();
  const { toast } = useToast();

  // Spring animation configuration
  const springConfig = { mass: 1, stiffness: 100, damping: 15 };

  // Auto-slide functionality with delay
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const nextSlide = activeSlide === slides.length - 1 ? 0 : activeSlide + 1;

      // Set the next slide with a delay
      setTimeout(() => {
        setActiveSlide(nextSlide);

        // Scroll to the slide element if it exists
        if (slidesRef.current[nextSlide]) {
          slidesRef.current[nextSlide]?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }
      }, 800); // 800ms delay
    }, 3000); // 3 seconds

    return () => clearInterval(interval);
  }, [isPaused, activeSlide, slides.length]);

  // If Clerk is not loaded yet, skip rendering the full component
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#45D1A7]"></div>
      </div>
    );
  }

  // Password validation
  const passwordsMatch = password === confirmPassword;
  const passwordValid = password.length >= 8;

  // Determine role based on account type
  const role = accountType === "business" ? "admin" : "user";

  // Handle initial signup process
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordsMatch) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure your passwords match",
        variant: "destructive",
      });
      return;
    }

    if (!passwordValid) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // First create the user with the Clerk SDK
      await signUp.create({
        emailAddress: email,
        password,
      });

      console.log("User created in Clerk, preparing email verification");

      // Prepare the email verification
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      // Switch to verification step
      setVerificationStep("verification");

      toast({
        title: "Verification code sent",
        description: "Please check your email for the verification code",
      });
    } catch (error: unknown) {
      console.error("Sign up failed", error);

      let errorMsg = "An error occurred during sign up";

      // Handle AxiosError
      if (axios.isAxiosError(error)) {
        errorMsg =
          (error.response?.data as { message?: string })?.message ||
          error.message ||
          "An error occurred during sign up";
      }
      // Handle ClerkError (or other structured errors)
      else if (error instanceof Error && "errors" in error) {
        const clerkError = error as { errors: { message: string }[] };
        errorMsg =
          clerkError.errors[0]?.message || "An error occurred during sign up";
      }
      // Handle generic Error
      else if (error instanceof Error) {
        errorMsg = error.message;
      }

      // Display the error message using toast
      toast({
        title: "Sign up failed",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle verification code submission
  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Attempt to verify the email address
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      // Store the additional user data via your API
      // Note: This no longer creates another Clerk user, just stores metadata
      const response = await axios.post("/api/sign-up", {
        email,
        fullName,
        companyName,
        accountType,
        role,
        managerEmail,
      });
      console.log("User data stored in the database", response.data);

      if (completeSignUp.status === "complete") {
        // Redirect to dashboard after successful sign up

        const payload = {
          personalDetails: {
            email,
            fullName,
          },
          subRoles: accountType === "business" ? "Admin" : "staff",
          role,
          companyId: response.data.data.companyId,
        };

        await axios.post("/api/user/user-details", payload);
        toast({
          title: "Account created successfully",
          description: "Welcome to MaxPilot!",
        });
        router.push("/users/dashboard");
      }
    } catch (error) {
      console.error("Verification failed", error);
      toast({
        title: "Verification failed",
        description: "Invalid or expired code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up with OAuth providers (Google, Xero)
  const handleOAuthSignUp = async (provider: OAuthStrategy) => {
    setIsLoading(true);

    try {
      await signUp.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: `/onboarding`,
        redirectUrlComplete: `/onboarding`,
      });
    } catch (error) {
      console.error(`${provider} sign up failed`, error);
      toast({
        title: "Sign up failed",
        description: `Unable to sign up with ${
          provider === "oauth_google" ? "Google" : "Xero"
        }`,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // Go to a specific slide
  const goToSlide = (index: number) => {
    setActiveSlide(index);
    if (slidesRef.current[index]) {
      slidesRef.current[index]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f0f9f7]">
      {/* Left Section - Illustration and Info */}
      <div
        className="hidden md:flex md:w-1/2 flex-col items-center justify-between p-8"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        ref={slideContainerRef}
      >
        <div className="w-full max-w-md">
          <Image
            src={Logo}
            alt="MAXPILOT"
            width={180}
            height={40}
            className="mb-12"
          />

          <div className="flex justify-center my-8 relative h-[300px]">
            <AnimatePresence mode="wait">
              {slides.map(
                (slide, index) =>
                  activeSlide === index && (
                    <motion.div
                      key={slide.id}
                      id={slide.id}
                      ref={(el) => {
                        slidesRef.current[index] = el;
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        transition: {
                          delay: 0.8,
                          type: "spring",
                          ...springConfig,
                        },
                      }}
                      exit={{ opacity: 0, y: -20 }}
                      className="absolute"
                    >
                      <Image
                        src={slide.imageUrl}
                        alt={slide.title}
                        width={400}
                        height={300}
                        priority={index === 0}
                      />
                    </motion.div>
                  )
              )}
            </AnimatePresence>
          </div>

          <div className="text-center mt-8 max-w-md mx-auto">
            <AnimatePresence mode="wait">
              <motion.h2
                key={`title-${activeSlide}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    delay: 1.0,
                    type: "spring",
                    ...springConfig,
                  },
                }}
                exit={{ opacity: 0, y: -10 }}
                className="text-2xl font-semibold mb-4 min-h-[2.5rem]"
              >
                {slides[activeSlide].title}
              </motion.h2>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.p
                key={`desc-${activeSlide}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    delay: 1.2,
                    type: "spring",
                    ...springConfig,
                  },
                }}
                exit={{ opacity: 0, y: -10 }}
                className="text-gray-600 mb-8 min-h-[4.5rem]"
              >
                {slides[activeSlide].description}
              </motion.p>
            </AnimatePresence>

            <div className="flex justify-center space-x-2 mt-4">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    activeSlide === index ? "bg-[#0e4f41] w-6" : "bg-gray-300"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Signup Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="md:hidden mb-8">
            <Image
              src="/maxpilot-logo.svg"
              alt="MAXPILOT"
              width={150}
              height={35}
            />
          </div>

          <h1 className="text-3xl font-bold mb-2">Create an Account</h1>
          <p className="text-gray-600 mb-8">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-[#45D1A7] hover:underline">
              Login
            </Link>
          </p>

          {verificationStep === "initial" ? (
            <form onSubmit={handleSignup} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="fullName" className="block text-gray-700">
                  Full Name
                </label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-gray-700">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="companyName" className="block text-gray-700">
                  Company Name
                </label>
                <Input
                  id="companyName"
                  type="text"
                  placeholder="Enter your company name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  className="w-full"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={`w-full pr-10 ${
                      !passwordValid && password ? "border-red-500" : ""
                    }`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {!passwordValid && password && (
                  <p className="text-red-500 text-xs mt-1">
                    Password must be at least 8 characters long
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="block text-gray-700"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Enter your password again"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className={`w-full pr-10 ${
                      !passwordsMatch && confirmPassword ? "border-red-500" : ""
                    }`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                {!passwordsMatch && confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    Passwords don&apos;t match
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-gray-700">
                  Choose Your Account Type
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setAccountType("business")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md border ${
                      accountType === "business"
                        ? "bg-[#45D1A7] text-white border-[#45D1A7]"
                        : "bg-white border-gray-200"
                    }`}
                    disabled={isLoading}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 21H21M3 18H21M5 18V8C5 7.44772 5.44772 7 6 7H18C18.5523 7 19 7.44772 19 8V18M9 7V5C9 4.44772 9.44772 4 10 4H14C14.5523 4 15 4.44772 15 5V7M10 11H14M10 15H14"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Business
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountType("employee")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md border ${
                      accountType === "employee"
                        ? "bg-[#45D1A7] text-white border-[#45D1A7]"
                        : "bg-white border-gray-200"
                    }`}
                    disabled={isLoading}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Employee
                  </button>
                </div>
              </div>

              {accountType === "employee" && (
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label htmlFor="managerEmail" className="block text-gray-700">
                    Manager Email
                  </label>
                  <Input
                    id="managerEmail"
                    type="email"
                    placeholder="Enter your manager's email"
                    value={managerEmail}
                    onChange={(e) => setManagerEmail(e.target.value)}
                    required
                    className="w-full"
                    disabled={isLoading}
                  />
                </motion.div>
              )}

              <div className="flex items-start space-x-2 pt-2">
                <Checkbox
                  id="terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) =>
                    setAgreeToTerms(checked as boolean)
                  }
                  className="mt-1"
                  disabled={isLoading}
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  By creating an account, you agree to{" "}
                  <Link
                    href="/terms"
                    className="text-[#45D1A7] hover:underline"
                  >
                    Terms & Services
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-[#45D1A7] hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#45D1A7] hover:bg-[#3bb993] text-white"
                disabled={isLoading || !agreeToTerms}
              >
                {isLoading ? "Creating Account..." : "Register"}
              </Button>

              <div className="text-center text-sm text-gray-500">or</div>

              <div className="grid grid-cols-1 gap-4">
                <button
                  type="button"
                  onClick={() => handleOAuthSignUp("oauth_google")}
                  className="flex items-center justify-center gap-2 w-full border border-gray-300 rounded-md py-2 px-4 text-gray-700 hover:bg-gray-50"
                  disabled={isLoading}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continue with Google
                </button>

                <button
                  type="button"
                  onClick={() => handleOAuthSignUp("oauth_xero")}
                  className="flex items-center justify-center gap-2 w-full border border-gray-300 rounded-md py-2 px-4 text-gray-700 hover:bg-gray-50"
                  disabled={isLoading}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="12" fill="#13B5EA" />
                    <path
                      d="M6 12.5L10 16.5L18 8.5"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Continue with Xero
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerification} className="space-y-6">
              <div className="rounded-lg bg-green-50 p-4 border border-green-100">
                <p className="text-sm text-green-800">
                  We&apos;ve sent a verification code to{" "}
                  <strong>{email}</strong>. Please check your email and enter
                  the code below.
                </p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="verificationCode"
                  className="block text-gray-700"
                >
                  Verification Code
                </label>
                <Input
                  id="verificationCode"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                  className="w-full"
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#45D1A7] hover:bg-[#3bb993] text-white"
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Complete Registration"}
              </Button>

              <p className="text-center text-sm">
                <button
                  type="button"
                  onClick={() => setVerificationStep("initial")}
                  className="text-[#45D1A7] hover:underline"
                  disabled={isLoading}
                >
                  Go back
                </button>
              </p>
            </form>
          )}
        </div>

        <div className="mt-auto pt-8 text-center text-sm text-gray-500">
          MaxPilot © 2025 maxpilot.com. All Rights Reserved
        </div>
      </div>
    </div>
  );
}
