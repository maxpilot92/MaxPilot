"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/../public/logo.svg";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { OAuthStrategy } from "@clerk/types";
import { slides } from "@/lib/slides";

export default function LoginPage() {
  // State variables
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [loginMethod, setLoginMethod] = useState<"password" | "otp">(
    "password"
  );

  // Refs
  const slideContainerRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);

  // Hooks
  const { isLoaded, setActive, signIn } = useSignIn();
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
    }, 3000); // 3000ms = 3 seconds

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

  // Sign in with email and password
  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/users/staff");
      } else {
        console.error("Sign in failed with status:", result.status);
        toast({
          title: "Sign in failed",
          description: "Please check your credentials and try again",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Sign in failed", error);
      toast({
        title: "Sign in failed",
        description: "An error occurred during sign in",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Request email OTP
  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn.create({
        strategy: "email_code",
        identifier: email,
      });

      setOtpSent(true);
      toast({
        title: "Verification code sent",
        description: "Please check your email for the verification code",
      });
    } catch (error) {
      console.error("Failed to send OTP", error);
      toast({
        title: "Failed to send code",
        description: "Please check your email address and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP code
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "email_code",
        code: otpCode,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/users/dashboard");
        toast({
          title: "Sign in successful",
          description: "Welcome back to MaxPilot!",
        });
      }
    } catch (error) {
      console.error("OTP verification failed", error);
      toast({
        title: "Verification failed",
        description: "Invalid or expired code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Sign in with OAuth providers (Google, Xero)
  const handleOAuthSignIn = async (provider: OAuthStrategy) => {
    setIsLoading(true);

    try {
      await signIn.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: "/users/dashboard",
        redirectUrlComplete: "/users/dashboard",
      });
    } catch (error) {
      console.error(`${provider} sign in failed`, error);
      toast({
        title: "Sign in failed",
        description: `Unable to sign in with ${
          provider === "oauth_google" ? "Google" : "Xero"
        }`,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // Toggle between password and OTP login methods
  const toggleLoginMethod = () => {
    setLoginMethod(loginMethod === "password" ? "otp" : "password");
    setOtpSent(false);
    setOtpCode("");
  };

  // Go to a specific slide
  const goToSlide = (index: number) => {
    setActiveSlide(index);
    // Scroll to the slide element if it exists
    if (slidesRef.current[index]) {
      slidesRef.current[index]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Section - Illustration and Info */}
      <div
        className="hidden md:flex md:w-1/2 bg-[#e6f5f3] flex-col items-center justify-between p-8 overflow-hidden"
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
                        src={slide.imageUrl || "/placeholder.svg"}
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

      {/* Right Section - Login Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md">
          <div className="md:hidden mb-8">
            <Image
              src="/maxpilot-logo.svg"
              alt="MAXPILOT"
              width={150}
              height={35}
            />
          </div>

          <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
          <p className="text-gray-600 mb-8">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-[#45D1A7] hover:underline">
              Signup
            </Link>
          </p>

          {loginMethod === "password" && !otpSent ? (
            <form onSubmit={handlePasswordSignIn} className="space-y-6">
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
                    className="w-full pr-10"
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
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) =>
                      setRememberMe(checked as boolean)
                    }
                    disabled={isLoading}
                  />
                  <label htmlFor="remember" className="text-sm text-gray-600">
                    Remember me
                  </label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-sm text-[#45D1A7] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#45D1A7] hover:bg-[#3bb993] text-white"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>

              <p className="text-center text-sm">
                <button
                  type="button"
                  onClick={toggleLoginMethod}
                  className="text-[#45D1A7] hover:underline"
                  disabled={isLoading}
                >
                  Sign in with a verification code instead
                </button>
              </p>
            </form>
          ) : (
            <form
              onSubmit={otpSent ? handleVerifyOTP : handleRequestOTP}
              className="space-y-6"
            >
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
                  disabled={isLoading || otpSent}
                />
              </div>

              {otpSent && (
                <div className="space-y-2">
                  <label htmlFor="otp" className="block text-gray-700">
                    Verification Code
                  </label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter the code sent to your email"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    required
                    className="w-full"
                    disabled={isLoading}
                  />
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-[#45D1A7] hover:bg-[#3bb993] text-white"
                disabled={isLoading}
              >
                {isLoading
                  ? otpSent
                    ? "Verifying..."
                    : "Sending..."
                  : otpSent
                  ? "Verify Code"
                  : "Send Verification Code"}
              </Button>

              <p className="text-center text-sm">
                <button
                  type="button"
                  onClick={toggleLoginMethod}
                  className="text-[#45D1A7] hover:underline"
                  disabled={isLoading}
                >
                  {otpSent ? "Start over" : "Sign in with password instead"}
                </button>
              </p>
            </form>
          )}

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <button
              type="button"
              onClick={() => handleOAuthSignIn("oauth_google")}
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
              {isLoading ? "Connecting..." : "Continue with Google"}
            </button>

            <button
              type="button"
              onClick={() => handleOAuthSignIn("oauth_xero")}
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
              {isLoading ? "Connecting..." : "Continue with Xero"}
            </button>
          </div>
        </div>

        <div className="mt-auto pt-8 text-center text-sm text-gray-500">
          MaxPilot © 2025 maxpilot.com. All Rights Reserved
        </div>
      </div>
    </div>
  );
}
