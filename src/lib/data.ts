
import type { Sample, AnalysisData, TrendData, StatusData, InventoryItem } from './types';

export const sampleData: Sample[] = [
  {
    id: 'RM001',
    product: 'Organic Shea Nuts',
    lot: 'SN-445-ORG',
    supplier: 'Outspan Kenya',
    result: 'Approved',
    status: 'Approved',
    analyst: 'Kevin Masinde',
    date: '2024-09-16',
    type: 'Raw Material',
    priority: 'Normal',
    testResults: {
      moistureContent: { value: 8.2, unit: '%', spec: '<10', status: 'Pass' },
      oilContent: { value: 45.8, unit: '%', spec: '40-50', status: 'Pass' },
      ffa: { value: 2.1, unit: '%', spec: '<3', status: 'Pass' },
      aflatoxin: { value: 4.5, unit: 'ppb', spec: '<10', status: 'Pass' }
    },
    overallResult: 'All parameters within specifications'
  },
  {
    id: 'FP001',
    product: 'Cold-Pressed Macadamia Oil',
    lot: 'MO-223-CP',
    supplier: 'Kenya Nuts Ltd.',
    result: 'Pending Review',
    status: 'Pending Approval',
    analyst: 'Monica Jebet',
    date: '2024-09-16',
    type: 'Finished Product',
    priority: 'High',
    testResults: {
      ffa: { value: 0.8, unit: '%', spec: '<2', status: 'Pass' },
      peroxideValue: { value: 2.1, unit: 'meq O₂/kg', spec: '<5', status: 'Pass' },
      color: { value: 'Golden Yellow', unit: '', spec: 'Light Yellow', status: 'Pass' }
    },
    overallResult: 'All parameters within specifications - pending QC approval'
  },
  {
    id: 'EX001',
    product: 'Export Grade Baobab Oil',
    lot: 'BO-E445-EX',
    client: 'European Naturals Ltd',
    result: 'Out of Spec',
    status: 'Rejected',
    analyst: 'Rhoda Mwikali',
    date: '2024-09-15',
    type: 'Export',
    priority: 'Critical',
    testResults: {
      ffa: { value: 3.2, unit: '%', spec: '<2', status: 'Fail' },
      peroxideValue: { value: 1.8, unit: 'meq O₂/kg', spec: '<3', status: 'Pass' },
      color: { value: 'Dark Brown', unit: '', spec: 'Light Yellow', status: 'Fail' }
    },
    overallResult: 'Sample rejected - FFA exceeds specification',
    rejectionReason: 'Free Fatty Acids exceed maximum limit'
  }
];

export const analysisData: AnalysisData[] = [
  { name: 'Raw Material', completed: 45, pending: 12, approved: 43, outOfSpec: 2 },
  { name: 'In Process', completed: 32, pending: 8, approved: 30, outOfSpec: 1 },
  { name: 'Finished Product', completed: 28, pending: 5, approved: 26, outOfSpec: 1 },
  { name: 'Export', completed: 15, pending: 3, approved: 14, outOfSpec: 0 }
];

export const trendData: TrendData[] = [
  { month: 'Jan', passRate: 94.2, volume: 120 },
  { month: 'Feb', passRate: 96.1, volume: 135 },
  { month: 'Mar', passRate: 92.8, volume: 140 },
  { month: 'Apr', passRate: 98.1, volume: 128 },
  { month: 'May', passRate: 95.5, volume: 150 },
  { month: 'Jun', passRate: 97.2, volume: 145 }
];

export const statusData: StatusData[] = [
  { name: 'Approved', value: 156 },
  { name: 'Pending', value: 28 },
  { name: 'Out of Spec', value: 8 },
  { name: 'In Progress', value: 15 }
];

export const inventoryItems: InventoryItem[] = [
  { 
    name: 'Hexane (HPLC Grade)',
    totalStock: 20,
    currentStock: 2.5,
    unit: 'L',
    status: 'Critical',
    consumption: [
        { date: '2024-07-20', amount: 5, productAnalyzed: 'Organic Shea Nuts (RM001)' },
        { date: '2024-07-21', amount: 5, productAnalyzed: 'Cold-Pressed Macadamia Oil (FP001)' },
        { date: '2024-07-22', amount: 7.5, productAnalyzed: 'Organic Shea Nuts (RM001)' },
    ]
  },
  { 
    name: 'Sulfuric Acid 98%',
    totalStock: 5,
    currentStock: 0.8,
    unit: 'L',
    status: 'Low',
    consumption: [
        { date: '2024-07-20', amount: 1, productAnalyzed: 'Organic Shea Nuts (RM001)' },
        { date: '2024-07-21', amount: 1.2, productAnalyzed: 'Export Grade Baobab Oil (EX001)' },
        { date: '2024-07-22', amount: 2, productAnalyzed: 'Cold-Pressed Macadamia Oil (FP001)' },
    ]
  },
  { 
    name: 'Methanol (AR Grade)',
    totalStock: 25,
    currentStock: 15,
    unit: 'L',
    status: 'OK',
    consumption: [
        { date: '2024-07-21', amount: 5, productAnalyzed: 'Cold-Pressed Macadamia Oil (FP001)' },
        { date: '2024-07-22', amount: 5, productAnalyzed: 'Organic Shea Nuts (RM001)' },
    ]
  },
  { 
    name: 'Whatman Filter Paper No. 1',
    totalStock: 200,
    currentStock: 78,
    unit: 'pieces',
    status: 'OK',
    consumption: [
      { date: '2024-07-20', amount: 20, productAnalyzed: 'Organic Shea Nuts (RM001)' },
      { date: '2024-07-21', amount: 52, productAnalyzed: 'Cold-Pressed Macadamia Oil (FP001)' },
      { date: '2024-07-22', amount: 50, productAnalyzed: 'Export Grade Baobab Oil (EX001)' },
    ]
  },
];

    
