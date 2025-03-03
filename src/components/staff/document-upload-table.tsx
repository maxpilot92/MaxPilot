"use client";

import type React from "react";

import { useState } from "react";
import { Search, Upload, Filter, Trash2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";

interface Document {
  id: string;
  fileName: string;
  fileSize: string;
  status: "complete" | "uploading" | "failed";
  progress: number;
  timeLeft?: string;
}

export function DocumentUploadTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      fileName: "abc.docx",
      fileSize: "25 MB",
      status: "complete",
      progress: 100,
      timeLeft: "0 min left",
    },
    {
      id: "2",
      fileName: "abc.docx",
      fileSize: "25 MB",
      status: "uploading",
      progress: 80,
      timeLeft: "2 min left",
    },
    {
      id: "3",
      fileName: "abc.docx",
      fileSize: "25 MB",
      status: "failed",
      progress: 80,
    },
  ]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) {
      throw new Error("No files uploaded");
    }
    const formData = new FormData();
    formData.append("file", files[0]);
    if (files) {
      Array.from(files).forEach((file) => {
        const newDoc: Document = {
          id: Math.random().toString(36).substr(2, 9),
          fileName: file.name,
          fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          status: "uploading",
          progress: 0,
          timeLeft: "Calculating...",
        };
        setDocuments((prev) => [...prev, newDoc]);

        // Simulate upload progress
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          if (progress <= 100) {
            setDocuments((prev) =>
              prev.map((doc) =>
                doc.id === newDoc.id
                  ? {
                      ...doc,
                      progress,
                      timeLeft:
                        progress < 100
                          ? `${((100 - progress) / 10).toFixed(0)} min left`
                          : "0 min left",
                      status: progress === 100 ? "complete" : "uploading",
                    }
                  : doc
              )
            );
          } else {
            clearInterval(interval);
          }
        }, 1000);

        // Upload file to backend (API call)
      });
      try {
        const response = await axios.post("/api/upload", formData);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleDelete = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  const handleRetry = (id: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id
          ? {
              ...doc,
              status: "uploading",
              progress: 0,
              timeLeft: "Calculating...",
            }
          : doc
      )
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Staff</h2>
          <p className="text-sm text-teal-500">Documents</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File Name</TableHead>
              <TableHead>File Size</TableHead>
              <TableHead className="w-[400px]">Status</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell>{doc.fileName}</TableCell>
                <TableCell>{doc.fileSize}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <Progress
                      value={doc.progress}
                      className={
                        doc.status === "complete"
                          ? "bg-gray-100 [&>div]:bg-teal-500"
                          : doc.status === "failed"
                          ? "bg-gray-100 [&>div]:bg-red-500"
                          : "bg-gray-100 [&>div]:bg-blue-500"
                      }
                    />
                    <p className="text-sm text-gray-500">
                      {doc.status === "failed"
                        ? "Upload failed."
                        : doc.timeLeft}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  {doc.status === "failed" ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRetry(doc.id)}
                    >
                      <RotateCcw className="h-4 w-4 text-red-500" />
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(doc.id)}
                    >
                      <Trash2 className="h-4 w-4 text-gray-500" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">Showing 1-10 from 24</p>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" disabled>
            {"<"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-teal-500 text-white hover:bg-teal-600"
          >
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            3
          </Button>
          <Button variant="outline" size="sm">
            4
          </Button>
          <Button variant="outline" size="sm">
            5
          </Button>
          <Button variant="outline" size="icon">
            {">"}
          </Button>
        </div>
        <div>
          <input
            type="file"
            id="file-upload"
            multiple
            className="hidden"
            onChange={handleFileUpload}
          />
          <label htmlFor="file-upload">
            <Button
              className="bg-teal-500 hover:bg-teal-600"
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload File
            </Button>
          </label>
        </div>
      </div>
    </div>
  );
}
