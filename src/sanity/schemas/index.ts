import collection from './documents/collection';
import { homePage } from './documents/homePage';
import { product } from './documents/product';
import { productFrame } from './documents/productFrame';
import { productSize } from './documents/productSize';
import { cta } from './objects/cta';
import { heroBlock } from './objects/heroBlock';
import { productGalleryImage } from './objects/productGalleryImage';
import { productVariant } from './objects/productVariant';
import { service } from './objects/service';
import { SchemaTypeDefinition } from 'sanity';

export const schemaTypes: SchemaTypeDefinition[] = [
  homePage,
  collection,
  product,
  productSize,
  productFrame,
  heroBlock,
  service,
  cta,
  productGalleryImage,
  productVariant,
];