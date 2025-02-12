import server from "@/config/axios";
import { AxiosError } from "axios";

export const createUser = async (userData: any) => {
  try {
    const response = await server.post("/user/create", userData);
    return response.data;
  } catch (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }
};

export const getUserById = async (userId: string) => {
  try {
    const response = await server.get(`/user/read/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching user: ${error.message}`);
  }
};

export const getAllUsers = async () => {
  try {
    const response = await server.get("/user/read");
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching users: ${error.message}`);
  }
};

export const updateUserById = async (userId: string, updateData: any) => {
  try {

    const response = await server.put(`/user/update/${userId}`, updateData);
    return response.data;
  } catch (error) {
    throw new Error(`Error updating user: ${error.message}`);
  }
};

export const deleteUserById = async (userId: string) => {
  try {
    await server.delete(`/user/delete/${userId}`);
  } catch (error) {
    throw new Error(`Error deleting user: ${error.message}`);
  }
};
