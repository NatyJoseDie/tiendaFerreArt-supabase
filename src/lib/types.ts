import type { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type ProductReview = {
  id: string;
  author: string;
  rating: number; // 1-5 stars
  comment: string;
  date: string;
  avatarUrl?: string;
};

export type ProductSpecification = {
  key: string;
  value: string;
};

export type Product = {
  id: string;
  name: string;
  description: string; // Short description for card
  longDescription?: string; // Detailed description for product page
  price: number;
  category: string;
  images: string[]; // URLs to images
  stock: number;
  featured?: boolean;
  specifications?: ProductSpecification[];
  reviews?: ProductReview[];
  sku?: string;
  brand?: string;
  tags?: string[];
  currency?: string;
};
