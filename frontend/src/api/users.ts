import { api } from './base';
import { User, UserBase, UserCreate } from '../types/user';

export const getUsers = async (): Promise<UserBase[]> => {
  const response = await api.get('/users');
  return response.data;
};

export const getUserDetails = async (id: number): Promise<User> => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const createUser = async (user: UserCreate): Promise<User> => {
  const response = await api.post('/users', user);
  return response.data;
};

export const updateUser = async (id: number, user: UserCreate): Promise<User> => {
  const response = await api.put(`/users/${id}`, user);
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`/users/${id}`);
};