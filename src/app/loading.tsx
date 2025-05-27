import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/page-header";

export default function Loading() {
  return (
    <div className="space-y-12">
      <PageHeader 
        title={<Skeleton className="h-12 w-1/2" />} 
        description={<Skeleton className="h-6 w-3/4 mt-2" />} 
      />

      <section>
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-2 p-4 border rounded-lg">
              <Skeleton className="h-48 w-full rounded-md" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </section>

      <section className="p-8 rounded-lg shadow">
         <div className="text-center space-y-4">
          <Skeleton className="h-8 w-1/2 mx-auto" />
          <Skeleton className="h-4 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-2/3 mx-auto" />
          <Skeleton className="h-12 w-48 mx-auto mt-2" />
        </div>
      </section>
    </div>
  );
}
