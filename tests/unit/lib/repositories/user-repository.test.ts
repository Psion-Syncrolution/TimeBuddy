import { describe, it, expect, beforeEach } from 'vitest';
import { userRepository } from '@/lib/repositories/user-repository';
import prisma from '@/lib/prisma';
import { resetDatabase } from '@tests/shared/helpers';

describe('userRepository', () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  describe('getByEmail', () => {
    it('liefert den User bei existierender E-Mail', async () => {
      const created = await userRepository.create({
        email: 'anna@test.local',
        password: 'geheim12345',
      });

      const found = await userRepository.getByEmail('anna@test.local');

      expect(found).not.toBeNull();
      expect(found?.id).toBe(created.id);
      expect(found?.email).toBe('anna@test.local');
    });

    it('liefert null bei unbekannter E-Mail', async () => {
      const found = await userRepository.getByEmail('niemand@test.local');
      expect(found).toBeNull();
    });
  });

  describe('getById', () => {
    it('liefert den User bei bekannter ID', async () => {
      const created = await userRepository.create({
        email: 'berta@test.local',
        password: 'geheim12345',
      });

      const found = await userRepository.getById(created.id);

      expect(found?.email).toBe('berta@test.local');
    });

    it('liefert null bei unbekannter ID', async () => {
      const found = await userRepository.getById('nicht-existierende-id');
      expect(found).toBeNull();
    });
  });

  describe('create', () => {
    it('hash das Passwort (bcrypt) und persistiert email + passwordHash', async () => {
      const created = await userRepository.create({
        email: 'carla@test.local',
        password: 'geheim12345',
      });

      // Das Klartext-Passwort darf nirgends in der DB stehen.
      const raw = await prisma.user.findUniqueOrThrow({ where: { id: created.id } });
      expect(raw.passwordHash).not.toBe('geheim12345');
      expect(raw.passwordHash.startsWith('$2')).toBe(true); // bcrypt-Präfix
      expect(raw.email).toBe('carla@test.local');
      expect(created.createdAt).toBeInstanceOf(Date);
    });

    it('verweigert Duplikate (unique email)', async () => {
      await userRepository.create({ email: 'dup@test.local', password: 'geheim12345' });

      await expect(
        userRepository.create({ email: 'dup@test.local', password: 'anderes67890' }),
      ).rejects.toThrow();
    });
  });

  describe('verifyPassword', () => {
    it('liefert { id, email, createdAt } bei korrektem Passwort', async () => {
      const created = await userRepository.create({
        email: 'dora@test.local',
        password: 'geheim12345',
      });

      const verified = await userRepository.verifyPassword('dora@test.local', 'geheim12345');

      expect(verified).not.toBeNull();
      expect(verified?.id).toBe(created.id);
      expect(verified?.email).toBe('dora@test.local');
      // Der Hash darf nie im Ergebnis stehen.
      expect((verified as { passwordHash?: string })?.passwordHash).toBeUndefined();
    });

    it('liefert null bei falschem Passwort', async () => {
      await userRepository.create({ email: 'erik@test.local', password: 'geheim12345' });

      const verified = await userRepository.verifyPassword('erik@test.local', 'falsch12345');
      expect(verified).toBeNull();
    });

    it('liefert null bei unbekannter E-Mail', async () => {
      const verified = await userRepository.verifyPassword('ghost@test.local', 'geheim12345');
      expect(verified).toBeNull();
    });
  });
});
