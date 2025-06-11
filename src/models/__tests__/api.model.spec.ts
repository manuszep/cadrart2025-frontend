import { ICadrartApiEntity } from '@manuszep/cadrart2025-common';

import { CadrartEntity } from '../api.model';

// Test interface extending the base API entity
interface ITestEntity extends ICadrartApiEntity {
  name: string;
  value: number;
  active: boolean;
}

// Concrete implementation of the abstract class for testing
class TestEntity extends CadrartEntity<ITestEntity> {
  // No need to add anything as we're just testing the base class functionality
}

describe('CadrartEntity', () => {
  describe('constructor', () => {
    it('should initialize with empty data', () => {
      const entity = new TestEntity();
      expect(entity.getRawValue()).toEqual({});
    });

    it('should initialize with provided data', () => {
      const testData = { id: 1, name: 'Test Entity', value: 42, active: true };
      const entity = new TestEntity(testData);
      expect(entity.getRawValue()).toEqual(testData);
    });

    it('should handle null data and initialize with empty object', () => {
      const entity = new TestEntity();
      expect(entity.getRawValue()).toEqual({});
    });
  });

  describe('id getter', () => {
    it('should return the id when it exists', () => {
      const entity = new TestEntity({ id: 123 });
      expect(entity.id).toBe(123);
    });

    it('should return undefined when id does not exist', () => {
      const entity = new TestEntity();
      expect(entity.id).toBeUndefined();
    });
  });

  describe('getLabelForColumn', () => {
    it('should return the string value of a property', () => {
      const entity = new TestEntity({
        name: 'Test Entity',
        value: 42,
        active: true
      });
      expect(entity.getLabelForColumn('name')).toBe('Test Entity');
      expect(entity.getLabelForColumn('value')).toBe('42');
      expect(entity.getLabelForColumn('active')).toBe('true');
    });

    it('should return an empty string for undefined properties', () => {
      const entity = new TestEntity({});
      expect(entity.getLabelForColumn('name')).toBe('');
    });
  });

  describe('setValues', () => {
    it('should replace all values with new data', () => {
      const entity = new TestEntity({ id: 1, name: 'Original', value: 10, active: false });

      const newData = { id: 2, name: 'Updated', value: 20, active: true };
      entity.setValues(newData);

      expect(entity.getRawValue()).toEqual(newData);
    });
  });

  describe('updateValues', () => {
    it('should merge new values with existing data', () => {
      const entity = new TestEntity({ id: 1, name: 'Original', value: 10, active: false });

      entity.updateValues({ name: 'Updated', value: 20 });

      expect(entity.getRawValue()).toEqual({
        id: 1,
        name: 'Updated',
        value: 20,
        active: false
      });
    });

    it('should add new properties that did not exist before', () => {
      const entity = new TestEntity({ id: 1 });

      entity.updateValues({ name: 'New Name', value: 99 });

      expect(entity.getRawValue()).toEqual({
        id: 1,
        name: 'New Name',
        value: 99
      });
    });
  });

  describe('getRawValue', () => {
    it('should return the internal data object', () => {
      const testData = { id: 1, name: 'Test Entity', value: 42, active: true };
      const entity = new TestEntity(testData);

      const result = entity.getRawValue();

      expect(result).toBe(testData); // Same reference
      expect(result).toEqual(testData); // Same content
    });
  });
});
