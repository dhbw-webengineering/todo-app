import React, { createContext, useContext, useCallback, useState } from 'react';

type InvalidateFn = () => void;

interface TaskQueryContextType {
  invalidateAll: () => void;
  subscribe: (fn: InvalidateFn) => () => void;
}

const TaskQueryContext = createContext<TaskQueryContextType | undefined>(undefined);

export function TaskQueryProvider({ children }: { children: React.ReactNode }) {
  const [subscribers, setSubscribers] = useState<Set<InvalidateFn>>(new Set());

  const invalidateAll = useCallback(() => {
    subscribers.forEach(fn => fn());
  }, [subscribers]);

  const subscribe = useCallback((fn: InvalidateFn) => {
    setSubscribers(prev => new Set(prev).add(fn));
    return () => setSubscribers(prev => {
      const next = new Set(prev);
      next.delete(fn);
      return next;
    });
  }, []);

  return (
    <TaskQueryContext.Provider value={{ invalidateAll, subscribe }}>
      {children}
    </TaskQueryContext.Provider>
  );
}

export function useTaskQuery() {
  const ctx = useContext(TaskQueryContext);
  if (!ctx) throw new Error('useTaskQuery must be inside TaskQueryProvider');
  return ctx;
}
