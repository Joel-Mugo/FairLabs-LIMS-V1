
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BookLock, User, Edit, PlusCircle, Trash2, CheckCircle, XCircle, AlertTriangle, Download } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const auditLogs = [
  {
    id: 1,
    user: 'Rhoda Mwikali',
    role: 'QC Manager',
    action: 'Approved',
    entity: 'Sample RM001',
    details: 'All parameters within specification.',
    timestamp: '2024-07-25 10:30:15',
  },
  {
    id: 2,
    user: 'Kevin Masinde',
    role: 'Analyst',
    action: 'Created',
    entity: 'Sample FP001',
    details: 'New finished product sample added.',
    timestamp: '2024-07-25 09:15:00',
  },
  {
    id: 3,
    user: 'Admin User',
    role: 'Admin',
    action: 'Edited',
    entity: 'User Kevin Masinde',
    details: 'Updated user role from Viewer to Analyst.',
    timestamp: '2024-07-24 15:00:45',
  },
   {
    id: 4,
    user: 'System',
    role: 'System',
    action: 'Alert',
    entity: 'Inventory',
    details: 'Hexane (HPLC Grade) stock is critical.',
    timestamp: '2024-07-24 12:00:00',
  },
  // Add more mock data here
];

const actionIcons: { [key: string]: React.ElementType } = {
  Approved: CheckCircle,
  Created: PlusCircle,
  Edited: Edit,
  Rejected: XCircle,
  Deleted: Trash2,
  Alert: AlertTriangle,
};

export default function AuditLog() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-headline text-foreground">Audit Log & System Traceability</h2>
          <p className="text-muted-foreground">Monitor all system activities for compliance and traceability.</p>
        </div>
        <div className="flex items-center gap-2">
            <Select>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by action" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="created">Created</SelectItem>
                    <SelectItem value="edited">Edited</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="deleted">Deleted</SelectItem>
                </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2" /> Export Log
            </Button>
        </div>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.map((log) => {
                const Icon = actionIcons[log.action] || BookLock;
                return (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-xs">{log.timestamp}</TableCell>
                    <TableCell>
                      <div className="font-medium">{log.user}</div>
                      <Badge variant="secondary">{log.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                         <Icon className="w-4 h-4 text-muted-foreground" />
                        <span>{log.action}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{log.entity}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{log.details}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
