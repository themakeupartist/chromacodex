export type VerificationStatus = "Verified" | "Needs Review" | "Imported";

export type Source = {
  id: string;
  name: string;
  type: string;
  url: string;
  reliabilityRole: string;
  notes: string;
};

export type Brand = {
  id: string;
  name: string;
  slug: string;
  manufacturer: string;
  synonyms: string[];
  notes: string;
};

export type Medium = {
  id: string;
  name: string;
  slug: string;
  parentCategory: string;
  coreBehaviorNotes: string;
};

export type ProductLine = {
  id: string;
  brandId: string;
  mediumId: string;
  name: string;
  slug: string;
  formulationFamily: string;
  productLineType: string;
  viscosity: string | null;
  finish: string | null;
  openTimeProfile: string | null;
  notes: string;
};

export type Pigment = {
  id: string;
  code: string;
  slug: string;
  colorFamily: string;
  status: string;
  fullName?: string;
  ciName?: string;
  organicOrInorganic?: string;
  origin?: string;
  notes?: string;
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
  behaviorSource: string;
};

export type Measurement = {
  type: string;
  density: number | null;
  rgb: {
    red: number;
    green: number;
    blue: number;
  } | null;
  method: string;
  sourceUrl: string;
};

export type Paint = {
  id: string;
  brandId: string;
  mediumId: string;
  productLineId: string;
  sourceId: string;
  name: string;
  slug: string;
  canonicalKey: string;
  colorFamily: string;
  pigmentCodes: string[];
  pigmentCount: number;
  singlePigment: boolean;
  verificationStatus: VerificationStatus;
  notes: string;
  behavior: PaintBehavior;
  measurement: Measurement | null;
};

export const sources: Source[] = [
  {
    id: "S001",
    name: "Sensual Logic Artist Color Data",
    type: "Measured Paint Dataset",
    url: "https://sensuallogic.com/artistcolordata",
    reliabilityRole: "Measured RGB data / source table",
    notes: "Source page states RGB values are measured with a spectrophotometer."
  },
  {
    id: "S002",
    name: "Winsor And Newton Professional Acrylic Colour Chart PDF",
    type: "Official Manufacturer Colour Chart",
    url: "https://www.winsornewton.com",
    reliabilityRole: "Official manufacturer product-line source",
    notes: "Useful for official series, permanence, and line-specific validation."
  }
];

export const brands: Brand[] = [
  {
    id: "B001",
    name: "Winsor And Newton",
    slug: "winsor-and-newton",
    manufacturer: "Colart",
    synonyms: ["Winsor & Newton", "W&N"],
    notes: "Canonical brand name uses And instead of ampersand."
  }
];

export const mediums: Medium[] = [
  {
    id: "M001",
    name: "Oil",
    slug: "oil",
    parentCategory: "Oil Based",
    coreBehaviorNotes: "Traditional oil paint."
  },
  {
    id: "M002",
    name: "Gouache",
    slug: "gouache",
    parentCategory: "Water Based",
    coreBehaviorNotes: "Opaque water-based paint."
  },
  {
    id: "M003",
    name: "Acrylic",
    slug: "acrylic",
    parentCategory: "Water Based",
    coreBehaviorNotes: "Acrylic polymer paint."
  }
];

export const productLines: ProductLine[] = [
  {
    id: "PL001",
    brandId: "B001",
    mediumId: "M001",
    name: "Artists Oil",
    slug: "winsor-and-newton-artists-oil",
    formulationFamily: "Artists Oil",
    productLineType: "Artist Oil",
    viscosity: null,
    finish: null,
    openTimeProfile: null,
    notes: "Traditional Winsor And Newton artist oil line."
  },
  {
    id: "PL002",
    brandId: "B001",
    mediumId: "M002",
    name: "Designers Gouache",
    slug: "winsor-and-newton-designers-gouache",
    formulationFamily: "Designers Gouache",
    productLineType: "Designer Gouache",
    viscosity: null,
    finish: "Matte",
    openTimeProfile: null,
    notes: "Opaque water-based gouache line."
  },
  {
    id: "PL003",
    brandId: "B001",
    mediumId: "M003",
    name: "Galeria Acrylic",
    slug: "winsor-and-newton-galeria-acrylic",
    formulationFamily: "Galeria Acrylic",
    productLineType: "Student Acrylic",
    viscosity: null,
    finish: null,
    openTimeProfile: null,
    notes: "Student acrylic line."
  },
  {
    id: "PL004",
    brandId: "B001",
    mediumId: "M003",
    name: "Professional Acrylic",
    slug: "winsor-and-newton-professional-acrylic",
    formulationFamily: "Professional Acrylic",
    productLineType: "Artist Acrylic",
    viscosity: null,
    finish: null,
    openTimeProfile: null,
    notes: "Professional acrylic line."
  }
];

