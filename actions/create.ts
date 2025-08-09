"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

const DEFAULT_USER = {
  name: "Julius Biascan",
  email: "juliusbiascan.me@gmail.com",
  password: "jlzk21dev",
};

export const createDefaultAccount = async () => {
  const hashedPassword = await bcrypt.hash(DEFAULT_USER.password, 10);
  await db.user.create({
    data: {
      name: DEFAULT_USER.name,
      email: DEFAULT_USER.email,
      password: hashedPassword,
      emailVerified: new Date(),
    },
  });
}