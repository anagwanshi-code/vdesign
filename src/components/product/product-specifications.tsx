import {
  hasProductSpecifications,
  type ProductSpecifications,
} from "@/lib/product/specifications";

type ProductSpecificationsProps = {
  specifications: ProductSpecifications | null | undefined;
};

export function ProductSpecifications({
  specifications,
}: ProductSpecificationsProps) {
  if (!hasProductSpecifications(specifications)) {
    return null;
  }

  return (
    <section className="flex flex-col gap-6" aria-labelledby="product-specs-heading">
      <h2
        id="product-specs-heading"
        className="font-serif text-2xl text-text-primary"
      >
        Technical Specifications
      </h2>
      <dl className="grid grid-cols-1 gap-x-8 gap-y-4 font-sans text-sm md:grid-cols-2">
        {specifications.paperType ? (
          <div className="flex flex-col border-b border-border/30 pb-2">
            <dt className="mb-1 text-xs uppercase tracking-wider text-text-muted">
              Paper Stock
            </dt>
            <dd className="text-text-primary">{specifications.paperType}</dd>
          </div>
        ) : null}

        {specifications.printMethod ? (
          <div className="flex flex-col border-b border-border/30 pb-2">
            <dt className="mb-1 text-xs uppercase tracking-wider text-text-muted">
              Print Method
            </dt>
            <dd className="text-text-primary">{specifications.printMethod}</dd>
          </div>
        ) : null}

        {specifications.machineType ? (
          <div className="flex flex-col border-b border-border/30 pb-2">
            <dt className="mb-1 text-xs uppercase tracking-wider text-text-muted">
              Machine
            </dt>
            <dd className="text-text-primary">{specifications.machineType}</dd>
          </div>
        ) : null}

        {specifications.laminationType &&
        specifications.laminationType !== "None" ? (
          <div className="flex flex-col border-b border-border/30 pb-2">
            <dt className="mb-1 text-xs uppercase tracking-wider text-text-muted">
              Lamination
            </dt>
            <dd className="text-text-primary">{specifications.laminationType}</dd>
          </div>
        ) : null}

        {specifications.techFinishingOptions &&
        specifications.techFinishingOptions.length > 0 ? (
          <div className="flex flex-col border-b border-border/30 pb-2 md:col-span-2">
            <dt className="mb-1 text-xs uppercase tracking-wider text-text-muted">
              Finishing
            </dt>
            <dd className="text-text-primary">
              {specifications.techFinishingOptions.join(" · ")}
            </dd>
          </div>
        ) : null}
      </dl>
    </section>
  );
}
