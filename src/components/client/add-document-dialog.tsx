"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Upload } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogTitle } from "@radix-ui/react-dialog";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

interface AddDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CATEGORIES = [
  "Aged Care Assessment",
  "Medical History",
  "Care Plan",
  "Progress Notes",
  "Risk Assessment",
  "Medication Chart",
];

interface FileUpload {
  responseData: {
    fileName: string;
    url: string;
  };
}

export function AddDocumentDialog({
  open,
  onOpenChange,
}: AddDocumentDialogProps) {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({ title: "Error", description: "File should be included" });
      return;
    }

    // Validate file type and size
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size must be less than 10MB",
      });
      return;
    }

    if (
      !file.type.startsWith("image/") &&
      !file.type.startsWith("application/pdf")
    ) {
      toast({
        title: "Error",
        description: "Only images and PDFs are allowed",
      });
      return;
    }

    try {
      // Step 1: Upload the file
      const formData = new FormData();
      formData.append("file", file);

      const uploadFileResponse = await axios.post<FileUpload>(
        "/api/upload",
        formData
      );
      console.log("File uploaded successfully for client");
      console.log(uploadFileResponse);
      // Step 2: Validate response and send payload
      const { fileName, url } = uploadFileResponse.data.responseData;
      if (!fileName || !url) {
        throw new Error(
          "Invalid response from the server: fileName or url is missing"
        );
      }

      const payload = {
        fileName,
        url,
        role: "client",
        category,
      };
      await axios.post("/api/user/document", payload);

      // Notify user of success
      toast({
        title: "Success",
        description: "Successfully uploaded document",
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error during file upload:", error);

      let errorMessage = "An error occurred while uploading the document";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message;
      }

      toast({
        title: "Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle />
      <DialogContent className="sm:max-w-[425px]">
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-lg font-semibold">Add Documents</h2>
        </div>

        <div className="py-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm text-gray-600">Select Category</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}{" "}
                const [currentPage] = useState(1);
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-600">Select Document</label>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="secondary"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700"
                onClick={triggerFileInput}
              >
                Choose File
              </Button>
              <span className="text-sm text-gray-500">
                {file ? file.name : "No File Chosen"}
              </span>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-gray-900 text-white hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!category || !file}
            className="bg-teal-500 hover:bg-teal-600 text-white"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload File
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
