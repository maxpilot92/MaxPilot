"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronDown,
  X,
  Play,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/../public/logo.svg";
import Website from "@/../public/website1 2.png";
import DemoThumbnail from "@/../public/demo.svg";
import Frame from "@/../public/frame.svg";
import Access from "@/../public/access.svg";
import GooglePlay from "@/../public/googlePlay.svg";
import AppStore from "@/../public/appStore.svg";
import Pricing from "@/components/pricing";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [cancel, setCancel] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex min-h-screen flex-col px-10">
      {/* Promo Banner */}
      {!cancel && (
        <motion.div
          initial={{ height: 30, opacity: 1 }}
          animate={{ height: isScrolled ? 0 : 30, opacity: isScrolled ? 0 : 1 }}
          transition={{ duration: 0.3 }}
          className="bg-[#4EB18D] text-white text-xs text-center py-1 px-4 flex items-center justify-center relative overflow-hidden"
        >
          <span>
            🔥 Special Offer: Save time trial today and enjoy 20% off for three
            Plan! Don&apost miss out on this limited time offer.
          </span>
          <button
            onClick={() => setCancel(true)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}

      {/* Header */}
      <motion.header
        className={`sticky top-0 z-50 bg-white border-b border-gray-100 transition-all duration-300 ${
          isScrolled ? "shadow-sm" : ""
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      >
        <div className="container mx-auto flex items-center justify-between py-4 px-4">
          <div className="flex items-center">
            <Link href="/" className="mr-8">
              <Image
                src={Logo}
                alt="MaxPilot Logo"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            </Link>
            <nav className="hidden md:flex space-x-1">
              <div className="relative group">
                <button className="px-3 py-2 text-sm font-medium text-gray-700 flex items-center">
                  Features <ChevronDown size={16} className="ml-1" />
                </button>
              </div>
              <Link
                href="#pricing"
                className="px-3 py-2 text-sm font-medium text-gray-700"
              >
                Pricing
              </Link>
              <div className="relative group">
                <button className="px-3 py-2 text-sm font-medium text-gray-700 flex items-center">
                  About <ChevronDown size={16} className="ml-1" />
                </button>
              </div>
            </nav>
          </div>
          <div className="flex items-center space-x-2">
            <Link
              href="/sign-in"
              className="text-sm font-medium text-gray-700 px-3 py-2"
            >
              Log In
            </Link>
            <Button
              variant="outline"
              size="sm"
              className="text-sm border-[#4EB18D] text-[#4EB18D] hover:bg-[#4EB18D]/10"
            >
              Book a Demo
            </Button>
            <Button
              size="sm"
              className="text-sm bg-[#4EB18D] hover:bg-[#4EB18D]/90"
            >
              Start Free Trial
            </Button>
          </div>
        </div>
      </motion.header>

      <main>
        {/* Hero Section */}
        <section className="bg-white py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="max-w-xl"
              >
                <div className="mb-6">
                  <span className="text-sm font-medium text-[#4EB18D]">
                    Simplifying Your Workforce
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Effortless <br />
                  <span className="text-[#4EB18D]">Rostering</span> & <br />
                  Staff Management
                </h1>
                <p className="text-gray-600 mb-8">
                  Managing your team has never been easier. From scheduling and
                  time tracking to payroll and compliance, we help you
                  streamline your operations.
                </p>
                <div className="flex flex-wrap gap-3 mb-8">
                  <Button className="bg-[#4EB18D] hover:bg-[#4EB18D]/90">
                    Start free trial
                  </Button>
                  <Button
                    variant="outline"
                    className="border-[#4EB18D] text-[#4EB18D] hover:bg-[#4EB18D]/10"
                  >
                    Book a Demo
                  </Button>
                </div>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center">
                    <div className="w-5 h-5 rounded-full bg-[#4EB18D] flex items-center justify-center mr-2">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20 6L9 17L4 12"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span>Rostering</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-5 h-5 rounded-full bg-[#4EB18D] flex items-center justify-center mr-2">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20 6L9 17L4 12"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span>Totally Free Trial</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-5 h-5 rounded-full bg-[#4EB18D] flex items-center justify-center mr-2">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20 6L9 17L4 12"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span>24 Hour support</span>
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative"
              >
                <Image
                  src={Website}
                  alt="MaxPilot App"
                  width={500}
                  height={600}
                  className="w-full h-auto"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Why Choose MaxPilot */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-flex items-center bg-white rounded-full px-4 py-2 shadow-sm"
            >
              <span className="text-sm font-medium">Why Choose MaxPilot?</span>
            </motion.div>
          </div>

          <div className="container mx-auto px-4 mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-center mb-4"
            >
              Simplify Scheduling, Payroll, and Team Management in <br />
              One Easy App
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-gray-600 text-center max-w-3xl mx-auto"
            >
              Manage your entire workforce effectively with built-in rostering
              and time tracking. Enjoy personalized client care and support from
              our dedicated team.
            </motion.p>
          </div>

          <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🔄",
                title: "Staff Management & Scheduling",
                description:
                  "Effortlessly manage and schedule your staff shifts. Plan, set up, edit, and organize rosters with ease. Manage leave requests and track time for each staff.",
              },
              {
                icon: "👥",
                title: "Employee Management",
                description:
                  "Easily manage your employees and enjoy a hassle-free onboarding process. Streamline communication, track training, and improve employee security needs.",
              },
              {
                icon: "💼",
                title: "Care Management",
                description:
                  "Create detailed care plans for your clients by specifying the scheduling process, tracking progress, and managing medications. Ensure clients receive every step of the care.",
              },
              {
                icon: "💰",
                title: "Payroll Integration",
                description:
                  "Easily manage billing and payments with our payroll integration. Connect with your existing accounting software and handle your finances with confidence and ease.",
              },
              {
                icon: "📱",
                title: "Mobile App",
                description:
                  "Stay on top of your schedule and shift details on the go. Access your roster from anywhere, take off, and view open shifts with ease. Track your employees for accurate attendance.",
              },
              {
                icon: "⏱️",
                title: "Time Tracking & Attendance",
                description:
                  "Effortlessly track shifts in real-time and know exactly when your employees arrive and leave. Receive proof! Real-time updates on shift changes, availability, and leave applications.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-lg shadow-sm"
              >
                <div className="w-12 h-12 bg-[#E8F5F0] rounded-full flex items-center justify-center mb-4 text-2xl">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Demo Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl font-bold mb-8"
            >
              Demo
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-gray-600 mb-8"
            >
              Check out the demo below to see how easy it is to use our web and
              mobile app.
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="relative rounded-lg overflow-hidden"
              >
                <Image
                  src={DemoThumbnail}
                  alt="Demo Video Thumbnail"
                  width={500}
                  height={300}
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 -mt-5 -ml-6 bg-white rounded-full flex items-center justify-center shadow-lg cursor-pointer">
                    <Play className="text-[#4EB18D] ml-1" size={24} />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="relative rounded-lg overflow-hidden bg-gray-100"
              >
                <div className="h-full flex items-center justify-center">
                  <span className="text-gray-400">Additional demo content</span>
                </div>
              </motion.div>
            </div>

            <div className="flex justify-end mt-4">
              <Link
                href="#"
                className="text-[#4EB18D] font-medium flex items-center text-sm"
              >
                Watch More <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        </section>

        {/* Built for Everyday Assistance */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl font-bold mb-12"
            >
              Built for Everyday Assistance
            </motion.h2>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="lg:col-span-2"
              >
                <Image
                  src={Frame}
                  alt="Healthcare Worker with Patient"
                  width={400}
                  height={400}
                  className="w-full h-auto rounded-lg"
                />
              </motion.div>

              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    icon: "👤",
                    title: "Personal Care",
                    description:
                      "Tailored support for individuals, assisting with daily activities.",
                  },
                  {
                    icon: "🏥",
                    title: "24 Hour Care",
                    description:
                      "Around-the-clock care for those who need constant assistance.",
                  },
                  {
                    icon: "💻",
                    title: "NDIS Software",
                    description:
                      "A complete system designed to support the NDIS.",
                  },
                  {
                    icon: "🤝",
                    title: "Support Coordination",
                    description:
                      "Assistance with NDIS plan management and support.",
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 + 0.1 * index }}
                    viewport={{ once: true }}
                    className="bg-white p-6 rounded-lg shadow-sm"
                  >
                    <div className="w-12 h-12 bg-[#E8F5F0] rounded-full flex items-center justify-center mb-4 text-2xl">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Mobile and Desktop Access */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold mb-4">
                  Mobile and
                  <br />
                  Desktop Access
                </h2>
                <p className="text-gray-600 mb-8">
                  MaxPilot provides you the option to access it anywhere from
                  your desktop or mobile device.
                </p>

                <div className="space-y-4">
                  {[
                    "Access MaxPilot from anywhere, anytime",
                    "Real-time data synced across all devices for a seamless experience",
                    "Manage tasks anytime, anywhere with full access on desktop and mobile",
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 * index }}
                      viewport={{ once: true }}
                      className="flex items-center"
                    >
                      <div className="w-6 h-6 rounded-full border border-[#4EB18D] flex items-center justify-center mr-3">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M20 6L9 17L4 12"
                            stroke="#4EB18D"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <span className="text-sm">{feature}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="flex space-x-4 mt-8">
                  <Link
                    href="#"
                    className="flex items-center bg-black text-white rounded-md px-4 py-2"
                  >
                    <Image
                      src={GooglePlay}
                      alt="Google Play"
                      width={20}
                      height={20}
                      className="mr-2"
                    />
                    <div>
                      <div className="text-xs">Get it on</div>
                      <div className="text-sm font-medium">Google Play</div>
                    </div>
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center bg-black text-white rounded-md px-4 py-2"
                  >
                    <Image
                      src={AppStore}
                      alt="App Store"
                      width={20}
                      height={20}
                      className="mr-2"
                    />
                    <div>
                      <div className="text-xs">Download on the</div>
                      <div className="text-sm font-medium">App Store</div>
                    </div>
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <Image
                  src={Access}
                  alt="MaxPilot on Desktop and Mobile"
                  width={500}
                  height={500}
                  className="w-full h-auto"
                />
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#FFF7E8] rounded-lg z-[-1]"></div>
                <div className="absolute -top-4 -right-4 w-24 h-24">
                  <div className="w-full h-full flex flex-wrap">
                    {[...Array(9)].map((_, i) => (
                      <div
                        key={i}
                        className="w-2 h-2 bg-[#FFD166] m-0.5 rounded-full"
                      ></div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <Pricing />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <Image
                src={Logo}
                alt="MaxPilot Logo"
                width={120}
                height={40}
                className="h-8 w-auto mb-4"
              />
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Phone size={16} className="mr-2 text-gray-400" />
                  <span>+877-9999999999</span>
                </div>
                <div className="flex items-center">
                  <Mail size={16} className="mr-2 text-gray-400" />
                  <span>info@maxpilot.com</span>
                </div>
                <div className="flex items-center">
                  <MapPin size={16} className="mr-2 text-gray-400" />
                  <span>Queensland, Australia, Planet Earth</span>
                </div>
              </div>
              <div className="flex space-x-3 mt-4">
                <Link
                  href="#"
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                >
                  <Facebook size={16} className="text-gray-600" />
                </Link>
                <Link
                  href="#"
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                >
                  <Twitter size={16} className="text-gray-600" />
                </Link>
                <Link
                  href="#"
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                >
                  <Instagram size={16} className="text-gray-600" />
                </Link>
                <Link
                  href="#"
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                >
                  <Linkedin size={16} className="text-gray-600" />
                </Link>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="#">Staff Management & Scheduling</Link>
                </li>
                <li>
                  <Link href="#">Employee Management</Link>
                </li>
                <li>
                  <Link href="#">Time Tracking & Attendance</Link>
                </li>
                <li>
                  <Link href="#">Leave & Availability Management</Link>
                </li>
                <li>
                  <Link href="#">Client Management</Link>
                </li>
                <li>
                  <Link href="#">Compliance & Reporting</Link>
                </li>
                <li>
                  <Link href="#">Document Management</Link>
                </li>
                <li>
                  <Link href="#">Feedback Management</Link>
                </li>
                <li>
                  <Link href="#">Incident Management</Link>
                </li>
                <li>
                  <Link href="#">Mobile App</Link>
                </li>
                <li>
                  <Link href="#">Payroll Integration</Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="#">Blog</Link>
                </li>
                <li>
                  <Link href="#">FAQs</Link>
                </li>
                <li>
                  <Link href="#">Videos</Link>
                </li>
                <li>
                  <Link href="#">Guides</Link>
                </li>
                <li>
                  <Link href="#">Monthly</Link>
                </li>
                <li>
                  <Link href="#">Annually</Link>
                </li>
                <li>
                  <Link href="#">Free Trial</Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-4">About</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="#">About Us</Link>
                </li>
                <li>
                  <Link href="#">Help Center</Link>
                </li>
                <li>
                  <Link href="#">Book a Demo</Link>
                </li>
                <li>
                  <Link href="#">Terms & Conditions</Link>
                </li>
                <li>
                  <Link href="#">Privacy Policy</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-100">
            <div className="flex space-x-4 mb-4 md:mb-0">
              <Link
                href="#"
                className="flex items-center bg-black text-white rounded-md px-3 py-1.5"
              >
                <Image
                  src={GooglePlay}
                  alt="Google Play"
                  width={16}
                  height={16}
                  className="mr-2"
                />
                <div>
                  <div className="text-[10px]">Get it on</div>
                  <div className="text-xs font-medium">Google Play</div>
                </div>
              </Link>
              <Link
                href="#"
                className="flex items-center bg-black text-white rounded-md px-3 py-1.5"
              >
                <Image
                  src={AppStore}
                  alt="App Store"
                  width={16}
                  height={16}
                  className="mr-2"
                />
                <div>
                  <div className="text-[10px]">Download on the</div>
                  <div className="text-xs font-medium">App Store</div>
                </div>
              </Link>
            </div>

            <div className="text-xs text-gray-500">
              © 2024 MaxPilot. All Rights Reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
