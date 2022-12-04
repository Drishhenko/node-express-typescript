import { DataTypes, Model, BuildOptions } from "sequelize";
import sequelize from "../db/db";

export type UserAttributes = {
  id?: number;
  email: string;
  firstName: string;
  lastName: string;
  image?: string;
  pdf?: PDFKit.PDFDocument;
};

export interface UserModel extends Model<UserAttributes>, UserAttributes {}

export type UserStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): UserModel;
};

const User = <UserStatic>sequelize.define("User", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  email: { type: DataTypes.STRING, unique: true },
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING,
  image: { type: DataTypes.STRING, defaultValue: "Not added yet" },
  pdf: DataTypes.BLOB,
});

export default User;
