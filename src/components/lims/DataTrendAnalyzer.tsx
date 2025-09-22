"use client";

import { useState } from 'react';
import { runDataTrendAnalysis } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Zap, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

type AnalysisResult = {
  deviations: any;
  warningMessage: string;
  error?: string;
};

export default function DataTrendAnalyzer() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    const result = await runDataTrendAnalysis();
    if (result.error) {
      setError(result.error);
    } else {
      setAnalysisResult(result as AnalysisResult);
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Use our AI-powered tool to analyze historical lab data against expected results. The system will flag any statistically significant deviations or drifts in quality.
      </p>
      <Button onClick={handleAnalyze} disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Zap className="mr-2 h-4 w-4" />
            Analyze Data Trends
          </>
        )}
      </Button>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Analysis Failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {analysisResult && (
        <Alert>
          <Zap className="h-4 w-4" />
          <AlertTitle>AI Analysis Complete</AlertTitle>
          <AlertDescription>
            <p className="font-semibold mb-2">{analysisResult.warningMessage}</p>
            {analysisResult.deviations && typeof analysisResult.deviations === 'object' && Object.keys(analysisResult.deviations).length > 0 && (
              <div className="mt-2">
                <h4 className="font-bold">Detected Deviations:</h4>
                <Card className="mt-2 bg-background">
                  <CardContent className="p-4">
                    <pre className="text-xs whitespace-pre-wrap font-mono">
                      {JSON.stringify(analysisResult.deviations, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
