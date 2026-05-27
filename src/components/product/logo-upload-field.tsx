"use client";

import { UploadCloud, X } from "lucide-react";
import { useRef } from "react";

type LogoUploadFieldProps = {
  logoFile: File | null;
  uploadInstructions: string;
  onLogoFileChange: (file: File | null) => void;
  onUploadInstructionsChange: (value: string) => void;
};

export function LogoUploadField({
  logoFile,
  uploadInstructions,
  onLogoFileChange,
  onUploadInstructionsChange,
}: LogoUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const clearFile = () => {
    onLogoFileChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  const handleUploadAreaClick = () => {
    if (logoFile) {
      const shouldReplace = window.confirm("Replace current file?");
      if (!shouldReplace) {
        return;
      }
    }

    openFilePicker();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    onLogoFileChange(file);
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="flex items-center gap-2 font-sans text-xs uppercase tracking-widest text-foreground">
        Artwork File
        <span className="font-normal lowercase tracking-normal text-muted/60">
          (optional)
        </span>
      </label>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.ai,.eps,.svg,.png,.jpg,.jpeg,.webp"
        onChange={handleFileChange}
        className="sr-only"
        aria-hidden={!logoFile}
        tabIndex={-1}
      />

      {logoFile ? (
        <div
          className="flex items-center justify-between gap-3 rounded-sm border border-border/80 bg-border/10 px-4 py-3"
          role="status"
          aria-live="polite"
        >
          <p className="min-w-0 flex-1 font-sans text-sm text-foreground">
            <span className="font-medium text-muted">File Uploaded:</span>{" "}
            <span className="break-all">{logoFile.name}</span>
          </p>
          <button
            type="button"
            onClick={clearFile}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-sm border border-border/80 px-3 py-1.5 font-sans text-xs uppercase tracking-wider text-muted transition-colors hover:border-magenta hover:text-magenta"
            aria-label={`Remove ${logoFile.name}`}
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            Remove
          </button>
        </div>
      ) : null}

      <button
        type="button"
        onClick={handleUploadAreaClick}
        className="group relative flex w-full cursor-pointer flex-col items-center justify-center rounded-sm border border-dashed border-border/80 p-6 text-center transition-all duration-300 hover:border-saffron/50 hover:bg-border/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron/40"
        aria-label={
          logoFile
            ? "Replace uploaded artwork file"
            : "Upload artwork file"
        }
      >
        <UploadCloud className="mb-3 h-6 w-6 text-muted transition-colors group-hover:text-saffron" />
        <span className="font-sans text-sm font-medium text-foreground">
          {logoFile ? "Click to replace file" : "Click or drag file to upload"}
        </span>
        {!logoFile ? (
          <span className="mt-1 font-sans text-xs text-muted">
            AI, PDF, EPS, or High-Res PNG
          </span>
        ) : (
          <span className="mt-1 font-sans text-xs text-muted">
            You will be asked to confirm before replacing
          </span>
        )}
      </button>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="upload-instructions"
          className="font-sans text-xs text-muted"
        >
          Upload instructions (optional)
        </label>
        <textarea
          id="upload-instructions"
          rows={3}
          value={uploadInstructions}
          onChange={(event) => onUploadInstructionsChange(event.target.value)}
          placeholder="Placement notes, Pantone references, or alternate contact for artwork…"
          className="rounded-sm border border-border/50 bg-background px-4 py-3 font-sans text-sm text-foreground placeholder:text-muted focus:border-saffron focus:outline-none"
        />
      </div>
    </div>
  );
}
