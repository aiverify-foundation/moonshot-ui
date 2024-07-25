import { processResponse } from '@/app/lib/http-requests';

describe('processResponse', () => {
  it('should return data when response is ok', async () => {
    const mockResponse = {
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({ message: 'Success' }),
    } as unknown as Response;

    const result = await processResponse<{ message: string }>(mockResponse);
    expect(result).toEqual({ status: 200, data: { message: 'Success' } });
  });

  it('should return error with message when response is not ok', async () => {
    const mockResponse = {
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      json: jest.fn().mockResolvedValue({ error: 'Invalid request' }),
    } as unknown as Response;

    const result = await processResponse<{ message: string }>(mockResponse);
    expect(result).toEqual(
      expect.objectContaining({
        message: expect.any(String),
      })
    );
  });

  it('should return error with message when json parsing fails', async () => {
    const mockResponse = {
      ok: true,
      status: 200,
      json: jest.fn().mockRejectedValue(new Error('Failed to parse JSON')),
    } as unknown as Response;

    const result = await processResponse<{ message: string }>(mockResponse);
    expect(result).toEqual(
      expect.objectContaining({
        message: 'Failed to parse JSON',
      })
    );
  });
});
