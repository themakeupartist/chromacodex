import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { execFileSync } from "node:child_process";

const workbookPath = resolve(process.cwd(), "ChromaCodex-Database-v15.xlsx");
const outputPath = resolve(process.cwd(), "src/data/generated/workbook-summary.json");

const pythonScript = String.raw`
import json
import sys
import zipfile
import xml.etree.ElementTree as ET

path = sys.argv[1]
ns = {
    'a': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main',
    'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
}

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

    important = [
        'Brands',
        'Mediums',
        'Product_Lines_Formulations',
        'Paints',
        'Pigments',
        'Paint_Pigments',
        'Paint_Behavior',
        'Measurements',
        'Sources',
        'Master_Paint_Records'
    ]

    payload = {
        'workbook': 'ChromaCodex-Database-v15.xlsx',
        'sheets': []
    }

    for name in important:
        target = sheets.get(name)
        if not target:
            payload['sheets'].append({
                'name': name,
                'found': False,
                'headers': [],
                'rowCount': 0,
                'preview': []
            })
            continue

        xml = ET.fromstring(z.read(target))
        rows = xml.find('a:sheetData', ns).findall('a:row', ns)
        values = [[cell_value(cell) for cell in row.findall('a:c', ns)] for row in rows]

        payload['sheets'].append({
            'name': name,
            'found': True,
            'headers': values[0] if values else [],
            'rowCount': max(len(values) - 1, 0),
            'preview': values[1:6]
        })

print(json.dumps(payload, indent=2))
`;

async function main() {
  const summaryJson = execFileSync("python3", ["-c", pythonScript, workbookPath], {
    cwd: process.cwd(),
    encoding: "utf8"
  });

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, summaryJson);

  console.log(`Wrote workbook summary to ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
