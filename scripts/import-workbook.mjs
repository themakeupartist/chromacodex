import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { execFileSync } from "node:child_process";

import { writeSeedSql } from "./generate-seed-sql.mjs";

const workbookPath = resolve(process.cwd(), "ChromaCodex-Database-v15.xlsx");
const summaryPath = resolve(process.cwd(), "src/data/generated/workbook-summary.json");
const normalizedPath = resolve(process.cwd(), "src/data/generated/workbook-normalized.json");
const seedPath = resolve(process.cwd(), "supabase/seed.sql");

const importantSheets = [
  "Brands",
  "Mediums",
  "Product_Lines_Formulations",
  "Paints",
  "Pigments",
  "Paint_Pigments",
  "Paint_Behavior",
  "Measurements",
  "Sources",
  "Master_Paint_Records"
];

const pythonScript = String.raw`
import json
import sys
import zipfile
import xml.etree.ElementTree as ET

path = sys.argv[1]
important = json.loads(sys.argv[2])
ns = {
    'a': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main',
    'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
}

def cell_column_index(reference):
    letters = ''.join(ch for ch in reference if ch.isalpha())
    total = 0
    for ch in letters:
        total = total * 26 + (ord(ch.upper()) - 64)
    return max(total - 1, 0)

with zipfile.ZipFile(path) as z:
    shared = []
    if 'xl/sharedStrings.xml' in z.namelist():
        root = ET.fromstring(z.read('xl/sharedStrings.xml'))
        for si in root.findall('a:si', ns):
            shared.append(''.join(t.text or '' for t in si.iterfind('.//a:t', ns)))

    wb = ET.fromstring(z.read('xl/workbook.xml'))
    rels = ET.fromstring(z.read('xl/_rels/workbook.xml.rels'))
    relmap = {rel.attrib['Id']: rel.attrib['Target'] for rel in rels}

    sheets = {}
    for sheet in wb.find('a:sheets', ns):
        rid = sheet.attrib['{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id']
        sheets[sheet.attrib['name']] = 'xl/' + relmap[rid]

    def cell_value(cell):
        cell_type = cell.attrib.get('t')
        value = cell.find('a:v', ns)

        if cell_type == 's' and value is not None:
            return shared[int(value.text)]

        if cell_type == 'inlineStr':
            inline = cell.find('a:is', ns)
            if inline is None:
                return ''
            return ''.join(t.text or '' for t in inline.iterfind('.//a:t', ns))

        return value.text if value is not None else ''

    def row_values(row):
        cells = {}
        max_index = -1
        for cell in row.findall('a:c', ns):
            reference = cell.attrib.get('r', '')
            index = cell_column_index(reference)
            cells[index] = cell_value(cell)
            if index > max_index:
                max_index = index
        if max_index < 0:
            return []
        return [cells.get(index, '') for index in range(max_index + 1)]

    payload = {
        'workbook': 'ChromaCodex-Database-v15.xlsx',
        'sheets': {}
    }

    for name in important:
        target = sheets.get(name)
        if not target:
            payload['sheets'][name] = {
                'found': False,
                'headers': [],
                'rows': []
            }
            continue

        xml = ET.fromstring(z.read(target))
        sheet_data = xml.find('a:sheetData', ns)
        rows = sheet_data.findall('a:row', ns) if sheet_data is not None else []
        values = [row_values(row) for row in rows]
        headers = values[0] if values else []
        body = []

        for raw in values[1:]:
            padded = raw + [''] * max(len(headers) - len(raw), 0)
            row_object = {}
            for index, header in enumerate(headers):
                row_object[header] = padded[index] if index < len(padded) else ''
            body.append(row_object)

        payload['sheets'][name] = {
            'found': True,
            'headers': headers,
            'rows': body
        }

print(json.dumps(payload, indent=2))
`;

function normalizeText(value) {
  if (value == null) {
    return null;
  }

  const trimmed = String(value).trim();
  return trimmed === "" ? null : trimmed;
}

