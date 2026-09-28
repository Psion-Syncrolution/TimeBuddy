import { describe, it, expect, beforeEach } from 'vitest';
import { erinnerungRepository } from '@/lib/repositories/erinnerung-repository';
import { terminRepository } from '@/lib/repositories/termin-repository';
import prisma from '@/lib/prisma';
import { resetDatabase, createUser } from '@tests/shared/helpers';

describe('erinnerungRepository', () => {
  let userId: string;
  let otherUserId: string;
  let terminId: string;
  let otherTerminId: string;

  beforeEach(async () => {
    await resetDatabase();
    const user = await createUser('user@test.local');
    const other = await createUser('other@test.local');
    userId = user.id;
    otherUserId = other.id;

    const termin = await terminRepository.create(userId, {
      titel: 'Mein Termin',
      datum: '2026-09-15',
      uhrzeit: '10:00',
    });
    const otherTermin = await terminRepository.create(otherUserId, {
      titel: 'Fremder Termin',
      datum: '2026-09-16',
      uhrzeit: '11:00',
    });
    terminId = termin.id;
    otherTerminId = otherTermin.id;
  });

  describe('create', () => {
    it('erzeugt eine Erinnerung inkl. Termin-Referenz', async () => {
      const erinnerung = await erinnerungRepository.create(userId, {
        terminId,
        erinnerung: 'Vorbereitung nicht vergessen',
        datum: '2026-09-15',
        uhrzeit: '09:00',
      });

      expect(erinnerung.id).toBeTruthy();
      expect(erinnerung.terminId).toBe(terminId);
      expect(erinnerung.erinnerung).toBe('Vorbereitung nicht vergessen');
      expect(erinnerung.datum).toBe('2026-09-15');
      expect(erinnerung.uhrzeit).toBe('09:00');
      expect(erinnerung.beschreibung).toBeNull(); // Default ohne Beschreibung
      expect(erinnerung.userId).toBe(userId);
      expect(erinnerung.termin).toEqual({ id: terminId, titel: 'Mein Termin' });
    });

    it('speichert eine optionale Beschreibung', async () => {
      const erinnerung = await erinnerungRepository.create(userId, {
        terminId,
        erinnerung: 'Kurz erinnern',
        datum: '2026-09-15',
        uhrzeit: '09:30',
        beschreibung: 'Details hier',
      });

      expect(erinnerung.beschreibung).toBe('Details hier');
    });
  });

  describe('getAll', () => {
    it('liefert nur die Erinnerungen des eigenen Users, aufsteigend nach Datum', async () => {
      await erinnerungRepository.create(userId, {
        terminId,
        erinnerung: 'Spaeter',
        datum: '2026-09-18',
        uhrzeit: '09:00',
      });
      await erinnerungRepository.create(userId, {
        terminId,
        erinnerung: 'Frueher',
        datum: '2026-09-14',
        uhrzeit: '09:00',
      });
      await erinnerungRepository.create(otherUserId, {
        terminId: otherTerminId,
        erinnerung: 'Fremd',
        datum: '2026-09-15',
        uhrzeit: '09:00',
      });

      const erinnerungen = await erinnerungRepository.getAll(userId);

      expect(erinnerungen).toHaveLength(2);
      expect(erinnerungen.map((e) => e.erinnerung)).toEqual(['Frueher', 'Spaeter']);
    });

    it('liefert ein leeres Array ohne Erinnerungen', async () => {
      const erinnerungen = await erinnerungRepository.getAll(userId);
      expect(erinnerungen).toEqual([]);
    });
  });

  describe('getById', () => {
    it('liefert die Erinnerung inkl. Termin bei eigener ID', async () => {
      const created = await erinnerungRepository.create(userId, {
        terminId,
        erinnerung: 'Eigen',
        datum: '2026-09-15',
        uhrzeit: '09:00',
      });

      const found = await erinnerungRepository.getById(created.id, userId);
      expect(found?.erinnerung).toBe('Eigen');
      expect(found?.termin?.titel).toBe('Mein Termin');
    });

    it('liefert null bei fremder Erinnerung (Isolation)', async () => {
      const created = await erinnerungRepository.create(otherUserId, {
        terminId: otherTerminId,
        erinnerung: 'Fremd',
        datum: '2026-09-15',
        uhrzeit: '09:00',
      });

      const found = await erinnerungRepository.getById(created.id, userId);
      expect(found).toBeNull();
    });

    it('liefert null bei unbekannter ID', async () => {
      const found = await erinnerungRepository.getById('unbekannt', userId);
      expect(found).toBeNull();
    });
  });

  describe('update', () => {
    it('aktualisiert einzelne Felder und laesst andere unveraendert', async () => {
      const created = await erinnerungRepository.create(userId, {
        terminId,
        erinnerung: 'Alt',
        datum: '2026-09-15',
        uhrzeit: '09:00',
        beschreibung: 'alte Beschreibung',
      });

      const updated = await erinnerungRepository.update(created.id, userId, {
        erinnerung: 'Neu',
      });

      expect(updated?.erinnerung).toBe('Neu');
      expect(updated?.datum).toBe('2026-09-15'); // unveraendert
      expect(updated?.uhrzeit).toBe('09:00'); // unveraendert
      expect(updated?.beschreibung).toBe('alte Beschreibung'); // unveraendert
    });

    it('verknuepft die Erinnerung mit einem anderen Termin (terminId)', async () => {
      const secondTermin = await terminRepository.create(userId, {
        titel: 'Zweiter Termin',
        datum: '2026-10-01',
        uhrzeit: '15:00',
      });
      const created = await erinnerungRepository.create(userId, {
        terminId,
        erinnerung: 'Umziehen',
        datum: '2026-09-15',
        uhrzeit: '09:00',
      });

      const updated = await erinnerungRepository.update(created.id, userId, {
        terminId: secondTermin.id,
      });

      expect(updated?.terminId).toBe(secondTermin.id);
      expect(updated?.termin?.titel).toBe('Zweiter Termin');
    });

    it('behaelt die bestehende Beschreibung, wenn null uebergeben wird', async () => {
      const created = await erinnerungRepository.create(userId, {
        terminId,
        erinnerung: 'Termin',
        datum: '2026-09-15',
        uhrzeit: '09:00',
        beschreibung: 'wichtig',
      });

      const updated = await erinnerungRepository.update(created.id, userId, {
        erinnerung: 'Termin 2',
        beschreibung: null,
      });

      expect(updated?.erinnerung).toBe('Termin 2');
      expect(updated?.beschreibung).toBe('wichtig'); // ?? existing.beschreibung
    });

    it('aktualisiert alle Felder auf einmal (inkl. datum und uhrzeit)', async () => {
      const created = await erinnerungRepository.create(userId, {
        terminId,
        erinnerung: 'Alt',
        datum: '2026-09-15',
        uhrzeit: '09:00',
      });

      const updated = await erinnerungRepository.update(created.id, userId, {
        erinnerung: 'Neu',
        datum: '2026-12-01',
        uhrzeit: '18:45',
        beschreibung: 'komplett ueberschrieben',
      });

      expect(updated?.erinnerung).toBe('Neu');
      expect(updated?.datum).toBe('2026-12-01');
      expect(updated?.uhrzeit).toBe('18:45');
      expect(updated?.beschreibung).toBe('komplett ueberschrieben');
    });

    it('liefert null bei fremder oder unbekannter Erinnerung', async () => {
      const created = await erinnerungRepository.create(otherUserId, {
        terminId: otherTerminId,
        erinnerung: 'Fremd',
        datum: '2026-09-15',
        uhrzeit: '09:00',
      });

      expect(await erinnerungRepository.update(created.id, userId, { erinnerung: 'Hack' })).toBeNull();
      expect(await erinnerungRepository.update('unbekannt', userId, { erinnerung: 'Hack' })).toBeNull();
    });
  });

  describe('delete', () => {
    it('loescht eine eigene Erinnerung und liefert true', async () => {
      const created = await erinnerungRepository.create(userId, {
        terminId,
        erinnerung: 'Loeschbar',
        datum: '2026-09-15',
        uhrzeit: '09:00',
      });

      expect(await erinnerungRepository.delete(created.id, userId)).toBe(true);
      expect(await erinnerungRepository.getById(created.id, userId)).toBeNull();
    });

    it('liefert false bei fremder oder unbekannter Erinnerung', async () => {
      const created = await erinnerungRepository.create(otherUserId, {
        terminId: otherTerminId,
        erinnerung: 'Fremd',
        datum: '2026-09-15',
        uhrzeit: '09:00',
      });

      expect(await erinnerungRepository.delete(created.id, userId)).toBe(false);
      expect(await erinnerungRepository.delete('unbekannt', userId)).toBe(false);
    });
  });

  describe('Kaskade', () => {
    it('loescht Erinnerungen beim Loeschen des zugehoerigen Termins (FK ON DELETE CASCADE)', async () => {
      const created = await erinnerungRepository.create(userId, {
        terminId,
        erinnerung: 'Mit Termin verknuepft',
        datum: '2026-09-15',
        uhrzeit: '09:00',
      });

      await prisma.termin.delete({ where: { id: terminId } });

      expect(await erinnerungRepository.getById(created.id, userId)).toBeNull();
    });
  });
});
