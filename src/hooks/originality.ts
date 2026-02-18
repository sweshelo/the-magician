import { useState, useEffect } from 'react';
import { getOriginalityMap } from '@/actions/originality';

export function useOriginalityMap(): { opMap: Record<string, number>; isLoading: boolean } {
  const [opMap, setOpMap] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getOriginalityMap()
      .then(data => {
        setOpMap(data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  return { opMap, isLoading };
}
