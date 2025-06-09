import { api } from './base';
import { Post, PostCreate } from '../types/post';

export const getPosts = async (): Promise<Post[]> => {
  const response = await api.get('/posts');
  return response.data;
};

export const getPost = async (id: number): Promise<Post> => {
  const response = await api.get(`/posts/${id}`);
  return response.data;
};

export const createPost = async (post: PostCreate): Promise<Post> => {
  const response = await api.post('/posts', post);
  return response.data;
};

export const updatePost = async (id: number, post: PostCreate): Promise<Post> => {
  const response = await api.put(`/posts/${id}`, post);
  return response.data;
};

export const deletePost = async (id: number): Promise<void> => {
  await api.delete(`/posts/${id}`);
};