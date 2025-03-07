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
import { AddNewHeadingDialog } from "@/components/client/add-new-heading-dialog";
import { AddDocumentDialog } from "@/components/client/document-upload-dialog";
import { Documents } from "@prisma/client";

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

interface PublicInformation {
  generalInfo: string;
  needToKnowInfo: { heading: string; description: string };
  usefulInfo: { heading: string; description: string };
}

interface GetDocument {
  data: Documents;
}

export default function ClientProfilePage() {
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [clientData, setClientData] = useState<ClientData>();
  const [open, setOpen] = useState<boolean>(false);
  const [shouldUpdate, setShouldUpdate] = useState<boolean>(false);
  const [publicInformation, setPublicInformation] =
    useState<PublicInformation>();
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [documents, setDocuments] = useState<Documents[]>();
  const { toast } = useToast();
  const params = useParams();

  // gets client data
  useEffect(() => {
    async function getClientData() {
      try {
        const response = await axios.get(
          `/api/user/user-details/${params.id}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data && response.data.data) {
          setClientData(response.data.data);
          setPublicInformation(response.data.data.publicInformation);
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
      await axios(`/api/user/staff/manage-archive/${clientData.id}`);
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

  // Add this to your useEffect or create a new one
  useEffect(() => {
    async function getPublicInformation() {
      try {
        const response = await axios.get(
          `/api/user/client/public-information?userId=${clientData?.id}`
        );
        console.log(response);
        if (response.data && response.data.data) {
          setPublicInformation(response.data.data);
        }
      } catch (error) {
        console.log("Error fetching public information:", error);
      }
    }

    getPublicInformation();
    setShouldUpdate(publicInformation ? true : false);
  }, [clientData?.id]);

  // Function to handle general information creation or update
  const handlePublicInfoCreation = async () => {
    try {
      const userId = clientData?.id;
      const url = `/api/user/client/public-information?userId=${userId}`;
      console.log(shouldUpdate, "su");
      // Check if we have existing public information

      if (shouldUpdate) {
        console.log("Public information already exists");
        await axios.put(url, {
          generalInfo: publicInformation?.generalInfo,
          needToKnowInfo: publicInformation?.needToKnowInfo,
          usefulInfo: publicInformation?.usefulInfo,
        });

        toast({
          title: "Success",
          description: "Public information updated successfully",
        });
        // handle put api call
      } else {
        // handle post api call
        if (!publicInformation) {
          throw new Error("Public information is required");
        }

        await axios.post(url, {
          generalInfo: publicInformation?.generalInfo,
          needToKnowInfo: publicInformation?.needToKnowInfo || {
            key: "",
            value: "",
          },
          usefulInfo: publicInformation?.usefulInfo || { key: "", value: "" },
        });
        toast({
          title: "Success",
          description: "Public information saved successfully",
        });
      }

      setIsClicked(false);
    } catch (error) {
      console.error("Error saving general information:", error);
      toast({
        title: "Failed to save general information",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const refreshPublicInformation = async () => {
    try {
      const response = await axios.get(
        `/api/user/client/public-information?userId=${clientData?.id}`
      );
      if (response.data && response.data.data) {
        setPublicInformation(response.data.data);
        setShouldUpdate(true);
      }
    } catch (error) {
      console.error("Error refreshing public information:", error);
    }
  };

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get<GetDocument>(
          "/api/user/client/document?role=client"
        );
        console.log(response);

        if (response.data && Array.isArray(response.data.data)) {
          const updatedDocuments = response.data.data.map((document) => {
            const expiresDate = new Date(document.expires);
            const archiveStatus =
              expiresDate > new Date() ? "Not Expired" : "Expired";
            return { ...document, status: archiveStatus };
          });

          setDocuments(updatedDocuments);
        } else {
          console.error("Invalid response data:", response.data);
        }
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };

    fetchDocuments();
  }, []);

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
              <div className="flex items-center justify-between">
                <span className="font-medium">General Information</span>
                <Button
                  onClick={() => setIsClicked(true)}
                  variant="ghost"
                  size="sm"
                  className="text-primary"
                >
                  <Plus className="h-4 w-4" />
                  {publicInformation?.generalInfo ? "Edit" : "Add"}
                </Button>
              </div>
              {isClicked && (
                <div>
                  <div>
                    <input
                      type="text"
                      placeholder="Enter addition General Information"
                      value={publicInformation?.generalInfo}
                      onChange={(e) =>
                        setPublicInformation((prev) => {
                          return {
                            generalInfo: e.target.value,
                            needToKnowInfo: prev?.needToKnowInfo ?? {
                              heading: "",
                              description: "",
                            },
                            usefulInfo: prev?.usefulInfo ?? {
                              heading: "",
                              description: "",
                            },
                          };
                        })
                      }
                      className="border border-gray-300 rounded-md w-full p-2"
                    />
                  </div>
                  <div className="flex justify-end gap-3 my-2">
                    <Button onClick={handlePublicInfoCreation}>Save</Button>
                    <Button onClick={() => setIsClicked(false)}>Cancel</Button>
                  </div>
                </div>
              )}
              {publicInformation?.generalInfo && (
                <div>
                  <span className="text-sm text-gray-600">
                    {publicInformation.generalInfo}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="font-medium">Need to know information</span>
                <Button
                  onClick={() => setOpen(true)}
                  variant="ghost"
                  size="sm"
                  className="text-primary"
                >
                  <Plus className="h-4 w-4" />
                  {publicInformation?.needToKnowInfo ? "Edit" : "Add"}
                </Button>
                {/* <AddHeadingDialog open={open} onOpenChange={setOpen} onAdd={} /> */}
                <AddNewHeadingDialog
                  title="needToKnowInfo"
                  open={open}
                  onOpenChange={setOpen}
                  userId={clientData.id}
                  shouldUpdate={shouldUpdate}
                  onSuccess={refreshPublicInformation}
                />
              </div>
              {publicInformation?.needToKnowInfo && (
                <div className="flex gap-5 text-gray-600">
                  <p>{publicInformation.needToKnowInfo.heading}</p>
                  <p>{publicInformation.needToKnowInfo.description}</p>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="font-medium">Useful information</span>
                <Button
                  onClick={() => setOpen(true)}
                  variant="ghost"
                  size="sm"
                  className="text-primary"
                >
                  <Plus className="h-4 w-4" />
                  {publicInformation?.usefulInfo ? "Edit" : "Add"}
                </Button>
                <AddNewHeadingDialog
                  title="usefulInfo"
                  open={open}
                  onOpenChange={setOpen}
                  userId={clientData.id}
                  shouldUpdate={shouldUpdate}
                  onSuccess={refreshPublicInformation}
                />
              </div>
              {publicInformation?.usefulInfo && (
                <div className="flex gap-5 text-gray-600">
                  <p>{publicInformation.usefulInfo.heading}</p>
                  <p>{publicInformation.usefulInfo.description}</p>
                </div>
              )}
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
              <Button
                onClick={() => setOpen(true)}
                variant="ghost"
                size="sm"
                className="text-primary"
              >
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
                  {(!documents || documents.length !== 0) &&
                    documents?.map((document) => (
                      <TableRow key={document.id}>
                        <TableCell>{document.category || ""}</TableCell>
                        <TableCell>
                          {document.expires ? document.expires.toString() : ""}
                        </TableCell>
                        <TableCell>
                          {document.updatedAt
                            ? document.updatedAt.toString()
                            : ""}
                        </TableCell>
                        <TableCell>{document.status || ""}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <AddDocumentDialog onOpenChange={setOpen} open={open} />
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
