import { useState, useEffect } from 'react';

export function useOriginalityMap(): { opMap: Record<string, number>; isLoading: boolean } {
  const [opMap, setOpMap] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/originality')
      .then(res => res.json())
      .then((data: Record<string, number>) => {
        setOpMap(data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  return { opMap, isLoading };
}
