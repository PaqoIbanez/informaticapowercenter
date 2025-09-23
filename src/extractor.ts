import * as fs from 'fs';
import * as path from 'path';
import { parseString } from 'xml2js';
import type { IPowerMart } from './interfaces/powermart.interface';


const xmlFilePath = path.join(process.cwd(), 'wkf_03_DI_CARGA_INDICADORES.XML');

fs.readFile(xmlFilePath, 'utf8', (err: NodeJS.ErrnoException | null, data: string) => {
  if (err) {
    console.error('Error reading XML file:', err);
    return;
  }

  parseString(data, { explicitArray: false }, (err: Error | null, result: any) => {
    if (err) {
      console.error('Error parsing XML:', err);
      return;
    }

    const powerMart: IPowerMart = result.POWERMART;

    // Aquí puedes procesar y mapear a las interfaces
    console.log(JSON.stringify(powerMart, null, 2));

    // Guardar en archivo
    fs.writeFileSync(path.join(process.cwd(), 'extraction_updated.json'), JSON.stringify(powerMart, null, 2));
  });
});