export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateProfileDTO extends Omit<Profile, 'id' | 'created_at' | 'updated_at'> {
  id?: string;
}

export interface UpdateProfileDTO extends Partial<Omit<CreateProfileDTO, 'id'>> {
  updated_at?: string;
}
