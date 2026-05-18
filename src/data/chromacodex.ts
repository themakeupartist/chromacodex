import workbookData from "@/data/generated/workbook-normalized.json";

export type VerificationStatus = "Verified" | "Needs Review" | "Imported" | "Not Provided" | "Incomplete / Needs Review";

export type Source = {
  id: string;
  name: string;
  type: string | null;
  url: string | null;
  reliabilityRole: string | null;
  notes: string | null;
};

export type Brand = {
  id: string;
  name: string | null;
  slug: string;
  manufacturer: string | null;
  synonyms: string[];
  notes: string | null;
};

export type Medium = {
  id: string;
  name: string | null;
  slug: string;
  parentCategory: string | null;
  coreBehaviorNotes: string | null;
};

export type ProductLine = {
  id: string;
  brandId: string | null;
  mediumId: string | null;
  name: string | null;
  slug: string;
  formulationFamily: string | null;
  productLineType: string | null;
  viscosity: string | null;
  finish: string | null;
  openTimeProfile: string | null;
  notes: string | null;
};

export type Pigment = {
  id: string;
  code: string | null;
  slug: string;
  colorFamily: string | null;
  status: string | null;
  fullName?: string | null;
  ciName?: string | null;
  organicOrInorganic?: string | null;
  origin?: string | null;
  notes?: string | null;
};

export type PaintBehavior = {
  transparency: string | null;
  opacityCode: string | null;
  permanence: string | null;
  granulation: string | null;
  staining: string | null;
  temperature: string | null;
  finish: string | null;
  viscosity: string | null;
  openTimeProfile: string | null;
  behaviorSource: string | null;
};

export type Measurement = {
  type: string | null;
  density: number | null;
  rgb: {
    red: number | null;
    green: number | null;
    blue: number | null;
  } | null;
  method: string | null;
  sourceUrl: string | null;
};

export type Paint = {
  id: string;
  brandId: string | null;
  mediumId: string | null;
  productLineId: string | null;
  sourceId: string | null;
  name: string | null;
  slug: string;
  canonicalKey: string | null;
  colorFamily: string | null;
  pigmentCodes: string[];
  pigmentCount: number;
  singlePigment: boolean;
  verificationStatus: VerificationStatus | string | null;
  notes: string | null;
  behavior: PaintBehavior;
  measurement: Measurement | null;
};

type NormalizedWorkbook = typeof workbookData;

const workbook = workbookData as NormalizedWorkbook;
const rawEntities = workbook.entities;

const behaviorByPaintId = new Map(rawEntities.paintBehavior.map((entry) => [entry.paintId, entry]));
const measurementByPaintId = new Map(rawEntities.measurements.map((entry) => [entry.paintId, entry]));

export const sources: Source[] = rawEntities.sources;
export const brands: Brand[] = rawEntities.brands;
export const mediums: Medium[] = rawEntities.mediums;
export const productLines: ProductLine[] = rawEntities.productLines;
export const pigments: Pigment[] = rawEntities.pigments;

export const paints: Paint[] = rawEntities.paints.map((paint) => {
  const behavior = behaviorByPaintId.get(paint.id);
  const measurement = measurementByPaintId.get(paint.id);

  return {
    id: paint.id,
    brandId: paint.brandId,
    mediumId: paint.mediumId,
    productLineId: paint.productLineId,
    sourceId: paint.sourceId,
    name: paint.name,
    slug: paint.slug,
    canonicalKey: paint.canonicalKey,
    colorFamily: paint.colorFamily,
    pigmentCodes: paint.pigmentCodes,
    pigmentCount: paint.pigmentCount,
    singlePigment: paint.singlePigment,
    verificationStatus: paint.verificationStatus,
    notes: paint.notes,
    behavior: {
      transparency: behavior?.transparency ?? null,
      opacityCode: behavior?.opacityCode ?? null,
      permanence: behavior?.permanence ?? null,
      granulation: behavior?.granulation ?? null,
      staining: behavior?.staining ?? null,
      temperature: behavior?.temperature ?? null,
      finish: behavior?.finish ?? null,
      viscosity: behavior?.viscosity ?? null,
      openTimeProfile: behavior?.openTimeProfile ?? null,
      behaviorSource: behavior?.behaviorSource ?? null
    },
    measurement: measurement
      ? {
          type: measurement.measurementType ?? null,
          density: measurement.density ?? null,
          rgb: measurement.rgb
            ? {
                red: measurement.rgb.red ?? null,
                green: measurement.rgb.green ?? null,
                blue: measurement.rgb.blue ?? null
              }
            : null,
          method: measurement.measurementMethod ?? null,
          sourceUrl: measurement.sourceUrl ?? null
        }
      : null
  };
});

