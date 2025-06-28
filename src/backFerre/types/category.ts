export interface Category {
  id: number;
  name: string;
  created_at: string;
  image: string | null;
}

export interface CreateCategoryDTO extends Omit<Category, 'id' | 'created_at'> {}

export interface UpdateCategoryDTO extends Partial<CreateCategoryDTO> {}
