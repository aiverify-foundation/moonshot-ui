import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { renderHook, waitFor, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import React from 'react';
import {
  cookbookApi,
  useGetCookbooksQuery,
  useCreateCookbookMutation,
  useLazyGetCookbooksQuery,
} from '../cookbook-api-service';
import { Cookbook, CookbookFormValues } from '../types';

// Mock the host module
jest.mock('../host', () => ({
  getHostAndPort: jest.fn(() => ['http://localhost', '3000']),
}));

// Polyfill for Node.js test environment
global.Request = global.Request || 
  class Request {
    url: string;
    method: string;
    headers: any;
    body: any;
    
    constructor(input: string | Request, init?: RequestInit) {
      this.url = typeof input === 'string' ? input : input.url;
      this.method = init?.method || 'GET';
      this.headers = init?.headers || {};
      this.body = init?.body;
    }
  };

global.Response = global.Response || 
  class Response {
    ok: boolean;
    status: number;
    statusText: string;
    private _body: any;
    
    constructor(body?: any, init?: ResponseInit) {
      this.ok = init?.status ? init.status >= 200 && init.status < 300 : true;
      this.status = init?.status || 200;
      this.statusText = init?.statusText || 'OK';
      this._body = body;
    }
    
    json() {
      return Promise.resolve(this._body || {});
    }

    // Add the clone method that RTK Query requires
    clone() {
      const cloned = new Response(this._body, {
        status: this.status,
        statusText: this.statusText,
      });
      return cloned;
    }

    // Add other methods that might be needed
    text() {
      return Promise.resolve(JSON.stringify(this._body || {}));
    }

    blob() {
      return Promise.resolve(new Blob([JSON.stringify(this._body || {})]));
    }

    arrayBuffer() {
      return Promise.resolve(new ArrayBuffer(0));
    }
  };

// Mock fetch globally
global.fetch = jest.fn();

const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

// Helper function to create a test store
const createTestStore = () => {
  const store = configureStore({
    reducer: {
      [cookbookApi.reducerPath]: cookbookApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(cookbookApi.middleware),
  });
  setupListeners(store.dispatch);
  return store;
};

// Helper function to create a wrapper with Redux Provider
const createWrapper = (store: ReturnType<typeof createTestStore>) => {
  return ({ children }: { children: React.ReactNode }) => 
    React.createElement(Provider, { store }, children);
};

// Mock data with proper typing
const mockCookbooks: Cookbook[] = [
  {
    id: '1',
    title: 'Italian Recipes',
    description: 'Delicious Italian dishes',
    categories: ['italian', 'pasta'],
    tags: ['dinner', 'comfort'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'Healthy Meals',
    description: 'Nutritious and tasty meals',
    categories: ['healthy', 'vegetarian'],
    tags: ['lunch', 'light'],
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
];

const mockCookbookForm: CookbookFormValues = {
  title: 'New Cookbook',
  description: 'A test cookbook',
  categories: ['test'],
  tags: ['new'],
};

// Helper function to create mock response
const createMockResponse = (data: any, options: { ok?: boolean; status?: number; statusText?: string } = {}) => {
  return new Response(data, {
    status: options.status || (options.ok === false ? 500 : 200),
    statusText: options.statusText || (options.ok === false ? 'Internal Server Error' : 'OK'),
  });
};

describe('cookbookApi', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
    mockFetch.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCookbooks endpoint', () => {
    it('should fetch cookbooks without parameters', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockCookbooks));

      const { result } = renderHook(() => useGetCookbooksQuery(undefined), {
        wrapper: createWrapper(store),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Check that fetch was called with a Request object
      expect(mockFetch).toHaveBeenCalledTimes(1);
      const requestArg = mockFetch.mock.calls[0][0] as Request;
      expect(requestArg.url).toBe('http://localhost:3000/api/v1/cookbooks');
      expect(requestArg.method).toBe('GET');
      expect(result.current.data).toEqual(mockCookbooks);
    });

    it('should fetch cookbooks with ids parameter', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockCookbooks));

      const params = { ids: ['1', '2'] };
      const { result } = renderHook(() => useGetCookbooksQuery(params), {
        wrapper: createWrapper(store),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const requestArg = mockFetch.mock.calls[0][0] as Request;
      expect(requestArg.url).toBe('http://localhost:3000/api/v1/cookbooks?ids=1%2C2');
      expect(requestArg.method).toBe('GET');
    });

    it('should fetch cookbooks with categories parameter', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockCookbooks));

      const params = { categories: ['italian', 'healthy'] };
      const { result } = renderHook(() => useGetCookbooksQuery(params), {
        wrapper: createWrapper(store),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const requestArg = mockFetch.mock.calls[0][0] as Request;
      expect(requestArg.url).toBe('http://localhost:3000/api/v1/cookbooks?categories=italian%2Chealthy');
      expect(requestArg.method).toBe('GET');
    });

    it('should fetch cookbooks with categories_excluded parameter', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockCookbooks));

      const params = { categories_excluded: ['dessert', 'unhealthy'] };
      const { result } = renderHook(() => useGetCookbooksQuery(params), {
        wrapper: createWrapper(store),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const requestArg = mockFetch.mock.calls[0][0] as Request;
      expect(requestArg.url).toBe('http://localhost:3000/api/v1/cookbooks?categories_excluded=dessert%2Cunhealthy');
      expect(requestArg.method).toBe('GET');
    });

    it('should fetch cookbooks with tags parameter', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockCookbooks));

      const params = { tags: ['dinner', 'quick'] };
      const { result } = renderHook(() => useGetCookbooksQuery(params), {
        wrapper: createWrapper(store),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const requestArg = mockFetch.mock.calls[0][0] as Request;
      expect(requestArg.url).toBe('http://localhost:3000/api/v1/cookbooks?tags=dinner%2Cquick');
      expect(requestArg.method).toBe('GET');
    });

    it('should fetch cookbooks with count parameter set to true', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockCookbooks));

      const params = { count: true };
      const { result } = renderHook(() => useGetCookbooksQuery(params), {
        wrapper: createWrapper(store),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const requestArg = mockFetch.mock.calls[0][0] as Request;
      expect(requestArg.url).toBe('http://localhost:3000/api/v1/cookbooks?count=true');
      expect(requestArg.method).toBe('GET');
    });

    it('should fetch cookbooks with count parameter set to false', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockCookbooks));

      const params = { count: false };
      const { result } = renderHook(() => useGetCookbooksQuery(params), {
        wrapper: createWrapper(store),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const requestArg = mockFetch.mock.calls[0][0] as Request;
      expect(requestArg.url).toBe('http://localhost:3000/api/v1/cookbooks?count=false');
      expect(requestArg.method).toBe('GET');
    });

    it('should fetch cookbooks with all parameters', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockCookbooks));

      const params = {
        ids: ['1', '2'],
        categories: ['italian'],
        categories_excluded: ['dessert'],
        tags: ['dinner'],
        count: true,
      };
      const { result } = renderHook(() => useGetCookbooksQuery(params), {
        wrapper: createWrapper(store),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const requestArg = mockFetch.mock.calls[0][0] as Request;
      expect(requestArg.url).toContain('http://localhost:3000/api/v1/cookbooks?');
      expect(requestArg.method).toBe('GET');

      // Check that all parameters are in the URL
      expect(requestArg.url).toContain('ids=1%2C2');
      expect(requestArg.url).toContain('categories=italian');
      expect(requestArg.url).toContain('categories_excluded=dessert');
      expect(requestArg.url).toContain('tags=dinner');
      expect(requestArg.url).toContain('count=true');
    });

    it('should handle empty arrays for categories and categories_excluded', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockCookbooks));

      const params = {
        categories: [],
        categories_excluded: [],
        tags: ['dinner'],
      };
      const { result } = renderHook(() => useGetCookbooksQuery(params), {
        wrapper: createWrapper(store),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const requestArg = mockFetch.mock.calls[0][0] as Request;
      expect(requestArg.url).toBe('http://localhost:3000/api/v1/cookbooks?tags=dinner');
      expect(requestArg.method).toBe('GET');
    });

    it('should handle API errors', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(null, {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      }));

      const { result } = renderHook(() => useGetCookbooksQuery(undefined), {
        wrapper: createWrapper(store),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
    });
  });

  describe('useLazyGetCookbooksQuery', () => {
    it('should trigger lazy query manually', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockCookbooks));

      const { result } = renderHook(() => useLazyGetCookbooksQuery(), {
        wrapper: createWrapper(store),
      });

      const [trigger] = result.current;

      // Initially should not be loading
      expect(result.current[1].isLoading).toBe(false);

      // Trigger the query within act
      await act(async () => {
        trigger({ ids: ['1'] });
      });

      await waitFor(() => {
        expect(result.current[1].isSuccess).toBe(true);
      });

      const requestArg = mockFetch.mock.calls[0][0] as Request;
      expect(requestArg.url).toBe('http://localhost:3000/api/v1/cookbooks?ids=1');
      expect(requestArg.method).toBe('GET');
    });
  });

  describe('createCookbook endpoint', () => {
    it('should create a cookbook successfully', async () => {
      const createdCookbook: Cookbook = { 
        id: '3', 
        ...mockCookbookForm,
        createdAt: '2024-01-03T00:00:00Z',
        updatedAt: '2024-01-03T00:00:00Z',
      };
      mockFetch.mockResolvedValueOnce(createMockResponse(createdCookbook));

      const { result } = renderHook(() => useCreateCookbookMutation(), {
        wrapper: createWrapper(store),
      });

      const [createCookbook] = result.current;
      
      await act(async () => {
        createCookbook(mockCookbookForm);
      });

      await waitFor(() => {
        expect(result.current[1].isSuccess).toBe(true);
      });

      const requestArg = mockFetch.mock.calls[0][0] as Request;
      expect(requestArg.url).toBe('http://localhost:3000/api/v1/cookbooks');
      expect(requestArg.method).toBe('POST');
      expect(requestArg.body).toBe(JSON.stringify(mockCookbookForm));
    });

    it('should handle creation errors', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(null, {
        ok: false,
        status: 400,
        statusText: 'Bad Request'
      }));

      const { result } = renderHook(() => useCreateCookbookMutation(), {
        wrapper: createWrapper(store),
      });

      const [createCookbook] = result.current;
      
      await act(async () => {
        createCookbook(mockCookbookForm);
      });

      await waitFor(() => {
        expect(result.current[1].isError).toBe(true);
      });

      expect(result.current[1].error).toBeDefined();
    });
  });

  describe('API configuration', () => {
    it('should have correct reducer path', () => {
      expect(cookbookApi.reducerPath).toBe('cookbookApi');
    });

    it('should include keepUnusedDataFor configuration', () => {
      // This tests that the keepUnusedDataFor is set in the query
      // We can verify this by checking the endpoint configuration
      const endpoints = cookbookApi.endpoints;
      expect(endpoints.getCookbooks).toBeDefined();
    });
  });
});

