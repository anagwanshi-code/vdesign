"use client";

import { AddToBagConfirmationModal } from "@/components/product/add-to-bag-confirmation-modal";
import { LogoUploadField } from "@/components/product/logo-upload-field";
import { ProductPriceDisplay } from "@/components/product/product-price-display";
import { useProductVariant } from "@/components/product/product-variant-context";
import { VariantOptionGroup } from "@/components/product/variant-option-group";
import { useCart } from "@/hooks/use-cart";
import {
  getQuantityValidationMessage,
  isQuantityValidForSaleType,
  normalizeMoq,
} from "@/lib/commerce/moq";
import { formatInr } from "@/lib/product/variants";
import { isFrameAvailableForSize } from "@/lib/product/variants";
import { ShoppingBag } from "lucide-react";
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

  const { addItem } = useCart();
  const isBulk = product.saleType === "bulk";
  const minOrderQuantity = normalizeMoq(product.minOrderQuantity);
  const quantityFloor = getQuantityFloor(product.saleType, minOrderQuantity);
  const quantityStep = getQuantityStep(product.saleType, minOrderQuantity);
  const showLogoUploadBox = product.logoUploadRequired;

  const [quantity, setQuantity] = useState(() =>
    getInitialQuantity(product.saleType, minOrderQuantity),
  );
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [uploadInstructions, setUploadInstructions] = useState("");
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const lineTotalLabel = formatInr(currentPrice * quantity);

  const meetsQuantityRules = useMemo(
    () =>
      isQuantityValidForSaleType(
        quantity,
        minOrderQuantity,
        product.saleType,
      ),
    [quantity, minOrderQuantity, product.saleType],
  );

  const quantityMessage = meetsQuantityRules
    ? null
    : getQuantityValidationMessage(minOrderQuantity, product.saleType);

  const canTransact = canPurchase && meetsQuantityRules;

  const variantLabel =
    [selected?.sizeLabel, selected?.frameLabel].filter(Boolean).join(" · ") ||
    "Standard";

  const buildCartPayload = useCallback(() => {
    if (!selected) {
      return null;
    }

    const variantSubtitle = [selected.sizeLabel, selected.frameLabel]
      .filter(Boolean)
      .join(" · ");

    return {
      productId: product.id,
      variantKey: selected.variantKey,
      title: product.title,
      subtitle: variantSubtitle || product.subtitle,
      priceLabel: selected.priceLabel,
      priceInInr: selected.priceInInr,
      sku: selected.sku,
      sizeLabel: selected.sizeLabel,
      frameLabel: selected.frameLabel,
      saleType: product.saleType,
      minOrderQuantity,
      logoFileName: logoFile?.name,
      uploadInstructions: uploadInstructions.trim() || undefined,
      image: {
        src: product.image.src,
        alt: product.image.alt,
      },
    };
  }, [product, selected, minOrderQuantity, logoFile, uploadInstructions]);

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
    setIsConfirmationOpen(true);
  };

  return (
    <>
      <div className="mt-8 flex flex-col gap-8 border-t border-border/50 pt-8">
        <ProductPriceDisplay
          price={currentPrice}
          compareAtPrice={compareAtPriceInInr}
          catalogMode={mode}
          statusMessage={statusMessage}
          sku={selected?.sku}
        />

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

        <div className="flex flex-col gap-3">
          <label className="flex items-center justify-between font-sans text-xs uppercase tracking-widest text-muted">
            <span>Quantity</span>
            {isBulk ? (
              <span className="text-saffron">MOQ: {minOrderQuantity} Units</span>
            ) : (
              <span>Min. {minOrderQuantity} units</span>
            )}
          </label>
          <div className="flex w-max items-center rounded-sm border border-border/50 bg-background">
            <button
              type="button"
              onClick={decreaseQuantity}
              className="px-4 py-3 text-muted transition-colors hover:text-foreground"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <input
              type="number"
              value={quantity}
              onChange={handleQuantityInput}
              min={quantityFloor}
              step={quantityStep}
              className="w-16 appearance-none bg-transparent text-center font-sans text-sm text-foreground focus:outline-none"
            />
            <button
              type="button"
              onClick={increaseQuantity}
              className="px-4 py-3 text-muted transition-colors hover:text-foreground"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          {quantityMessage ? (
            <p className="font-sans text-xs text-magenta">{quantityMessage}</p>
          ) : null}
        </div>

        {showLogoUploadBox ? (
          <LogoUploadField
            logoFile={logoFile}
            uploadInstructions={uploadInstructions}
            onLogoFileChange={setLogoFile}
            onUploadInstructionsChange={setUploadInstructions}
          />
        ) : null}

        <div className="mt-4 flex flex-col gap-4">
          <button
            type="button"
            onClick={handleAddToBag}
            disabled={!canTransact}
            className="flex w-full items-center justify-center gap-3 bg-foreground py-4 font-sans text-xs uppercase tracking-widest text-background transition-colors duration-500 hover:bg-saffron hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ShoppingBag className="h-4 w-4" />
            Add to Bag • {lineTotalLabel}
          </button>
        </div>
      </div>

      <AddToBagConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        quantity={quantity}
        productTitle={product.title}
        variant={variantLabel}
      />
    </>
  );
}
