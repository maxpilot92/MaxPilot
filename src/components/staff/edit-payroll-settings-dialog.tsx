"use client";

import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PayrollSettings } from "@/types/staff/staff";

const payrollSettingsSchema = z.object({
  industryAward: z.string().optional(),
  awardLevel: z.string().optional(),
  awardLevelPay: z.string().optional(),
  payGroup: z.string().optional(),
  payGroupReviewDate: z.string().optional(),
  employeeProfile: z.string().optional(),
  allowances: z.string().optional(),
  dailyHours: z.number().min(0).max(24).optional(),
  weeklyHours: z.number().min(0).max(168).optional(),
  externalSystemIdentifier: z.string().optional(),
});

type PayrollSettingsFormValues = z.infer<typeof payrollSettingsSchema>;

interface EditPayrollSettingsDialogProps {
  data?: PayrollSettings | null;
  onSave: (data: Partial<PayrollSettings>) => Promise<void>;
}

export function EditPayrollSettingsDialog({
  data,
  onSave,
}: EditPayrollSettingsDialogProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<PayrollSettingsFormValues>({
    resolver: zodResolver(payrollSettingsSchema),
    defaultValues: {
      industryAward: data?.industryAward || "",
      awardLevel: data?.awardLevel || "",
      awardLevelPay: data?.awardLevelPay || "",
      payGroup: data?.payGroup || "",
      payGroupReviewDate: data?.payGroupReviewDate || "",
      employeeProfile: data?.employeeProfile || "",
      allowances: data?.allowances || "",
      dailyHours: data?.dailyHours || 0,
      weeklyHours: data?.weeklyHours || 0,
      externalSystemIdentifier: data?.externalSystemIdentifier || "",
    },
  });

  async function onSubmit(formData: PayrollSettingsFormValues) {
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Payroll Settings</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="industryAward"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry Award</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="award1">Award 1</SelectItem>
                        <SelectItem value="award2">Award 2</SelectItem>
                        <SelectItem value="award3">Award 3</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="awardLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Award Level</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="level1">Level 1</SelectItem>
                        <SelectItem value="level2">Level 2</SelectItem>
                        <SelectItem value="level3">Level 3</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="awardLevelPay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Award Level Pay</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pay1">Pay Point 1</SelectItem>
                        <SelectItem value="pay2">Pay Point 2</SelectItem>
                        <SelectItem value="pay3">Pay Point 3</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="payGroup"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pay Group</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="group1">Group 1</SelectItem>
                        <SelectItem value="group2">Group 2</SelectItem>
                        <SelectItem value="group3">Group 3</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="payGroupReviewDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pay Group Review Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="employeeProfile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee Profile</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="profile1">Profile 1</SelectItem>
                        <SelectItem value="profile2">Profile 2</SelectItem>
                        <SelectItem value="profile3">Profile 3</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="allowances"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allowances</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="allowance1">Allowance 1</SelectItem>
                        <SelectItem value="allowance2">Allowance 2</SelectItem>
                        <SelectItem value="allowance3">Allowance 3</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dailyHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Daily Hours</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-10 w-10"
                          onClick={() =>
                            field.onChange(Math.max(0, Number(field.value) - 1))
                          }
                        >
                          -
                        </Button>
                        <Input
                          type="number"
                          {...field}
                          className="mx-2 text-center"
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-10 w-10"
                          onClick={() =>
                            field.onChange(
                              Math.min(24, Number(field.value) + 1)
                            )
                          }
                        >
                          +
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="weeklyHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weekly Hours</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-10 w-10"
                          onClick={() =>
                            field.onChange(Math.max(0, Number(field.value) - 1))
                          }
                        >
                          -
                        </Button>
                        <Input
                          type="number"
                          {...field}
                          className="mx-2 text-center"
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-10 w-10"
                          onClick={() =>
                            field.onChange(
                              Math.min(168, Number(field.value) + 1)
                            )
                          }
                        >
                          +
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="externalSystemIdentifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>External System Identifier</FormLabel>
                  <FormControl>
                    <Input placeholder="MYOB Card" {...field} />
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
