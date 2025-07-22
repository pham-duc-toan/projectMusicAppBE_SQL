export interface ISinger {
  id: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  fullName: string;
  avatar: string;
  status: 'active' | 'inactive';
  slug: string;
  deleted: boolean;
  deletedAt: string | null;
}
