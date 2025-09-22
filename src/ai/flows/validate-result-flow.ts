
'use server';
/**
 * @fileOverview An AI agent for validating lab test results against specifications.
 *
 * - validateResult - A function that checks if a given value meets a specification.
 * - ValidateResultInput - The input type for the validateResult function.
 * - ValidateResultOutput - The return type for the validateResult function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateResultInputSchema = z.object({
  value: z.string().describe('The test result value entered by the analyst.'),
  spec: z.string().describe('The specification criteria for the test (e.g., "<10", "40-50", ">99.5").'),
});
export type ValidateResultInput = z.infer<typeof ValidateResultInputSchema>;

const ValidateResultOutputSchema = z.object({
  isValid: z.boolean().describe('Whether the value meets the specification.'),
});
export type ValidateResultOutput = z.infer<typeof ValidateResultOutputSchema>;

export async function validateResult(input: ValidateResultInput): Promise<ValidateResultOutput> {
  return validateResultFlow(input);
}

const prompt = ai.definePrompt({
  name: 'validateResultPrompt',
  input: {schema: ValidateResultInputSchema},
  output: {schema: ValidateResultOutputSchema},
  prompt: `You are a precision validation engine for a laboratory system. Your task is to determine if a given 'value' meets the 'specification'. The specification can be a range (e.g., "40-50"), a minimum (e.g., ">95"), a maximum (e.g., "<10"), or a specific value.

Value: {{{value}}}
Specification: {{{spec}}}

Analyze the value against the specification and return a boolean 'isValid'. The value is valid if it falls within the range, is less than the maximum, or greater than the minimum as defined by the spec.
`,
});

const validateResultFlow = ai.defineFlow(
  {
    name: 'validateResultFlow',
    inputSchema: ValidateResultInputSchema,
    outputSchema: ValidateResultOutputSchema,
  },
  async input => {
    // Basic sanitization
    const cleanedValue = input.value.replace(/[^0-9.-]/g, '');
    const numericValue = parseFloat(cleanedValue);
    
    if (isNaN(numericValue)) {
        return { isValid: false };
    }

    const {output} = await prompt({ value: numericValue.toString(), spec: input.spec });
    return output!;
  }
);

    
