import { describe, it, expect } from 'vitest';
import catalogData from '../../data/catalog.json';

describe('Catalog Data Integrity', () => {
  describe('Structure', () => {
    it('has version field', () => {
      expect(catalogData.version).toBeDefined();
    });

    it('has generated_at field', () => {
      expect(catalogData.generated_at).toBeDefined();
    });

    it('has total_files field', () => {
      expect(catalogData.total_files).toBeDefined();
      expect(typeof catalogData.total_files).toBe('number');
    });

    it('has files array', () => {
      expect(Array.isArray(catalogData.files)).toBe(true);
    });

    it('has tier_distribution object', () => {
      expect(catalogData.tier_distribution).toBeDefined();
      expect(typeof catalogData.tier_distribution).toBe('object');
    });

    it('has categories array', () => {
      expect(Array.isArray(catalogData.categories)).toBe(true);
    });
  });

  describe('File Count', () => {
    it('total_files matches actual file count', () => {
      expect(catalogData.files.length).toBe(catalogData.total_files);
    });

    it('has exactly 70 lessons', () => {
      expect(catalogData.files.length).toBe(70);
    });

    it('tier distribution adds up correctly', () => {
      const { free, premium, pro } = catalogData.tier_distribution;
      expect(free + premium + pro).toBe(catalogData.total_files);
    });
  });

  describe('File Schema', () => {
    it('every file has required fields', () => {
      catalogData.files.forEach((file, index) => {
        expect(file.filename, `File ${index} missing filename`).toBeDefined();
        expect(file.title, `File ${index} missing title`).toBeDefined();
        expect(file.category, `File ${index} missing category`).toBeDefined();
        expect(file.difficulty, `File ${index} missing difficulty`).toBeDefined();
        expect(file.tier, `File ${index} missing tier`).toBeDefined();
        expect(file.techniques, `File ${index} missing techniques`).toBeDefined();
      });
    });

    it('every file has a description', () => {
      catalogData.files.forEach((file, index) => {
        expect(file.description, `File ${index} missing description`).toBeDefined();
        expect(file.description.length, `File ${index} has empty description`).toBeGreaterThan(0);
      });
    });

    it('techniques is always an array', () => {
      catalogData.files.forEach((file, index) => {
        expect(Array.isArray(file.techniques), `File ${index} techniques not array`).toBe(true);
        expect(file.techniques.length, `File ${index} has no techniques`).toBeGreaterThan(0);
      });
    });
  });

  describe('Valid Values', () => {
    const validDifficulties = ['beginner', 'intermediate', 'advanced'];
    const validTiers = ['free', 'premium', 'pro'];

    it('all difficulties are valid', () => {
      catalogData.files.forEach((file, index) => {
        expect(
          validDifficulties.includes(file.difficulty),
          `File ${index} has invalid difficulty: ${file.difficulty}`
        ).toBe(true);
      });
    });

    it('all tiers are valid', () => {
      catalogData.files.forEach((file, index) => {
        expect(
          validTiers.includes(file.tier),
          `File ${index} has invalid tier: ${file.tier}`
        ).toBe(true);
      });
    });

    it('all categories are in categories list', () => {
      catalogData.files.forEach((file, index) => {
        expect(
          catalogData.categories.includes(file.category),
          `File ${index} has unknown category: ${file.category}`
        ).toBe(true);
      });
    });
  });

  describe('Tier Distribution', () => {
    it('has 10 free lessons', () => {
      const freeCount = catalogData.files.filter(f => f.tier === 'free').length;
      expect(freeCount).toBe(10);
    });

    it('has 30 premium lessons', () => {
      const premiumCount = catalogData.files.filter(f => f.tier === 'premium').length;
      expect(premiumCount).toBe(30);
    });

    it('has 30 pro lessons', () => {
      const proCount = catalogData.files.filter(f => f.tier === 'pro').length;
      expect(proCount).toBe(30);
    });
  });

  describe('Difficulty Distribution', () => {
    it('has beginner lessons', () => {
      const beginnerCount = catalogData.files.filter(f => f.difficulty === 'beginner').length;
      expect(beginnerCount).toBeGreaterThan(0);
    });

    it('has intermediate lessons', () => {
      const intermediateCount = catalogData.files.filter(f => f.difficulty === 'intermediate').length;
      expect(intermediateCount).toBeGreaterThan(0);
    });

    it('has advanced lessons', () => {
      const advancedCount = catalogData.files.filter(f => f.difficulty === 'advanced').length;
      expect(advancedCount).toBeGreaterThan(0);
    });

    it('majority are intermediate (realistic distribution)', () => {
      const intermediateCount = catalogData.files.filter(f => f.difficulty === 'intermediate').length;
      expect(intermediateCount).toBeGreaterThan(catalogData.files.length / 2);
    });
  });

  describe('Category Coverage', () => {
    it('has scale lessons', () => {
      const count = catalogData.files.filter(f => f.category === 'scale').length;
      expect(count).toBeGreaterThan(0);
    });

    it('has arpeggio lessons', () => {
      const count = catalogData.files.filter(f => f.category === 'arpeggio').length;
      expect(count).toBeGreaterThan(0);
    });

    it('has pentatonic lessons', () => {
      const count = catalogData.files.filter(f => f.category === 'pentatonic').length;
      expect(count).toBeGreaterThan(0);
    });

    it('has economy picking lessons', () => {
      const count = catalogData.files.filter(f => f.category === 'economy').length;
      expect(count).toBeGreaterThan(0);
    });

    it('has legato lessons', () => {
      const count = catalogData.files.filter(f => f.category === 'legato').length;
      expect(count).toBeGreaterThan(0);
    });
  });

  describe('Filename Validity', () => {
    it('all filenames end with .gp or .gpx', () => {
      catalogData.files.forEach((file, index) => {
        const valid = file.filename.endsWith('.gp') || file.filename.endsWith('.gpx');
        expect(valid, `File ${index} has invalid extension: ${file.filename}`).toBe(true);
      });
    });

    it('no duplicate filenames', () => {
      const filenames = catalogData.files.map(f => f.filename);
      const uniqueFilenames = new Set(filenames);
      expect(uniqueFilenames.size).toBe(filenames.length);
    });
  });

  describe('Description Quality', () => {
    it('descriptions are meaningful length (>20 chars)', () => {
      catalogData.files.forEach((file, index) => {
        expect(
          file.description.length >= 20,
          `File ${index} description too short: "${file.description}"`
        ).toBe(true);
      });
    });

    it('descriptions dont just repeat title', () => {
      catalogData.files.forEach((file, index) => {
        expect(
          file.description !== file.title,
          `File ${index} description equals title`
        ).toBe(true);
      });
    });
  });
});