function parseInteger(value) {
  const normalized = normalizeText(value);

  if (!normalized) {
    return null;
  }

  const parsed = Number.parseInt(normalized, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function slugify(value) {
  const normalized = normalizeText(value);

  if (!normalized) {
    return "";
  }

  return normalized
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function splitList(value) {
  const normalized = normalizeText(value);

  if (!normalized) {
    return [];
  }

  return normalized
    .split(/[;,]/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function getSheet(payload, name) {
  return payload.sheets[name] ?? { found: false, headers: [], rows: [] };
}

function buildSummary(payload) {
  return {
    workbook: payload.workbook,
    sheets: importantSheets.map((name) => {
      const sheet = getSheet(payload, name);

      return {
        name,
        found: sheet.found,
        headers: sheet.headers,
        rowCount: sheet.rows.length,
        preview: sheet.rows.slice(0, 5).map((row) => sheet.headers.map((header) => row[header] ?? ""))
      };
    })
  };
}

function collectDuplicates(records, keyField, idField) {
  const counts = new Map();

  records.forEach((record) => {
    const key = normalizeText(record[keyField]);
    if (!key) {
      return;
    }

    const existing = counts.get(key) ?? [];
    existing.push(record[idField]);
    counts.set(key, existing);
  });

  return [...counts.entries()]
    .filter(([, ids]) => ids.length > 1)
    .map(([key, ids]) => ({
      key,
      count: ids.length,
      ids
    }));
}

function findMissingReferences(records, field, validIds, labelField = "id") {
  return records
    .filter((record) => {
      const value = normalizeText(record[field]);
      return value && !validIds.has(value);
    })
    .map((record) => ({
      [labelField]: record.id,
      missingField: field,
      missingId: record[field]
    }));
}

function isSuspiciousPigmentCode(code) {
  const normalized = normalizeText(code);

  if (!normalized) {
    return true;
  }

  if (/not provided/i.test(normalized)) {
    return true;
  }

  return !/\d/.test(normalized);
}

function normalizeWorkbook(payload) {
  const sources = getSheet(payload, "Sources").rows.map((row) => ({
    id: row.Source_ID,
    name: normalizeText(row.Source_Name),
    type: normalizeText(row.Source_Type),
    url: normalizeText(row.Source_URL),
    reliabilityRole: normalizeText(row.Reliability_Role),
    notes: normalizeText(row.Notes)
  }));

  const brands = getSheet(payload, "Brands").rows.map((row) => ({
    id: row.Brand_ID,
    name: normalizeText(row.Brand_Name),
    slug: slugify(row.Brand_System_Value ?? row.Brand_Name),
    manufacturer: normalizeText(row.Manufacturer),
    synonyms: splitList(row.Synonyms),
    notes: normalizeText(row.Notes)
  }));

  const mediums = getSheet(payload, "Mediums").rows.map((row) => ({
    id: row.Medium_ID,
    name: normalizeText(row.Medium),
    slug: slugify(row.Medium_System_Value ?? row.Medium),
    parentCategory: normalizeText(row.Parent_Category),
    coreBehaviorNotes: normalizeText(row.Core_Behavior_Notes)
  }));

  const productLines = getSheet(payload, "Product_Lines_Formulations").rows.map((row) => ({
    id: row.Product_Line_ID,
    brandId: normalizeText(row.Brand_ID),
    mediumId: normalizeText(row.Medium_ID),
    name: normalizeText(row.Product_Line_Name),
    slug: slugify(row.Product_Line_System_Value ?? row.Product_Line_Name),
    formulationFamily: normalizeText(row.Formulation_Family),
    productLineType: normalizeText(row.Product_Line_Type),
    viscosity: normalizeText(row.Viscosity),
    finish: normalizeText(row.Finish),
    openTimeProfile: normalizeText(row.Open_Time_Profile),
    notes: normalizeText(row.Notes)
  }));

  const pigments = getSheet(payload, "Pigments").rows.map((row) => ({
    id: row.Pigment_ID,
    code: normalizeText(row.Pigment_Code),
    slug: slugify(row.Pigment_Code),
    fullName: normalizeText(row.Pigment_Full_Name),
    ciName: normalizeText(row.CI_Name),
    organicOrInorganic: normalizeText(row.Organic_or_Inorganic),
    origin: normalizeText(row.Pigment_Origin),
    colorFamily: normalizeText(row.Color_Family),
    status: normalizeText(row.Status),
    notes: normalizeText(row.Notes)
  }));

  const paints = getSheet(payload, "Paints").rows.map((row) => ({
    id: row.Paint_ID,
    recordId: parseInteger(row.Record_ID),
    sourceRecordId: parseInteger(row.Source_Record_ID),
    brandId: normalizeText(row.Brand_ID),
    mediumId: normalizeText(row.Medium_ID),
    productLineId: normalizeText(row.Product_Line_ID),
    sourceId: normalizeText(row.Source_ID),
    name: normalizeText(row.Paint_Name),
    slug: slugify(row.Paint_Name),
    canonicalKey: normalizeText(row.Paint_Product_Key),
    colorFamily: normalizeText(row.Color_Family),
    verificationStatus: normalizeText(row.Verification_Status),
    notes: normalizeText(row.Notes)
  }));

  const paintPigments = getSheet(payload, "Paint_Pigments").rows.map((row) => ({
    id: row.Paint_Pigment_ID,
    paintId: normalizeText(row.Paint_ID),
    pigmentId: normalizeText(row.Pigment_ID),
    pigmentCode: normalizeText(row.Pigment_Code),
    pigmentSequence: parseInteger(row.Pigment_Sequence),
    relationshipType: normalizeText(row.Relationship_Type),
    verificationStatus: normalizeText(row.Verification_Status),
    notes: normalizeText(row.Notes)
  }));

  const paintBehavior = getSheet(payload, "Paint_Behavior").rows.map((row) => ({
    id: row.Behavior_ID,
    paintId: normalizeText(row.Paint_ID),
    transparency: normalizeText(row.Transparency),
    opacityCode: normalizeText(row.Opacity_Code),
    permanence: normalizeText(row.Permanence),
    granulation: normalizeText(row.Granulation),
    staining: normalizeText(row.Staining),
    temperature: normalizeText(row.Temperature),
    finish: normalizeText(row.Finish),
    viscosity: normalizeText(row.Viscosity),
    openTimeProfile: normalizeText(row.Open_Time_Profile),
    behaviorSource: normalizeText(row.Behavior_Source),
    verificationStatus: normalizeText(row.Verification_Status),
    notes: normalizeText(row.Notes)
  }));

  const measurements = getSheet(payload, "Measurements").rows.map((row) => ({
    id: row.Measurement_ID,
    paintId: normalizeText(row.Paint_ID),
    sourceId: normalizeText(row.Source_ID),
    measurementType: normalizeText(row.Measurement_Type),
    density: parseInteger(row.Density),
    rgb: row.RGB_Red || row.RGB_Green || row.RGB_Blue
      ? {
          red: parseInteger(row.RGB_Red),
          green: parseInteger(row.RGB_Green),
          blue: parseInteger(row.RGB_Blue)
        }
      : null,
    rgbCombined: normalizeText(row.RGB_Combined),
    swatch: normalizeText(row.Swatch),
    measurementMethod: normalizeText(row.Measurement_Method),
    sourceUrl: normalizeText(row.Source_URL),
    notes: normalizeText(row.Notes)
  }));

  const paintPigmentsByPaintId = paintPigments.reduce((map, entry) => {
    const existing = map.get(entry.paintId) ?? [];
    existing.push(entry);
    map.set(entry.paintId, existing);
    return map;
  }, new Map());

  const behaviorByPaintId = new Set(paintBehavior.map((entry) => entry.paintId));
  const measurementsByPaintId = new Set(measurements.map((entry) => entry.paintId));

  const paintsWithDerivedFields = paints.map((paint) => {
    const relatedPigments = (paintPigmentsByPaintId.get(paint.id) ?? []).sort((left, right) => {
      return (left.pigmentSequence ?? Number.MAX_SAFE_INTEGER) - (right.pigmentSequence ?? Number.MAX_SAFE_INTEGER);
    });

    const pigmentCodes = relatedPigments.map((entry) => entry.pigmentCode).filter(Boolean);
    const pigmentCount = pigmentCodes.length;

    return {
      ...paint,
      pigmentCodes,
      pigmentCount,
      singlePigment: pigmentCount === 1,
      hasBehavior: behaviorByPaintId.has(paint.id),
      hasMeasurement: measurementsByPaintId.has(paint.id)
    };
  });

  const brandIds = new Set(brands.map((entry) => entry.id));
  const mediumIds = new Set(mediums.map((entry) => entry.id));
  const productLineIds = new Set(productLines.map((entry) => entry.id));
  const sourceIds = new Set(sources.map((entry) => entry.id));
  const pigmentIds = new Set(pigments.map((entry) => entry.id));
  const paintIds = new Set(paints.map((entry) => entry.id));

  const integrity = {
    missingSheets: importantSheets.filter((name) => !getSheet(payload, name).found),
    duplicateCanonicalKeys: collectDuplicates(paintsWithDerivedFields, "canonicalKey", "id"),
    suspiciousPigmentCodes: pigments
      .filter((pigment) => isSuspiciousPigmentCode(pigment.code))
      .map((pigment) => ({
        id: pigment.id,
        code: pigment.code,
        status: pigment.status,
        notes: pigment.notes
      })),
    missingReferences: {
      productLinesBrandId: findMissingReferences(productLines, "brandId", brandIds),
      productLinesMediumId: findMissingReferences(productLines, "mediumId", mediumIds),
      paintsBrandId: findMissingReferences(paintsWithDerivedFields, "brandId", brandIds),
      paintsMediumId: findMissingReferences(paintsWithDerivedFields, "mediumId", mediumIds),
      paintsProductLineId: findMissingReferences(paintsWithDerivedFields, "productLineId", productLineIds),
      paintsSourceId: findMissingReferences(paintsWithDerivedFields, "sourceId", sourceIds),
      paintPigmentsPaintId: findMissingReferences(paintPigments, "paintId", paintIds),
      paintPigmentsPigmentId: findMissingReferences(paintPigments, "pigmentId", pigmentIds),
      paintBehaviorPaintId: findMissingReferences(paintBehavior, "paintId", paintIds),
      measurementsPaintId: findMissingReferences(measurements, "paintId", paintIds),
      measurementsSourceId: findMissingReferences(measurements, "sourceId", sourceIds)
    },
    paintsWithoutPigmentLinks: paintsWithDerivedFields.filter((paint) => paint.pigmentCount === 0).map((paint) => paint.id),
    paintsWithoutBehavior: paintsWithDerivedFields.filter((paint) => !paint.hasBehavior).map((paint) => paint.id),
    paintsWithoutMeasurements: paintsWithDerivedFields.filter((paint) => !paint.hasMeasurement).map((paint) => paint.id)
  };

  return {
    generatedAt: new Date().toISOString(),
    workbook: payload.workbook,
    rowCounts: {
      sources: sources.length,
      brands: brands.length,
      mediums: mediums.length,
      productLines: productLines.length,
      pigments: pigments.length,
      paints: paintsWithDerivedFields.length,
      paintPigments: paintPigments.length,
      paintBehavior: paintBehavior.length,
      measurements: measurements.length
    },
    entities: {
      sources,
      brands,
      mediums,
      productLines,
      pigments,
      paints: paintsWithDerivedFields,
      paintPigments,
      paintBehavior,
      measurements
    },
    integrity
  };
}

async function main() {
  const rawJson = execFileSync("python3", ["-c", pythonScript, workbookPath, JSON.stringify(importantSheets)], {
    cwd: process.cwd(),
    encoding: "utf8",
    maxBuffer: 50 * 1024 * 1024
  });

  const payload = JSON.parse(rawJson);
  const summary = buildSummary(payload);
  const normalized = normalizeWorkbook(payload);

  await mkdir(dirname(summaryPath), { recursive: true });
  await writeFile(summaryPath, JSON.stringify(summary, null, 2));
  await writeFile(normalizedPath, JSON.stringify(normalized, null, 2));
  await writeSeedSql(normalized, seedPath);

  console.log(`Wrote workbook summary to ${summaryPath}`);
  console.log(`Wrote normalized workbook export to ${normalizedPath}`);
  console.log(`Wrote Supabase seed SQL to ${seedPath}`);
  console.log(`Normalized ${normalized.rowCounts.paints} paints and ${normalized.rowCounts.paintPigments} paint-pigment links.`);

  if (normalized.integrity.duplicateCanonicalKeys.length > 0) {
    console.log(`Found ${normalized.integrity.duplicateCanonicalKeys.length} duplicate canonical keys.`);
  }

  if (normalized.integrity.suspiciousPigmentCodes.length > 0) {
    console.log(`Flagged ${normalized.integrity.suspiciousPigmentCodes.length} suspicious pigment codes for review.`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
