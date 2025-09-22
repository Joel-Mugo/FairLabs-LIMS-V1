
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Settings as SettingsIcon, Bell, FileText, Palette, Users, Shield } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function Settings() {
  return (
    <div className="space-y-6">
       <div>
          <h2 className="text-2xl font-bold font-headline text-foreground">System Settings</h2>
          <p className="text-muted-foreground">Manage application-wide settings and configurations.</p>
        </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Bell /> Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications">Email Notifications for Approvals</Label>
                <Switch id="email-notifications" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="system-alerts">In-App Alerts for Critical Inventory</Label>
                <Switch id="system-alerts" defaultChecked />
              </div>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><FileText /> Reporting</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div>
                  <Label htmlFor="report-header">Default Report Header</Label>
                  <Input id="report-header" defaultValue="FairLabs Inc. - Certificate of Analysis" />
               </div>
               <div>
                  <Label htmlFor="report-footer">Default Report Footer</Label>
                  <Textarea id="report-footer" defaultValue="This report is confidential and intended for the recipient only." />
               </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Palette /> Appearance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Theme customization is coming soon.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Shield /> Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Button variant="outline" className="w-full">Configure SSO</Button>
                <Button variant="outline" className="w-full">API Access Tokens</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
