import { useEffect, useState } from 'react';
import { AppEventTypes } from '@/app/types/enums';

function initSSE() {
  fetch('/api/v1/status', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ msg: 'init' }),
  })
    .then((response) => response.json())
    .then((data) => console.log('Success:', data))
    .catch((error) => {
      console.error('Error:', error);
    });
}

function isObject(object: any): boolean {
  return object != null && typeof object === 'object';
}

function isEqual(obj1: any, obj2: any): boolean {
  const obj1Keys = Object.keys(obj1);
  const obj2Keys = Object.keys(obj2);

  if (obj1Keys.length !== obj2Keys.length) {
    return false;
  }

  for (const key of obj1Keys) {
    const val1 = obj1[key];
    const val2 = obj2[key];
    const areObjects = isObject(val1) && isObject(val2);
    if (
      (areObjects && !isEqual(val1, val2)) ||
      (!areObjects && val1 !== val2)
    ) {
      return false;
    }
  }

  return true;
}

export function useEventSource<T>(url: string): [T | null, () => void] {
  const [data, setData] = useState<T | null>(null);
  let eventSource: EventSource | null = null;

  function closeEventSource() {
    console.log('Closing EventSource');
    eventSource?.close();
  }

  useEffect(() => {
    // initSSE(); // Workaround a weird issue in the nextjs backend - if /api/v1/stream is called first, followed by /api/v1/status, the eventEmitter is not the same instance. TODO - debug
    eventSource = new EventSource(url);

    eventSource.onopen = (event) => {
      console.log('EVENTSOURCE Open', event);
    };

    eventSource.addEventListener(AppEventTypes.SYSTEM_UPDATE, (event) => {
      console.log('SYSTEM-UPDATE', event);
      const parsedData: T = JSON.parse(event.data);
      // Warning - isEqual does deep equality. Currently this is ok because data is 1 level deep.
      if (data && isEqual(data, parsedData)) return;
      setData(parsedData);
    });

    eventSource.addEventListener(AppEventTypes.BENCHMARK_UPDATE, (event) => {
      console.log('BENCHMARK-UPDATE', event);
      const parsedData: T = JSON.parse(event.data);
      // Warning - isEqual does deep equality. Currently this is ok because data is 1 level deep.
      if (data && isEqual(data, parsedData)) return;
      setData(parsedData);
    });

    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
      eventSource?.close();
    };
  }, []);

  return [data, closeEventSource];
}