export const stats = [
  {
    label: "Workbook source",
    value: "v15"
  },
  {
    label: "Imported paints",
    value: String(workbook.rowCounts.paints)
  },
  {
    label: "Pigments modeled",
    value: String(workbook.rowCounts.pigments)
  },
  {
    label: "Product lines modeled",
    value: String(workbook.rowCounts.productLines)
  }
];

export type BrowseFilters = {
  brand?: string;
  medium?: string;
  productLine?: string;
  pigment?: string;
  colorFamily?: string;
  opacity?: string;
  permanence?: string;
};

export function getBrandById(brandId: string | null) {
  return brands.find((brand) => brand.id === brandId);
}

export function getMediumById(mediumId: string | null) {
  return mediums.find((medium) => medium.id === mediumId);
}

export function getProductLineById(productLineId: string | null) {
  return productLines.find((productLine) => productLine.id === productLineId);
}

export function getPaintById(paintId: string) {
  return paints.find((paint) => paint.id === paintId);
}

export function getPaintsForPigment(code: string) {
  return paints.filter((paint) => paint.pigmentCodes.includes(code));
}

export function getPaintsForBrand(slug: string) {
  const brand = brands.find((entry) => entry.slug === slug);
  return brand ? paints.filter((paint) => paint.brandId === brand.id) : [];
}

export function getPaintsForProductLine(slug: string) {
  const line = productLines.find((entry) => entry.slug === slug);
  return line ? paints.filter((paint) => paint.productLineId === line.id) : [];
}

export function filterPaints(filters: BrowseFilters) {
  return paints.filter((paint) => {
    const brand = getBrandById(paint.brandId);
    const medium = getMediumById(paint.mediumId);
    const line = getProductLineById(paint.productLineId);

    if (filters.brand && brand?.slug !== filters.brand) {
      return false;
    }

    if (filters.medium && medium?.slug !== filters.medium) {
      return false;
    }

    if (filters.productLine && line?.slug !== filters.productLine) {
      return false;
    }

    if (filters.pigment && !paint.pigmentCodes.includes(filters.pigment.toUpperCase())) {
      return false;
    }

    if (filters.colorFamily && paint.colorFamily?.toLowerCase() !== filters.colorFamily.toLowerCase()) {
      return false;
    }

    if (filters.opacity && paint.behavior.opacityCode !== filters.opacity.toUpperCase()) {
      return false;
    }

    if (filters.permanence && paint.behavior.permanence !== filters.permanence.toUpperCase()) {
      return false;
    }

    return true;
  });
}

export function rgbToCss(rgb: Measurement["rgb"]) {
  if (!rgb || rgb.red == null || rgb.green == null || rgb.blue == null) {
    return "linear-gradient(135deg, #d7c7a4, #8c7654)";
  }

  return `rgb(${rgb.red}, ${rgb.green}, ${rgb.blue})`;
}

export function uniqueColorFamilies() {
  return [...new Set(paints.map((paint) => paint.colorFamily).filter(Boolean) as string[])].sort();
}

export function uniqueOpacityCodes() {
  return [...new Set(paints.map((paint) => paint.behavior.opacityCode).filter(Boolean) as string[])].sort();
}

export function uniquePermanenceCodes() {
  return [...new Set(paints.map((paint) => paint.behavior.permanence).filter(Boolean) as string[])].sort();
}
