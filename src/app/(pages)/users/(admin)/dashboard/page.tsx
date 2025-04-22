"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOnBoardingStore } from "@/store/onBoardingStore";
import axios from "axios";
import { Calendar } from "lucide-react";
import React, { useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

// Sample data for the charts
const attendanceData = [
  { date: "19/01", "Late Clock-ins": 0, "Late Clock-outs": 0 },
  { date: "20/01", "Late Clock-ins": 8, "Late Clock-outs": 0 },
  { date: "21/01", "Late Clock-ins": 0, "Late Clock-outs": 15 },
  { date: "22/01", "Late Clock-ins": 0, "Late Clock-outs": 0 },
  { date: "23/01", "Late Clock-ins": 0, "Late Clock-outs": 10 },
  { date: "24/01", "Late Clock-ins": 0, "Late Clock-outs": 0 },
  { date: "25/01", "Late Clock-ins": 0, "Late Clock-outs": 0 },
];

const activityData = [
  { date: "19/01", Booked: 0, Cancelled: 0, Pending: 0, Absent: 0 },
  { date: "20/01", Booked: 0, Cancelled: 0, Pending: 0, Absent: 5 },
  { date: "21/01", Booked: 0, Cancelled: 0, Pending: 0, Absent: 0 },
  { date: "22/01", Booked: 5, Cancelled: 0, Pending: 0, Absent: 0 },
  { date: "23/01", Booked: 15, Cancelled: 10, Pending: 0, Absent: 0 },
  { date: "24/01", Booked: 8, Cancelled: 0, Pending: 5, Absent: 0 },
  { date: "25/01", Booked: 5, Cancelled: 0, Pending: 0, Absent: 8 },
];

const unavailabilityData = [
  {
    id: 1,
    submittedBy: "Sita",
    from: "February 24, 2025",
    to: "February 24, 2025",
    requestedOn: "February 23, 2025",
    reason: "This is an reason given for unavailability",
  },
  {
    id: 2,
    submittedBy: "Jane",
    from: "February 24, 2025",
    to: "February 28, 2025",
    requestedOn: "February 23, 2025",
    reason: "This is an reason given for unavailability",
  },
  {
    id: 3,
    submittedBy: "John",
    from: "February 24, 2025, 12:00 AM",
    to: "February 24, 2025, 01:00 PM",
    requestedOn: "February 23, 2025",
    reason: "This is an reason given for unavailability",
  },
];

export default function Dashboard() {
  const { onBoardingStates } = useOnBoardingStore();

  useEffect(() => {
    const storeUserData = async () => {
      const { email, fullName, companyId, role, subRoles } = onBoardingStates;

      const payload = {
        personalDetails: {
          email,
          fullName,
        },
        subRoles,
        role,
        companyId,
      };

      console.log("User details payload:", payload);
      try {
        const response = await axios.post("/api/user/user-details", payload);
        console.log("User details response:", response.data);
      } catch (error) {
        console.log("Error fetching user details:", error);
      }
    };
    storeUserData();
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-medium">Good Morning, Jane</h1>
          <p className="text-gray-500">Welcome back to ABC Company</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total Staff"
            value="20"
            icon={
              <div className="p-2 bg-blue-50 rounded-full">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                    stroke="#3498db"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6 21V19C6 17.9391 6.42143 16.9217 7.17157 16.1716C7.92172 15.4214 8.93913 15 10 15H14C15.0609 15 16.0783 15.4214 16.8284 16.1716C17.5786 16.9217 18 17.9391 18 19V21"
                    stroke="#3498db"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            }
            actionText="Add New Staff"
          />
          <StatCard
            title="Available for Rostering"
            value="16"
            icon={
              <div className="p-2 bg-green-50 rounded-full">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
                    stroke="#2ecc71"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z"
                    stroke="#2ecc71"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M20 8V14"
                    stroke="#2ecc71"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M23 11H17"
                    stroke="#2ecc71"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            }
            actionText="Add Staff Availability"
          />
          <StatCard
            title="Total Teams"
            value="5"
            icon={
              <div className="p-2 bg-purple-50 rounded-full">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
                    stroke="#9b59b6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
                    stroke="#9b59b6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13"
                    stroke="#9b59b6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88"
                    stroke="#9b59b6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            }
            actionText="Add New Team"
          />
          <StatCard
            title="Total Client"
            value="12"
            icon={
              <div className="p-2 bg-orange-50 rounded-full">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                    stroke="#e67e22"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                    stroke="#e67e22"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            }
            actionText="Add New Client"
          />
        </div>

        {/* Shift Activity Section */}
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4">Shift Activity</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-white p-4 rounded-md border">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-gray-600">
                  Attendance
                </h3>
                <Select defaultValue="last7days">
                  <SelectTrigger className="w-[180px] h-8 text-xs">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last7days">Last 7 days</SelectItem>
                    <SelectItem value="last30days">Last 30 days</SelectItem>
                    <SelectItem value="last90days">Last 90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-600">Number of Staff</p>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={attendanceData}
                    margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <RechartsTooltip />
                    <Line
                      type="monotone"
                      dataKey="Late Clock-ins"
                      stroke="#f39c12"
                      activeDot={{ r: 8 }}
                      dot={{ r: 4, fill: "#f39c12" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="Late Clock-outs"
                      stroke="#5b48e0"
                      activeDot={{ r: 8 }}
                      dot={{ r: 4, fill: "#5b48e0" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#f39c12]"></div>
                  <span className="text-xs text-gray-600">Late Clock-ins</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#5b48e0]"></div>
                  <span className="text-xs text-gray-600">Late Clock-outs</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-md border">
              <h3 className="text-sm font-medium text-gray-600 mb-4">
                Shift Cancellation (%)
              </h3>
              <div className="h-64 flex items-center justify-center">
                <DonutChart
                  data={[
                    {
                      name: "Cancelled by Staff",
                      value: 60,
                      color: "#2ecc71",
                    },
                    {
                      name: "Cancelled by Client",
                      value: 40,
                      color: "#7f8c8d",
                    },
                  ]}
                />
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#2ecc71]"></div>
                  <span className="text-xs text-gray-600">
                    Cancelled by Staff
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#7f8c8d]"></div>
                  <span className="text-xs text-gray-600">
                    Cancelled by Client
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Insight Overview Section */}
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4">Insight Overview</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-md border">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-gray-600">
                  Incidents Overview (%)
                </h3>
                <Select defaultValue="pastMonth">
                  <SelectTrigger className="w-[180px] h-8 text-xs">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pastMonth">Past Month</SelectItem>
                    <SelectItem value="past3Months">Past 3 Months</SelectItem>
                    <SelectItem value="past6Months">Past 6 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="h-64 flex items-center justify-center">
                <DonutChart
                  data={[
                    {
                      name: "Resolved Incidents",
                      value: 60,
                      color: "#2ecc71",
                    },
                    { name: "Open Incidents", value: 40, color: "#7f8c8d" },
                  ]}
                />
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#2ecc71]"></div>
                  <span className="text-xs text-gray-600">
                    Resolved Incidents
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#7f8c8d]"></div>
                  <span className="text-xs text-gray-600">Open Incidents</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-md border">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-gray-600">
                  Activity Overview
                </h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>19/01/2024</span>
                    <span>to</span>
                    <span>25/01/2024</span>
                  </div>
                </div>
              </div>
              <div className="mb-2">
                <p className="text-sm text-gray-600">Hours</p>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={activityData}
                    margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <RechartsTooltip />
                    <Bar dataKey="Booked" fill="#2ecc71" barSize={10} />
                    <Bar dataKey="Cancelled" fill="#f39c12" barSize={10} />
                    <Bar dataKey="Pending" fill="#e74c3c" barSize={10} />
                    <Bar dataKey="Absent" fill="#5b48e0" barSize={10} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#2ecc71]"></div>
                  <span className="text-xs text-gray-600">Booked</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#f39c12]"></div>
                  <span className="text-xs text-gray-600">Cancelled</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#e74c3c]"></div>
                  <span className="text-xs text-gray-600">Pending</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#5b48e0]"></div>
                  <span className="text-xs text-gray-600">Absent</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Manage Unavailability Section */}
        <div>
          <h2 className="text-lg font-medium mb-4">Manage Unavailability</h2>
          <div className="bg-white rounded-md border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-emerald-50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Submitted By
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      From
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      To
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Requested On
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Reason
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {unavailabilityData.map((item) => (
                    <tr key={item.id} className="border-t">
                      <td className="px-4 py-3 text-sm">{item.submittedBy}</td>
                      <td className="px-4 py-3 text-sm">{item.from}</td>
                      <td className="px-4 py-3 text-sm">{item.to}</td>
                      <td className="px-4 py-3 text-sm">{item.requestedOn}</td>
                      <td className="px-4 py-3 text-sm">{item.reason}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs h-8"
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="text-xs h-8"
                          >
                            Decline
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  actionText,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  actionText: string;
}) {
  return (
    <Card className="p-4 bg-white">
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
      </div>
      <Button
        variant="ghost"
        className="w-full justify-start text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 p-0 h-auto"
      >
        <span className="text-sm">+ {actionText}</span>
      </Button>
    </Card>
  );
}

// Donut Chart Component
const DonutChart = ({
  data,
}: {
  data: { name: string; value: number; color: string }[];
}) => {
  // Use useEffect and useState to ensure client-side only rendering
  const [chartPaths, setChartPaths] = React.useState<React.ReactNode[]>([]);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);

    const total = data.reduce((sum, item) => sum + item.value, 0);
    let startAngle = 0;
    const paths: React.ReactNode[] = [];

    data.forEach((item, index) => {
      const angle = (item.value / total) * 360;
      const endAngle = startAngle + angle;

      // Calculate SVG arc path with fixed precision to avoid hydration errors
      const x1 = Number(
        (50 + 40 * Math.cos((startAngle * Math.PI) / 180)).toFixed(2)
      );
      const y1 = Number(
        (50 + 40 * Math.sin((startAngle * Math.PI) / 180)).toFixed(2)
      );
      const x2 = Number(
        (50 + 40 * Math.cos((endAngle * Math.PI) / 180)).toFixed(2)
      );
      const y2 = Number(
        (50 + 40 * Math.sin((endAngle * Math.PI) / 180)).toFixed(2)
      );

      // Determine if the arc should take the long path (> 180 degrees)
      const largeArcFlag = angle > 180 ? 1 : 0;

      // Create the SVG path with fixed precision
      const path = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

      paths.push(<path key={index} d={path} fill={item.color} />);

      startAngle = endAngle;
    });

    setChartPaths(paths);
  }, [data]);

  // Show a placeholder during server-side rendering
  if (!isClient) {
    return (
      <div className="relative w-48 h-48 flex items-center justify-center">
        <div className="w-48 h-48 rounded-full bg-gray-100"></div>
      </div>
    );
  }

  return (
    <div className="relative w-48 h-48">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {chartPaths}
        <circle cx="50" cy="50" r="25" fill="white" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {data.length > 0 && (
          <span className="text-2xl font-semibold">{data[0].value}%</span>
        )}
      </div>
    </div>
  );
};
