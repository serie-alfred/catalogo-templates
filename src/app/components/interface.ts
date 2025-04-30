// interface.ts
import { LAYOUTS } from "../data/data";

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

interface RenderImageProps {
  activeLayoutKey: string | null;
  selectedImages: { id: string; layoutKey: string }[];
  onSelect: (id: string, layoutKey: string) => void;
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
  RenderImageProps,
  RenderButtonProps,
  Layouts,
};
