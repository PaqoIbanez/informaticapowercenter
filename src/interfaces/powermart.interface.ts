// src/interfaces/powermart.interface.ts
import type { IMapping, ITableAttribute } from './mapping.interface';
import type { ISession } from './sessiones.interface';
import type { IWorkflow, IConfig, ITask } from './workflow.interface';

/**
 * Representa el nodo raíz del documento XML de PowerCenter.
 * Los atributos se fusionan como propiedades directas debido a `mergeAttrs: true`.
 */
export interface IPowerMart {
  CREATION_DATE: string;
  REPOSITORY_VERSION: string;
  REPOSITORY: IRepository;
}

/**
 * Contiene la información del repositorio y la carpeta principal.
 */
export interface IRepository {
  NAME: string;
  VERSION: string;
  CODEPAGE: string;
  DATABASETYPE: string;
  FOLDER: IFolder; // Asumiendo una sola carpeta principal por repositorio en este XML
}

/**
 * El contenedor principal para todos los objetos de ETL como
 * fuentes, destinos, mapeos, sesiones y workflows.
 */
export interface IFolder {
  NAME: string;
  GROUP?: string; // Presente pero vacío en el ejemplo
  OWNER: string;
  SHARED: "SHARED" | "NOTSHARED";
  DESCRIPTION?: string;
  PERMISSIONS?: string; // Ejemplo: "rwx---r--"
  UUID?: string;
  SOURCE?: ISource[];
  TARGET?: ITarget[];
  MAPPING?: IMapping[];
  SESSION?: ISession[];
  WORKFLOW?: IWorkflow; // Asumiendo un único workflow por archivo XML en este contexto
  CONFIG?: IConfig[];
  TASK?: ITask[]; // Tareas reutilizables definidas directamente en la carpeta
  ERPINFO?: object; // Etiqueta vacía en el XML de ejemplo
}

/**
 * Interfaz genérica para un campo (columna) en una fuente o destino.
 * Los atributos se fusionan como propiedades directas.
 */
export interface IField {
  NAME: string;
  DATATYPE: string; // Ej. "date", "varchar2", "number(p,s)"
  KEYTYPE: "PRIMARY KEY" | "NOT A KEY" | "PRIMARY FOREIGN KEY" | "FOREIGN KEY";
  NULLABLE: "NULL" | "NOTNULL";
  PRECISION: string; // Ej. "19", "200"
  SCALE: string;     // Ej. "0", "9"
  DESCRIPTION?: string;
  BUSINESSNAME?: string;
  FIELDNUMBER: string;
  PICTURETEXT?: string;
  // Atributos específicos para SOURCEFIELD (se hacen opcionales para reutilizar en TARGETFIELD)
  FIELDPROPERTY?: string; // Ej. "0"
  FIELDTYPE?: string;     // Ej. "ELEMITEM"
  HIDDEN?: "YES" | "NO";  // Ej. "NO"
  LENGTH?: string;        // Ej. "19", "0", "10"
  LEVEL?: string;         // Ej. "0"
  OCCURS?: string;        // Ej. "0"
  OFFSET?: string;        // Ej. "0", "19"
  PHYSICALLENGTH?: string; // Ej. "19", "200"
  PHYSICALOFFSET?: string; // Ej. "0", "19"
  USAGE_FLAGS?: string;   // Ej. ""
}

/**
 * Representa una definición de fuente de datos (Source Definition).
 * Los atributos se fusionan como propiedades directas.
 */
export interface ISource {
  NAME: string;
  DATABASETYPE: string;
  DBDNAME: string;
  OWNERNAME: string;
  OBJECTVERSION: string;
  VERSIONNUMBER: string;
  DESCRIPTION?: string;
  BUSINESSNAME?: string; // Presente pero vacío en el ejemplo
  SOURCEFIELD?: IField[];
  FLATFILE?: IFlatFile; // Atributos específicos si es un archivo plano
  TABLEATTRIBUTE?: ITableAttribute[]; // Las fuentes también pueden tener atributos, ej. `Base Table Name`
}

/**
 * Representa una definición de destino de datos (Target Definition).
 * Los atributos se fusionan como propiedades directas.
 */
export interface ITarget {
  NAME: string;
  DATABASETYPE: string;
  OBJECTVERSION: string;
  VERSIONNUMBER: string;
  DESCRIPTION?: string;
  BUSINESSNAME?: string; // Presente pero vacío en el ejemplo
  CONSTRAINT?: string;   // Presente pero vacío en el ejemplo
  TABLEOPTIONS?: string; // Presente pero vacío en el ejemplo
  TARGETFIELD?: IField[];
  TABLEATTRIBUTE?: ITableAttribute[]; // Los destinos pueden tener atributos como Pre/Post SQL
}

/**
 * Propiedades específicas para fuentes de tipo Flat File.
 * Los atributos se fusionan como propiedades directas.
 */
export interface IFlatFile {
  CODEPAGE: string; // Ej. "UTF-8"
  CONSECDELIMITERSASONE: "YES" | "NO"; // Ej. "NO"
  DELIMITED: "YES" | "NO"; // Ej. "YES"
  DELIMITERS: string; // Ej. ","
  ESCAPE_CHARACTER: string; // Ej. ""
  KEEPESCAPECHAR: "YES" | "NO"; // Ej. "NO"
  LINESEQUENTIAL: "YES" | "NO"; // Ej. "NO"
  MULTIDELIMITERSASAND: "YES" | "NO"; // Ej. "YES"
  NULLCHARTYPE: string; // Ej. "ASCII"
  NULL_CHARACTER: string; // Ej. "*"
  PADBYTES: string; // Ej. "1"
  QUOTE_CHARACTER: "SINGLE" | "DOUBLE" | "NONE"; // Ej. "DOUBLE"
  REPEATABLE: "YES" | "NO"; // Ej. "NO"
  ROWDELIMITER: string; // Ej. "10"
  SHIFTSENSITIVEDATA: "YES" | "NO"; // Ej. "NO"
  SKIPROWS: string; // Ej. "1"
  STRIPTRAILINGBLANKS: "YES" | "NO"; // Ej. "NO"
}