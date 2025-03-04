import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface StaffSidebarProps {
  staff: {
    id: string;
    name: string;
    role: string;
    hours: number;
    avatar?: string;
  }[];
}

export default function StaffSidebar({ staff }: StaffSidebarProps) {
  return (
    <div className="border-r bg-white">
      <div className="p-4 border-b">
        <h3 className="font-medium">Job Board</h3>
      </div>
      <div className="divide-y">
        {staff.map((person) => (
          <div
            key={person.id}
            className="p-4 flex items-center justify-between"
          >
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-3">
                <AvatarFallback>
                  {person.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-sm">{person.name}</div>
                <div className="text-xs text-gray-500">{person.role}</div>
              </div>
            </div>
            <div className="text-xs text-gray-500">{person.hours} Hours</div>
          </div>
        ))}
      </div>
    </div>
  );
}
