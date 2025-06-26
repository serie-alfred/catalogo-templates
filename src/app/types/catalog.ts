import { StaticImageData } from "next/image";

export type CatalogItem = {
  id: number; 
  title: string;
  subtitle: string;
  image: StaticImageData;
  desktopLink: string;
  mobileLink: string;
};
