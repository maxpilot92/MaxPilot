"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Upload,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddDocumentDialog } from "@/components/client/add-document-dialog";
import { Documents } from "@prisma/client";
import axios from "axios";

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [documents, setDocuments] = useState<Documents[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const getDocuments = async () => {
      try {
        const response = await axios.get("/api/user/document?role=client");
        setDocuments(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    getDocuments();
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Clients</h1>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>List</span>
          <ChevronRight className="h-4 w-4" />
          <span>Profile</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-teal-600">Documents</span>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            type="search"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
        <Button
          className="bg-teal-500 hover:bg-teal-600"
          onClick={() => setDialogOpen(true)}
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload File
        </Button>
      </div>

      {/* Documents Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>App Visibility</TableHead>
              <TableHead>No Expiration</TableHead>
              <TableHead>Last Update</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell>{doc.fileName}</TableCell>
                <TableCell>
                  <span
                    className={doc.category === "Empty" ? "text-red-500" : ""}
                  >
                    {doc.category}
                  </span>
                </TableCell>
                <TableCell
                  className={doc.category === "Empty" ? "text-red-500" : ""}
                >
                  {doc.expires?.toString()}
                </TableCell>
                <TableCell>
                  <Checkbox checked={doc.staffVisibility ?? undefined} />
                </TableCell>
                <TableCell>
                  <Checkbox checked={doc.noExpiration ?? undefined} />
                </TableCell>
                <TableCell>{doc.updatedAt.toString()}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                    Active
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination and Download */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">Showing 1 of 1</div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" disabled>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-teal-500 text-white hover:bg-teal-600"
          >
            1
          </Button>
          <Button variant="outline" size="icon" disabled>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="outline" className="text-teal-600 hover:text-teal-700">
          Download
        </Button>
      </div>

      <AddDocumentDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
