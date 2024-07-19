import { isErrorWithMessage, toErrorWithMessage } from '@/app/lib/error-utils';

test('should return true, given Error instance using new keyword', () => {
  const error = new Error('mock error');
  const result = isErrorWithMessage(error);
  expect(result).toBe(true);
});

test('should return true, given Error instance', () => {
  const error = Error('mock error');
  const result = isErrorWithMessage(error);
  expect(result).toBe(true);
});

test('should return true, given object with message property', () => {
  const error = { message: 'mock error', cause: 'mock cause' };
  const result = isErrorWithMessage(error);
  expect(result).toBe(true);
});

test('should return false, given object without message property', () => {
  const error = { error: 'mock error' };
  const result = isErrorWithMessage(error);
  expect(result).toBe(false);
});

test('should return false, given string', () => {
  const error = 'mock error';
  const result = isErrorWithMessage(error);
  expect(result).toBe(false);
});

test('should return error with message, given Error instance', () => {
  const errorInstance = new Error('mock error', { cause: 'mock cause' });
  const result = toErrorWithMessage(errorInstance);
  expect(result).toBe(errorInstance);
  expect(result.message).toBe('mock error');
});

test('should return error with message, given non Error instance - string', () => {
  const errorString = 'mock error';
  const result = toErrorWithMessage(errorString);
  expect(result.message).toBe(errorString);
});

test('should return error with message, given non Error instance - object with message property', () => {
  const errorObject = { message: 'mock error', cause: 'mock cause' };
  const result = toErrorWithMessage(errorObject);
  expect(result).toBe(errorObject);
  expect(result.message).toBe('mock error');
});

test('should return error with message, given non Error instance - object without message property', () => {
  const errorObject = { error: 'mock cause' };
  const result = toErrorWithMessage(errorObject);
  expect(result).not.toBe(errorObject);
  expect(result.message).toEqual('{"error":"mock cause"}');
});

test('should return error with message, given non Error instance - object without message property, but cannot be JSON stringified', () => {
  const errorObject: { error: string; test?: object } = { error: 'mock cause' };
  errorObject.test = errorObject;
  const result = toErrorWithMessage(errorObject);
  expect(result).not.toBe(errorObject);
  expect(result.message).not.toBeUndefined();
});
