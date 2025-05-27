// Summarize product reviews using AI to identify common themes and sentiments.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeProductReviewsInputSchema = z.object({
  productReviews: z
    .string()
    .describe('A list of customer reviews for a product.'),
});

export type SummarizeProductReviewsInput =
  z.infer<typeof SummarizeProductReviewsInputSchema>;

const SummarizeProductReviewsOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A summary of the customer reviews, highlighting common themes and sentiments.'
    ),
});

export type SummarizeProductReviewsOutput =
  z.infer<typeof SummarizeProductReviewsOutputSchema>;

export async function summarizeProductReviews(
  input: SummarizeProductReviewsInput
): Promise<SummarizeProductReviewsOutput> {
  return summarizeProductReviewsFlow(input);
}

const summarizeProductReviewsPrompt = ai.definePrompt({
  name: 'summarizeProductReviewsPrompt',
  input: {schema: SummarizeProductReviewsInputSchema},
  output: {schema: SummarizeProductReviewsOutputSchema},
  prompt: `You are an AI assistant helping a store administrator understand customer feedback about their products.

  Please summarize the following product reviews, highlighting common themes and sentiments:

  {{{productReviews}}}
  `,
});

const summarizeProductReviewsFlow = ai.defineFlow(
  {
    name: 'summarizeProductReviewsFlow',
    inputSchema: SummarizeProductReviewsInputSchema,
    outputSchema: SummarizeProductReviewsOutputSchema,
  },
  async input => {
    const {output} = await summarizeProductReviewsPrompt(input);
    return output!;
  }
);
