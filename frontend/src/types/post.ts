export interface Post {
    id: number;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface PostCreate {
    title: string;
    content?: string;
  }
