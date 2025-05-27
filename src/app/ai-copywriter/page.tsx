'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { generateProductDescription, type GenerateProductDescriptionInput, type GenerateProductDescriptionOutput } from '@/ai/flows/generate-product-description';
import { Loader2, Sparkles, Copy } from 'lucide-react';

const formSchema = z.object({
  productName: z.string().min(3, { message: "Product name must be at least 3 characters." }).max(100),
  productDetails: z.string().min(10, { message: "Product details must be at least 10 characters." }).max(1000),
  targetAudience: z.string().min(3, { message: "Target audience must be at least 3 characters." }).max(200),
  keyFeatures: z.string().min(10, { message: "Key features must be at least 10 characters." }).max(500),
});

type FormData = z.infer<typeof formSchema>;

export default function AiCopywriterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GenerateProductDescriptionOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: '',
      productDetails: '',
      targetAudience: '',
      keyFeatures: '',
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    setGeneratedContent(null);
    try {
      const result = await generateProductDescription(data as GenerateProductDescriptionInput);
      setGeneratedContent(result);
      toast({
        title: "Success!",
        description: "Product copy generated successfully.",
      });
    } catch (error) {
      console.error("Error generating product description:", error);
      toast({
        title: "Error",
        description: "Failed to generate product copy. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to clipboard!",
        description: `${fieldName} has been copied.`,
      });
    }).catch(err => {
      console.error('Failed to copy: ', err);
      toast({
        title: "Copy Failed",
        description: "Could not copy to clipboard.",
        variant: "destructive",
      });
    });
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="AI Product Copywriter"
        description="Generate compelling product descriptions and summaries with the power of AI. Fill in the details below to get started."
      />

      <Card className="shadow-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
              <CardDescription>Provide the necessary details for the AI to generate your product copy.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="productName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., VisionPro Smartwatch" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="productDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Details</FormLabel>
                    <FormControl>
                      <Textarea rows={4} placeholder="Describe the product, including materials, dimensions, main functions, etc." {...field} />
                    </FormControl>
                    <FormDescription>Be specific for better results.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="targetAudience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Audience</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Tech-savvy professionals, fitness enthusiasts" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="keyFeatures"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Key Features & Benefits</FormLabel>
                    <FormControl>
                      <Textarea rows={3} placeholder="List the main selling points and what makes the product special. e.g., Long battery life, AMOLED display, waterproof" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} size="lg">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Generate Copy
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {isLoading && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Loader2 className="mr-2 h-5 w-5 animate-spin text-primary" />
              Generating...
            </CardTitle>
            <CardDescription>Our AI is crafting your product copy. Please wait a moment.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-2">
                <Label className="text-muted-foreground">Product Description</Label>
                <div className="p-4 border rounded-md bg-muted min-h-[100px] animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Product Summary</Label>
                <div className="p-4 border rounded-md bg-muted min-h-[50px] animate-pulse"></div>
              </div>
          </CardContent>
        </Card>
      )}

      {generatedContent && !isLoading && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-green-600">
              <Sparkles className="mr-2 h-5 w-5" />
              Generated Content
            </CardTitle>
            <CardDescription>Here is the AI-generated copy for your product. You can copy it and use it as needed.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-1">
                <Label htmlFor="generatedDescription" className="text-lg font-semibold">Product Description</Label>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(generatedContent.productDescription, "Product Description")}>
                  <Copy className="mr-2 h-4 w-4" /> Copy
                </Button>
              </div>
              <Textarea id="generatedDescription" value={generatedContent.productDescription} readOnly rows={8} className="bg-background focus-visible:ring-1" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <Label htmlFor="generatedSummary" className="text-lg font-semibold">Product Summary</Label>
                 <Button variant="ghost" size="sm" onClick={() => copyToClipboard(generatedContent.productSummary, "Product Summary")}>
                  <Copy className="mr-2 h-4 w-4" /> Copy
                </Button>
              </div>
              <Textarea id="generatedSummary" value={generatedContent.productSummary} readOnly rows={4} className="bg-background focus-visible:ring-1" />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
