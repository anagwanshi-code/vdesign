export type TestimonialDocument = {
  _id: string;
  name: string;
  designation?: string | null;
  review: string;
  rating?: number | null;
  imageUrl?: string | null;
};
