// interface.ts
import { LAYOUTS } from "./data";

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
  selectedImageId: string | null;
  onSelect: (id: string, layoutKey: string) => void;
}

interface RenderButtonProps {
  activeLayoutKey: keyof typeof LAYOUTS | null;
  onCategoryChange: (layoutKey: keyof typeof LAYOUTS) => void;
}

export type {
  ImageItem,
  RenderPreviewProps,
  RenderImageProps,
  RenderButtonProps,
};
