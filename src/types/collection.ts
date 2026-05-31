/** Slim collection shape for the /collections index page. */
export type CollectionIndexItem = {
  _id: string;
  title: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  alt?: string | null;
};
