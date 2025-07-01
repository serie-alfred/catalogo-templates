import { LAYOUTS, LayoutKey } from "../data/layoutData";
import { LayoutSelection } from '@/hooks/useLayoutGenerator';

interface ImageItem {
  id: string;
  image: string;         
  mobile?: string;
  title?: string;
  description?: string;
}

interface RenderPreviewProps {
  item: ImageItem;
  selectedImageId: string | null;
  imageBasePath?: string;
  isMobile?: boolean;  
}

interface SelectSectionItemProps {
  activeLayoutKey: LayoutKey | null;
  selectedImages: LayoutSelection[];
  onSelect: (id: string, layoutKey: LayoutKey) => void;
}


interface RenderButtonProps {
  activeLayoutKey: keyof typeof LAYOUTS | null;
  onCategoryChange: (layoutKey: keyof typeof LAYOUTS) => void;
}

interface LayoutItem {
  id: string;
  image: string;
  mobile: string;
  title: string;
  description: string;
}

interface LayoutCategory {
  name: string;
  items: LayoutItem[];
}

interface Layouts {
  [platform: string]: {
    [category: string]: LayoutCategory;
  };
}

export type {
  ImageItem,
  RenderPreviewProps,
  SelectSectionItemProps,
  RenderButtonProps,
  Layouts,
};
