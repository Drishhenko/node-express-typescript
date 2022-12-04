import { Request, Response, NextFunction } from "express";

import {
  createUser,
  deleteUserById,
  getUserByEmail,
  patchUser,
  getAllUsers,
  saveUserPdf,
} from "../services/userServices";
import jwt from "jsonwebtoken";
import path from "path";
import { v4 } from "uuid";
import PDFDocument from "pdfkit";
import fs from "fs";
import { GenerateJwt } from "../types/userController.types";
import { UploadedFile } from "express-fileupload";

const generateJwt = (data: GenerateJwt) => {
  const { email, firstName, lastName } = data;
  const secretKey = process.env.SECRET_KEY as string;
  return jwt.sign({ email, firstName, lastName }, secretKey, {
    expiresIn: "24h",
  });
};

class UserController {
  async registration(req: Request, res: Response, next: NextFunction) {
    const { email, firstName, lastName } = req.body;
    if (!email || !firstName || !lastName) {
      return res.status(400).json({ message: "PLease, send all data" });
    }

    try {
      const condidate = await getUserByEmail(email);
      if (condidate) {
        return res
          .status(400)
          .json({ message: "User with this email already exists" });
      }
      const user = await createUser({ email, firstName, lastName });
      const tokenData = {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      };
      const token = generateJwt(tokenData);

      res.json({ user, token });
    } catch (err: any) {
      res.json(err.message);
    }
  }

  async authorization(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;
    try {
      const user = await getUserByEmail(email);
      if (!user) {
        return;
      }
      const tokenData = {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      };
      const token = generateJwt(tokenData);
      res.json(token);
    } catch (err: any) {
      res.json(err.message);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    const { email, firstName, lastName } = req.body;
    let image;
    if (req.files) {
      const file = req.files.file as UploadedFile;
      image = v4() + ".jpg";
      if (!fs.existsSync(`${__dirname}/../images`)) {
        fs.mkdirSync(`${__dirname}/../images`);
      }
      file.mv(path.resolve(__dirname, "..", "images", image));
    }

    const { id } = req.params;
    try {
      await patchUser({ id, email, firstName, lastName, image });
      res.json("updated");
    } catch (err: any) {
      res.json(err.message);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      await deleteUserById(id);
      res.json("deleted");
    } catch (err: any) {
      res.json(err.message);
    }
  }

  async getUser(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;
    try {
      const user = await getUserByEmail(email);
      res.json(user);
    } catch (err: any) {
      res.json(err.message);
    }
  }

  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await getAllUsers();
      res.json({ users });
    } catch (err: any) {
      res.json(err.message);
    }
  }

  async generatePdf(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;
    try {
      const user = await getUserByEmail(email);
      if (!user) {
        return;
      }
      const userFirstName = user.dataValues.firstName;
      const userLastName = user.dataValues.lastName;
      const userImage = user.dataValues.image;

      const pdf = new PDFDocument();
      const pdfName = v4() + ".pdf";
      pdf.pipe(fs.createWriteStream(pdfName));
      pdf.text(`${userFirstName} ${userLastName}`);
      pdf.image(`${__dirname}/../images/${userImage}`);
      pdf.end();
      await saveUserPdf({ email, pdf });
      res.json(true);
    } catch (err: any) {
      res.json(err.message);
    }
  }
}

const userController = new UserController();
export default userController;
