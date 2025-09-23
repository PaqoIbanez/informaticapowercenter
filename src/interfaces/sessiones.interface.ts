// src/interfaces/sessiones.interface.ts
import type { ITableAttribute } from './mapping.interface';

/**
 * Representa una sesión, que es la instancia ejecutable de un mapeo.
 * Los atributos se fusionan como propiedades directas.
 */
export interface ISession {
  NAME: string;
  MAPPINGNAME: string;
  ISVALID: "YES" | "NO";
  REUSABLE: "YES" | "NO";
  VERSIONNUMBER: string;
  DESCRIPTION?: string;
  SORTORDER?: string; // Ej. "Binary"
  SESSTRANSFORMATIONINST?: ISessTransformationInst[];
  SESSIONEXTENSION?: ISessionExtension[];
  ATTRIBUTE?: ITableAttribute[];
  CONFIGREFERENCE: IConfigReference;
  SESSIONCOMPONENT?: ISessionComponent[]; // Componentes reutilizables (ej. Email_Failed)
}

/**
 * Instancia de una transformación dentro de una sesión, define propiedades
 * como el particionamiento.
 * Los atributos se fusionan como propiedades directas.
 */
export interface ISessTransformationInst {
  SINSTANCENAME: string;
  TRANSFORMATIONNAME: string;
  TRANSFORMATIONTYPE: string;
  PIPELINE: string;
  STAGE: string;
  ISREPARTITIONPOINT: "YES" | "NO";
  PARTITIONTYPE: "PASS THROUGH" | "HASH AUTO KEYS" | "ROUND ROBIN" | string;
  DESCRIPTION?: string; // En algunos casos, la instancia de transformación tiene una descripción
  // Un <SESSTRANSFORMATIONINST> puede contener <ATTRIBUTE> (para atributos de partición)
  ATTRIBUTE?: ITableAttribute[];
  // Puede contener también una etiqueta <PARTITION> con sus propios atributos.
  PARTITION?: {
    NAME: string;
    DESCRIPTION?: string;
  }[];
}

/**
 * Define configuraciones específicas para conexiones de la sesión
 * (lectores, escritores, lookups).
 * Los atributos se fusionan como propiedades directas.
 */
export interface ISessionExtension {
  NAME: string; // Ej. "Relational Writer", "Relational Reader", "Relational Lookup"
  SINSTANCENAME: string;
  SUBTYPE: string; // Ej. "Relational Writer", "Relational Lookup"
  TRANSFORMATIONTYPE: string; // Ej. "Target Definition", "Source Qualifier", "Lookup Procedure"
  TYPE: "READER" | "WRITER" | "LOOKUPEXTENSION";
  // Atributos específicos para extensiones de Source Qualifier
  DSQINSTNAME?: string;
  DSQINSTTYPE?: string;
  CONNECTIONREFERENCE?: IConnectionReference; // Esto es una etiqueta hija
  ATTRIBUTE?: ITableAttribute[]; // Esto es una etiqueta hija
}

/**
 * Referencia a una conexión de base de datos o de otro tipo.
 * Los atributos se fusionan como propiedades directas.
 */
export interface IConnectionReference {
  CNXREFNAME: string;
  CONNECTIONTYPE: "Relational" | "Application" | string;
  VARIABLE: string;
  CONNECTIONNAME?: string;
  CONNECTIONNUMBER?: string;
  CONNECTIONSUBTYPE?: string;
}

/**
 * Referencia a un objeto de configuración.
 * Los atributos se fusionan como propiedades directas.
 */
export interface IConfigReference {
  TYPE: string;
  REFOBJECTNAME: string;
}

/**
 * Referencia a un componente de sesión reutilizable (ej. una tarea de Email para notificación de fallo).
 * Los atributos se fusionan como propiedades directas.
 */
export interface ISessionComponent {
  REFOBJECTNAME: string;
  REUSABLE: "YES" | "NO";
  TYPE: "Failure Email" | string;
}