import { Template, Sections, LayoutItem } from "../components/types";

export type Props = {
    type: string;
    sections: {
      [key: string]: {
        id: string;
        image: string;
        title: string;
        description: string;
      }[];
    };
    layoutPreviewList: { section: string; id: string }[];
    setLayoutPreviewList: (list: { section: string; id: string }[]) => void;
    updatePreview: () => void;
    updateProgress: () => void;
    updateURLParams: () => void;
  };
  