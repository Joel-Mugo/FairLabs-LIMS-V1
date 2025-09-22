
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Activity, FileText, ClipboardCheck, BarChart3, 
  Bell, Printer, CheckCircle, XCircle, Clock, AlertTriangle, 
  Beaker, Plus, Download, Eye, Package, TrendingUp, Award,
  QrCode, Send, X, Mail, Save, FileSpreadsheet, FlaskConical, TestTube, Factory, Truck, Container, Ship, Globe, Leaf, RefreshCw, Calendar as CalendarIcon, LogOut,
  Users, BookLock, Settings as SettingsIcon, NotebookText, ChevronDown
} from 'lucide-react';

import type { Sample, AnalysisType, Role, InventoryItem, ConsumptionLog, Specification, ProductSpecification, User, ProductCategory } from '@/lib/types';
import { sampleData as initialSampleData, inventoryItems as initialInventoryItems } from '@/lib/data';
import { getSpecifications } from '@/lib/specifications';
import { validateResult } from '@/ai/flows/validate-result-flow';
import { cn } from '@/lib/utils';
import { users as initialUsers } from '@/lib/users';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";

import AnalysisStatusBarChart from '@/components/lims/charts/AnalysisStatusBarChart';
import QualityTrendsLineChart from '@/components/lims/charts/QualityTrendsLineChart';
import SampleStatusPieChart from '@/components/lims/charts/SampleStatusPieChart';
import StatCard from '@/components/lims/StatCard';
import CertificateOfAnalysis from '@/components/lims/CertificateOfAnalysis';
import DataTrendAnalyzer from '@/components/lims/DataTrendAnalyzer';
import { Progress } from '@/components/ui/progress';
import InventoryConsumptionChart from '@/components/lims/charts/InventoryConsumptionChart';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { getLoggedInUser, logout } from '@/app/actions';
import ProductSpecManagement from '@/components/lims/ProductSpecManagement';
import UserManagement from '@/components/lims/UserManagement';
import AuditLog from '@/components/lims/AuditLog';
import Settings from '@/components/lims/Settings';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';


type ActiveTab = 'dashboard' | 'analyses' | 'new-analysis' | 'approvals' | 'inventory' | 'analytics' | 'specifications' | 'user-management' | 'audit-log' | 'settings';

const initialAnalysisFormState: Partial<Sample> & { analysisType?: AnalysisType, category?: ProductCategory } = {
    analysisType: 'Raw Material',
    category: undefined,
    product: '',
    lot: '',
    supplier: '',
    supplierLotNumber: '',
    countryOfOrigin: '',
    client: '',
    exportNumber: '',
    destination: '',
    dateReceived: new Date().toISOString().split('T')[0],
    analysisDate: new Date().toISOString().split('T')[0],
    shift: 'Day',
    interval: '',
    analysisRequested: '',
    testResults: {},
    comments: ''
  };

