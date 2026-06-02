import collection from './documents/collection';
import { siteSettings } from './documents/siteSettings';
import { product } from './documents/product';
import { productFrame } from './documents/productFrame';
import { productSize } from './documents/productSize';
import { cta } from './objects/cta';
import { heroBlock } from './objects/heroBlock';
import { productGalleryImage } from './objects/productGalleryImage';
import { productVariant } from './objects/productVariant';
import { volumeDiscount } from './objects/volumeDiscount';
import { premiumAddon } from './objects/premiumAddon';
import { SchemaTypeDefinition } from 'sanity';

export const schemaTypes: SchemaTypeDefinition[] = [
  siteSettings,
  collection,
  product,
  productSize,
  productFrame,
  heroBlock,
  cta,
  productGalleryImage,
  productVariant,
  volumeDiscount,
  premiumAddon,
];