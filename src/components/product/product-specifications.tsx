import {
  hasProductSpecifications,
  type ProductSpecifications,
} from "@/lib/product/specifications";

type ProductSpecificationsProps = {
  specifications: ProductSpecifications | null | undefined;
};

type SpecRow = {
  label: string;
  value: string;
};

function buildSpecRows(specifications: ProductSpecifications): SpecRow[] {
  const rows: SpecRow[] = [];

  if (specifications.paperType) {
    rows.push({ label: "Paper Stock", value: specifications.paperType });
  }

  if (specifications.printMethod) {
    rows.push({ label: "Print Method", value: specifications.printMethod });
  }

  if (specifications.machineType) {
    rows.push({ label: "Machine", value: specifications.machineType });
  }

  if (
    specifications.laminationType &&
    specifications.laminationType !== "None"
  ) {
    rows.push({ label: "Lamination", value: specifications.laminationType });
  }

  if (specifications.techFinishingOptions?.length) {
    rows.push({
      label: "Finishing",
      value: specifications.techFinishingOptions.join(" · "),
    });
  }

  return rows;
}

export function ProductSpecifications({
  specifications,
}: ProductSpecificationsProps) {
  if (!hasProductSpecifications(specifications)) {
    return null;
  }

  const rows = buildSpecRows(specifications);

  return (
    <section
      className="rounded-2xl border border-slate-100 bg-slate-50 p-6 md:p-8"
      aria-labelledby="product-specs-heading"
    >
      <div className="mb-6 flex flex-col gap-2">
        <p className="font-sans text-xs uppercase tracking-wider text-gray-500">
          Atelier details
        </p>
        <h2
          id="product-specs-heading"
          className="font-serif text-2xl font-medium text-gray-950 md:text-3xl"
        >
          Technical Specifications
        </h2>
      </div>

      <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-slate-200/80 bg-slate-200/80 md:grid-cols-2">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex flex-col gap-1.5 bg-slate-50 px-5 py-4"
          >
            <dt className="font-sans text-xs uppercase tracking-wider text-gray-500">
              {row.label}
            </dt>
            <dd className="font-sans text-sm font-semibold text-gray-900">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
