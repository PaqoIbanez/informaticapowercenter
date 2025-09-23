import type { IMapping } from './mapping.interface';
import type { ISession } from './sessiones.interface';
import type { IWorkflow, IConfig, ITask } from './workflow.interface';


/**
 * Representa el nodo raíz del documento XML de PowerCenter.
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
  FOLDER: IFolder;
}

/**
 * Es el contenedor principal de todos los objetos de ETL como
 * fuentes, destinos, mapeos, sesiones y workflows.
 */
export interface IFolder {
  NAME: string;
  DESCRIPTION?: string;
  OWNER: string;
  SHARED: "SHARED" | "NOTSHARED";
  UUID: string;
  SOURCE?: ISource[];
  TARGET?: ITarget[];
  MAPPING?: IMapping[];
  SESSION?: ISession[];
  WORKFLOW?: IWorkflow[];
  CONFIG?: IConfig[];
  TASK?: ITask[];
  CONNECTION?: IConnection[];
}
/*
### Interfaces para Fuentes (Sources) y Destinos (Targets)

Modelan las definiciones de las tablas, archivos u otros orígenes y destinos de datos.


 * Interfaz genérica para un campo (columna) en una fuente o destino.
*/
export interface IField {
  NAME: string;
  DATATYPE: string;
  KEYTYPE: "PRIMARY KEY" | "NOT A KEY" | "PRIMARY FOREIGN KEY" | "FOREIGN KEY";
  NULLABLE: "NULL" | "NOTNULL";
  PRECISION: string;
  SCALE: string;
  DESCRIPTION?: string;
  BUSINESSNAME?: string;
  FIELDNUMBER: string;
  PICTURETEXT?: string;
}

/**
 * Representa una definición de fuente de datos (Source Definition).
 */
export interface ISource {
  NAME: string;
  DATABASETYPE: string;
  DBDNAME: string;
  OWNERNAME: string;
  DESCRIPTION?: string;
  OBJECTVERSION: string;
  VERSIONNUMBER: string;
  SOURCEFIELD: IField[];
  FLATFILE?: IFlatFile; // Atributos específicos si es un archivo plano
}

/**
 * Representa una definición de destino de datos (Target Definition).
 */
export interface ITarget {
  NAME: string;
  DATABASETYPE: string;
  DESCRIPTION?: string;
  OBJECTVERSION: string;
  VERSIONNUMBER: string;
  TARGETFIELD: IField[];
  CONSTRAINT?: string;
}

/**
 * Propiedades específicas para fuentes de tipo Flat File.
 */
export interface IFlatFile {
  CODEPAGE: string;
  DELIMITED: "YES" | "NO";
  DELIMITERS: string;
  QUOTE_CHARACTER: "SINGLE" | "DOUBLE" | "NONE";
  SKIPROWS: string;
}

/**
 * Representa una conexión de base de datos o de otro tipo.
 */
export interface IConnection {
  NAME: string;
  TYPE: "Relational" | "Application" | string;
  USERNAME?: string;
  PASSWORD?: string;
  HOST?: string;
  PORT?: string;
  DATABASE?: string;
  CONNECTIONSTRING?: string;
}
