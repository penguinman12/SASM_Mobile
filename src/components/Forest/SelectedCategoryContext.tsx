import { createContext, useState, SetStateAction, Dispatch } from 'react';

interface Category {
    id: number;
    name: string;
}

interface SelectedCategoryContextType {
  selectedCategories : Category[];
  setSelectedCategories : Dispatch<React.SetStateAction<Category[]>>;
  selectedIds : number[];
  setSelectedIds : Dispatch<React.SetStateAction<number[]>>;
}

const SelectedCategoryContext = createContext<SelectedCategoryContextType>({
    selectedCategories: [],
    setSelectedCategories: () => {},
    selectedIds: [],
    setSelectedIds: () => {},
});
  
const SelectedCategoryProvider = ({ children }: any) => {
    const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    
    return (
        <SelectedCategoryContext.Provider value={{ selectedCategories, setSelectedCategories, selectedIds, setSelectedIds, }}>
          {children}
        </SelectedCategoryContext.Provider>
      );
    };
      
    export { SelectedCategoryContext, SelectedCategoryProvider };