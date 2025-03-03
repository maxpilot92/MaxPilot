"use client";

import { useEffect, useState } from "react";
import { X, Plus, Check, Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

export interface Heading {
  id: string;
  name: string;
  mandatory: boolean;
}

interface ManageDialogProps {
  title: string;
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  headings: Heading[];
  onSave: (headings: Heading[]) => void;
}

export default function ManageDialog({
  title,
  open,
  onOpenChange,
  headings: initialHeadings,
  onSave,
  userId,
}: ManageDialogProps) {
  const [headings, setHeadings] = useState<Heading[]>(initialHeadings);
  const [newHeading, setNewHeading] = useState("");
  const [newHeadingMandatory, setNewHeadingMandatory] =
    useState<boolean>(false);
  const [editingHeadingId, setEditingHeadingId] = useState<string | null>(null);
  const [display, setDisplay] = useState<boolean>(false);
  const [dialogName, setDialogName] = useState<string>("");
  const { toast } = useToast();

  if (!userId) {
    throw new Error("Missing user id");
  }

  useEffect(() => {
    if (title === "Need to know information") {
      setDialogName("needToKnowInfo");
    } else {
      setDialogName("usefulInfo");
    }
  }, [title]);

  const handleAddHeading = () => {
    if (newHeading.trim() === "") return;

    const newId = `heading-${Date.now()}`;
    setHeadings([
      ...headings,
      { id: newId, name: newHeading, mandatory: newHeadingMandatory },
    ]);
    setNewHeading("");
    setNewHeadingMandatory(false);
  };

  const handleEditHeading = (id: string, newName: string) => {
    setHeadings(
      headings.map((heading) =>
        heading.id === id ? { ...heading, name: newName } : heading
      )
    );
    setEditingHeadingId(null);
  };

  const handleDeleteHeading = (id: string) => {
    setHeadings(headings.filter((heading) => heading.id !== id));
  };

  const handleToggleMandatory = (id: string) => {
    setHeadings(
      headings.map((heading) =>
        heading.id === id
          ? { ...heading, mandatory: !heading.mandatory }
          : heading
      )
    );
  };

  const handleSave = () => {
    async function updateClientPublicInfo() {
      const data = {
        [dialogName]: newHeading,
        [dialogName + "Mandatory"]: newHeadingMandatory,
      };
      console.log(data);
      try {
        const response = await axios.post(
          `/api/user/client/heading?userId=${userId}`,
          data
        );

        console.log(response.data, "response");
        toast({
          title: "Success",
          description: `${dialogName} added successfully`,
        });
      } catch (error) {
        console.error("Error adding heading:", error);
        toast({
          title: "Error",
          description: `Failed to add ${dialogName}`,
          variant: "destructive",
        });
      }
    }

    updateClientPublicInfo();
    onSave(headings);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Edit {title}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="py-4">
          <div className="flex justify-between pb-2 mb-2 border-b">
            <div className="font-medium text-sm">Heading</div>
            <div className="font-medium text-sm">Mandatory</div>
          </div>

          {headings.length === 0 && (
            <div className="text-center py-6 text-gray-500 text-sm">
              No data available
            </div>
          )}

          {headings.map((heading) => (
            <div
              key={heading.id}
              className="flex items-center justify-between py-2"
            >
              {editingHeadingId === heading.id ? (
                <div className="flex-1 mr-4">
                  <Input
                    value={heading.name}
                    onChange={(e) =>
                      handleEditHeading(heading.id, e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter")
                        handleEditHeading(heading.id, heading.name);
                    }}
                    autoFocus
                  />
                </div>
              ) : (
                <div className="flex-1">{heading.name}</div>
              )}

              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 flex items-center justify-center">
                  {heading.mandatory ? (
                    <Check
                      className="h-5 w-5 text-teal-500 cursor-pointer"
                      onClick={() => handleToggleMandatory(heading.id)}
                    />
                  ) : (
                    <X
                      className="h-5 w-5 text-red-500 cursor-pointer"
                      onClick={() => handleToggleMandatory(heading.id)}
                    />
                  )}
                </div>

                {editingHeadingId !== heading.id && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setEditingHeadingId(heading.id)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDeleteHeading(heading.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}

          {display && (
            <div className="mt-4">
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="New Heading"
                  value={newHeading}
                  onChange={(e) => setNewHeading(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newHeading.trim() !== "")
                      handleAddHeading();
                  }}
                />
                <div className="flex items-center justify-center h-10 w-10">
                  <Checkbox
                    id="mandatory"
                    checked={newHeadingMandatory}
                    onCheckedChange={(checked: boolean) =>
                      setNewHeadingMandatory(checked === true)
                    }
                  />
                </div>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            className="mt-4 text-teal-600 hover:text-teal-700 hover:bg-teal-50 flex items-center"
            onClick={() => setDisplay(!display)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add new heading
          </Button>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
