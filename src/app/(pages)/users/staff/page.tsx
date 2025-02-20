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
import { StaffFilterDialog } from "@/components/staff/staff-filter-dialog";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { StaffData } from "@/types/staff/staff";
import { FilterParams } from "@/types/filterStaff";
import { AlertDialog } from "@/components/alert-dialog";

interface PaginationMetadata {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function StaffListPage() {
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterParams>({});
  const [allStaffData, setAllStaffData] = useState<StaffData[]>([]); // Store all staff data
  const [displayedStaffData, setDisplayedStaffData] = useState<StaffData[]>([]); // Filtered and paginated data
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

  const fetchStaff = async () => {
    try {
      setLoading(true);

      const queryParams: Record<string, string> = {};

      // Add filters to query params if they exist
      if (filters.gender) queryParams.gender = filters.gender;
      if (filters.role) queryParams.role = filters.role;
      if (filters.employmentType)
        queryParams.employmentType = filters.employmentType;
      if (filters.team) queryParams.team = filters.team;

      const params = new URLSearchParams(queryParams);
      const response = await axios.get<{
        status: string;
        data: {
          data: StaffData[];
          meta: PaginationMetadata;
        };
      }>(`/api/user/staff/staff-details?${params}`);

      setAllStaffData(response.data.data.data);
    } catch (error) {
      console.error("Error fetching staff:", error);
      toast({
        title: "Error",
        description: "Failed to fetch staff data. Please try again.",
        variant: "destructive",
      });
      setAllStaffData([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter and paginate data
  useEffect(() => {
    let filteredData = allStaffData;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filteredData = filteredData.filter((staff) =>
        staff.personalDetails.fullName.toLowerCase().includes(query)
      );
    }

    // Calculate pagination
    const total = filteredData.length;
    const limit = 5;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;

    // Update displayed data and pagination
    setDisplayedStaffData(filteredData.slice(startIndex, endIndex));
    setPagination({
      total,
      page: currentPage,
      limit,
      totalPages,
    });
  }, [searchQuery, currentPage, allStaffData]);

  // Fetch initial data
  useEffect(() => {
    fetchStaff();
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
      await axios.post("/api/user/staff/alter-archive", {
        operation: "archive",
      });
      setShowArchiveDialog(false);
      fetchStaff();
      toast({
        title: "Success",
        description: "All staff archived successfully",
      });
    } catch (error) {
      console.error("Error archiving staff:", error);
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
            <h1 className="text-2xl font-semibold">Staff</h1>
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
              onClick={() => router.push("/users/staff/new")}
              className="bg-[#0D894F] hover:bg-[#0D894F]/90"
            >
              + Add Staff
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
              <TableHead>Role</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Employment Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : displayedStaffData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No staff members found
                </TableCell>
              </TableRow>
            ) : (
              displayedStaffData.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell>{staff.personalDetails.fullName}</TableCell>
                  <TableCell>{staff.personalDetails.gender}</TableCell>
                  <TableCell>{staff.workDetails.role}</TableCell>
                  <TableCell>{staff.personalDetails.email}</TableCell>
                  <TableCell>{staff.personalDetails.phoneNumber}</TableCell>
                  <TableCell>{staff.personalDetails.address}</TableCell>
                  <TableCell>{staff.workDetails.employmentType}</TableCell>
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
                onClick={() =>
                  handlePageChange(Math.max(1, pagination.page - 1))
                }
                className={
                  pagination.page <= 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
            {[...Array(pagination.totalPages)].map((_, i) => (
              <PaginationItem key={i + 1}>
                <PaginationLink
                  href="#"
                  onClick={() => handlePageChange(i + 1)}
                  isActive={pagination.page === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() =>
                  handlePageChange(
                    Math.min(pagination.totalPages, pagination.page + 1)
                  )
                }
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
        title="Archive Staffs?"
        description="Are you sure you want to archive all staff members? Once archived, they will no longer appear in your list."
        onConfirm={handleArchiveAll}
        onCancel={() => setShowArchiveDialog(false)}
        name="Archive All"
      />

      <StaffFilterDialog
        open={showFilterDialog}
        onOpenChange={setShowFilterDialog}
        onApplyFilters={handleApplyFilters}
        currentFilters={filters}
      />
    </div>
  );
}
