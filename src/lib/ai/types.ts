export type GeneratedProductSpecifications = {
  paperType?: string;
  printMethod?: string;
  machineType?: string;
  laminationType?: string;
  techFinishingOptions?: string[];
};

export type GeneratedProductFinishing = {
  embossing?: boolean;
  spotUV?: boolean;
  goldFoiling?: boolean;
  velvetLamination?: boolean;
};

export type GeneratedProductContent = {
  productType: string;
  title: string;
  subtitle: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  specifications: GeneratedProductSpecifications;
  finishing: GeneratedProductFinishing;
};

export type GenerateProductContentInput = {
  title?: string;
  subtitle?: string;
  imageUrl?: string | null;
};
