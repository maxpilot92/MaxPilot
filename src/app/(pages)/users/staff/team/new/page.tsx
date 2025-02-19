"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
  type DragStartEvent,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableStaffCard } from "@/components/sortable-staff-card";
import { StaffCard } from "@/components/staff-card";
import type { StaffData } from "@/types/staff/staff";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

interface TeamMember extends StaffData {
  teamRole?: string;
}

function DroppableTeamArea({ children }: { children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({
    id: "team-members",
  });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[200px] rounded-lg border border-dashed p-4 transition-colors ${
        isOver ? "border-primary bg-primary/5" : ""
      }`}
    >
      {children}
    </div>
  );
}

function DroppableAvailableArea({ children }: { children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({
    id: "available-staff",
  });

  return (
    <div
      ref={setNodeRef}
      className={`p-4 space-y-2 transition-colors ${
        isOver ? "bg-primary/5" : ""
      }`}
    >
      {children}
    </div>
  );
}

export default function TeamsPage() {
  const [teamName, setTeamName] = useState("");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [availableStaff, setAvailableStaff] = useState<StaffData[]>([]);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchStaff = async () => {
    try {
      const response = await axios.get(`/api/user/staff/staff-details`);
      setAvailableStaff(response.data.data.data);
    } catch (error) {
      console.error("Error fetching staff:", error);
      toast({
        title: "Error",
        description: "Failed to fetch staff data. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);

    const { active, over } = event;
    if (!over) return;

    const activeStaff = [...availableStaff, ...teamMembers].find(
      (staff) => staff.id === active.id
    );
    if (!activeStaff) return;

    if (over.id === "team-members") {
      // Moving to team members
      if (!teamMembers.find((member) => member.id === activeStaff.id)) {
        setTeamMembers((prev) => [...prev, activeStaff]);
        setAvailableStaff((prev) =>
          prev.filter((staff) => staff.id !== activeStaff.id)
        );
      }
    } else if (over.id === "available-staff") {
      // Moving to available staff
      if (!availableStaff.find((staff) => staff.id === activeStaff.id)) {
        setAvailableStaff((prev) => [...prev, activeStaff]);
        setTeamMembers((prev) =>
          prev.filter((member) => member.id !== activeStaff.id)
        );
      }
    }
  };

  const handleAddStaff = (staff: StaffData) => {
    if (!teamMembers.find((member) => member.id === staff.id)) {
      setTeamMembers((prev) => [...prev, staff]);
      setAvailableStaff((prev) => prev.filter((s) => s.id !== staff.id));
    }
  };

  const handleRemoveStaff = (staff: StaffData) => {
    if (!availableStaff.find((s) => s.id === staff.id)) {
      setAvailableStaff((prev) => [...prev, staff]);
      setTeamMembers((prev) => prev.filter((member) => member.id !== staff.id));
    }
  };

  const handleSave = async () => {
    if (!teamName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a team name",
        variant: "destructive",
      });
      return;
    }

    try {
      const staffIds = teamMembers.map((teamMember) => teamMember.id);
      await axios.post("/api/user/staff/team", {
        name: teamName,
        staffIds,
      });
      toast({
        title: "Success",
        description: "Team saved successfully",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to save team",
        variant: "destructive",
      });
    }
  };

  const filteredStaff = availableStaff.filter((staff) =>
    staff.personalDetails.fullName
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-1">Staff</h1>
        <div className="flex items-center text-sm text-muted-foreground">
          <span>Teams</span>
          <span className="mx-2">/</span>
          <span className="text-primary">Add Team</span>
        </div>
      </div>

      <div>
        <div>
          <div>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="mb-4">
                    <label htmlFor="teamName" className="text-sm font-medium">
                      Team Name
                    </label>
                    <Input
                      id="teamName"
                      placeholder="Enter Team Name"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      className="mt-1.5"
                    />
                  </div>
                  <h2 className="text-sm font-medium mb-3">Team Members</h2>
                  <DroppableTeamArea>
                    {teamMembers.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center text-sm text-muted-foreground">
                        <p>Drag and drop staff here</p>
                        <p className="mt-1">Or</p>
                        <Button variant="secondary" className="mt-2">
                          <Plus className="h-4 w-4 mr-1" />
                          Add Staff
                        </Button>
                      </div>
                    ) : (
                      <SortableContext
                        items={teamMembers.map((m) => m.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-2">
                          {teamMembers.map((staff) => (
                            <SortableStaffCard
                              key={staff.id}
                              staff={staff}
                              onRemove={() => handleRemoveStaff(staff)}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    )}
                  </DroppableTeamArea>
                </div>

                <div>
                  <div className="my-[30px]">
                    <div className="relative">
                      <Input
                        placeholder="Search staff"
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-4 h-4 absolute left-2.5 top-2.5 text-muted-foreground"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="mt-4 rounded-lg border">
                    <h2 className="px-4 py-2 border-b text-sm font-medium">
                      Available Staff
                    </h2>
                    <DroppableAvailableArea>
                      <SortableContext
                        items={filteredStaff.map((s) => s.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-2">
                          {filteredStaff.map((staff) => (
                            <SortableStaffCard
                              key={staff.id}
                              staff={staff}
                              onAdd={() => handleAddStaff(staff)}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DroppableAvailableArea>
                  </div>

                  <DragOverlay>
                    {activeId ? (
                      <StaffCard
                        staff={
                          [...availableStaff, ...teamMembers].find(
                            (staff) => staff.id === activeId
                          )!
                        }
                        overlay
                      />
                    ) : null}
                  </DragOverlay>
                </div>
              </div>
            </DndContext>

            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleSave}
                className="bg-[#0D894F] hover:bg-[#0D894F]/90"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
