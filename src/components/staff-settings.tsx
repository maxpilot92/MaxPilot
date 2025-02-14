import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, PenSquare, Trash2 } from "lucide-react"

export function StaffSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payroll Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium mb-2">Industry Award</h4>
              <p className="text-muted-foreground">None</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Award Level</h4>
              <p className="text-muted-foreground">None</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Award Level Pay Point</h4>
              <p className="text-muted-foreground">None</p>
            </div>
            {/* Add more grid items for other payroll settings */}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="font-medium">Notify Timesheet Approval</h4>
              </div>
              <Switch checked={true} />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="font-medium">Subscribe to notification</h4>
              </div>
              <Switch checked={true} />
            </div>
            {/* Add more setting items */}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Compliance</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Compliance Item</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>COVID-19 Compliance</TableCell>
                <TableCell>05/01/2025</TableCell>
                <TableCell>Updated 2 hours ago</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                    Active
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <PenSquare className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              {/* Add more TableRow components for other compliance items */}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

