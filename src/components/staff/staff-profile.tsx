"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Eye,
  FileText,
  MessageSquare,
  PenSquare,
  Trash2,
} from "lucide-react";
import { EditPersonalDetailsDialog } from "./edit-personal-details-dialog";
import { EditWorkDetailsDialog } from "./edit-work-details-dialog";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import type {
  PersonalDetails,
  StaffData,
  WorkDetails,
  NextOfKin,
  PayrollSettings,
} from "@/types/staff/staff";
import { EditPayrollSettingsDialog } from "./edit-payroll-settings-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { EditNextOfKinDialog } from "./edit-next-of-kin-dialog";
import { AlertDialog } from "../alert-dialog";
import { useRouter } from "next/navigation";

export function StaffProfile({ data: initialData }: { data: StaffData }) {
  const [data, setData] = useState(initialData);
  const [nextOfKin, setNextOfKin] = useState<NextOfKin>();
  const [payrollData, setPayrollData] = useState<PayrollSettings>();
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSavePersonalDetails = async (
    updatedData: Partial<PersonalDetails>
  ) => {
    try {
      await axios.put(`/api/user/personal-details/${data.id}`, updatedData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setData((prevData) => ({
        ...prevData,
        personalDetails: {
          ...prevData.personalDetails,
          ...updatedData,
        },
      }));

      toast({
        title: "Success",
        description: "Personal details updated successfully",
      });
    } catch (error) {
      console.error("Error updating personal details:", error);
      toast({
        title: "Error",
        description: "Failed to update personal details. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSaveWorkDetails = async (updatedData: Partial<WorkDetails>) => {
    try {
      await axios.put(`/api/user/staff/work-details/${data.id}`, updatedData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setData((prevData) => ({
        ...prevData,
        workDetails: {
          ...prevData.workDetails,
          ...updatedData,
        },
      }));

      toast({
        title: "Success",
        description: "Work details updated successfully",
      });
    } catch (error) {
      console.error("Error updating work details:", error);
      toast({
        title: "Error",
        description: "Failed to update work details. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const getNextOfKin = async () => {
      try {
        const response = await axios.get(
          `/api/user/staff/next-of-kin/${data.id}`
        );
        setNextOfKin(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    getNextOfKin();
  }, [data.id]);

  const handleSaveNextOfKin = async (updatedData: Partial<NextOfKin>) => {
    try {
      await axios.put(`/api/user/staff/next-of-kin/${data.id}`, updatedData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setNextOfKin((prev) => ({
        ...prev!,
        ...updatedData,
      }));

      toast({
        title: "Success",
        description: "Next of kin details updated successfully",
      });
    } catch (error) {
      console.error("Error updating next of kin:", error);
      toast({
        title: "Error",
        description: "Failed to update next of kin details. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSavePayrollSettings = async (
    updatedData: Partial<PayrollSettings>
  ) => {
    try {
      await axios.put(
        `/api/user/staff/payroll-settings/${data.id}`,
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setPayrollData((prevData) => ({
        ...prevData,
        payrollSettings: {
          ...updatedData,
        },
      }));

      toast({
        title: "Success",
        description: "Payroll settings updated successfully",
      });
    } catch (error) {
      console.error("Error updating payroll settings:", error);
      toast({
        title: "Error",
        description: "Failed to update payroll settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleArchiveStaff = async () => {
    try {
      await axios.put(`/api/user/staff/manage-archive/${data.id}`, data);
      setShowArchiveDialog(false);
      toast({
        title: "Success",
        description: "Staff archived successfully",
      });

      // Optionally redirect to staff list or update UI
    } catch (error) {
      console.error("Error archiving staff:", error);
      toast({
        title: "Error",
        description: "Failed to archive staff. Please try again.",
        variant: "destructive",
      });
    }
  };
  return (
    <div className="grid grid-cols-[1fr_300px] gap-6">
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={"/placeholder.svg?height=64&width=64"} />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">
                {data.personalDetails.fullName}
              </h2>
              <Badge
                variant="secondary"
                className="bg-emerald-100 text-emerald-700"
              >
                Active
              </Badge>
            </div>
            <p className="text-muted-foreground">{data.workDetails.role}</p>
          </div>
        </div>

        {/* Personal Details */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Personal Details</CardTitle>
            <EditPersonalDetailsDialog
              data={data.personalDetails}
              onSave={handleSavePersonalDetails}
            />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
              <div>
                <h4 className="text-sm font-medium mb-1">Name</h4>
                <p className="text-muted-foreground">
                  {data.personalDetails.fullName}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Phone Number</h4>
                <p className="text-muted-foreground">
                  {data.personalDetails.phoneNumber}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Gender</h4>
                <p className="text-muted-foreground">
                  {data.personalDetails.gender || "Not specified"}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">DOB</h4>
                <p className="text-muted-foreground">
                  {data.personalDetails.dob}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Language</h4>
                <p className="text-muted-foreground">
                  {data.personalDetails.language || "Not specified"}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Emergency Contact</h4>
                <p className="text-muted-foreground">
                  {data.personalDetails.emergencyContact}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Work Details */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Work Details</CardTitle>
            <EditWorkDetailsDialog
              data={data.workDetails}
              onSave={handleSaveWorkDetails}
            />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
              <div>
                <h4 className="text-sm font-medium mb-1">Works At</h4>
                <p className="text-muted-foreground">
                  {data.workDetails.worksAt}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Hired On</h4>
                <p className="text-muted-foreground">
                  {data.workDetails.hiredOn}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Employment Type</h4>
                <p className="text-muted-foreground">
                  {data.workDetails.employmentType}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Team</h4>
                <p className="text-muted-foreground"></p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payroll Settings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Payroll Settings</CardTitle>
            <EditPayrollSettingsDialog
              data={payrollData}
              onSave={handleSavePayrollSettings}
            />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-x-12 gap-y-6">
              <div>
                <h4 className="text-sm font-medium mb-1">Industry Award</h4>
                <p className="text-muted-foreground">
                  {payrollData?.industryAward || "None"}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Award Level</h4>
                <p className="text-muted-foreground">
                  {payrollData?.awardLevel || "None"}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">
                  Award Level Pay Point
                </h4>
                <p className="text-muted-foreground">
                  {payrollData?.awardLevelPay || "None"}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Pay Group</h4>
                <p className="text-muted-foreground">
                  {payrollData?.payGroup || "Default Casual"}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">
                  Pay Group Review Date
                </h4>
                <p className="text-muted-foreground">
                  {payrollData?.payGroupReviewDate || "None"}
                </p>
              </div>
              <div>
                x<h4 className="text-sm font-medium mb-1">Employee Profile</h4>
                <p className="text-muted-foreground">
                  {payrollData?.employeeProfile || "None"}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Allowance</h4>
                <p className="text-muted-foreground">
                  {payrollData?.allowances || "None"}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Daily Hours</h4>
                <p className="text-muted-foreground">
                  {payrollData?.dailyHours || "0"}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Weekly Hours</h4>
                <p className="text-muted-foreground">
                  {payrollData?.weeklyHours || "0"}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">
                  External System Identifier
                </h4>
                <p className="text-muted-foreground">
                  {payrollData?.externalSystemIdentifier || "None"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compliance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Compliance</CardTitle>
            <Button variant="ghost" size="sm" className="text-primary">
              <PenSquare className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Last Update</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>COVID-19 Compliance</TableCell>
                  <TableCell>05/01/2025</TableCell>
                  <TableCell>Updated 2 hours ago</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="bg-emerald-100 text-emerald-700"
                    >
                      Active
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <PenSquare className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>First Aid Certificate</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="bg-orange-100 text-orange-700"
                    >
                      Not Specified
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <PenSquare className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>NDIS Worker Check (NDISWC)</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="bg-orange-100 text-orange-700"
                    >
                      Not Specified
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <PenSquare className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Archive Staff */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Archive Staff</h3>
            <p className="text-muted-foreground mb-4">
              Are you sure you want to archive this staff? Once archived, they
              will no longer appear in your list. If you want to unarchive them,
              then please visit{" "}
              <a href="#" className="text-primary hover:underline">
                Archive
              </a>{" "}
              to perform the action.
            </p>
            <Button
              variant="destructive"
              onClick={() => setShowArchiveDialog(true)}
            >
              Archive Staff
            </Button>
          </CardContent>
        </Card>

        <AlertDialog
          open={showArchiveDialog}
          onOpenChange={setShowArchiveDialog}
          title="Archive Staffs?"
          description="Are you sure you want to archive all staff members? Once archived, they will no longer appear in your list."
          onConfirm={handleArchiveStaff}
          onCancel={() => setShowArchiveDialog(false)}
        />
      </div>

      {/* Right Sidebar */}
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <Button className="w-full mb-4" variant="outline">
              + Add Shift
            </Button>
            <div className="space-y-4">
              <Button
                onClick={() => router.push("/users/staff/document")}
                variant="ghost"
                className="w-full justify-start"
              >
                <FileText className="mr-2 h-4 w-4" />
                Documents
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Clock className="mr-2 h-4 w-4" />
                Timesheets
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Calendar
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <MessageSquare className="mr-2 h-4 w-4" />
                Communications
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Forms
              </Button>
            </div>
          </CardContent>
        </Card>
        {/* Next of Kin */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Next Of Kin</CardTitle>
            <EditNextOfKinDialog
              data={nextOfKin}
              onSave={handleSaveNextOfKin}
            />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Name</h4>
                <p className="text-muted-foreground">
                  {nextOfKin ? nextOfKin?.name : ""}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Relation</h4>
                <p className="text-muted-foreground">
                  {nextOfKin ? nextOfKin?.relation : ""}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Contact</h4>
                <p className="text-muted-foreground">
                  {nextOfKin ? nextOfKin?.contact : ""}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Email</h4>
                <p className="text-muted-foreground">
                  {nextOfKin ? nextOfKin?.email : ""}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Settings</CardTitle>
              <Button variant="ghost" size="sm" className="text-primary">
                <PenSquare className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-medium">
                    Notify Timesheet Approval
                  </h4>
                </div>
                <Switch checked={true} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-medium">
                    Subscribe to notification
                  </h4>
                </div>
                <Switch checked={true} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-medium">
                    Available for roostering
                  </h4>
                </div>
                <Switch checked={true} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-medium">Publish shift</h4>
                </div>
                <Switch checked={true} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-medium">Account Owner</h4>
                </div>
                <Switch checked={true} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-medium">No Access</h4>
                </div>
                <Switch checked={true} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
