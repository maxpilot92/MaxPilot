"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, Filter, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  ClientFilterDialog,
  FilterParams,
} from "@/components/client/client-filter-dialog";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { AlertDialog } from "@/components/alert-dialog";

// Define proper types that match your API response
interface PersonalDetails {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  gender: string | null;
  clientStatus: string | null;
  unit: string | null;
}

interface ClientData {
  id: string;
  role: string;
  subRoles: string | null;
  personalDetailsId: string;
  workDetailsId: string | null;
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Use join/include fields that come from your API
  personalDetails: PersonalDetails;
}

interface PaginationMetadata {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function ClientListPage() {
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterParams>({});
  const [allClientData, setAllClientData] = useState<ClientData[]>([]); // Store all client data
  const [displayedClientData, setDisplayedClientData] = useState<ClientData[]>(
    []
  ); // Filtered and paginated data
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState<PaginationMetadata>({
    total: 0,
    page: 1,
    limit: 5,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  const fetchClients = async () => {
    try {
      setLoading(true);

      const queryParams: Record<string, string> = {};

      // Set userRole to 'client'
      filters.userRole = "client";

      // Add filters to query params if they exist
      if (filters.gender) queryParams.gender = filters.gender;
      if (filters.maritalStatus)
        queryParams.maritalStatus = filters.maritalStatus;
      if (filters.clientStatus) queryParams.clientStatus = filters.clientStatus;
      if (filters.unit) queryParams.unit = filters.unit;
      if (filters.userRole) queryParams.userRole = filters.userRole; // Add userRole filter

      const params = new URLSearchParams(queryParams);

      const response = await axios.get<{
        status: string;
        data: ClientData[];
        meta: PaginationMetadata;
      }>(`/api/user/user-details?${params}`);

      setAllClientData(response.data.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast({
        title: "Error",
        description: "Failed to fetch client data. Please try again.",
        variant: "destructive",
      });
      setAllClientData([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter and paginate data
  useEffect(() => {
    let filteredData = allClientData;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filteredData = filteredData.filter((client) =>
        client.personalDetails.fullName.toLowerCase().includes(query)
      );
    }

    if (!filteredData) return;

    // Calculate pagination
    const total = filteredData.length;
    const limit = 5;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;

    // Update displayed data and pagination
    setDisplayedClientData(filteredData.slice(startIndex, endIndex));
    setPagination({
      total,
      page: currentPage,
      limit,
      totalPages,
    });
  }, [searchQuery, currentPage, allClientData]);

  // Fetch initial data
  useEffect(() => {
    fetchClients();
  }, [filters]);

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleArchiveAll = async () => {
    try {
      const response = await axios.post("/api/user/staff/alter-archive", {
        operation: "archive",
        role: "client",
      });
      console.log(response);
      setShowArchiveDialog(false);
      fetchClients();
      toast({
        title: "Success",
        description: response.data.message,
      });
    } catch (error) {
      console.error("Error archiving clients:", error);
    }
  };

  const handleApplyFilters = (newFilters: FilterParams) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  return (
    <div className="container py-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold">Clients</h1>
            <p className="text-muted-foreground">List</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="destructive"
              className="bg-[#DC2626] hover:bg-[#DC2626]/90"
              onClick={() => setShowArchiveDialog(true)}
            >
              Archive All
            </Button>
            <Button
              onClick={() => router.push("/users/client/new")}
              className="bg-[#0D894F] hover:bg-[#0D894F]/90"
            >
              + Add Client
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name"
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setShowFilterDialog(true)}
          >
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-[#F1F7F6]">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Unit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : displayedClientData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No clients found
                </TableCell>
              </TableRow>
            ) : (
              displayedClientData.map((client) => (
                <TableRow key={client.id}>
                  <TableCell
                    className="cursor-pointer"
                    onClick={() => router.push(`/users/client/${client.id}`)}
                  >
                    {client.personalDetails.fullName}
                  </TableCell>
                  <TableCell>{client.personalDetails.gender}</TableCell>
                  <TableCell>{client.personalDetails.clientStatus}</TableCell>
                  <TableCell>{client.personalDetails.email}</TableCell>
                  <TableCell>{client.personalDetails.phoneNumber}</TableCell>
                  <TableCell>{client.personalDetails.address}</TableCell>
                  <TableCell>{client.personalDetails.unit}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {(pagination.page - 1) * pagination.limit + 1}-
          {Math.min(pagination.page * pagination.limit, pagination.total)} from{" "}
          {pagination.total}
        </p>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(Math.max(1, pagination.page - 1));
                }}
                className={
                  pagination.page <= 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
            {[...Array(pagination.totalPages)].map((_, i) => (
              <PaginationItem key={i + 1}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(i + 1);
                  }}
                  isActive={pagination.page === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(
                    Math.min(pagination.totalPages, pagination.page + 1)
                  );
                }}
                className={
                  pagination.page >= pagination.totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <AlertDialog
        open={showArchiveDialog}
        onOpenChange={setShowArchiveDialog}
        title="Archive Clients?"
        description="Are you sure you want to archive all clients? Once archived, they will no longer appear in your list."
        onConfirm={handleArchiveAll}
        onCancel={() => setShowArchiveDialog(false)}
        name="Archive All"
      />

      <ClientFilterDialog
        open={showFilterDialog}
        onOpenChange={setShowFilterDialog}
        onApplyFilters={handleApplyFilters}
        currentFilters={filters}
      />
    </div>
  );
}
