/**
 * Gemeinsame Test-Helper fuer die Repository-Tests.
 */
import prisma from '@/lib/prisma';

/** Loescht alle Testdaten in FK-Reihenfolge (Erinnerungen -> Termine -> Users). */
export async function resetDatabase(): Promise<void> {
  await prisma.erinnerung.deleteMany();
  await prisma.termin.deleteMany();
  await prisma.user.deleteMany();
}

/** Erzeugt einen User mit bcrypt-gehashtem Passwort. */
export async function createUser(
  email = 'user@test.local',
  password = 'geheim12345',
) {
  const { userRepository } = await import('@/lib/repositories/user-repository');
  return userRepository.create({ email, password });
}
