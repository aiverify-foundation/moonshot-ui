import { getEndpointsFromRequiredConfig } from '@/app/lib/getEndpointsFromRequiredConfig';

describe('getEndpointsFromRequiredConfig', () => {
  it('should return empty array when requiredConfig is null', () => {
    const result = getEndpointsFromRequiredConfig(null);
    expect(result).toEqual([]);
  });

  it('should return endpoints array when only endpoints exist', () => {
    const config = {
      configurations: {},
      endpoints: ['endpoint-1', 'endpoint-2'],
    };
    const result = getEndpointsFromRequiredConfig(config);
    expect(result).toEqual(['endpoint-1', 'endpoint-2']);
  });

  it('should return embeddings array when only embeddings exist', () => {
    const config = {
      configurations: {
        embeddings: ['embed-endpoint-1', 'embed-endpoint-2'],
      },
    };
    const result = getEndpointsFromRequiredConfig(config);
    expect(result).toEqual(['embed-endpoint-1', 'embed-endpoint-2']);
  });

  it('should return combined unique endpoints when both exist', () => {
    const mockRequiredConfig = {
      configurations: {
        embeddings: ['embed-endpoint-1', 'embed-endpoint-2'],
      },
      endpoints: ['endpoint-1', 'endpoint-2'],
    };
    const result = getEndpointsFromRequiredConfig(mockRequiredConfig);
    expect(result).toEqual([
      'endpoint-1',
      'endpoint-2',
      'embed-endpoint-1',
      'embed-endpoint-2',
    ]);
  });

  it('should not duplicate endpoints that appear in both arrays', () => {
    const config = {
      configurations: {
        embeddings: ['endpoint-1', 'embed-endpoint-2'],
      },
      endpoints: ['endpoint-1', 'endpoint-2'],
    };
    const result = getEndpointsFromRequiredConfig(config);
    expect(result).toEqual(['endpoint-1', 'endpoint-2', 'embed-endpoint-2']);
  });
});
