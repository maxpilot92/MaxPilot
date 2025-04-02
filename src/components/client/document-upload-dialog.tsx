"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
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
import axios, { AxiosResponse } from "axios";
import { useToast } from "@/hooks/use-toast";
import { DialogTitle } from "@radix-ui/react-dialog";

interface FileUpload {
  responseData: {
    url: string;
    fileName: string;
  };
}

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

export function AddDocumentDialog({
  open,
  onOpenChange,
}: AddDocumentDialogProps) {
  const [category, setCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadDocument = async () => {
    if (!file) {
      throw new Error("Client file not found");
    }
    const formData = new FormData();
    formData.set("file", file);
    try {
      // upload to aws s3
      const uplaodResponse: AxiosResponse<FileUpload> =
        await axios.post<FileUpload>("/api/upload", formData);
      console.log("file upload", uplaodResponse);
      const { fileName, url } = uplaodResponse.data.responseData;

      // save to database

      await axios.post("/api/user/document", {
        role: "client",
        fileName,
        url,
        category,
      });
      onOpenChange(false);
      toast({
        title: "Success",
        description: "Document added succesfully",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed",
        description: "Document added failed",
        variant: "destructive",
      });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    const defaultCategory = CATEGORIES[0]; // Set the first item as the default
    setCategory(defaultCategory);
  }, []); //
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle></DialogTitle>
      <DialogContent className="sm:max-w-[425px]">
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-lg font-semibold">Add Documents</h2>
        </div>

        <div className="py-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm text-gray-600">Select Category</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Aged Care Assessment" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem
                    key={cat}
                    value={cat}
                    onClick={() => setCategory(cat)}
                  >
                    {cat}
                  </SelectItem>
                ))}
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
            onClick={handleUploadDocument}
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