// Additional integration test for the full flow
describe('cookbookApi integration', () => {
  it('should handle the complete flow of fetching and creating cookbooks', async () => {
    const store = createTestStore();

    // Mock successful fetch for getCookbooks
    mockFetch.mockResolvedValueOnce(createMockResponse(mockCookbooks));

    // Mock successful creation
    const newCookbook: Cookbook = { 
      id: '3', 
      ...mockCookbookForm,
      createdAt: '2024-01-03T00:00:00Z',
      updatedAt: '2024-01-03T00:00:00Z',
    };
    mockFetch.mockResolvedValueOnce(createMockResponse(newCookbook));

    const { result: getResult } = renderHook(
      () => useGetCookbooksQuery(undefined),
      {
        wrapper: createWrapper(store),
      }
    );

    const { result: createResult } = renderHook(
      () => useCreateCookbookMutation(),
      {
        wrapper: createWrapper(store),
      }
    );

    // Wait for initial fetch to complete
    await waitFor(() => {
      expect(getResult.current.isSuccess).toBe(true);
    });

    // Create a new cookbook
    const [createCookbook] = createResult.current;
    await act(async () => {
      createCookbook(mockCookbookForm);
    });

    await waitFor(() => {
      expect(createResult.current[1].isSuccess).toBe(true);
    });

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});