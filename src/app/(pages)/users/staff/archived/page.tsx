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
import { AlertDialog } from "@/components/alert-dialog";
import { StaffFilterDialog } from "@/components/staff-filter-dialog";
import type { FilterParams } from "@/types/filterStaff";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { StaffData } from "@/types/staff/staff";

export default function ArchivedStaffPage() {
  const [showUnarchiveDialog, setShowUnarchiveDialog] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterParams>({});
  const [allStaffData, setAllStaffData] = useState<StaffData[]>([]); // Store all staff data
  const [displayedStaffData, setDisplayedStaffData] = useState<StaffData[]>([]); // Filtered and paginated data
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const itemsPerPage = 10;

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        archived: "true",
      });

      // Add filters to params
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value.toString());
        }
      });

      const response = await axios.get(
        `/api/user/staff/archived-staff?${params.toString()}`
      );

      if (response.data?.data) {
        const staffData = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        setAllStaffData(staffData);
      }
    } catch (error) {
      console.log("Error fetching staff:", error);
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
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Update displayed data and pagination
    setDisplayedStaffData(filteredData.slice(startIndex, endIndex));
    setPagination({
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
    });
  }, [searchQuery, currentPage, allStaffData]);

  // Fetch initial data
  useEffect(() => {
    fetchStaff();
  }, [filters, fetchStaff]);

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleUnarchiveAll = async () => {
    try {
      await axios.post("/api/user/staff/alter-archive", {
        operation: "unarchive",
      });
      toast({
        title: "Success",
        description: "All staff unarchived successfully",
      });
      setShowUnarchiveDialog(false);
      fetchStaff();
    } catch (error) {
      console.error("Error unarchiving staff:", error);
      toast({
        title: "Error",
        description: "Failed to unarchive staff. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUnarchiveStaff = async (data: StaffData) => {
    try {
      await axios.put(`/api/user/staff/manage-archive/${data.id}`, data);
      toast({
        title: "Success",
        description: "Staff member unarchived successfully",
      });
      fetchStaff();
    } catch (error) {
      console.error("Error unarchiving staff member:", error);
      toast({
        title: "Error",
        description: "Failed to unarchive staff member. Please try again.",
        variant: "destructive",
      });
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
            <p className="text-muted-foreground">Archived</p>
          </div>
          <Button
            onClick={() => setShowUnarchiveDialog(true)}
            className="bg-[#0D894F] hover:bg-[#0D894F]/90"
          >
            Unarchive All
          </Button>
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
              <TableHead>Role</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Employment Type</TableHead>
              <TableHead>Action</TableHead>
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
                  No archived staff members found
                </TableCell>
              </TableRow>
            ) : (
              displayedStaffData.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell>{staff.personalDetails.fullName}</TableCell>
                  <TableCell>{staff.workDetails.role}</TableCell>
                  <TableCell>{staff.personalDetails.email}</TableCell>
                  <TableCell>{staff.personalDetails.phoneNumber}</TableCell>
                  <TableCell>{staff.personalDetails.address}</TableCell>
                  <TableCell>{staff.workDetails.employmentType}</TableCell>
                  <TableCell>
                    <Button
                      variant="secondary"
                      className="bg-[#0D894F] text-white hover:bg-[#0D894F]/90"
                      onClick={() => handleUnarchiveStaff(staff)}
                    >
                      Unarchive
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}
            -
            {Math.min(
              pagination.currentPage * pagination.itemsPerPage,
              pagination.totalItems
            )}{" "}
            from {pagination.totalItems}
          </p>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  className={
                    !pagination.hasPrevPage
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
              {[...Array(pagination.totalPages)].map((_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink
                    href="#"
                    onClick={() => setCurrentPage(i + 1)}
                    isActive={pagination.currentPage === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(pagination.totalPages, prev + 1)
                    )
                  }
                  className={
                    !pagination.hasNextPage
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <AlertDialog
        open={showUnarchiveDialog}
        onOpenChange={setShowUnarchiveDialog}
        title="Unarchive All Staff?"
        description="Are you sure you want to unarchive all staff members? They will be moved back to the active staff list."
        onConfirm={handleUnarchiveAll}
        onCancel={() => setShowUnarchiveDialog(false)}
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
