import { useEffect, useState } from 'react';

function isObject(object: unknown): boolean {
  return object != null && typeof object === 'object';
}

function isEqual(
  obj1: Record<string, unknown>,
  obj2: Record<string, unknown>
): boolean {
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
      (areObjects &&
        !isEqual(
          val1 as Record<string, unknown>,
          val2 as Record<string, unknown>
        )) ||
      (!areObjects && val1 !== val2)
    ) {
      return false;
    }
  }

  return true;
}

export function useEventSource<T, E extends string>(
  url: string,
  eventType: E
): [T | null, () => void] {
  const [data, setData] = useState<T | null>(null);
  let eventSource: EventSource | null = null;

  function closeEventSource() {
    console.log('Closing EventSource');
    eventSource?.close();
  }

  useEffect(() => {
    eventSource = new EventSource(url);

    eventSource.onopen = (event) => {
      console.log('EVENTSOURCE Open', event);
    };

    eventSource.addEventListener(eventType, (event) => {
      console.log('SYSTEM-UPDATE', event);
      const parsedData: T = JSON.parse(event.data);
      // Warning - isEqual does deep equality. Currently this is ok because data is 1 level deep.
      // Avoid designing nested objects for data
      if (
        data &&
        isEqual(
          data as Record<string, unknown>,
          parsedData as Record<string, unknown>
        )
      )
        return;
      setData(parsedData);
    });

    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
      eventSource?.close();
    };
  }, []);

  return [data, closeEventSource];
}
