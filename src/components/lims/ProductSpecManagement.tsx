
import { productSpecifications } from '@/lib/specifications';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

type SpecCategory = 'Vegetable Oil' | 'Essential Oil' | 'Raw Material' | 'By-Product';

const DynamicSpecForm = ({ category }: { category: SpecCategory | null }) => {
  if (!category) {
    return <p className="text-sm text-muted-foreground text-center py-4">Please select a category to see the specification form.</p>;
  }

  const commonFields = (
     <>
        <div className="grid grid-cols-2 gap-4">
            <div><Label>Product Name</Label><Input placeholder="e.g. Avocado Oil, Extra Virgin" /></div>
            <div><Label>Botanical Name</Label><Input placeholder="e.g. Persea gratissima" /></div>
            <div><Label>European INCI Name</Label><Input placeholder="e.g. Persea gratissima (Avocado) oil" /></div>
            <div><Label>CAS n°</Label><Input placeholder="e.g. 8024-32-6" /></div>
            <div><Label>EC/EINECS n°</Label><Input placeholder="e.g. 232-428-0" /></div>
            <div><Label>Shelf Life (months)</Label><Input type="number" placeholder="e.g. 24" /></div>
        </div>
        <div><Label>Description</Label><Textarea placeholder="e.g. Vegetable oil obtained from..." /></div>
     </>
  );

  const oilPhysicalTests = (
    <div>
        <h4 className="font-semibold text-foreground mb-3 mt-4">Physical Characteristics & Tests</h4>
        <div className="grid grid-cols-3 gap-4">
            <div><Label>Physical State</Label><Input placeholder="e.g. Clear Mobile Liquid" /></div>
            <div><Label>Colour</Label><Input placeholder="e.g. Green to light green" /></div>
            <div><Label>Odour</Label><Input placeholder="e.g. Characteristic of avocado oil" /></div>
            <div><Label>Relative Density (20°C)</Label><Input placeholder="e.g. 0.912 – 0.923" /></div>
            <div><Label>Refractive Index (20°C)</Label><Input placeholder="e.g. 1.460 – 1.470" /></div>
        </div>
    </div>
  );
  
  const vegOilChemicalParams = (
    <div>
        <h4 className="font-semibold text-foreground mb-3 mt-4">Chemical Parameters</h4>
        <div className="grid grid-cols-2 gap-4">
             <div><Label>Free Fatty Acid (FFA) %</Label><Input placeholder="e.g. ≤ 1.0" /></div>
            <div><Label>Peroxide value meqO2/kg</Label><Input placeholder="e.g. ≤ 4.0" /></div>
            <div><Label>Acid value (mg KOH/g)</Label><Input placeholder="e.g. ≤ 2.0" /></div>
            <div><Label>Saponification value</Label><Input placeholder="e.g. 175 – 200" /></div>
            <div><Label>Unsaponifiable matter (%)</Label><Input placeholder="e.g. ≤ 4.0" /></div>
            <div><Label>Iodine value g I/100g</Label><Input placeholder="e.g. 75 – 102" /></div>
        </div>
    </div>
  );

  switch (category) {
    case 'Vegetable Oil':
      return <div className="space-y-4">{commonFields}{oilPhysicalTests}{vegOilChemicalParams}</div>;
    case 'Essential Oil':
      return <div className="space-y-4">{commonFields}{oilPhysicalTests}</div>;
    case 'Raw Material':
       return (
        <div className="space-y-4">
             <div><Label>Product Name</Label><Input placeholder="e.g. Shea Nuts" /></div>
             <div className="grid grid-cols-3 gap-4">
                <div><Label>Colour</Label><Input placeholder="Brown nuts" /></div>
                <div><Label>Foreign Material %</Label><Input placeholder="≤2" /></div>
                <div><Label>% FFA</Label><Input placeholder="≤4" /></div>
                <div><Label>% Acid Value</Label><Input placeholder="≤8" /></div>
                <div><Label>% PV</Label><Input placeholder="≤5" /></div>
                <div><Label>Aflatoxin</Label><Input placeholder="≤10" /></div>
                <div><Label>% Oil Content</Label><Input placeholder="≥50%" /></div>
                <div><Label>% Moisture Content</Label><Input placeholder="4 - 7%" /></div>
             </div>
        </div>
       );
    default:
      return <p>This specification category is under development.</p>;
  }
};


export default function ProductSpecManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [specCategory, setSpecCategory] = useState<SpecCategory | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-headline text-foreground">Product & Specification Management</h2>
          <p className="text-muted-foreground">Manage products and their quality control test specifications.</p>
        </div>
         <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Specification
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Create New Product Specification</DialogTitle>
              </DialogHeader>
              <div className="py-4 space-y-4">
                 <div>
                    <Label>Select Specification Category</Label>
                    <Select onValueChange={(value: SpecCategory) => setSpecCategory(value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a category..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Vegetable Oil">Vegetable Oil</SelectItem>
                            <SelectItem value="Essential Oil">Essential Oil</SelectItem>
                            <SelectItem value="Raw Material">Raw Material</SelectItem>
                            <SelectItem value="By-Product">By-Product</SelectItem>
                        </SelectContent>
                    </Select>
                 </div>
                 <div className="max-h-[50vh] overflow-y-auto p-4 border rounded-md">
                   <DynamicSpecForm category={specCategory} />
                 </div>
              </div>
              <DialogFooter>
                 <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                 <Button>Save Specification</Button>
              </DialogFooter>
            </DialogContent>
         </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Specifications</CardTitle>
          <CardDescription>
            This table lists all products and their associated analysis types and parameters.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Analysis Type</TableHead>
                <TableHead>Test Parameters</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productSpecifications.map((spec, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{spec.productName}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{spec.analysisType}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {spec.parameters.map(param => (
                        <Badge key={param.id} variant="outline">
                          {param.label} ({param.spec} {param.unit})
                        </Badge>
                      ))}
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