export default function FairLabsLIMS() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showSampleDetails, setShowSampleDetails] = useState(false);
  const [selectedSample, setSelectedSample] = useState<Sample | null>(null);
  const [samples, setSamples] = useState<Sample[]>(initialSampleData);
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventoryItems);
  const [users, setUsers] = useState<(User & {password?: string})[]>(initialUsers);
  
  const { toast } = useToast();

  const [analysisForm, setAnalysisForm] = useState(initialAnalysisFormState);
  
  useEffect(() => {
    async function fetchUser() {
      const loggedInUser = await getLoggedInUser();
      setUser(loggedInUser);
      setLoading(false);
    }
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const handleAnalysisSubmit = () => {
    if (!user) return;
    const typePrefix: Record<AnalysisType, string> = {
      'Raw Material': 'RM',
      'In-Process': 'IP',
      'Incoming Pre-Shipment': 'IPS',
      'Outgoing Pre-Shipment': 'OPS',
      'Finished Product': 'FP',
      'By-Product': 'BP',
      'Export': 'EX',
      'Essential Oil': 'EO'
    };
    const prefix = typePrefix[analysisForm.analysisType || 'Raw Material'] || 'GN';
    const newId = `${prefix}-${Date.now().toString().slice(-4)}`;
    
    const newSample: Sample = {
      id: newId,
      product: analysisForm.product || 'Unknown Product',
      lot: analysisForm.lot || `L-${Date.now().toString().slice(-3)}`,
      status: 'Pending Approval',
      result: 'Pending Review',
      analyst: user.name,
      date: new Date().toISOString().slice(0, 10),
      type: analysisForm.analysisType || 'Raw Material',
      priority: 'Normal',
      testResults: analysisForm.testResults || {},
      overallResult: 'Awaiting analysis and QC approval',
      ...analysisForm,
    };

    setSamples(prevSamples => [newSample, ...prevSamples]);

    toast({
      title: "Analysis Submitted for Approval",
      description: `Sample ID: ${newSample.id} has been added to the approval queue.`,
    });

    setActiveTab('approvals');
    setAnalysisForm(initialAnalysisFormState); // Reset form
  };

  const navigation: { id: ActiveTab; name: string; icon: React.ElementType; roles: Role[] }[] = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3, roles: ['Analyst', 'QC Manager', 'Admin', 'QC Director', 'Director', 'COO', 'CEO', 'Viewer'] },
    { id: 'new-analysis', name: 'New Analysis', icon: FileText, roles: ['Analyst', 'QC Manager', 'Admin', 'QC Director', 'Director', 'COO', 'CEO', 'Viewer'] },
    { id: 'analyses', name: 'Analyses', icon: Activity, roles: ['Analyst', 'QC Manager', 'Admin', 'QC Director', 'Director', 'COO', 'CEO', 'Viewer'] },
    { id: 'approvals', name: 'Approvals', icon: ClipboardCheck, roles: ['QC Manager', 'Admin', 'QC Director'] },
    { id: 'inventory', name: 'Inventory', icon: Package, roles: ['Analyst', 'QC Manager', 'Admin'] },
    { id: 'analytics', name: 'Analytics', icon: TrendingUp, roles: ['Analyst', 'QC Manager', 'Admin', 'QC Director', 'Director', 'COO', 'CEO', 'Viewer'] },
    { id: 'specifications', name: 'Specifications', icon: NotebookText, roles: ['Analyst', 'QC Manager', 'Admin', 'QC Director', 'Director', 'COO', 'CEO', 'Viewer'] },
    { id: 'user-management', name: 'User Management', icon: Users, roles: ['Admin'] },
    { id: 'audit-log', name: 'Audit Log', icon: BookLock, roles: ['Admin'] },
    { id: 'settings', name: 'Settings', icon: SettingsIcon, roles: ['Admin'] }
  ];

  const handleViewDetails = (sample: Sample) => {
    setSelectedSample(sample);
    setShowSampleDetails(true);
  };

  const handleViewPDF = (sample: Sample) => {
    setSelectedSample(sample);
    setShowPDFPreview(true);
  };

  const handleViewQR = (sample: Sample) => {
    setSelectedSample(sample);
    setShowQRModal(true);
  }
  
  const handleApproval = (sampleId: string, decision: 'Approved' | 'Rejected') => {
    setSamples(samples.map(s => 
      s.id === sampleId 
        ? { ...s, status: decision, result: decision === 'Approved' ? 'Approved' : 'Out of Spec' } 
        : s
    ));
    toast({
      title: `Sample ${decision}`,
      description: `Sample ${sampleId} has been marked as ${decision}.`,
      variant: decision === 'Rejected' ? 'destructive' : 'default',
    });
  };

  const renderContent = () => {
    if (!user) return null;
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'analyses':
        return <AnalysesView samples={samples} onViewDetails={handleViewDetails} onViewPDF={handleViewPDF} onViewQR={handleViewQR} />;
      case 'new-analysis':
        return <NewAnalysisView 
                  formState={analysisForm} 
                  setFormState={setAnalysisForm} 
                  onSubmit={handleAnalysisSubmit}
                  onCancel={() => setActiveTab('analyses')}
               />;
      case 'approvals':
        return <ApprovalsView samples={samples.filter(s => s.status === 'Pending Approval')} onApprove={handleApproval} onReject={handleApproval} onViewDetails={handleViewDetails} />;
      case 'inventory':
        return <InventoryView inventory={inventory} setInventory={setInventory} samples={samples} />;
      case 'analytics':
        return <AnalyticsView inventory={inventory} />;
      case 'specifications':
        return <ProductSpecManagement />;
      case 'user-management':
        return <UserManagement users={users} setUsers={setUsers} />;
      case 'audit-log':
        return <AuditLog />;
      case 'settings':
        return <Settings />;
      default:
        return null;
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    // This should be handled by middleware, but as a fallback:
    return null; 
  }

  const hasAccess = (tabRoles: Role[]) => tabRoles.includes(user.role);

  const pendingApprovals = samples.filter(s => s.status === 'Pending Approval');

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-primary to-purple-600 p-2 rounded-lg mr-3">
                <Beaker className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-headline bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  FairLabs LIMS
                </h1>
                <p className="text-xs text-muted-foreground">Laboratory Information Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full relative">
                    <Bell className="w-5 h-5" />
                    {pendingApprovals.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {pendingApprovals.length}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="font-medium">Notifications</h4>
                    {pendingApprovals.length > 0 ? (
                      <ul className="space-y-2">
                        {pendingApprovals.map(sample => (
                          <li key={sample.id} className="text-sm p-2 rounded-md hover:bg-muted">
                            <p><strong>Pending Approval:</strong> {sample.product} ({sample.id})</p>
                            <p className="text-xs text-muted-foreground">Submitted by {sample.analyst}</p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">No new notifications.</p>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                   <div className="flex items-center space-x-3 bg-secondary/50 rounded-lg p-2 cursor-pointer hover:bg-muted">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground">{user.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="text-muted-foreground text-xs">{user.role}</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Billing</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex space-x-2 mb-8 bg-card rounded-xl p-2 shadow-sm border overflow-x-auto">
          {navigation.map((item) => {
            const isActive = activeTab === item.id;
            if (!hasAccess(item.roles)) return null;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  'flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 w-full md:w-auto justify-center flex-shrink-0',
                  isActive 
                    ? 'bg-gradient-to-r from-primary to-purple-600 text-primary-foreground shadow-lg' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </button>
            );
          })}
        </nav>

        <main>
          {renderContent()}
        </main>
      </div>

      {selectedSample && (
        <>
          <SampleDetailsModal 
            isOpen={showSampleDetails} 
            onClose={() => setShowSampleDetails(false)} 
            sample={selectedSample}
            onViewQR={() => { setShowSampleDetails(false); setShowQRModal(true); }}
            onViewPDF={() => { setShowSampleDetails(false); setShowPDFPreview(true); }}
          />
          <QRCodeModal 
            isOpen={showQRModal} 
            onClose={() => setShowQRModal(false)} 
            sample={selectedSample}
          />
          <PDFPreviewModal 
            isOpen={showPDFPreview} 
            onClose={() => setShowPDFPreview(false)} 
            sample={selectedSample}
          />
        </>
      )}
    </div>
  );

  function DashboardView() {
    if(!user) return null;
    const pendingApprovalsCount = samples.filter(s => s.status === 'Pending Approval').length;
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-primary to-purple-600 rounded-2xl p-8 text-primary-foreground">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold font-headline mb-2">Welcome back, {user.name}! 👋</h2>
              <p className="opacity-80 text-lg">Here's your lab overview for today</p>
            </div>
            <div className="text-right hidden sm:block">
              <div className="bg-white/20 rounded-lg p-4">
                <p className="text-sm">Today's Date</p>
                <p className="text-xl font-semibold">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard label="Total Samples Today" value="47" change="+12%" icon={Activity} color="primary" />
          <StatCard label="Pending Approvals" value={pendingApprovalsCount.toString()} change="-5%" icon={ClipboardCheck} color="amber" />
          <StatCard label="Pass Rate This Month" value="97.2%" change="+2.1%" icon={CheckCircle} color="green" />
          <StatCard label="Critical Alerts" value="3" change="-1" icon={AlertTriangle} color="red" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Analysis Status Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <AnalysisStatusBarChart />
            </CardContent>
          </Card>
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Sample Status</CardTitle>
            </CardHeader>
            <CardContent>
              <SampleStatusPieChart />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>AI-Powered Data Trend Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTrendAnalyzer />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Pending Approvals</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {samples.filter(s => s.status === 'Pending Approval').slice(0, 3).map((item) => (
                <div key={item.id} className="bg-amber-100/50 border border-amber-200 rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-sm text-amber-900">{item.product}</p>
                    <p className="text-xs text-amber-700">by {item.analyst}</p>
                  </div>
                  <Button size="sm" onClick={() => setActiveTab('approvals')}>Review</Button>
                </div>
              ))}
              {pendingApprovalsCount === 0 && <p className="text-sm text-muted-foreground">No pending approvals.</p>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Critical Inventory</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {inventory.filter(i => i.status === 'Critical').map((item, index) => (
                <div key={index} className="bg-red-100/50 border border-red-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-sm text-red-900">{item.name}</p>
                      <p className="text-xs text-red-700">{item.currentStock} {item.unit} remaining</p>
                    </div>
                    <Button size="sm" variant="destructive" onClick={() => toast({ title: `Reordering ${item.name}` })}>Reorder</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  function AnalysesView({ samples, onViewDetails, onViewPDF, onViewQR }: { samples: Sample[], onViewDetails: (s: Sample) => void, onViewPDF: (s: Sample) => void, onViewQR: (s: Sample) => void }) {
    
    const renderResultBadge = (result: string) => {
      const variant = result === 'Approved' ? 'default' : result === 'Out of Spec' ? 'destructive' : 'secondary';
      const bg = result === 'Approved' ? 'bg-green-100 text-green-800' : result === 'Out of Spec' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800';
      return <Badge variant={variant} className={cn("capitalize", bg)}>{result}</Badge>;
    };

    const renderStatusBadge = (status: string, priority: string) => {
      const iconMap: { [key: string]: React.ReactElement } = {
        'Approved': <CheckCircle className="w-3 h-3 mr-1" />,
        'Pending Approval': <Clock className="w-3 h-3 mr-1" />,
        'Rejected': <XCircle className="w-3 h-3 mr-1" />
      };
      const colorMap: { [key: string]: string } = {
        'Approved': 'bg-green-100 text-green-800',
        'Pending Approval': 'bg-yellow-100 text-yellow-800',
        'Rejected': 'bg-red-100 text-red-800'
      };

      return (
        <Badge variant="outline" className={cn("inline-flex items-center", colorMap[status])}>
          {iconMap[status]}
          { (priority === 'High' || priority === 'Critical') && <span className="mr-1 text-red-500">●</span> }
          {status}
        </Badge>
      );
    };
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold font-headline text-foreground">Analysis Management</h2>
            <p className="text-muted-foreground">Manage and track all laboratory analyses</p>
          </div>
          <div className="flex space-x-3">
            {user && hasAccess(['Analyst', 'Admin']) && (
              <Button onClick={() => setActiveTab('new-analysis')}>
                <Plus className="w-4 h-4 mr-2" />
                New Analysis
              </Button>
            )}
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Analysis Records</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Analyst</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {samples.map((sample) => (
                  <TableRow key={sample.id}>
                    <TableCell className="font-mono font-medium">
                      <div className="flex items-center gap-2">
                        {sample.id}
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onViewQR(sample)}>
                          <QrCode className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{sample.product}</div>
                      <div className="text-xs text-muted-foreground">Lot: {sample.lot}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">{sample.type}</Badge>
                    </TableCell>
                    <TableCell>{sample.analyst}</TableCell>
                    <TableCell>{sample.date}</TableCell>
                    <TableCell>{renderResultBadge(sample.result)}</TableCell>
                    <TableCell>{renderStatusBadge(sample.status, sample.priority)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => onViewDetails(sample)}>
                          <Eye className="w-3 h-3 mr-1" /> View
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => onViewPDF(sample)}>
                          <Printer className="w-3 h-3 mr-1" /> PDF
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }
}

interface NewAnalysisViewProps {
  formState: typeof initialAnalysisFormState;
  setFormState: React.Dispatch<React.SetStateAction<typeof initialAnalysisFormState>>;
  onSubmit: () => void;
  onCancel: () => void;
}

function NewAnalysisView({ formState, setFormState, onSubmit, onCancel }: NewAnalysisViewProps) {
    const [specifications, setSpecifications] = useState<Specification[]>([]);
    const [validationStatus, setValidationStatus] = useState<Record<string, { status: 'Pending' | 'Pass' | 'Fail' | 'Validating', message?: string }>>({});
    
    const effectiveAnalysisTypeForSpecs = formState.category || formState.analysisType;

    useEffect(() => {
      if (formState.product && effectiveAnalysisTypeForSpecs) {
        const specs = getSpecifications(formState.product, effectiveAnalysisTypeForSpecs as AnalysisType);
        setSpecifications(specs);
        
        const initialResults: Record<string, any> = {};
        const initialValidation: Record<string, any> = {};
        specs.forEach(spec => {
            initialResults[spec.id] = { value: '', unit: spec.unit, spec: spec.spec, status: 'Pending' };
            initialValidation[spec.id] = { status: 'Pending' };
        });
        setFormState(prev => ({...prev, testResults: initialResults}));
        setValidationStatus(initialValidation);
      } else {
        setSpecifications([]);
      }
    }, [formState.product, effectiveAnalysisTypeForSpecs, setFormState]);
    
    const handleResultChange = useCallback(async (paramId: string, value: string) => {
      const spec = specifications.find(s => s.id === paramId);
      if (!spec) return;

      setFormState(prev => ({
        ...prev,
        testResults: {
          ...prev.testResults,
          [paramId]: { ...prev.testResults?.[paramId], value: value, status: 'Pending' }
        }
      }));

      if (value) {
        setValidationStatus(prev => ({ ...prev, [paramId]: { status: 'Validating' } }));
        try {
          const result = await validateResult({ value, spec: spec.spec });
          const newStatus = result.isValid ? 'Pass' : 'Fail';
          setValidationStatus(prev => ({ ...prev, [paramId]: { status: newStatus } }));
          setFormState(prev => ({
              ...prev,
              testResults: {
                  ...prev.testResults,
                  [paramId]: { ...prev.testResults?.[paramId], status: newStatus }
              }
          }));
        } catch (error) {
           console.error("Validation failed:", error);
           setValidationStatus(prev => ({ ...prev, [paramId]: { status: 'Fail', message: 'Validation error' } }));
        }
      } else {
         setValidationStatus(prev => ({ ...prev, [paramId]: { status: 'Pending' } }));
      }
    }, [specifications, setFormState]);

    const analysisTypes: { type: AnalysisType, icon: React.ElementType, color: string, description: string }[] = [
      { type: 'Raw Material', icon: Package, color: 'bg-blue-500', description: 'Incoming raw materials' },
      { type: 'In-Process', icon: RefreshCw, color: 'bg-cyan-500', description: 'During production' },
      { type: 'Incoming Pre-Shipment', icon: Truck, color: 'bg-green-500', description: 'Before receiving' },
      { type: 'Outgoing Pre-Shipment', icon: Container, color: 'bg-orange-500', description: 'Before shipping' },
      { type: 'Finished Product', icon: Award, color: 'bg-purple-500', description: 'Final products' },
      { type: 'By-Product', icon: FlaskConical, color: 'bg-yellow-500', description: 'Secondary products' },
      { type: 'Export', icon: Ship, color: 'bg-indigo-500', description: 'Export documentation' },
      { type: 'Essential Oil', icon: Leaf, color: 'bg-pink-500', description: 'Essential oils testing' }
    ];

    const getFieldsForAnalysisType = (type: AnalysisType | undefined) => {
      const baseFields: (keyof Sample)[] = ['product', 'lot', 'dateReceived', 'analysisDate', 'shift'];
      const fieldGroups: Record<AnalysisType, (keyof Sample)[]> = {
        'Raw Material': [...baseFields, 'supplier', 'recoverySKR', 'viableRecovery', 'color', 'odor', 'destination'],
        'In-Process': [...baseFields, 'interval', 'odor', 'sediments', 'destination'],
        'Incoming Pre-Shipment': [...baseFields, 'supplier', 'recoverySKR', 'viableRecovery', 'color', 'odor', 'destination'],
        'Outgoing Pre-Shipment': [...baseFields, 'client', 'recoverySKR', 'viableRecovery', 'color', 'odor', 'destination'],
        'Finished Product': [...baseFields, 'destination', 'odor', 'sediments', 'client', 'exportNumber'],
        'By-Product': [...baseFields, 'odor', 'color', 'destination'],
        'Export': [...baseFields, 'client', 'exportNumber', 'destination', 'odor'],
        'Essential Oil': [...baseFields, 'countryOfOrigin', 'supplier', 'supplierLotNumber', 'analysisRequested', 'odor', 'foreignMatter', 'client', 'exportNumber']
      };
      return type ? fieldGroups[type] : baseFields;
    };
    
    const renderDynamicFields = () => {
      const fields = getFieldsForAnalysisType(formState.analysisType);
      const fieldConfigs: Record<string, { label: string; type: string; placeholder?: string; options?: string[]; step?: string }> = {
        product: { label: 'Product Name', type: 'select', options: ['Organic Shea Nuts', 'Cold-Pressed Macadamia Oil', 'Export Grade Baobab Oil', 'Lavender Essential Oil'] },
        lot: { label: 'Lot Number', type: 'text', placeholder: 'Enter lot number' },
        supplier: { label: 'Supplier', type: 'select', options: ['Outspan Kenya', 'Kenya Nuts Company', 'Local Farmers', 'Essential Oils Ltd'] },
        supplierLotNumber: { label: 'Supplier Lot Number', type: 'text', placeholder: 'Enter supplier lot' },
        client: { label: 'Client', type: 'text', placeholder: 'Enter client name' },
        exportNumber: { label: 'Export Number', type: 'text', placeholder: 'Enter export number' },
        destination: { label: 'Destination', type: 'text', placeholder: 'Enter destination' },
        countryOfOrigin: { label: 'Country of Origin', type: 'text', placeholder: 'Enter country' },
        dateReceived: { label: 'Received/Sampling Date', type: 'date' },
        analysisDate: { label: 'Analysis Date', type: 'date' },
        shift: { label: 'Shift', type: 'select', options: ['Day', 'Night'] },
        interval: { label: 'Interval', type: 'select', options: ['1st 4 hours', '2nd 4 hours', '3rd 4 hours'] },
        analysisRequested: { label: 'Analysis Type Requested', type: 'select', options: ['Full Analysis', 'Basic Analysis', 'Custom Analysis'] },
        recoverySKR: { label: '% Recovery (SKR)', type: 'number', placeholder: '0.00', step: '0.01' },
        viableRecovery: { label: '% Viable Recovery', type: 'number', placeholder: '0.00', step: '0.01' },
        color: { label: 'Color', type: 'select', options: ['Clear', 'Light Yellow', 'Golden Yellow', 'Amber', 'Dark Brown', 'Green', 'Other'] },
        odor: { label: 'Odor', type: 'select', options: ['Normal', 'Mild', 'Strong', 'Rancid', 'Fresh', 'Fruity', 'Nutty', 'Off-odor'] },
        sediments: { label: 'Sediments in Sample', type: 'select', options: ['None', 'Trace', 'Light', 'Moderate', 'Heavy'] },
        foreignMatter: { label: 'Foreign Matter/Sediments', type: 'select', options: ['None', 'Trace', 'Present', 'Significant'] },
      };

      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {fields.map(field => {
            const config = fieldConfigs[field];
            if (!config) return null;
            
            return (
              <div key={field}>
                <Label htmlFor={field} className="block text-sm font-medium text-muted-foreground mb-2">{config.label}</Label>
                {config.type === 'select' ? (
                   <Select value={formState[field as keyof typeof formState] as string || ''} onValueChange={(value) => setFormState(prev => ({...prev, [field]: value}))}>
                      <SelectTrigger id={field}><SelectValue placeholder={`Select ${config.label}`} /></SelectTrigger>
                      <SelectContent>
                          {config.options?.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                      </SelectContent>
                   </Select>
                ) : config.type === 'date' ? (
                  <Popover>
                      <PopoverTrigger asChild>
                          <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !formState[field as keyof typeof formState] && "text-muted-foreground")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formState[field as keyof typeof formState] ? format(new Date(formState[field as keyof typeof formState] as string), "PPP") : <span>Pick a date</span>}
                          </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={new Date(formState[field as keyof typeof formState] as string)} onSelect={(date) => setFormState(p => ({...p, [field]: date?.toISOString().split('T')[0]}))} initialFocus />
                      </PopoverContent>
                  </Popover>
                ) : (
                  <Input 
                    id={field}
                    type={config.type}
                    step={config.step}
                    value={formState[field as keyof typeof formState] as string || ''}
                    onChange={(e) => setFormState(prev => ({...prev, [field]: e.target.value}))}
                    placeholder={config.placeholder}
                  />
                )}
              </div>
            );
          })}
        </div>
      );
    };

    const showCategorySelector = formState.analysisType && !['Raw Material', 'Essential Oil'].includes(formState.analysisType);

    const renderTestParameters = () => {
      if (!formState.product || specifications.length === 0) {
        return <p className="text-sm text-muted-foreground text-center py-4">Select a product to see its test parameters.</p>;
      }

      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {specifications.map(param => {
            const status = validationStatus[param.id]?.status || 'Pending';
            return (
              <div key={param.id}>
                <Label htmlFor={param.id} className="block text-sm font-medium text-muted-foreground mb-1">{param.label} ({param.unit})</Label>
                <div className="flex items-center space-x-2">
                  <Input 
                    id={param.id}
                    type="text"
                    placeholder="0.00"
                    value={formState.testResults?.[param.id]?.value || ''}
                    onChange={(e) => handleResultChange(param.id, e.target.value)}
                  />
                  <span className="text-xs text-muted-foreground whitespace-nowrap">Spec: {param.spec}</span>
                   <div className="w-4 h-4">
                    {status === 'Validating' && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
                    {status === 'Pass' && <CheckCircle className="w-4 h-4 text-green-600" />}
                    {status === 'Fail' && <XCircle className="w-4 h-4 text-red-600" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
    };


    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl p-6 text-white">
          <h2 className="text-2xl font-bold font-headline mb-2">New Analysis Entry</h2>
          <p className="text-green-100">Create a comprehensive laboratory analysis record for all product types</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">1. Analysis Type Selection</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {analysisTypes.map((item) => (
                  <button
                    key={item.type}
                    onClick={() => setFormState(prev => ({ ...initialAnalysisFormState, product: '', analysisType: item.type, category: undefined }))}
                    className={cn(
                        'text-white p-4 rounded-lg hover:opacity-90 transition-all text-center',
                        item.color,
                        formState.analysisType === item.type ? 'ring-4 ring-primary ring-offset-2 scale-105' : ''
                    )}
                  >
                    <item.icon className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-xs font-bold">{item.type}</div>
                    <div className="text-xs opacity-80 mt-1 hidden md:block">{item.description}</div>
                  </button>
                ))}
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg">
                <p className="text-sm text-blue-800">
                  <strong>Selected Analysis Type:</strong> {formState.analysisType}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Fields will automatically adjust based on the selected analysis type.
                </p>
            </div>

            <div className="space-y-8">
                <div>
                  <h4 className="font-semibold text-foreground mb-4 flex items-center text-lg border-b pb-2">
                    <Package className="w-5 h-5 mr-3 text-primary" />
                    2. Sample Information
                  </h4>
                  {renderDynamicFields()}
                </div>

                <div>
                   <h4 className="font-semibold text-foreground mb-4 flex items-center text-lg border-b pb-2">
                    <Beaker className="w-5 h-5 mr-3 text-green-600" />
                    3. Test Parameters
                  </h4>
                  
                  {showCategorySelector && (
                    <div className="mb-4 max-w-sm">
                       <Label>Sample Category</Label>
                       <Select value={formState.category} onValueChange={(value: ProductCategory) => setFormState(prev => ({...prev, category: value}))}>
                          <SelectTrigger><SelectValue placeholder="Select a category to load parameters..." /></SelectTrigger>
                          <SelectContent>
                              <SelectItem value="Raw Material">Raw Material</SelectItem>
                              <SelectItem value="Finished Product">Vegetable Oil</SelectItem>
                              <SelectItem value="Essential Oil">Essential Oil</SelectItem>
                          </SelectContent>
                       </Select>
                       <p className="text-xs text-muted-foreground mt-1">This will determine which test parameters are available.</p>
                    </div>
                  )}

                  {renderTestParameters()}
                </div>

                <div>
                  <Label htmlFor="comments" className="block text-sm font-medium text-muted-foreground mb-2">4. Comments & Observations</Label>
                  <Textarea 
                    id="comments"
                    rows={4}
                    value={formState.comments}
                    onChange={(e) => setFormState(prev => ({...prev, comments: e.target.value}))}
                    placeholder="Enter any observations, deviations, or special notes about this analysis..."
                  />
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                        Test parameters will be validated against specifications upon submission.
                    </p>
                    <div className="flex space-x-4">
                        <Button variant="outline" onClick={onCancel}>Cancel</Button>
                        <Button onClick={onSubmit}>
                          <Send className="w-4 h-4 mr-2" /> Submit Analysis
                        </Button>
                    </div>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
}

function ApprovalsView({ samples, onApprove, onReject, onViewDetails }: { samples: Sample[], onApprove: (id: string, decision: 'Approved') => void, onReject: (id: string, decision: 'Rejected') => void, onViewDetails: (sample: Sample) => void }) {
    if (samples.length === 0) {
      return (
        <Card className="text-center py-12">
          <CardContent>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">All Clear!</h3>
            <p className="text-muted-foreground">There are no pending approvals in the queue.</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold font-headline text-foreground">Approval Workflow</h2>
              <p className="text-muted-foreground">Review and approve or reject pending analyses</p>
            </div>
            <Badge variant="secondary">{samples.length} Pending</Badge>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {samples.map(sample => (
                <div key={sample.id} className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-grow">
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-sm bg-muted px-2 py-1 rounded">{sample.id}</span>
                        <Badge variant="outline">{sample.type}</Badge>
                      </div>
                      <h4 className="font-semibold mt-2">{sample.product}</h4>
                      <p className="text-sm text-muted-foreground">
                        Lot: {sample.lot} | Submitted by: {sample.analyst} on {sample.date}
                      </p>
                  </div>
                  <div className="flex-shrink-0 flex items-center gap-3">
                    <Button variant="outline" size="sm" onClick={() => onViewDetails(sample)}><Eye className="mr-2" />Details</Button>
                    <Button size="sm" variant="destructive" onClick={() => onReject(sample.id, 'Rejected')}><XCircle className="mr-2" />Reject</Button>
                    <Button size="sm" onClick={() => onApprove(sample.id, 'Approved')}><CheckCircle className="mr-2" />Approve</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
function InventoryView({ inventory, setInventory, samples }: { inventory: InventoryItem[], setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>, samples: Sample[] }) {
  const { toast } = useToast();
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', packages: '', capacity: '', unit: 'L', dateReceived: new Date() });
  
  const [consumptionState, setConsumptionState] = useState<{
    isOpen: boolean;
    itemName: string;
    amount: string;
    date: Date;
    productAnalyzed: string;
  }>({
    isOpen: false,
    itemName: '',
    amount: '',
    date: new Date(),
    productAnalyzed: '',
  });

  const handleAddItem = () => {
    const packages = parseInt(newItem.packages, 10);
    const capacity = parseFloat(newItem.capacity);
    if (!newItem.name || isNaN(packages) || isNaN(capacity) || packages <= 0 || capacity <= 0) {
      toast({ title: 'Invalid Input', description: 'Please fill out all fields with valid numbers.', variant: 'destructive' });
      return;
    }
    const stockToAdd = packages * capacity;

    setInventory(prev => {
        const existingItemIndex = prev.findIndex(item => item.name === newItem.name);
        
        if (existingItemIndex > -1) {
            const updatedInventory = [...prev];
            const existingItem = updatedInventory[existingItemIndex];
            
            const newTotalStock = (existingItem.totalStock || 0) + stockToAdd;
            const newCurrentStock = (existingItem.currentStock || 0) + stockToAdd;

            updatedInventory[existingItemIndex] = { ...existingItem, totalStock: newTotalStock, currentStock: newCurrentStock };
            return updatedInventory;

        } else {
            const newInvItem: InventoryItem = {
              name: newItem.name,
              totalStock: stockToAdd,
              currentStock: stockToAdd,
              unit: newItem.unit,
              status: 'OK',
              consumption: []
            };
            return [...prev, newInvItem];
        }
    });

    setIsAddItemOpen(false);
    setNewItem({ name: '', packages: '', capacity: '', unit: 'L', dateReceived: new Date() }); 
    toast({ title: 'Inventory Updated', description: `${newItem.name} has been added/updated.` });
  };
  
  const handleLogConsumption = () => {
    const { itemName, amount, date, productAnalyzed } = consumptionState;
    const consumedValue = parseFloat(amount);

    if (isNaN(consumedValue) || consumedValue <= 0 || !productAnalyzed) {
      toast({ title: 'Invalid consumption value or product not selected.', variant: 'destructive' });
      return;
    }

    setInventory(prev => prev.map(item => {
      if (item.name === itemName) {
        if (item.currentStock < consumedValue) {
          toast({ title: 'Insufficient Stock', variant: 'destructive' });
          return item;
        }
        const newCurrentStock = item.currentStock - consumedValue;
        const newConsumption: ConsumptionLog = { 
            date: format(date, 'yyyy-MM-dd'), 
            amount: consumedValue, 
            productAnalyzed 
        };
        
        let newStatus: InventoryItem['status'] = 'OK';
        const stockPercentage = (newCurrentStock / item.totalStock) * 100;
        if (stockPercentage < 10) newStatus = 'Critical';
        else if (stockPercentage < 25) newStatus = 'Low';
        
        return { ...item, currentStock: newCurrentStock, consumption: [...item.consumption, newConsumption], status: newStatus };
      }
      return item;
    }));

    setConsumptionState({ isOpen: false, itemName: '', amount: '', date: new Date(), productAnalyzed: '' }); // Reset state
    toast({ title: 'Consumption Logged', description: `${consumedValue} ${inventory.find(i=>i.name===itemName)?.unit} of ${itemName} logged.` });
  };
    
    const inventoryItemNames = [
        'Hexane (HPLC Grade)',
        'Sulfuric Acid 98%',
        'Methanol (AR Grade)',
        'Whatman Filter Paper No. 1',
        'Potassium Hydroxide Pellets',
        'Sodium Thiosulphate',
        'Starch Soluble',
        'Phenolphthalein Indicator Powder',
        'Ethanol Absolute',
        'Diethyl Ether',
        'Glacial Acetic Acid',
        'Chloroform',
        'Potassium lodide',
        'Filter papers',
        'Plastic Droppers',
        'Thimbles',
        'Petroleum Ether',
        'Methanol'
    ];
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold font-headline text-foreground">Inventory Management</h2>
            <p className="text-muted-foreground">Track and manage laboratory reagents and supplies with full traceability.</p>
          </div>
          <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2" /> Add Item</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add New Inventory Item</DialogTitle></DialogHeader>
              <div className="grid gap-4 py-4">
                 <div className="space-y-2">
                    <Label>Item Name</Label>
                    <Select value={newItem.name} onValueChange={val => setNewItem(p => ({...p, name: val}))}>
                        <SelectTrigger><SelectValue placeholder="Select Item Name" /></SelectTrigger>
                        <SelectContent>
                            {inventoryItemNames.map(name => <SelectItem key={name} value={name}>{name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                 </div>
                 <div className="space-y-2">
                    <Label>Date Received</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !newItem.dateReceived && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {newItem.dateReceived ? format(newItem.dateReceived, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={newItem.dateReceived} onSelect={(date) => setNewItem(p => ({...p, dateReceived: date || new Date()}))} initialFocus />
                        </PopoverContent>
                    </Popover>
                 </div>
                <div className="space-y-2">
                    <Label>Number of Packages (e.g., Boxes, Bottles)</Label>
                    <Input type="number" placeholder="e.g., 4" value={newItem.packages} onChange={e => setNewItem(p => ({...p, packages: e.target.value}))} />
                </div>
                <div className="flex gap-4">
                  <div className="flex-grow space-y-2">
                    <Label>Capacity per Package</Label>
                    <Input type="number" placeholder="e.g., 2.5" value={newItem.capacity} onChange={e => setNewItem(p => ({...p, capacity: e.target.value}))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Unit</Label>
                    <Select value={newItem.unit} onValueChange={val => setNewItem(p => ({...p, unit: val}))}>
                        <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                        <SelectItem value="L">Liters (L)</SelectItem>
                        <SelectItem value="ml">Milliliters (ml)</SelectItem>
                        <SelectItem value="kg">Kilograms (kg)</SelectItem>
                        <SelectItem value="g">Grams (g)</SelectItem>
                        <SelectItem value="pieces">Pieces</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground pt-2 border-t">
                  Total Stock to Add: <span className="font-bold">{(!isNaN(parseInt(newItem.packages, 10)) && !isNaN(parseFloat(newItem.capacity))) ? (parseInt(newItem.packages, 10) * parseFloat(newItem.capacity)).toFixed(2) : '0.00'} {newItem.unit}</span>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddItem}>Add to Stock</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Reagent & Supply Levels</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead className="w-[250px]">Stock Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventory.map(item => {
                  const stockPercentage = item.totalStock > 0 ? (item.currentStock / item.totalStock) * 100 : 0;
                  return (
                    <TableRow key={item.name}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.currentStock.toFixed(2)} / {item.totalStock.toFixed(2)} {item.unit}</TableCell>
                      <TableCell><Progress value={stockPercentage} className="w-full" /></TableCell>
                      <TableCell>
                        <Badge variant={item.status === 'Critical' ? 'destructive' : 'secondary'} className={item.status === 'Low' ? 'bg-amber-100 text-amber-800' : ''}>
                           {item.status === 'Critical' && <AlertTriangle className="w-3 h-3 mr-1" />}
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                         <Button variant="outline" size="sm" onClick={() => setConsumptionState(prev => ({...prev, isOpen: true, itemName: item.name}))}>Log Use</Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
         <Dialog open={consumptionState.isOpen} onOpenChange={(isOpen) => setConsumptionState(p => ({...p, isOpen}))}>
            <DialogContent>
                <DialogHeader><DialogTitle>Log Consumption for {consumptionState.itemName}</DialogTitle></DialogHeader>
                <div className="py-4 space-y-4">
                    <div>
                        <Label>Amount Consumed ({inventory.find(i => i.name === consumptionState.itemName)?.unit})</Label>
                        <Input type="number" value={consumptionState.amount} onChange={e => setConsumptionState(p => ({...p, amount: e.target.value}))} />
                    </div>
                    <div>
                        <Label>Date of Consumption</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !consumptionState.date && "text-muted-foreground")}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {consumptionState.date ? format(consumptionState.date, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={consumptionState.date} onSelect={(date) => setConsumptionState(p => ({...p, date: date || new Date()}))} initialFocus />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div>
                        <Label>Product Analyzed</Label>
                        <Select value={consumptionState.productAnalyzed} onValueChange={val => setConsumptionState(p => ({...p, productAnalyzed: val}))}>
                            <SelectTrigger><SelectValue placeholder="Select product..." /></SelectTrigger>
                            <SelectContent>
                                {samples.map(s => <SelectItem key={s.id} value={`${s.product} (${s.id})`}>{s.product} (${s.id})</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleLogConsumption}>Log</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </div>
    );
}

function AnalyticsView({ inventory }: { inventory: InventoryItem[] }) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold font-headline text-foreground">Analytics & Trends</h2>
            <p className="text-muted-foreground">Visualize lab data and quality metrics over time</p>
          </div>
          <Button variant="outline"><FileSpreadsheet className="mr-2" /> Export Reports</Button>
        </div>
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quality Trends</CardTitle>
              <CardDescription>Monthly pass rate and sample volume</CardDescription>
            </CardHeader>
            <CardContent>
              <QualityTrendsLineChart />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Analysis Turnaround Time (Avg)</CardTitle>
              <CardDescription>Average time from sample receipt to approval</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-[250px]">
                <div className="text-center">
                    <p className="text-5xl font-bold">2.1 <span className="text-2xl text-muted-foreground">days</span></p>
                    <p className="text-sm text-green-600">↓ 15% from last month</p>
                </div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Inventory Consumption</CardTitle>
            <CardDescription>Weekly consumption of key lab reagents</CardDescription>
          </CardHeader>
          <CardContent>
            <InventoryConsumptionChart inventory={inventory} />
          </CardContent>
        </Card>
      </div>
    );
}

function SampleDetailsModal({ isOpen, onClose, sample, onViewQR, onViewPDF }: { isOpen: boolean, onClose: () => void, sample: Sample, onViewQR: () => void, onViewPDF: () => void }) {
    if (!isOpen) return null;
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Sample Details - {sample.id}</DialogTitle>
          </DialogHeader>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Sample Information</h4>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium text-muted-foreground">ID:</span> {sample.id}</p>
                  <p><span className="font-medium text-muted-foreground">Product:</span> {sample.product}</p>
                  <p><span className="font-medium text-muted-foreground">Lot:</span> {sample.lot}</p>
                  <p><span className="font-medium text-muted-foreground">Analyst:</span> {sample.analyst}</p>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Test Results</h4>
              {Object.keys(sample.testResults).length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Parameter</TableHead>
                      <TableHead>Result</TableHead>
                      <TableHead>Specification</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(sample.testResults || {}).map(([key, result]) => (
                      <TableRow key={key}>
                        <TableCell className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</TableCell>
                        <TableCell className="font-mono">{result.value} {result.unit}</TableCell>
                        <TableCell>{result.spec}</TableCell>
                        <TableCell>
                          <Badge variant={result.status === 'Pass' ? 'default' : 'destructive'} className={result.status === 'Pass' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {result.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No test results recorded for this sample yet.</p>
              )}
            </div>
          </div>
          <DialogFooter className="flex justify-between w-full">
            <Button variant="link" onClick={onViewQR}><QrCode className="w-4 h-4 mr-1" /> View QR Code</Button>
            <Button onClick={onViewPDF}><Printer className="w-4 h-4 mr-2" /> Generate PDF</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
}

function QRCodeModal({ isOpen, onClose, sample }: { isOpen: boolean, onClose: () => void, sample: Sample }) {
    if (!isOpen) return null;
    const qrCodeUrl = `https://fairlabs-lims.com/sample/${sample.id}`;
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Sample QR Code</DialogTitle>
          </DialogHeader>
          <div className="text-center p-4">
            <div className="bg-white border-2 border-gray-200 p-8 rounded-lg mb-4 inline-block">
               <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrCodeUrl)}`} alt="QR Code" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">Scan to view sample details</p>
            <p className="text-xs font-mono bg-muted p-2 rounded break-all">{qrCodeUrl}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { navigator.clipboard.writeText(qrCodeUrl); toast({ title: "Link Copied!" }); }}>Copy Link</Button>
            <Button>Print QR</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
}

function PDFPreviewModal({ isOpen, onClose, sample }: { isOpen: boolean, onClose: () => void, sample: Sample }) {
    if (!isOpen) return null;
    const { toast } = useToast();

    const downloadPDF = () => {
      toast({ title: "Downloading PDF..." });
    };

    const emailClient = () => {
      toast({ title: "Email Sent!", description: `COA for sample ${sample.id} sent to client.` });
    };

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl p-0">
          <DialogHeader className="p-6 border-b">
            <DialogTitle>Certificate of Analysis - Preview</DialogTitle>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-y-auto bg-muted/50 p-8">
            <CertificateOfAnalysis sample={sample} />
          </div>
          <DialogFooter className="p-6 border-t bg-muted/50">
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button onClick={downloadPDF}><Download className="w-4 h-4 mr-2" /> Download PDF</Button>
            <Button onClick={emailClient}><Mail className="w-4 h-4 mr-2" /> Email Client</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
}
