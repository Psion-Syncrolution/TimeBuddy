import { describe, it, expect, beforeEach } from 'vitest';
import { terminRepository } from '@/lib/repositories/termin-repository';
import prisma from '@/lib/prisma';
import { resetDatabase, createUser } from '@tests/shared/helpers';

describe('terminRepository', () => {
  let userId: string;
  let otherUserId: string;

  beforeEach(async () => {
    await resetDatabase();
    const user = await createUser('user@test.local');
    const other = await createUser('other@test.local');
    userId = user.id;
    otherUserId = other.id;
  });

  describe('create', () => {
    it('erzeugt einen Termin und serialisiert datum als YYYY-MM-DD', async () => {
      const termin = await terminRepository.create(userId, {
        titel: 'Team-Meeting',
        datum: '2026-09-15',
        uhrzeit: '10:30',
      });

      expect(termin.id).toBeTruthy();
      expect(termin.titel).toBe('Team-Meeting');
      expect(termin.datum).toBe('2026-09-15');
      expect(termin.uhrzeit).toBe('10:30');
      expect(termin.beschreibung).toBeNull(); // Default ohne Beschreibung
      expect(termin.userId).toBe(userId);
    });

    it('speichert eine optionale Beschreibung', async () => {
      const termin = await terminRepository.create(userId, {
        titel: 'Doktor',
        datum: '2026-10-01',
        uhrzeit: '08:00',
        beschreibung: 'Blutdruck messen lassen',
      });

      expect(termin.beschreibung).toBe('Blutdruck messen lassen');
    });
  });

  describe('getAll', () => {
    it('liefert nur die Termine des eigenen Users, aufsteigend nach Datum', async () => {
      await terminRepository.create(userId, { titel: 'Spaeter', datum: '2026-09-20', uhrzeit: '09:00' });
      await terminRepository.create(userId, { titel: 'Frueher', datum: '2026-09-10', uhrzeit: '09:00' });
      await terminRepository.create(otherUserId, { titel: 'Fremd', datum: '2026-09-15', uhrzeit: '09:00' });

      const termine = await terminRepository.getAll(userId);

      expect(termine).toHaveLength(2);
      expect(termine.map((t) => t.titel)).toEqual(['Frueher', 'Spaeter']);
    });

    it('liefert ein leeres Array ohne Termine', async () => {
      const termine = await terminRepository.getAll(userId);
      expect(termine).toEqual([]);
    });
  });

  describe('getById', () => {
    it('liefert den Termin bei eigener ID', async () => {
      const created = await terminRepository.create(userId, {
        titel: 'Eigen',
        datum: '2026-09-15',
        uhrzeit: '12:00',
      });

      const found = await terminRepository.getById(created.id, userId);
      expect(found?.titel).toBe('Eigen');
    });

    it('liefert null bei fremdem Termin (Isolation)', async () => {
      const created = await terminRepository.create(otherUserId, {
        titel: 'Fremd',
        datum: '2026-09-15',
        uhrzeit: '12:00',
      });

      const found = await terminRepository.getById(created.id, userId);
      expect(found).toBeNull();
    });

    it('liefert null bei unbekannter ID', async () => {
      const found = await terminRepository.getById('unbekannt', userId);
      expect(found).toBeNull();
    });
  });

  describe('getByDateRange', () => {
    it('filtert Termine innerhalb des Datumsbereichs (inkl. Grenzen)', async () => {
      await terminRepository.create(userId, { titel: 'Vor Bereich', datum: '2026-09-01', uhrzeit: '09:00' });
      await terminRepository.create(userId, { titel: 'Im Bereich', datum: '2026-09-15', uhrzeit: '09:00' });
      await terminRepository.create(userId, { titel: 'Rand unten', datum: '2026-09-10', uhrzeit: '09:00' });
      await terminRepository.create(userId, { titel: 'Rand oben', datum: '2026-09-20', uhrzeit: '09:00' });
      await terminRepository.create(userId, { titel: 'Nach Bereich', datum: '2026-10-05', uhrzeit: '09:00' });

      const termine = await terminRepository.getByDateRange(userId, '2026-09-10', '2026-09-20');

      expect(termine.map((t) => t.titel)).toEqual(['Rand unten', 'Im Bereich', 'Rand oben']);
    });

    it('ignoriert Termine anderer User im selben Zeitraum', async () => {
      await terminRepository.create(otherUserId, { titel: 'Fremd', datum: '2026-09-15', uhrzeit: '09:00' });

      const termine = await terminRepository.getByDateRange(userId, '2026-09-01', '2026-09-30');
      expect(termine).toEqual([]);
    });
  });

  describe('update', () => {
    it('aktualisiert einzelne Felder und laesst andere unveraendert', async () => {
      const created = await terminRepository.create(userId, {
        titel: 'Alt',
        datum: '2026-09-15',
        uhrzeit: '10:00',
        beschreibung: 'alte Beschreibung',
      });

      const updated = await terminRepository.update(created.id, userId, { titel: 'Neu' });

      expect(updated?.titel).toBe('Neu');
      expect(updated?.datum).toBe('2026-09-15'); // unveraendert
      expect(updated?.uhrzeit).toBe('10:00'); // unveraendert
      expect(updated?.beschreibung).toBe('alte Beschreibung'); // unveraendert
    });

    it('aktualisiert datum, uhrzeit und beschreibung', async () => {
      const created = await terminRepository.create(userId, {
        titel: 'Termin',
        datum: '2026-09-15',
        uhrzeit: '10:00',
      });

      const updated = await terminRepository.update(created.id, userId, {
        datum: '2026-11-02',
        uhrzeit: '14:30',
        beschreibung: 'neu',
      });

      expect(updated?.datum).toBe('2026-11-02');
      expect(updated?.uhrzeit).toBe('14:30');
      expect(updated?.beschreibung).toBe('neu');
    });

    it('behaelt die bestehende Beschreibung, wenn null uebergeben wird', async () => {
      const created = await terminRepository.create(userId, {
        titel: 'Termin',
        datum: '2026-09-15',
        uhrzeit: '10:00',
        beschreibung: 'wichtig',
      });

      const updated = await terminRepository.update(created.id, userId, {
        titel: 'Termin 2',
        beschreibung: null,
      });

      expect(updated?.titel).toBe('Termin 2');
      expect(updated?.beschreibung).toBe('wichtig'); // ?? existing.beschreibung
    });

    it('liefert null bei fremdem oder unbekanntem Termin', async () => {
      const created = await terminRepository.create(otherUserId, {
        titel: 'Fremd',
        datum: '2026-09-15',
        uhrzeit: '10:00',
      });

      expect(await terminRepository.update(created.id, userId, { titel: 'Hack' })).toBeNull();
      expect(await terminRepository.update('unbekannt', userId, { titel: 'Hack' })).toBeNull();
    });
  });

  describe('delete', () => {
    it('loescht einen eigenen Termin und liefert true', async () => {
      const created = await terminRepository.create(userId, {
        titel: 'Loeschbar',
        datum: '2026-09-15',
        uhrzeit: '10:00',
      });

      expect(await terminRepository.delete(created.id, userId)).toBe(true);
      expect(await terminRepository.getById(created.id, userId)).toBeNull();
    });

    it('liefert false bei fremdem oder unbekanntem Termin', async () => {
      const created = await terminRepository.create(otherUserId, {
        titel: 'Fremd',
        datum: '2026-09-15',
        uhrzeit: '10:00',
      });

      expect(await terminRepository.delete(created.id, userId)).toBe(false);
      expect(await terminRepository.delete('unbekannt', userId)).toBe(false);
    });
  });

  describe('getStatistik', () => {
    it('zaehlt Termine pro Datum (YYYY-MM-DD)', async () => {
      await terminRepository.create(userId, { titel: 'A1', datum: '2026-09-15', uhrzeit: '08:00' });
      await terminRepository.create(userId, { titel: 'A2', datum: '2026-09-15', uhrzeit: '12:00' });
      await terminRepository.create(userId, { titel: 'B1', datum: '2026-09-16', uhrzeit: '09:00' });
      await terminRepository.create(otherUserId, { titel: 'Fremd', datum: '2026-09-15', uhrzeit: '08:00' });

      const statistik = await terminRepository.getStatistik(userId);

      expect(statistik).toEqual({
        '2026-09-15': 2,
        '2026-09-16': 1,
      });
    });

    it('liefert ein leeres Record ohne Termine', async () => {
      const statistik = await terminRepository.getStatistik(userId);
      expect(statistik).toEqual({});
    });
  });

  describe('Kaskade', () => {
    it('loescht die Termine eines Users beim Loeschen des Users (FK ON DELETE CASCADE)', async () => {
      const created = await terminRepository.create(userId, {
        titel: 'Mit User verknuepft',
        datum: '2026-09-15',
        uhrzeit: '10:00',
      });

      await prisma.user.delete({ where: { id: userId } });

      expect(await terminRepository.getById(created.id, userId)).toBeNull();
    });
  });
});
