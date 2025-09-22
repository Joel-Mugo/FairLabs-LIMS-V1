
'use server';

import { analyzeDataTrends, AnalyzeDataTrendsOutput } from '@/ai/flows/analyze-data-trends';
import { sampleData } from '@/lib/data';
import { users } from '@/lib/users';
import { cookies } from 'next/headers';
import type { User } from '@/lib/types';
import { redirect } from 'next/navigation';

type AnalysisResult = AnalyzeDataTrendsOutput & {
  deviations: any; 
  error?: string;
};

export async function runDataTrendAnalysis(): Promise<AnalysisResult | { error: string }> {
  try {
    const historicalData = JSON.stringify(sampleData.map(s => ({
      id: s.id,
      product: s.product,
      lot: s.lot,
      results: s.testResults
    })));

    const expectedResults = JSON.stringify({
      "Organic Shea Nuts": {
        moistureContent: { spec: '<10%' },
        oilContent: { spec: '40-50%' },
        ffa: { spec: '<3%' },
        aflatoxin: { spec: '<10ppb' }
      },
      "Cold-Pressed Macadamia Oil": {
        ffa: { spec: '<2%' },
        peroxideValue: { spec: '<5meq O₂/kg' }
      },
      "Export Grade Baobab Oil": {
        ffa: { spec: '<2%' },
        peroxideValue: { spec: '<3meq O₂/kg' }
      }
    });

    const result = await analyzeDataTrends({
      historicalData,
      expectedResults,
    });
    
    let parsedDeviations: any = result.deviations;
    try {
        parsedDeviations = JSON.parse(result.deviations);
    } catch (e) {
        // If parsing fails, keep it as a raw string.
    }

    return { ...result, deviations: parsedDeviations };

  } catch (error) {
    console.error("Error in runDataTrendAnalysis:", error);
    return { error: 'An unexpected error occurred while analyzing data trends.' };
  }
}

// --- Authentication Actions ---

export async function login(prevState: { error: string } | undefined, formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password) {
    return { error: 'Please enter both username and password.' };
  }

  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return { error: 'Invalid username or password.' };
  }

  // Create session
  const sessionUser = { id: user.id, name: user.name, role: user.role, avatar: user.avatar, username: user.username };
  cookies().set('session', JSON.stringify(sessionUser), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });

  redirect('/');
}


export async function logout() {
  cookies().delete('session');
  redirect('/login');
}

export async function getLoggedInUser(): Promise<User | null> {
  const session = cookies().get('session')?.value;
  if (session) {
    return JSON.parse(session);
  }
  return null;
}
