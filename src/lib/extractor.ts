import * as fs from "fs/promises";
import * as path from "path";
import { parseStringPromise } from "xml2js";
import type {
  IExtractionResult,
  IFlatExtractionData,
  IMappedTaskInstance,
} from "../interfaces/index";

import {
  ensureArray,
  mapConfig,
  mapMapping,
  mapSession,
  mapSource,
  mapTarget,
  mapTask,
  mapWorkflow,
} from "./mappingHelpers.ts";

const xmlInputDir = path.join(process.cwd(), "xml_inputs");
const outputJsonFilePath = path.join(process.cwd(), "public/extraction.json");

/**
 * Función principal asíncrona que orquesta el proceso de extracción.
 * Lee, procesa y combina múltiples archivos XML en un único JSON.
 */
async function runExtraction() {
  try {
    // 1. Asegurarse de que el directorio de salida exista
    await fs.mkdir(path.dirname(outputJsonFilePath), { recursive: true });

    // 2. Leer todos los nombres de archivo del directorio de entrada
    const files = await fs.readdir(xmlInputDir);
    const xmlFiles = files.filter(
      (file) => path.extname(file).toLowerCase() === ".xml"
    );

    if (xmlFiles.length === 0) {
      console.log(
        `No se encontraron archivos XML en el directorio: ${xmlInputDir}`
      );
      // Crear un archivo JSON vacío para evitar que la aplicación falle
      await fs.writeFile(
        outputJsonFilePath,
        JSON.stringify(
          {
            repositoryName: "N/A",
            folderName: "N/A",
            summary: {
              totalWorkflows: 0,
              totalSessions: 0,
              totalMappings: 0,
              totalSources: 0,
              totalTargets: 0,
              totalTransformations: 0,
            },
            mappings: [],
            workflows: [],
            sources: [],
            targets: [],
            sessions: [],
            configs: [],
            reusableTasks: [],
            allTasksInstances: [],
          },
          null,
          2
        )
      );
      console.log(
        `Archivo 'extraction.json' vacío creado en ${outputJsonFilePath}`
      );
      return;
    }
    console.log(`Archivos XML encontrados: ${xmlFiles.join(", ")}`);

    // 3. Procesar cada archivo XML en paralelo para mayor eficiencia
    const allResults = await Promise.all(
      xmlFiles.map(async (fileName) => {
        const filePath = path.join(xmlInputDir, fileName);
        const xmlData = await fs.readFile(filePath, "utf8");
        const result: IExtractionResult = await parseStringPromise(xmlData, {
          explicitArray: false,
          mergeAttrs: true,
        });
        return result;
      })
    );

    // 4. Inicializar la estructura de datos final
    const finalExtraction: IFlatExtractionData = {
      repositoryName: "",
      folderName: "",
      summary: {
        totalWorkflows: 0,
        totalSessions: 0,
        totalMappings: 0,
        totalSources: 0,
        totalTargets: 0,
        totalTransformations: 0,
      },
      mappings: [],
      workflows: [],
      sources: [],
      targets: [],
      sessions: [],
      configs: [],
      reusableTasks: [],
      allTasksInstances: [],
    };

    // 5. Iterar y fusionar los resultados
    allResults.forEach((result, index) => {
      const powerMart = result.POWERMART;
      const folder = powerMart.REPOSITORY.FOLDER;

      if (index === 0) {
        finalExtraction.repositoryName = powerMart.REPOSITORY.NAME;
        finalExtraction.folderName = folder.NAME;
      }

      finalExtraction.sources.push(
        ...ensureArray(folder.SOURCE).map(mapSource)
      );
      finalExtraction.targets.push(
        ...ensureArray(folder.TARGET).map(mapTarget)
      );
      finalExtraction.mappings.push(
        ...ensureArray(folder.MAPPING).map(mapMapping)
      );
      finalExtraction.sessions.push(
        ...ensureArray(folder.SESSION).map(mapSession)
      );
      finalExtraction.workflows.push(
        ...ensureArray(folder.WORKFLOW).map(mapWorkflow)
      );
      finalExtraction.configs.push(
        ...ensureArray(folder.CONFIG).map(mapConfig)
      );
      finalExtraction.reusableTasks.push(
        ...ensureArray(folder.TASK).map(mapTask)
      );
    });

    // 6. Recalcular el resumen final
    finalExtraction.summary = {
      totalWorkflows: finalExtraction.workflows.length,
      totalSessions: finalExtraction.sessions.length,
      totalMappings: finalExtraction.mappings.length,
      totalSources: finalExtraction.sources.length,
      totalTargets: finalExtraction.targets.length,
      totalTransformations: finalExtraction.mappings.reduce(
        (acc, m) => acc + (m.transformations?.length || 0),
        0
      ),
    };

    // 7. Consolidar todas las instancias de tareas
    let allTasksInstances: IMappedTaskInstance[] = [];
    finalExtraction.workflows.forEach((wf) => {
      allTasksInstances.push(...wf.tasks);
    });
    finalExtraction.allTasksInstances = allTasksInstances;

    // 8. Guardar el resultado
    await fs.writeFile(
      outputJsonFilePath,
      JSON.stringify(finalExtraction, null, 2)
    );

    console.log(
      `\nExtracción completada. Datos combinados guardados en ${outputJsonFilePath}`
    );
    console.log("Resumen final:", finalExtraction.summary);
  } catch (err) {
    if (
      (err as NodeJS.ErrnoException).code === "ENOENT" &&
      (err as NodeJS.ErrnoException).path === xmlInputDir
    ) {
      console.error(
        `Error: El directorio de entrada '${xmlInputDir}' no existe. Por favor, créalo y añade tus archivos XML.`
      );
    } else {
      console.error("Ocurrió un error durante el proceso de extracción:", err);
    }
  }
}

runExtraction();
