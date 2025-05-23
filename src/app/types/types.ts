export type Template = {
    id: string;
    image: string;
    title: string;
    description: string;
  };
  
  export type Sections = {
    [key: string]: Template[];
  };
  
  export type LayoutItem = {
    section: string;
    id: string;
  };
  