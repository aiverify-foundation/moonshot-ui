import {
  isErrorWithMessage,
  isApiError,
  toErrorWithMessage,
} from '@/app/lib/error-utils';

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

test('should return true, given an object with valid ApiError structure', () => {
  const apiError = {
    status: 500,
    data: {
      detail: 'Not Found',
    },
  };
  const result = isApiError(apiError);
  expect(result).toBe(true);
});

test('should return false, given an object without data property', () => {
  const apiError = {
    status: 500,
  };
  const result = isApiError(apiError);
  expect(result).toBe(false);
});

test('should return false, given an object with data property but without detail', () => {
  const apiError = {
    status: 500,
    data: {},
  };
  const result = isApiError(apiError);
  expect(result).toBe(false);
});

test('should return false, given an object with data property but detail is not a string', () => {
  const apiError = {
    status: 500,
    data: {
      detail: 123,
    },
  };
  const result = isApiError(apiError);
  expect(result).toBe(false);
});

test('should return false, given a non-object value', () => {
  const apiError = 'Not Found';
  const result = isApiError(apiError);
  expect(result).toBe(false);
});

test('should return false, given a null value', () => {
  const apiError = null;
  const result = isApiError(apiError);
  expect(result).toBe(false);
});
