import { useContext } from 'react';
import { SystemContext, SystemContextType } from '.';

export const useSystemContext = (): SystemContextType => {
  const context = useContext(SystemContext);
  if (context == null) throw Error('useSystemContext must be used within a SystemProvider');
  return context;
};
