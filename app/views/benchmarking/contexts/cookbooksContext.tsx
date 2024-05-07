import React from 'react';

type CookBookContextValue =
  | [Cookbook[], React.Dispatch<React.SetStateAction<Cookbook[]>>]
  | undefined;

const CookbooksContext = React.createContext<CookBookContextValue>(undefined);
CookbooksContext.displayName = 'CookbooksContext';

function CookbooksProvider({ children }: { children: React.ReactNode }) {
  const [cookbooks, setCookbooks] = React.useState<Cookbook[]>([]);

  const value: CookBookContextValue = [cookbooks, setCookbooks];
  return (
    <CookbooksContext.Provider value={value}>
      {children}
    </CookbooksContext.Provider>
  );
}

function useCookbooks() {
  const context = React.useContext(CookbooksContext);
  if (!context) {
    throw new Error('useCookbooks must be used within a CookbooksProvider');
  }
  return context;
}

const updateAllCookbooks = (
  setState: (cookbooks: Cookbook[] | undefined) => void,
  cookbooks: Cookbook[] | undefined
) => {
  setState(cookbooks);
};

export { CookbooksProvider, useCookbooks, updateAllCookbooks };
