import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
export async function verifyStageKey(
  stageKey: string,
  username: string,
  password: string,
) {
  const expectedStageKey = process.env.STAGE_KEY;
  if (stageKey !== expectedStageKey) {
    return null;
  }
  let admin = await prisma.admin.findUnique({ where: { stageKey } });
  if (!admin) {
    const hashedPassword = await bcrypt.hash(password, 12);
    admin = await prisma.admin.create({
      data: { username, password: hashedPassword, stageKey },
    });
  } else {
    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      return null;
    }
  }
  return admin;
}
export async function getAdminByStageKey(stageKey: string) {
  return await prisma.admin.findUnique({ where: { stageKey } });
}