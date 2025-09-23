import type { ITableAttribute } from './mapping.interface';


/**
 * Representa una sesión, que es la instancia ejecutable de un mapeo.
 */
export interface ISession {
  NAME: string;
  MAPPINGNAME: string;
  ISVALID: "YES" | "NO";
  REUSABLE: "YES" | "NO";
  VERSIONNUMBER: string;
  DESCRIPTION?: string;
  SESSTRANSFORMATIONINST?: ISessTransformationInst[];
  SESSIONEXTENSION?: ISessionExtension[];
  ATTRIBUTE: ITableAttribute[];
  CONFIGREFERENCE: {
    TYPE: string;
    REFOBJECTNAME: string;
  };
}

/**
 * Instancia de una transformación dentro de una sesión, define propiedades
 * como el particionamiento.
 */
export interface ISessTransformationInst {
  SINSTANCENAME: string;
  TRANSFORMATIONNAME: string;
  TRANSFORMATIONTYPE: string;
  PIPELINE: string;
  STAGE: string;
  ISREPARTITIONPOINT: "YES" | "NO";
  PARTITIONTYPE: "PASS THROUGH" | "HASH AUTO KEYS" | "ROUND ROBIN" | string; // Puede haber otros tipos
}

/**
 * Define configuraciones específicas para conexiones de la sesión
 * (lectores, escritores, lookups).
 */
export interface ISessionExtension {
  NAME:
    | "Relational Reader"
    | "Relational Writer"
    | "Relational Lookup"
    | "File Reader"
    | "File Writer";
  SINSTANCENAME: string;
  SUBTYPE: string;
  TRANSFORMATIONTYPE: string;
  TYPE: "READER" | "WRITER" | "LOOKUPEXTENSION";
  CONNECTIONREFERENCE: IConnectionReference;
  ATTRIBUTE: ITableAttribute[];
}

/**
 * Referencia a una conexión de base de datos o de otro tipo.
 */
export interface IConnectionReference {
  CNXREFNAME: string;
  CONNECTIONTYPE: "Relational" | "Application" | string;
  VARIABLE: string;
}
