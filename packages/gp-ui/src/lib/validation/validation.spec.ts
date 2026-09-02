import { GpValidators } from './validators';
import { GpFormDirective } from './form.directive';
import { GpEditableBase } from '../base/gp-editable-base';
import { Component, ViewChild } from '@angular/core';

// Test mock implementation of GpEditableBase
class TestInputControl extends GpEditableBase<string> {
  // Concrete implementation
}

describe('Validation & Side Effects Architecture', () => {
  describe('GpValidators', () => {
    it('required: should validate non-empty values', () => {
      const validator = GpValidators.required('Custom required message');
      expect(validator('', null as any)).toEqual({ rule: 'required', message: 'Custom required message' });
      expect(validator(null, null as any)).toEqual({ rule: 'required', message: 'Custom required message' });
      expect(validator(undefined, null as any)).toEqual({ rule: 'required', message: 'Custom required message' });
      expect(validator([], null as any)).toEqual({ rule: 'required', message: 'Custom required message' });
      expect(validator(false, null as any)).toEqual({ rule: 'required', message: 'Custom required message' });

      expect(validator('valid text', null as any)).toBeNull();
      expect(validator(0, null as any)).toBeNull();
      expect(validator(true, null as any)).toBeNull();
      expect(validator(['item'], null as any)).toBeNull();
    });

    it('email: should validate email formats', () => {
      const validator = GpValidators.email();
      expect(validator('not-an-email', null as any)).toEqual({
        rule: 'email',
        message: 'Please enter a valid email address'
      });
      expect(validator('missing@domain', null as any)).toEqual({
        rule: 'email',
        message: 'Please enter a valid email address'
      });

      expect(validator('user@example.com', null as any)).toBeNull();
      expect(validator('dev.user+test@sub.company.org', null as any)).toBeNull();
      expect(validator('', null as any)).toBeNull(); // Empty values handled by required
    });

    it('minLength & maxLength: should validate length constraints', () => {
      const minVal = GpValidators.minLength(5);
      expect(minVal('abc', null as any)).toEqual({
        rule: 'minLength',
        message: 'Must be at least 5 characters',
        params: { min: 5, actual: 3 }
      });
      expect(minVal('abcde', null as any)).toBeNull();

      const maxVal = GpValidators.maxLength(5);
      expect(maxVal('abcdef', null as any)).toEqual({
        rule: 'maxLength',
        message: 'Must be at most 5 characters',
        params: { max: 5, actual: 6 }
      });
      expect(maxVal('abc', null as any)).toBeNull();
    });

    it('min & max: should validate numeric constraints', () => {
      const min = GpValidators.min(18, 'Must be at least 18');
      expect(min(17, null as any)).toEqual({
        rule: 'min',
        message: 'Must be at least 18',
        params: { min: 18, actual: 17 }
      });
      expect(min(18, null as any)).toBeNull();
      expect(min(25, null as any)).toBeNull();

      const max = GpValidators.max(100);
      expect(max(105, null as any)).toEqual({
        rule: 'max',
        message: 'Value must not exceed 100',
        params: { max: 100, actual: 105 }
      });
      expect(max(100, null as any)).toBeNull();
    });

    it('pattern: should validate against regex pattern', () => {
      const zipValidator = GpValidators.pattern(/^\d{5}$/, 'Must be a 5-digit zip');
      expect(zipValidator('123', null as any)).toEqual({
        rule: 'pattern',
        message: 'Must be a 5-digit zip',
        params: { pattern: '/^\\d{5}$/' }
      });
      expect(zipValidator('abcde', null as any)).toEqual({
        rule: 'pattern',
        message: 'Must be a 5-digit zip',
        params: { pattern: '/^\\d{5}$/' }
      });
      expect(zipValidator('90210', null as any)).toBeNull();
    });

    it('match: should validate matching values', () => {
      let password = 'secretPassword123';
      const matchValidator = GpValidators.match(() => password, 'Passwords must match');
      expect(matchValidator('different', null as any)).toEqual({ rule: 'match', message: 'Passwords must match' });
      expect(matchValidator('secretPassword123', null as any)).toBeNull();
    });

    it('custom: should execute custom validation function', () => {
      const customValidator = GpValidators.custom(
        (val) => (val === 'admin' ? 'Username "admin" is reserved' : true),
        'reserved_user'
      );
      expect(customValidator('admin', null as any)).toEqual({
        rule: 'reserved_user',
        message: 'Username "admin" is reserved'
      });
      expect(customValidator('john_doe', null as any)).toBeNull();
    });

    it('async: should execute async validator promise', async () => {
      const asyncValidator = GpValidators.async(async (val) => {
        await new Promise((r) => setTimeout(r, 10));
        return val === 'taken@example.com' ? 'Email already registered' : true;
      }, 'unique_email');

      const res1 = await asyncValidator('taken@example.com', null as any);
      expect(res1).toEqual({ rule: 'unique_email', message: 'Email already registered' });

      const res2 = await asyncValidator('available@example.com', null as any);
      expect(res2).toBeNull();
    });

    it('compose: should evaluate multiple validators in sequence', async () => {
      const composed = GpValidators.compose(
        GpValidators.required('Required'),
        GpValidators.minLength(4, 'Min length 4')
      );

      expect(await composed('', null as any)).toEqual({ rule: 'required', message: 'Required' });
      expect(await composed('ab', null as any)).toEqual({
        rule: 'minLength',
        message: 'Min length 4',
        params: { min: 4, actual: 2 }
      });
      expect(await composed('valid', null as any)).toBeNull();
    });
  });

  describe('GpEditableBase Validation & Side Effects', () => {
    let ctrl: TestInputControl;

    beforeEach(() => {
      ctrl = new TestInputControl();
      ctrl.name = 'username';
    });

    it('should validate and set valid/invalid signals', async () => {
      ctrl.validators = [GpValidators.required(), GpValidators.minLength(3)];

      ctrl.value = 'a';
      ctrl.internalValue.set('a');
      const isValid = await ctrl.validate();

      expect(isValid).toBe(false);
      expect(ctrl.isValid()).toBe(false);
      expect(ctrl.isInvalid()).toBe(true);
      expect(ctrl.errors().length).toBe(1);
      expect(ctrl.firstError()).toBe('Must be at least 3 characters');

      ctrl.value = 'alex';
      ctrl.internalValue.set('alex');
      const isNowValid = await ctrl.validate();

      expect(isNowValid).toBe(true);
      expect(ctrl.isValid()).toBe(true);
      expect(ctrl.isInvalid()).toBe(false);
      expect(ctrl.errors().length).toBe(0);
    });

    it('should emit onValid and onInvalid events', async () => {
      ctrl.validators = [GpValidators.required()];

      let validPayload: any = null;
      let invalidPayload: any = null;

      ctrl.onValid.subscribe((v) => (validPayload = v));
      ctrl.onInvalid.subscribe((e) => (invalidPayload = e));

      ctrl.value = '';
      ctrl.internalValue.set('');
      await ctrl.validate();

      expect(invalidPayload).toBeDefined();
      expect(invalidPayload.length).toBe(1);
      expect(validPayload).toBeNull();

      ctrl.value = 'hello';
      ctrl.internalValue.set('hello');
      await ctrl.validate();

      expect(validPayload).toBe('hello');
    });

    it('should execute custom side effects (valueEffect) on value update', async () => {
      let effectExecuted = false;
      let sideEffectNewVal: any = null;
      let sideEffectOldVal: any = null;

      ctrl.valueEffect = async (newVal, oldVal) => {
        effectExecuted = true;
        sideEffectNewVal = newVal;
        sideEffectOldVal = oldVal;
      };

      await ctrl.updateValue('first-value');
      expect(effectExecuted).toBe(true);
      expect(sideEffectNewVal).toBe('first-value');

      await ctrl.updateValue('second-value');
      expect(sideEffectNewVal).toBe('second-value');
      expect(sideEffectOldVal).toBe('first-value');
    });

    it('should support external error injection via setErrors()', () => {
      ctrl.setErrors(['Server error: Username already taken', 'Format is deprecated']);
      expect(ctrl.isInvalid()).toBe(true);
      expect(ctrl.errors().length).toBe(2);
      expect(ctrl.firstError()).toBe('Server error: Username already taken');

      ctrl.clearErrors();
      expect(ctrl.isInvalid()).toBe(false);
      expect(ctrl.errors().length).toBe(0);
    });

    it('should reset value, touched, dirty, and error states on reset()', () => {
      ctrl.value = 'some value';
      ctrl.markAsDirty();
      ctrl.markAsTouched();
      ctrl.setErrors(['Custom error']);

      expect(ctrl.isDirty()).toBe(true);
      expect(ctrl.isTouched()).toBe(true);
      expect(ctrl.isInvalid()).toBe(true);

      ctrl.reset();

      expect(ctrl.value).toBeNull();
      expect(ctrl.isDirty()).toBe(false);
      expect(ctrl.isTouched()).toBe(false);
      expect(ctrl.isInvalid()).toBe(false);
    });
  });

  describe('GpFormDirective', () => {
    it('should coordinate multi-field validation, value extraction, and server error mapping', async () => {
      const form = new GpFormDirective();

      const field1 = new TestInputControl();
      field1.name = 'email';
      field1.validators = [GpValidators.required(), GpValidators.email()];

      const field2 = new TestInputControl();
      field2.name = 'age';
      field2.validators = [GpValidators.required(), GpValidators.min(18)];

      form.registerControl(field1);
      form.registerControl(field2);

      field1.value = 'invalid-email';
      field1.internalValue.set('invalid-email');
      field2.value = 16;
      field2.internalValue.set(16 as any);

      const allValid = await form.validateAll();
      expect(allValid).toBe(false);
      expect(form.isValid()).toBe(false);
      expect(form.isInvalid()).toBe(true);

      const values = form.getValues();
      expect(values.email).toBe('invalid-email');
      expect(values.age).toBe(16);

      // Fix values
      field1.value = 'valid@example.com';
      field1.internalValue.set('valid@example.com');
      field2.value = 21;
      field2.internalValue.set(21 as any);

      const nowValid = await form.validateAll();
      expect(nowValid).toBe(true);
      expect(form.isValid()).toBe(true);

      // Test external server error mapping (e.g. from API response)
      form.setErrors({
        email: 'Email is blacklisted',
        age: 'Age must be approved by guardian'
      });

      expect(field1.isInvalid()).toBe(true);
      expect(field1.firstError()).toBe('Email is blacklisted');
      expect(field2.isInvalid()).toBe(true);
      expect(field2.firstError()).toBe('Age must be approved by guardian');

      form.clearErrors();
      expect(field1.isInvalid()).toBe(false);
      expect(field2.isInvalid()).toBe(false);
    });
  });
});
