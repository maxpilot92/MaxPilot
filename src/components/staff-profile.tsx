"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  FileText,
  MessageSquare,
  Clock,
  PenSquare,
} from "lucide-react";
import { StaffData } from "@/types/staff/staff";

export function StaffProfile({ data }: { data: StaffData }) {
  const {
    personalDetails: {
      address,
      dob,
      email,
      emergencyContact,
      fullName,
      phoneNumber,
      gender,
      language,
    },
    workDetails: { employmentType, hiredOn, role, worksAt },
  } = data;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        {/* Profile Header */}
        <div className="flex items-center gap-4 p-4 bg-background rounded-lg border">
          <Avatar className="h-16 w-16">
            <AvatarImage src="/placeholder.svg?height=64&width=64" />
            <AvatarFallback>
              <Avatar></Avatar>
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">{fullName}</h2>
              <Badge
                variant="secondary"
                className="bg-emerald-100 text-emerald-700"
              >
                Active
              </Badge>
            </div>
            <p className="text-muted-foreground">{role}</p>
          </div>
        </div>

        {/* Personal Details */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Personal Details</CardTitle>
            <Button variant="ghost" size="sm" className="text-primary">
              <PenSquare className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Name</h4>
                <p className="text-muted-foreground">{fullName}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Phone Number</h4>
                <p className="text-muted-foreground">{phoneNumber}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Email</h4>
                <p className="text-muted-foreground">{email}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Address</h4>
                <p className="text-muted-foreground">{address}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Gender</h4>
                <p className="text-muted-foreground">{gender}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">DOB</h4>
                <p className="text-muted-foreground">{dob}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Language</h4>
                <p className="text-muted-foreground">{language}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Emergency Contact</h4>
                <p className="text-muted-foreground">{emergencyContact}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Work Details */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Work Details</CardTitle>
            <Button variant="ghost" size="sm" className="text-primary">
              <PenSquare className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Works At</h4>
                <p className="text-muted-foreground">{worksAt}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Hired On</h4>
                <p className="text-muted-foreground">{hiredOn}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Role</h4>
                <p className="text-muted-foreground">{role}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Employment Type</h4>
                <p className="text-muted-foreground">{employmentType}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Team</h4>
                <p className="text-muted-foreground"></p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {/* Quick Actions */}
        <Card>
          <CardContent className="pt-6">
            <Button className="w-full mb-4" variant="outline">
              + Add Shift
            </Button>
            <div className="space-y-4">
              <Button variant="ghost" className="w-full justify-start">
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
            <Button variant="ghost" size="sm" className="text-primary">
              <PenSquare className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Name</h4>
                <p className="text-muted-foreground">Sita</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Relation</h4>
                <p className="text-muted-foreground">Mother</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Contact</h4>
                <p className="text-muted-foreground">9800000022</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Email</h4>
                <p className="text-muted-foreground">sita@gmail.com</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
