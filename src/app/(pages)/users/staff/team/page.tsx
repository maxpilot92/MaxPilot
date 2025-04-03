"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, PenSquare, Search, Trash2 } from "lucide-react";
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
import { useDebounce } from "use-debounce";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Staff {
  fullName: string;
}
interface Team {
  id: string;
  name: string;
  staff: Staff[];
}

export default function TeamsPage() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [teams, setTeams] = useState<Team[]>([]);
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
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const router = useRouter();

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        ...(searchQuery && { name: searchQuery }),
        page: currentPage.toString(),
        limit: "5",
      });

      const response = await axios.get(`/api/user/staff/team?${params}`);

      if (response.data && response.data.data) {
        setTeams(response.data.data || []);
        setPagination(
          response.data.data.pagination || {
            currentPage: 1,
            totalPages: 1,
            totalItems: 0,
            itemsPerPage: 10,
            hasNextPage: false,
            hasPrevPage: false,
          }
        );
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.log("Error fetching teams:", error);

      setTeams([]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10,
        hasNextPage: false,
        hasPrevPage: false,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, [currentPage, debouncedSearchQuery]); //This line was already correct.  No change needed.

  const handleDeleteTeam = async () => {
    if (!selectedTeam) return;

    try {
      await axios.delete(`/api/user/staff/team/${selectedTeam.id}`);
      toast({
        title: "Success",
        description: "Team deleted successfully",
      });
      fetchTeams();
    } catch (error) {
      console.error("Error deleting team:", error);
      toast({
        title: "Error",
        description: "Failed to delete team. Please try again.",
        variant: "destructive",
      });
    } finally {
      setShowDeleteDialog(false);
      setSelectedTeam(null);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/users/staff/team/edit/${id}`);
  };

  return (
    <div className="container py-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold">Staff</h1>
            <p className="text-muted-foreground">Teams</p>
          </div>
          <Button
            onClick={() => router.push("/users/staff/team/new")}
            className="bg-[#0D894F] hover:bg-[#0D894F]/90"
          >
            + Add Team
          </Button>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search teams"
              className="pl-8"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-[#F1F7F6]">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Count</TableHead>
              <TableHead>Staff</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : teams.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  No teams found
                </TableCell>
              </TableRow>
            ) : (
              teams.map((team, idx) => (
                <TableRow key={team.id}>
                  <TableCell>{team.name}</TableCell>
                  <TableCell>{team.staff.length}</TableCell>
                  <TableCell>
                    <div key={idx} className="flex -space-x-2 ">
                      {team.staff.map((detail, id) => (
                        <div
                          key={id}
                          className="bg-black text-white rounded px-4 py-2"
                        >
                          {detail.fullName}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEdit(team.id)}
                        variant="ghost"
                        size="icon"
                      >
                        <PenSquare className="h-4 w-4 text-primary" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedTeam(team);
                          setShowDeleteDialog(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
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
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Team?"
        description={`Are you sure you want to delete ${selectedTeam?.name}? This action cannot be undone.`}
        onConfirm={handleDeleteTeam}
        onCancel={() => {
          setShowDeleteDialog(false);
          setSelectedTeam(null);
        }}
        name="Delete"
      />
    </div>
  );
}
