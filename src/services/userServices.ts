import User from "../models/userModel";
import { CreateUser, SaveUserPdf, PatchUser } from "../types/userService.types";

export const createUser = async (data: CreateUser) => {
  const { email, firstName, lastName, image } = data;
  const user = await User.create({ email, firstName, lastName, image });
  return user;
};

export const getUserByEmail = async (email: string) => {
  const user = await User.findOne({ where: { email } });
  return user;
};

export const getAllUsers = async () => {
  const users = await User.findAll();
  return users;
};

export const deleteUserById = async (id: string) => {
  await User.destroy({ where: { id } });
};

export const saveUserPdf = async (data: SaveUserPdf) => {
  const {email, pdf} = data
  const result = await User.update({ pdf }, { where: { email } });
  return result
};

export const patchUser = async (data: PatchUser) => {
  const {id, email, firstName, lastName, image} = data
  const user = await User.update(
    { email, firstName, lastName, image},
    { where: { id } }
  );
  return user;
};
