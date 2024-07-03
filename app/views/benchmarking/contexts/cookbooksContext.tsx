import React from 'react';

type CookBookContextValue =
  | [
      Cookbook[],
      React.Dispatch<React.SetStateAction<Cookbook[]>>,
      boolean,
      React.Dispatch<React.SetStateAction<boolean>>,
    ]
  | undefined;

const CookbooksContext = React.createContext<CookBookContextValue>(undefined);
CookbooksContext.displayName = 'CookbooksContext';

type CookbooksProviderProps = {
  children: React.ReactNode;
  initialCookbooks?: Cookbook[];
};

function CookbooksProvider({
  children,
  initialCookbooks = [],
}: CookbooksProviderProps) {
  const [cookbooks, setCookbooks] =
    React.useState<Cookbook[]>(initialCookbooks);
  const [isFirstCookbooksFetch, setIsFirstCookbooksFetch] = React.useState(
    () => true
  );

  const value: CookBookContextValue = [
    cookbooks,
    setCookbooks,
    isFirstCookbooksFetch,
    setIsFirstCookbooksFetch,
  ];
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
  setState: React.Dispatch<React.SetStateAction<Cookbook[]>>,
  cookbooks: Cookbook[]
) => {
  setState(cookbooks);
};

export { CookbooksProvider, useCookbooks, updateAllCookbooks };
