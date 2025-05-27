import { PageHeader } from '@/components/shared/page-header';
import { ProductCard } from '@/components/products/product-card';
import { getFeaturedProducts } from '@/data/mock-products';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  const featuredProducts = getFeaturedProducts();

  return (
    <div className="space-y-12">
      <PageHeader
        title="Welcome to ShopVision"
        description="Discover amazing products and generate compelling descriptions with our AI-powered tools. Your vision, our store."
      />

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold tracking-tight">Featured Products</h2>
          <Button variant="outline" asChild>
            <Link href="/products">
              View All Products <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No featured products available at the moment.</p>
        )}
      </section>

      <section className="bg-secondary/50 p-8 rounded-lg shadow">
         <div className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight mb-4">AI-Powered Product Copywriter</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Struggling with product descriptions? Let our AI assistant help you craft compelling copy that sells.
            Generate engaging descriptions and summaries in seconds.
          </p>
          <Button asChild size="lg">
            <Link href="/ai-copywriter">
              Try AI Copywriter <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
