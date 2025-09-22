
import type { AnalysisType, ProductSpecification, ProductCategory } from './types';

export const productSpecifications: ProductSpecification[] = [
  {
    productName: 'Organic Shea Nuts',
    analysisType: 'Raw Material',
    parameters: [
      { id: 'moistureContent', label: 'Moisture Content', spec: '<10', unit: '%' },
      { id: 'oilContent', label: 'Oil Content', spec: '40-50', unit: '%' },
      { id: 'ffa', label: 'Free Fatty Acids', spec: '<3', unit: '%' },
      { id: 'aflatoxin', label: 'Aflatoxin', spec: '<10', unit: 'ppb' },
    ],
  },
  {
    productName: 'Cold-Pressed Macadamia Oil',
    analysisType: 'Finished Product',
    parameters: [
      { id: 'ffa', label: 'Free Fatty Acids', spec: '<2', unit: '%' },
      { id: 'peroxideValue', label: 'Peroxide Value', spec: '<5', unit: 'meq O₂/kg' },
      { id: 'iodineValue', label: 'Iodine Value', spec: '70-80', unit: '' },
      { id: 'saponificationValue', label: 'Saponification Value', spec: '190-200', unit: '' },
    ],
  },
    {
    productName: 'Export Grade Baobab Oil',
    analysisType: 'Finished Product', // Assuming this is also a finished product
    parameters: [
        { id: 'ffa', label: 'Free Fatty Acids', spec: '<2', unit: '%' },
        { id: 'peroxideValue', label: 'Peroxide Value', spec: '<3', unit: 'meq O₂/kg' },
    ]
  },
  {
    productName: 'Export Grade Baobab Oil',
    analysisType: 'Export',
    parameters: [
        { id: 'ffa', label: 'Free Fatty Acids', spec: '<2', unit: '%' },
        { id: 'peroxideValue', label: 'Peroxide Value', spec: '<3', unit: 'meq O₂/kg' },
    ]
  },
  {
    productName: 'Lavender Essential Oil',
    analysisType: 'Essential Oil',
    parameters: [
      { id: 'specificGravity', label: 'Specific Gravity', spec: '0.880-0.892', unit: '' },
      { id: 'opticalRotation', label: 'Optical Rotation', spec: '-10 to -5', unit: '°' },
      { id: 'refractiveIndex', label: 'Refractive Index', spec: '1.458-1.462', unit: '' },
      { id: 'linaloolContent', label: 'Linalool Content', spec: '25-38', unit: '%' },
    ],
  },
  // Add more product specifications here
];

export const getSpecifications = (productName: string, analysisOrCategory: AnalysisType | ProductCategory | undefined) => {
    if (!analysisOrCategory) return [];
    const spec = productSpecifications.find(p => p.productName === productName && p.analysisType === analysisOrCategory);
    return spec?.parameters || [];
}
