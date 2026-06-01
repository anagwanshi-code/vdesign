const HIGHLIGHT_CLASS =
  "font-dancing bg-gradient-to-r from-saffron-gold to-orange-500 bg-clip-text text-transparent";

type AboutHeroHeadingProps = {
  title: string;
  highlight: string;
};

export function AboutHeroHeading({ title, highlight }: AboutHeroHeadingProps) {
  const highlightSpan = (
    <span className={HIGHLIGHT_CLASS}>{highlight}</span>
  );

  const cmsTitle = title.trim();
  const newlineLines = cmsTitle.split("\n").map((l) => l.trim()).filter(Boolean);

  if (newlineLines.length >= 2) {
    return (
      <>
        {newlineLines[0]}
        <br />
        {newlineLines.slice(1).join(" ")} {highlightSpan}
      </>
    );
  }

  const dotParts = cmsTitle.split(/\.\s+/).filter(Boolean);
  if (dotParts.length >= 2) {
    return (
      <>
        {dotParts[0].endsWith(".") ? dotParts[0] : `${dotParts[0]}.`}
        <br />
        {dotParts.slice(1).join(". ")} {highlightSpan}
      </>
    );
  }

  return (
    <>
      {cmsTitle}
      <br />
      {highlightSpan}
    </>
  );
}
