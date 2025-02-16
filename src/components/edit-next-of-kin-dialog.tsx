"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PenSquare } from "lucide-react";
import { z } from "zod";
import type { NextOfKin } from "@/types/staff/staff";
import axios from "axios";

const nextOfKinSchema = z.object({
  name: z.string().min(1, "Name is required"),
  relation: z.string().min(1, "Relation is required"),
  contact: z.string().min(10, "Contact must be at least 10 digits"),
  email: z.string().email("Invalid email address"),
});

type NextOfKinFormValues = z.infer<typeof nextOfKinSchema>;

interface EditNextOfKinDialogProps {
  data?: NextOfKin | null;
  onSave: (data: Partial<NextOfKin>) => Promise<void>;
}

export function EditNextOfKinDialog({
  data: initialData,
  onSave,
}: EditNextOfKinDialogProps) {
  const [open, setOpen] = useState(false);
  const [fetchedData, setFetchedData] = useState<NextOfKin | null>(null);

  const form = useForm<NextOfKinFormValues>({
    resolver: zodResolver(nextOfKinSchema),
    defaultValues: {
      name: "",
      relation: "",
      contact: "",
      email: "",
    },
  });

  useEffect(() => {
    const getNextOfKin = async () => {
      const urlId = window.location.href;
      const splittedid = urlId.split("/");
      const id = splittedid[splittedid.length - 1];

      try {
        const response = await axios.get(`/api/user/staff/next-of-kin/${id}`);
        const nextOfKinData = response.data.data;
        setFetchedData(nextOfKinData);

        // Update form values with fetched data
        form.reset({
          name: nextOfKinData.name || "",
          relation: nextOfKinData.relation || "",
          contact: nextOfKinData.contact || "",
          email: nextOfKinData.email || "",
        });
      } catch (error) {
        console.log(error);
      }
    };

    if (open) {
      // If we have initial data, use it
      if (initialData) {
        form.reset({
          name: initialData.name || "",
          relation: initialData.relation || "",
          contact: initialData.contact || "",
          email: initialData.email || "",
        });
      } else {
        // Otherwise fetch from API
        getNextOfKin();
      }
    }
  }, [open, initialData, form]);

  async function onSubmit(formData: NextOfKinFormValues) {
    try {
      await onSave(formData);
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-primary">
          <PenSquare className="h-4 w-4 mr-1" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Next of Kin</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="relation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relation</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-[#0D894F] hover:bg-[#0D894F]/90"
            >
              Save Changes
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
