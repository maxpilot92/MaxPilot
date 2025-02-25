"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  FileText,
  MessageSquare,
  PenSquare,
  Plus,
  Receipt,
  Target,
} from "lucide-react";
import { AlertDialog } from "@/components/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useParams } from "next/navigation";
import { EditClientDetailsDialog } from "@/components/client/edit-client-details-dialog";

interface ClientData {
  id: string;
  personalDetails: {
    fullName: string;
    phoneNumber: string;
    email: string;
    dob: string;
    address: string;
    unitNumber: string;
    language: string;
    emergencyContact: string;
    maritalStatus: string;
    religion: string;
    nationality: string;
    gender: "Female" | "Male" | string; // Update this line
  };
  status: "Active" | "Inactive";
}

export default function ClientProfilePage() {
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const { toast } = useToast();
  const params = useParams();
  const [clientData, setClientData] = useState<ClientData>();

  useEffect(() => {
    async function getClientData() {
      try {
        const response = await axios.get(
          `/api/user/staff/staff-details/${params.id}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data && response.data.data) {
          setClientData(response.data.data);
        } else {
          throw new Error("No data received from API");
        }
      } catch (error) {
        console.error("Error fetching client data:", error);
        if (axios.isAxiosError(error)) {
          console.log(error.response?.data?.message || error.message);
        } else {
          console.log("An unexpected error occurred");
        }
      }
    }

    if (params.id) {
      getClientData();
    }
  }, [params.id]);

  const handleSavePersonalDetails = async (
    updatedData: Partial<ClientData["personalDetails"]>
  ) => {
    if (!clientData) return;

    try {
      console.log("clientData", clientData.id);
      await axios.put(
        `/api/user/personal-details/${clientData.id}`,
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setClientData((prevData) => {
        if (!prevData) return undefined;
        return {
          ...prevData,
          personalDetails: {
            ...prevData.personalDetails,
            ...updatedData,
          },
        };
      });

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

  const handleArchiveClient = async () => {
    if (!clientData) return;

    try {
      await fetch(`/api/clients/${clientData.id}/archive`, { method: "POST" });
      toast({
        title: "Success",
        description: "Client archived successfully",
      });
    } catch (error) {
      console.error("Error archiving client:", error);
      toast({
        title: "Error",
        description: "Failed to archive client. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!clientData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container py-6">
      <div className="grid grid-cols-[1fr_300px] gap-6">
        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder.svg?height=64&width=64" />
              <AvatarFallback>
                {clientData.personalDetails.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">
                  {clientData.personalDetails.fullName}
                </h2>
                <Badge
                  variant="secondary"
                  className="bg-emerald-100 text-emerald-700"
                >
                  {clientData.status}
                </Badge>
              </div>
              <p className="text-muted-foreground">Client</p>
            </div>
          </div>

          {/* Personal Details */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Personal Details</CardTitle>
              <EditClientDetailsDialog
                data={{
                  ...clientData.personalDetails,
                  gender: clientData.personalDetails.gender as
                    | "Female"
                    | "Male"
                    | undefined,
                }}
                onSave={handleSavePersonalDetails}
              />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-y-6">
                <div>
                  <h4 className="text-sm font-medium mb-1">Name</h4>
                  <p className="text-muted-foreground">
                    {clientData.personalDetails.fullName}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Phone Number</h4>
                  <p className="text-muted-foreground">
                    {clientData.personalDetails.phoneNumber}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Email</h4>
                  <p className="text-muted-foreground">
                    {clientData.personalDetails.email}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">DOB</h4>
                  <p className="text-muted-foreground">
                    {clientData.personalDetails.dob}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Address</h4>
                  <p className="text-muted-foreground">
                    {clientData.personalDetails.address}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">
                    Unit/Apartment No.
                  </h4>
                  <p className="text-muted-foreground">
                    {clientData.personalDetails.unitNumber}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Language</h4>
                  <p className="text-muted-foreground">
                    {clientData.personalDetails.language}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">
                    Emergency Contact
                  </h4>
                  <p className="text-muted-foreground">
                    {clientData.personalDetails.emergencyContact}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Marital Status</h4>
                  <p className="text-muted-foreground">
                    {clientData.personalDetails.maritalStatus}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Religion</h4>
                  <p className="text-muted-foreground">
                    {clientData.personalDetails.religion}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Nationality</h4>
                  <p className="text-muted-foreground">
                    {clientData.personalDetails.nationality}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Gender</h4>
                  <p className="text-muted-foreground">
                    {clientData.personalDetails.gender}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Public Information */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Public Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <span className="font-medium">General Information</span>
                <Button variant="ghost" size="sm" className="text-primary">
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <span className="font-medium">Need to know information</span>
                <Button variant="ghost" size="sm" className="text-primary">
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <span className="font-medium">Useful information</span>
                <Button variant="ghost" size="sm" className="text-primary">
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Funds */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Funds</CardTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-primary">
                  View Billing
                </Button>
                <Button variant="ghost" size="sm" className="text-primary">
                  Add Fund
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader className="bg-[#F1F7F6]">
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Starts</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Default</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-4 text-muted-foreground"
                    >
                      No Data Available
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Documents</CardTitle>
              <Button variant="ghost" size="sm" className="text-primary">
                <PenSquare className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader className="bg-[#F1F7F6]">
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Last Update</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-4 text-muted-foreground"
                    >
                      No Data Available
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Associated Forms */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Associated Forms</CardTitle>
              <Button variant="ghost" size="sm" className="text-primary">
                <PenSquare className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader className="bg-[#F1F7F6]">
                  <TableRow>
                    <TableHead>Form Name</TableHead>
                    <TableHead>Mandatory</TableHead>
                    <TableHead>Last Update</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center py-4 text-muted-foreground"
                    >
                      No Data Available
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div className="mt-4 flex justify-end">
                <Button className="bg-[#0D894F] hover:bg-[#0D894F]/90">
                  <Plus className="h-4 w-4 mr-1" />
                  Attach Form
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Invoices */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Invoices</CardTitle>
              <Button variant="ghost" size="sm" className="text-primary">
                <PenSquare className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader className="bg-[#F1F7F6]">
                  <TableRow>
                    <TableHead>Invoice Number</TableHead>
                    <TableHead>Issued Date</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Tax</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-4 text-muted-foreground"
                    >
                      No Data Available
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Archive Client */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Archive Client</h3>
              <p className="text-muted-foreground mb-4">
                Are you sure you want to archive this client? Once archived,
                they will no longer appear in your list. If you want to
                unarchive them, then please visit{" "}
                <a href="#" className="text-primary hover:underline">
                  Archive
                </a>{" "}
                to perform the action.
              </p>
              <Button
                variant="destructive"
                onClick={() => setShowArchiveDialog(true)}
              >
                Archive Client
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-2">
          <Button className="w-full bg-[#0D894F] hover:bg-[#0D894F]/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Shift
          </Button>
          <Button className="w-full bg-[#0D894F] hover:bg-[#0D894F]/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <FileText className="h-4 w-4 mr-2" />
            Documents
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Calendar className="h-4 w-4 mr-2" />
            Calendar
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <MessageSquare className="h-4 w-4 mr-2" />
            Communications
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Receipt className="h-4 w-4 mr-2" />
            Billing Reports
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Target className="h-4 w-4 mr-2" />
            Goals
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <FileText className="h-4 w-4 mr-2" />
            Forms
          </Button>

          {/* Additional Information */}
          <Card className="mt-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Additional Information</CardTitle>
              <Button variant="ghost" size="sm" className="text-primary">
                <PenSquare className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-1">NDIS Number:</h4>
                <p className="text-muted-foreground">-</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">
                  Aged Care Recipient ID:
                </h4>
                <p className="text-muted-foreground">-</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Reference Number:</h4>
                <p className="text-muted-foreground">-</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Custom Field:</h4>
                <p className="text-muted-foreground">-</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">PO. Number:</h4>
                <p className="text-muted-foreground">-</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Client Type:</h4>
                <p className="text-muted-foreground">-</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">
                  Default Price Book:
                </h4>
                <p className="text-muted-foreground">-</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Team:</h4>
                <p className="text-muted-foreground">-</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">
                  Share Progress Note:
                </h4>
                <p className="text-muted-foreground">-</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Invoice Travel:</h4>
                <p className="text-muted-foreground">-</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog
        open={showArchiveDialog}
        onOpenChange={setShowArchiveDialog}
        title="Archive Client?"
        description="Are you sure you want to archive this client? Once archived, they will no longer appear in your list."
        onConfirm={handleArchiveClient}
        onCancel={() => setShowArchiveDialog(false)}
      />
    </div>
  );
}
