import prisma from '@/lib/prisma';
import { hash, compare } from 'bcryptjs';
import type { UserCreateInput } from '@/types/user';

export const userRepository = {
  async getByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  async getById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  async create(input: UserCreateInput) {
    const passwordHash = await hash(input.password, 12);
    return prisma.user.create({
      data: {
        email: input.email,
        passwordHash,
      },
    });
  },

  async verifyPassword(email: string, password: string) {
    const user = await this.getByEmail(email);
    if (!user) return null;

    const isValid = await compare(password, user.passwordHash);
    if (!isValid) return null;

    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    };
  },
};