export const pigments: Pigment[] = [
  {
    id: "PIG000032",
    code: "PR",
    slug: "pr",
    colorFamily: "Red",
    status: "Needs Review",
    notes: "Imported from source as incomplete code and should be validated."
  },
  {
    id: "PIG000033",
    code: "PR101",
    slug: "pr101",
    colorFamily: "Orange",
    status: "Valid",
    notes: "Synthetic iron oxide."
  },
  {
    id: "PIG000046",
    code: "PR83",
    slug: "pr83",
    colorFamily: "Red",
    status: "Valid",
    notes: "Traditional alizarin crimson pigment code."
  },
  {
    id: "PIG000066",
    code: "PY184",
    slug: "py184",
    colorFamily: "Yellow",
    status: "Valid",
    notes: "Bismuth vanadate yellow."
  },
  {
    id: "PIG000068",
    code: "PY35",
    slug: "py35",
    colorFamily: "Yellow",
    status: "Valid",
    notes: "Cadmium yellow pigment family."
  }
];

export const paints: Paint[] = [
  {
    id: "PNT000001",
    brandId: "B001",
    mediumId: "M001",
    productLineId: "PL001",
    sourceId: "S001",
    name: "Alizarin Crimson",
    slug: "alizarin-crimson",
    canonicalKey: "winsor and newton|oil|artists oil|alizarin crimson",
    colorFamily: "Red",
    pigmentCodes: ["PR83"],
    pigmentCount: 1,
    singlePigment: true,
    verificationStatus: "Needs Review",
    notes: "Relational paint product record imported from workbook.",
    behavior: {
      transparency: null,
      opacityCode: "T",
      permanence: "B",
      granulation: null,
      staining: null,
      temperature: null,
      finish: null,
      viscosity: null,
      openTimeProfile: null,
      behaviorSource: "Sensual Logic"
    },
    measurement: {
      type: "Mass Tone RGB",
      density: 1045,
      rgb: {
        red: 68,
        green: 2,
        blue: 6
      },
      method: "Spectrophotometer measured per source page",
      sourceUrl: "https://sensuallogic.com/artistcolordata"
    }
  },
  {
    id: "PNT000002",
    brandId: "B001",
    mediumId: "M001",
    productLineId: "PL001",
    sourceId: "S001",
    name: "Bismuth Yellow",
    slug: "bismuth-yellow",
    canonicalKey: "winsor and newton|oil|artists oil|bismuth yellow",
    colorFamily: "Yellow",
    pigmentCodes: ["PY184"],
    pigmentCount: 1,
    singlePigment: true,
    verificationStatus: "Needs Review",
    notes: "Relational paint product record imported from workbook.",
    behavior: {
      transparency: null,
      opacityCode: "O",
      permanence: "A",
      granulation: null,
      staining: null,
      temperature: null,
      finish: null,
      viscosity: null,
      openTimeProfile: null,
      behaviorSource: "Sensual Logic"
    },
    measurement: {
      type: "Mass Tone RGB",
      density: 1684,
      rgb: {
        red: 255,
        green: 232,
        blue: 0
      },
      method: "Spectrophotometer measured per source page",
      sourceUrl: "https://sensuallogic.com/artistcolordata"
    }
  },
  {
    id: "PNT000003",
    brandId: "B001",
    mediumId: "M001",
    productLineId: "PL001",
    sourceId: "S001",
    name: "Bright Red",
    slug: "bright-red",
    canonicalKey: "winsor and newton|oil|artists oil|bright red",
    colorFamily: "Red",
    pigmentCodes: ["PR"],
    pigmentCount: 1,
    singlePigment: true,
    verificationStatus: "Needs Review",
    notes: "Pigment code appears incomplete in the source and should be reviewed.",
    behavior: {
      transparency: null,
      opacityCode: "T",
      permanence: "A",
      granulation: null,
      staining: null,
      temperature: null,
      finish: null,
      viscosity: null,
      openTimeProfile: null,
      behaviorSource: "Sensual Logic"
    },
    measurement: {
      type: "Mass Tone RGB",
      density: 1784,
      rgb: {
        red: 197,
        green: 0,
        blue: 15
      },
      method: "Spectrophotometer measured per source page",
      sourceUrl: "https://sensuallogic.com/artistcolordata"
    }
  },
  {
    id: "PNT000004",
    brandId: "B001",
    mediumId: "M001",
    productLineId: "PL001",
    sourceId: "S001",
    name: "Burnt Sienna",
    slug: "burnt-sienna",
    canonicalKey: "winsor and newton|oil|artists oil|burnt sienna",
    colorFamily: "Orange",
    pigmentCodes: ["PR101"],
    pigmentCount: 1,
    singlePigment: true,
    verificationStatus: "Needs Review",
    notes: "Relational paint product record imported from workbook.",
    behavior: {
      transparency: null,
      opacityCode: "T",
      permanence: "AA",
      granulation: null,
      staining: null,
      temperature: null,
      finish: null,
      viscosity: null,
      openTimeProfile: null,
      behaviorSource: "Sensual Logic"
    },
    measurement: {
      type: "Mass Tone RGB",
      density: 1181,
      rgb: {
        red: 82,
        green: 42,
        blue: 31
      },
      method: "Spectrophotometer measured per source page",
      sourceUrl: "https://sensuallogic.com/artistcolordata"
    }
  },
  {
    id: "PNT000005",
    brandId: "B001",
    mediumId: "M001",
    productLineId: "PL001",
    sourceId: "S001",
    name: "Cadmium Lemon",
    slug: "cadmium-lemon",
    canonicalKey: "winsor and newton|oil|artists oil|cadmium lemon",
    colorFamily: "Yellow",
    pigmentCodes: ["PY35"],
    pigmentCount: 1,
    singlePigment: true,
    verificationStatus: "Needs Review",
    notes: "Relational paint product record imported from workbook.",
    behavior: {
      transparency: null,
      opacityCode: "O",
      permanence: "A",
      granulation: null,
      staining: null,
      temperature: null,
      finish: null,
      viscosity: null,
      openTimeProfile: null,
      behaviorSource: "Sensual Logic"
    },
    measurement: {
      type: "Mass Tone RGB",
      density: 2166,
      rgb: {
        red: 255,
        green: 222,
        blue: 0
      },
      method: "Spectrophotometer measured per source page",
      sourceUrl: "https://sensuallogic.com/artistcolordata"
    }
  }
];

