'use server';
/**
 * @fileOverview AI-powered product description generator.
 *
 * - generateProductDescription - A function that generates product descriptions.
 * - GenerateProductDescriptionInput - The input type for the generateProductDescription function.
 * - GenerateProductDescriptionOutput - The return type for the generateProductDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProductDescriptionInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  productDetails: z.string().describe('Details about the product including features, materials, and dimensions.'),
  targetAudience: z.string().describe('The target audience for the product.'),
  keyFeatures: z.string().describe('Key features and benefits of the product.'),
});
export type GenerateProductDescriptionInput = z.infer<typeof GenerateProductDescriptionInputSchema>;

const GenerateProductDescriptionOutputSchema = z.object({
  productDescription: z.string().describe('A compelling and engaging product description.'),
  productSummary: z.string().describe('A brief summary of the product.'),
});
export type GenerateProductDescriptionOutput = z.infer<typeof GenerateProductDescriptionOutputSchema>;

export async function generateProductDescription(input: GenerateProductDescriptionInput): Promise<GenerateProductDescriptionOutput> {
  return generateProductDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProductDescriptionPrompt',
  input: {schema: GenerateProductDescriptionInputSchema},
  output: {schema: GenerateProductDescriptionOutputSchema},
  prompt: `You are an AI copywriter specializing in creating engaging product descriptions.

  Based on the information provided, write a compelling product description and a brief summary.

  Product Name: {{{productName}}}
  Product Details: {{{productDetails}}}
  Target Audience: {{{targetAudience}}}
  Key Features: {{{keyFeatures}}}

  Write a detailed productDescription that captures the essence of the product and appeals to the targetAudience.
  Also, provide a short productSummary.
  `,
});

const generateProductDescriptionFlow = ai.defineFlow(
  {
    name: 'generateProductDescriptionFlow',
    inputSchema: GenerateProductDescriptionInputSchema,
    outputSchema: GenerateProductDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
