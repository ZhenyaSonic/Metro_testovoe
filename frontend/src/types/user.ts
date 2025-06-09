export interface UserBase {
    id: number;
    full_name: string;
    email: string;
  }
  
  export interface User extends UserBase {
    address?: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface UserCreate {
    full_name: string;
    email: string;
    address?: string;
  }