export const stats = [
  {
    label: "Workbook source",
    value: "v15"
  },
  {
    label: "Starter paints",
    value: String(paints.length)
  },
  {
    label: "Mediums modeled",
    value: String(mediums.length)
  },
  {
    label: "Product lines modeled",
    value: String(productLines.length)
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

export function getBrandById(brandId: string) {
  return brands.find((brand) => brand.id === brandId);
}

export function getMediumById(mediumId: string) {
  return mediums.find((medium) => medium.id === mediumId);
}

export function getProductLineById(productLineId: string) {
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

    if (filters.colorFamily && paint.colorFamily.toLowerCase() !== filters.colorFamily.toLowerCase()) {
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
  if (!rgb) {
    return "linear-gradient(135deg, #d7c7a4, #8c7654)";
  }

  return `rgb(${rgb.red}, ${rgb.green}, ${rgb.blue})`;
}

export function uniqueColorFamilies() {
  return [...new Set(paints.map((paint) => paint.colorFamily))].sort();
}

export function uniqueOpacityCodes() {
  return [...new Set(paints.map((paint) => paint.behavior.opacityCode).filter(Boolean) as string[])].sort();
}

export function uniquePermanenceCodes() {
  return [...new Set(paints.map((paint) => paint.behavior.permanence).filter(Boolean) as string[])].sort();
}
