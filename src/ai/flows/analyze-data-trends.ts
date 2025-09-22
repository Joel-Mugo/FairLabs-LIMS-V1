'use server';

/**
 * @fileOverview An AI agent for analyzing historical lab data and identifying statistically significant deviations.
 *
 * - analyzeDataTrends - A function that triggers the data trend analysis process.
 * - AnalyzeDataTrendsInput - The input type for the analyzeDataTrends function.
 * - AnalyzeDataTrendsOutput - The return type for the analyzeDataTrends function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeDataTrendsInputSchema = z.object({
  historicalData: z.string().describe('Historical lab data in JSON format.'),
  expectedResults: z.string().describe('Expected results data in JSON format.'),
});
export type AnalyzeDataTrendsInput = z.infer<typeof AnalyzeDataTrendsInputSchema>;

const AnalyzeDataTrendsOutputSchema = z.object({
  deviations: z.string().describe('Statistically significant deviations from expected results, in JSON format.'),
  warningMessage: z.string().describe('A warning message to display if deviations are found.'),
});
export type AnalyzeDataTrendsOutput = z.infer<typeof AnalyzeDataTrendsOutputSchema>;

export async function analyzeDataTrends(input: AnalyzeDataTrendsInput): Promise<AnalyzeDataTrendsOutput> {
  return analyzeDataTrendsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeDataTrendsPrompt',
  input: {schema: AnalyzeDataTrendsInputSchema},
  output: {schema: AnalyzeDataTrendsOutputSchema},
  prompt: `You are an expert quality control (QC) manager. Your task is to analyze historical lab data and identify any statistically significant deviations from expected results.

Historical Data: {{{historicalData}}}
Expected Results: {{{expectedResults}}}

Based on the provided data, identify any deviations that are statistically significant. Provide your output in JSON format. Also include a warning message if deviations are found, or a confirmation message if no deviations are found.
`,
});

const analyzeDataTrendsFlow = ai.defineFlow(
  {
    name: 'analyzeDataTrendsFlow',
    inputSchema: AnalyzeDataTrendsInputSchema,
    outputSchema: AnalyzeDataTrendsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
