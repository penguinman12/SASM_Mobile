import { createContext, useState, SetStateAction, Dispatch } from 'react';

interface Category {
  id: number;
  name: string;
}

interface Forest {
  title: string;
  subtitle: string;
  content: string;
  category: Category;
  semi_categories: Array<string>;
  hashtags: any;
  photos: Array<string>;
  rep_pic: string;
}

interface ForestContextType {
  category: Category;
  setCategory: Dispatch<React.SetStateAction<Category>>;
  semiCategories: any[];
  setSemiCategories: Dispatch<React.SetStateAction<any[]>>;
  forest: Forest;
  setForest: Dispatch<React.SetStateAction<Forest>>;
}

const ForestContext = createContext<ForestContextType>({
  category: { id: 0, name: '' },
  setCategory: () => {},
  semiCategories: [],
  setSemiCategories: () => {},
  forest: { title: "", subtitle: "", content: "", category: {} as any, semi_categories: [] as any, hashtags: "", photos: [] as any, rep_pic: "" },
  setForest: () => {},
});

const ForestProvider = ({ children }: any) => {
  const [category, setCategory] = useState<Category>({ id: 0, name: '' });
  const [semiCategories, setSemiCategories] = useState<any[]>([]);
  const [forest, setForest] = useState({ title: "", subtitle: "", content: "", category: {} as any, semi_categories: [] as any, hashtags: "", photos: [] as any, rep_pic: "" });

  return (
    <ForestContext.Provider value={{ category, setCategory, semiCategories, setSemiCategories, forest, setForest, }}>
      {children}
    </ForestContext.Provider>
  );
};

export { ForestContext, ForestProvider };
