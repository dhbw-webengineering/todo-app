import React, { createContext, useContext, ReactNode } from "react";
import { Tag, useTags as useTagsInternal } from "./useTags";

type TagsContextValue = {
  tags: Tag[];
  loading: boolean;
  refetch: () => Promise<void>;
};

const TagsContext = createContext<TagsContextValue | undefined>(undefined);

export function TagsProvider({ children }: { children: ReactNode }) {
  const { tags, loading, refetch } = useTagsInternal();
  return (
    <TagsContext.Provider value={{ tags, loading, refetch }}>
      {children}
    </TagsContext.Provider>
  );
}

export function useTags() {
  const ctx = useContext(TagsContext);
  if (!ctx) {
    throw new Error("useTags must be used within TagsProvider");
  }
  return ctx;
}
