"use client";

import { LogoUploadField } from "@/components/product/logo-upload-field";
import { PremiumAddonSelector } from "@/components/product/premium-addon-selector";
import { ProductPriceDisplay } from "@/components/product/product-price-display";
import { useProductVariant } from "@/components/product/product-variant-context";
import { VariantOptionGroup } from "@/components/product/variant-option-group";
import { VolumeDiscountAppliedBanner } from "@/components/product/volume-discount-applied-banner";
import { VolumeDiscountHighlights } from "@/components/product/volume-discount-highlights";
import { useCart } from "@/hooks/use-cart";
import { calculateProductLinePricing } from "@/lib/commerce/product-pricing";
import {
  getQuantityValidationMessage,
  isQuantityValidForSaleType,
} from "@/lib/commerce/moq";
import { formatInr, isFrameAvailableForSize } from "@/lib/product/variants";
import { cn } from "@/lib/utils/cn";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

function getInitialQuantity(saleType: "bulk" | "flexible", moq: number) {
  return moq;
}

function getQuantityStep(saleType: "bulk" | "flexible", moq: number) {
  return saleType === "bulk" ? moq : 1;
}

function getQuantityFloor(saleType: "bulk" | "flexible", moq: number) {
  return moq;
}

export function ProductPurchasePanel() {
  const {
    product,
    sizeKey,
    frameKey,
    selected,
    mode,
    canPurchase,
    statusMessage,
    showSizeSelector,
    showFrameSelector,
    selectSize,
    selectFrame,
    unitPriceInInr: currentPrice,
    compareAtPriceInInr,
  } = useProductVariant();

  const { addItem, openCart } = useCart();
  const isBulk = product.saleType === "bulk";
  const moq = product.moq;
  const quantityFloor = getQuantityFloor(product.saleType, moq);
  const quantityStep = getQuantityStep(product.saleType, moq);
  const showLogoUploadBox =
    product.allowCustomUpload || product.logoUploadRequired;

  const [quantity, setQuantity] = useState(() =>
    getInitialQuantity(product.saleType, moq),
  );
  const [selectedAddonNames, setSelectedAddonNames] = useState<string[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [uploadInstructions, setUploadInstructions] = useState("");

  const selectedAddons = useMemo(
    () =>
      product.premiumAddons.filter((addon) =>
        selectedAddonNames.includes(addon.addonName),
      ),
    [product.premiumAddons, selectedAddonNames],
  );

  const linePricing = useMemo(
    () =>
      calculateProductLinePricing(
        currentPrice,
        quantity,
        product.volumeDiscounts,
        selectedAddons,
      ),
    [currentPrice, quantity, product.volumeDiscounts, selectedAddons],
  );

  const meetsQuantityRules = useMemo(
    () => isQuantityValidForSaleType(quantity, moq, product.saleType),
    [quantity, moq, product.saleType],
  );

  const quantityMessage = meetsQuantityRules
    ? null
    : getQuantityValidationMessage(moq, product.saleType);

  const canTransact = canPurchase && meetsQuantityRules;

  const toggleAddon = useCallback((addonName: string) => {
    setSelectedAddonNames((current) =>
      current.includes(addonName)
        ? current.filter((name) => name !== addonName)
        : [...current, addonName],
    );
  }, []);

  const handleSelectTierQuantity = useCallback(
    (nextQuantity: number) => {
      setQuantity(Math.max(quantityFloor, nextQuantity));
    },
    [quantityFloor],
  );

  const buildCartPayload = useCallback(() => {
    if (!selected) {
      return null;
    }

    const variantSubtitle = [selected.sizeLabel, selected.frameLabel]
      .filter(Boolean)
      .join(" · ");

    const addonSummary =
      selectedAddons.length > 0
        ? selectedAddons.map((addon) => addon.addonName).join(", ")
        : undefined;

    const combinedInstructions = [
      uploadInstructions.trim() || null,
      addonSummary ? `Add-ons: ${addonSummary}` : null,
    ]
      .filter(Boolean)
      .join(" · ");

    return {
      productId: product.id,
      variantKey: selected.variantKey,
      title: product.title,
      subtitle: variantSubtitle || product.subtitle,
      priceLabel: formatInr(linePricing.finalUnitPrice),
      priceInInr: linePricing.finalUnitPrice,
      baseUnitPriceInInr: linePricing.baseUnitPrice,
      volumeDiscountPercent: linePricing.discountPercent,
      premiumAddons: selectedAddons,
      sku: selected.sku,
      sizeLabel: selected.sizeLabel,
      frameLabel: selected.frameLabel,
      saleType: product.saleType,
      minOrderQuantity: moq,
      logoFileName: logoFile?.name,
      uploadInstructions: combinedInstructions || undefined,
      image: {
        src: product.image.src,
        alt: product.image.alt,
      },
    };
  }, [
    product,
    selected,
    moq,
    logoFile,
    uploadInstructions,
    selectedAddons,
    linePricing.finalUnitPrice,
  ]);

  const handleQuantityInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(event.target.value, 10);

    if (Number.isNaN(value)) {
      setQuantity(quantityFloor);
      return;
    }

    setQuantity(Math.max(quantityFloor, value));
  };

  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(quantityFloor, current - quantityStep));
  };

  const increaseQuantity = () => {
    setQuantity((current) => current + quantityStep);
  };

  const handleAddToBag = () => {
    const payload = buildCartPayload();

    if (!payload || !canTransact) {
      return;
    }

    addItem({ ...payload, quantity });
    openCart();
  };

  return (
    <>
      <div className="flex flex-col gap-8 border-t border-gray-200/80 pt-8 lg:gap-10">
        <section className="flex flex-col gap-5">
          <ProductPriceDisplay
            price={currentPrice}
            compareAtPrice={compareAtPriceInInr}
            catalogMode={mode}
            statusMessage={statusMessage}
            sku={selected?.sku}
          />

          {isBulk && moq > 1 ? (
            <p className="mt-2 font-sans text-sm tracking-wide text-gray-500">
              Multiples of{" "}
              <span className="font-semibold text-gray-900">{moq}</span> only
            </p>
          ) : null}

          <VolumeDiscountAppliedBanner
            discountPercent={linePricing.discountPercent}
            quantity={quantity}
          />

          <VolumeDiscountHighlights
            tiers={product.volumeDiscounts}
            activeQuantity={quantity}
            moq={moq}
            saleType={product.saleType}
            onSelectQuantity={handleSelectTierQuantity}
          />
        </section>

        {showSizeSelector ? (
          <VariantOptionGroup
            label="Size"
            name={`${product.handle}-size`}
            options={product.sizes}
            value={sizeKey}
            onChange={selectSize}
            appearance="editorial"
          />
        ) : null}

        {showFrameSelector ? (
          <VariantOptionGroup
            label="Frame"
            name={`${product.handle}-frame`}
            options={product.frames}
            value={frameKey}
            onChange={selectFrame}
            isOptionDisabled={(frameOptionKey) =>
              Boolean(sizeKey) &&
              product.variants.length > 0 &&
              !isFrameAvailableForSize(product, sizeKey, frameOptionKey)
            }
          />
        ) : null}

        <section className="flex flex-col gap-3">
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
            Quantity
          </span>

          <div className="inline-flex w-fit items-stretch border border-gray-200 bg-transparent">
            <button
              type="button"
              onClick={decreaseQuantity}
              className="flex w-11 items-center justify-center border-r border-gray-200 text-gray-600 transition-colors hover:text-gray-950"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <input
              type="number"
              value={quantity}
              onChange={handleQuantityInput}
              min={quantityFloor}
              step={quantityStep}
              className="w-16 appearance-none rounded-none bg-transparent text-center font-sans text-sm font-medium tabular-nums text-gray-950 focus:outline-none"
            />
            <button
              type="button"
              onClick={increaseQuantity}
              className="flex w-11 items-center justify-center border-l border-gray-200 text-gray-600 transition-colors hover:text-gray-950"
              aria-label="Increase quantity"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <span className="mt-2 block font-sans text-xs font-semibold uppercase tracking-widest text-gray-400">
            Minimum Order: {moq} Units
          </span>

          {quantityMessage ? (
            <p className="font-sans text-sm text-pink-700">{quantityMessage}</p>
          ) : null}
        </section>

        <PremiumAddonSelector
          addons={product.premiumAddons}
          selectedNames={selectedAddonNames}
          onToggle={toggleAddon}
        />

        {showLogoUploadBox ? (
          <LogoUploadField
            logoFile={logoFile}
            uploadInstructions={uploadInstructions}
            onLogoFileChange={setLogoFile}
            onUploadInstructionsChange={setUploadInstructions}
          />
        ) : null}

        <button
          type="button"
          onClick={handleAddToBag}
          disabled={!canTransact}
          className={cn(
            "group flex w-full items-center justify-center gap-3 bg-pink-600 bg-gradient-to-r from-rose-600 to-pink-600 px-4 py-4 font-sans text-sm font-bold uppercase tracking-[0.2em] text-white transition-all duration-500 ease-out",
            "hover:-translate-y-1 hover:from-pink-500 hover:to-rose-400 hover:shadow-[0_8px_25px_rgb(225,29,72,0.4)]",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none",
          )}
        >
          <ShoppingBag className="h-4 w-4" aria-hidden="true" />
          <span>Add to Bag · {formatInr(linePricing.lineTotal)}</span>
        </button>
      </div>
    </>
  );
}
