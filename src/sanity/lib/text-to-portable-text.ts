import { randomKey } from "@/sanity/lib/random-key";

type PortableTextBlock = {
  _type: "block";
  _key: string;
  style: "normal";
  markDefs: [];
  children: Array<{
    _type: "span";
    _key: string;
    text: string;
    marks: [];
  }>;
};

export function textToPortableText(text: string): PortableTextBlock[] {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) {
    return [];
  }

  return paragraphs.map((paragraph) => ({
    _type: "block",
    _key: randomKey(),
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: randomKey(),
        text: paragraph.replace(/\n/g, " "),
        marks: [],
      },
    ],
  }));
}
