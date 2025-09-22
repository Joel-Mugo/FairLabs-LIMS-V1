
import type { Sample } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Beaker, CheckCircle, Clock, QrCode, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CertificateOfAnalysis({ sample }: { sample: Sample }) {
  const isRejected = sample?.status === 'Rejected';
  const isApproved = sample?.status === 'Approved';

  const StatusBanner = () => {
    if (isRejected) {
      return (
        <div className="bg-red-600 text-white text-center py-4 mb-6 rounded-lg">
          <h2 className="text-xl font-bold flex items-center justify-center gap-2"><XCircle /> REJECTED BY QC MANAGER</h2>
          <p className="text-sm">Rhoda Mwikali - Quality Control Manager</p>
        </div>
      );
    }
    if (isApproved) {
      return (
        <div className="bg-green-600 text-white text-center py-4 mb-6 rounded-lg">
          <h2 className="text-xl font-bold flex items-center justify-center gap-2"><CheckCircle /> APPROVED BY QC MANAGER</h2>
          <p className="text-sm">Rhoda Mwikali - Quality Control Manager</p>
        </div>
      );
    }
    return (
      <div className="bg-gray-600 text-white text-center py-4 mb-6 rounded-lg">
        <h2 className="text-xl font-bold flex items-center justify-center gap-2"><Clock /> PENDING REVIEW</h2>
        <p className="text-sm">Awaiting QC Manager Approval</p>
      </div>
    );
  };

  return (
    <div className="bg-white p-8 shadow-lg max-w-3xl mx-auto font-body">
      <header className="text-center mb-8">
        <StatusBanner />
        <div className="flex justify-between items-center mb-6">
          <div className="bg-gradient-to-r from-primary to-purple-600 p-2 rounded-lg text-primary-foreground">
            <Beaker className="w-8 h-8" />
            <div className="text-xs font-bold">FairLabs</div>
          </div>
          <div className="text-right">
             <img src={`https://api.qrserver.com/v1/create-qr-code/?size=64x64&data=${encodeURIComponent(`https://fairlabs-lims.com/sample/${sample.id}`)}`} alt="QR Code" />
            <p className="text-xs text-muted-foreground">Scan for verification</p>
          </div>
        </div>
      </header>

      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold font-headline text-gray-800 mb-2">CERTIFICATE OF ANALYSIS</h1>
          <p className="text-gray-600">Report ID: {sample?.id || 'SAMPLE'}-COA-{new Date().toISOString().slice(0,10)}</p>
        </div>

        <div className="grid grid-cols-2 gap-6 p-4 border rounded-lg">
          <div>
            <h3 className="font-semibold mb-3">Sample Information</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium text-muted-foreground">Product:</span> {sample?.product || 'N/A'}</p>
              <p><span className="font-medium text-muted-foreground">Lot Number:</span> {sample?.lot || 'N/A'}</p>
              <p><span className="font-medium text-muted-foreground">Analysis Date:</span> {sample?.date || 'N/A'}</p>
              <p><span className="font-medium text-muted-foreground">Analyst:</span> {sample?.analyst || 'N/A'}</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Client Information</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium text-muted-foreground">Supplier/Client:</span> {sample?.supplier || sample?.client || 'N/A'}</p>
              <p><span className="font-medium text-muted-foreground">Report Date:</span> {new Date().toLocaleDateString()}</p>
              <p><span className="font-medium text-muted-foreground">Valid Until:</span> {new Date(Date.now() + 90*24*60*60*1000).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Test Results</h3>
          {sample?.testResults && Object.keys(sample.testResults).length > 0 ? (
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
                {Object.entries(sample.testResults).map(([key, result]) => (
                  <TableRow key={key} className={result.status === 'Fail' ? 'bg-red-50' : ''}>
                    <TableCell className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</TableCell>
                    <TableCell className="font-mono">{result.value} {result.unit}</TableCell>
                    <TableCell>{result.spec}</TableCell>
                    <TableCell>
                      <Badge variant={result.status === 'Pass' ? 'default' : 'destructive'} className={cn(result.status === 'Pass' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}>
                        {result.status === 'Pass' ? '✓ PASS' : '✗ FAIL'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
             <p className="text-sm text-muted-foreground text-center py-4">No test results recorded for this sample.</p>
          )}
        </div>

        <div className={cn('border-2 rounded-lg p-4', 
            isRejected ? 'bg-red-50 border-red-300' : 
            isApproved ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-300'
          )}>
          <h3 className={cn('font-bold mb-2 flex items-center gap-2',
              isRejected ? 'text-red-800' : isApproved ? 'text-green-800' : 'text-gray-800'
            )}>
            {isRejected ? <XCircle/> : isApproved ? <CheckCircle/> : <Clock/>}
            {isRejected ? 'REJECTION SUMMARY' : isApproved ? 'APPROVAL SUMMARY' : 'ANALYSIS SUMMARY'}
          </h3>
          <p className="text-sm">{sample?.overallResult || 'Analysis in progress'}</p>
          {sample?.rejectionReason && (
            <p className="text-sm text-red-700 mt-2">
              <span className="font-semibold">Rejection Reason:</span> {sample.rejectionReason}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-8 mt-8 pt-6 border-t">
          <div className="text-center">
            <div className="border-t-2 border-gray-400 pt-2 mt-12">
              <p className="font-medium">{sample?.analyst || 'Lab Analyst'}</p>
              <p className="text-sm text-gray-600">Laboratory Analyst</p>
            </div>
          </div>
          <div className="text-center">
            <div className="border-t-2 border-gray-400 pt-2 mt-12">
              <p className="font-medium">Rhoda Mwikali</p>
              <p className="text-sm text-gray-600">QC Manager</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

    
