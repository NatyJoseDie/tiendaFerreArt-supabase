import React from 'react';

interface Product {
  stock: number;
}

interface StatCardProps {
  title: string;
  value: number | string;
  description: string;
  icon: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description, icon }) => (
  <div className="stat bg-base-100 shadow-lg rounded-lg">
    <div className="stat-figure text-primary text-3xl">{icon}</div>
    <div className="stat-title">{title}</div>
    <div className="stat-value text-primary">{value}</div>
    <div className="stat-desc">{description}</div>
  </div>
);

interface StatsHeaderProps {
  products: Product[];
}

const StatsHeader: React.FC<StatsHeaderProps> = ({ products }) => {
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.stock <= 5).length;
  const categoriesCount = new Set(products.map((p: any) => p.categoria)).size;

  return (
    <div className="stats stats-vertical lg:stats-horizontal shadow w-full mb-8">
      <StatCard 
        title="Productos Activos"
        value={totalProducts}
        description="Total de productos en la lista"
        icon="📦"
      />
      <StatCard
        title="Alertas de Stock"
        value={lowStockProducts}
        description="Productos con 5 o menos unidades"
        icon="⚠️"
      />
      <StatCard
        title="Categorías Diferentes"
        value={categoriesCount}
        description="Total de categorías de productos"
        icon="🏷️"
      />
    </div>
  );
};

export default StatsHeader;
