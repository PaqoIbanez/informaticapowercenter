// src/interfaces/mapping.interface.ts

/**
 * Atributos clave-valor que definen el comportamiento de diversos elementos.
 * Los atributos se fusionan como propiedades directas.
 */
export interface ITableAttribute {
  NAME: string;
  VALUE: string;
}

/**
 * Representa un mapeo (Mapping) que define el flujo de datos.
 * Los atributos se fusionan como propiedades directas.
 */
export interface IMapping {
  NAME: string;
  ISVALID: "YES" | "NO";
  OBJECTVERSION: string;
  VERSIONNUMBER: string;
  DESCRIPTION?: string;
  TRANSFORMATION?: ITransformation[];
  INSTANCE?: IInstance[];
  CONNECTOR?: IConnector[];
  TARGETLOADORDER?: ITargetLoadOrder[];
  MAPPINGVARIABLE?: IMappingVariable[];
  ERPINFO?: object; // Etiqueta vacía en el XML
}

/**
 * Representa una transformación dentro de un mapeo (ej. Expression, Filter).
 * Los atributos se fusionan como propiedades directas.
 */
export interface ITransformation {
  NAME: string;
  TYPE:
    | "Source Qualifier"
    | "Expression"
    | "Filter"
    | "Aggregator"
    | "Joiner"
    | "Lookup Procedure"
    | "Update Strategy"
    | "Sorter"; // Añadido "Sorter"
  OBJECTVERSION: string;
  REUSABLE: "YES" | "NO";
  VERSIONNUMBER: string;
  DESCRIPTION?: string;
  TRANSFORMFIELD?: ITransformField[];
  TABLEATTRIBUTE?: ITableAttribute[];
  METADATAEXTENSION?: IMetaDataExtension[]; // Extensión de metadatos (opcional)
}

/**
 * Representa un puerto (campo) dentro de una transformación.
 * Los atributos se fusionan como propiedades directas.
 */
export interface ITransformField {
  NAME: string;
  PORTTYPE:
    | "INPUT"
    | "OUTPUT"
    | "INPUT/OUTPUT"
    | "LOOKUP/OUTPUT"
    | "LOOKUP/RETURN/OUTPUT"
    | "INPUT/OUTPUT/MASTER";
  DATATYPE:
    | "nstring"
    | "date/time"
    | "decimal"
    | "string"
    | "integer"
    | "number(p,s)"
    | "varchar2"
    | "number"; // Tipos de datos extendidos
  PRECISION: string;
  SCALE: string;
  DEFAULTVALUE?: string;
  DESCRIPTION?: string;
  EXPRESSION?: string;
  EXPRESSIONTYPE?: "GENERAL" | "GROUPBY";
  PICTURETEXT?: string;
  // Específicos para transformaciones Sorter
  ISSORTKEY?: "YES" | "NO";
  SORTDIRECTION?: "ASCENDING" | "DESCENDING";
}

/**
 * Instancia de una transformación, fuente o destino dentro de un mapeo.
 * Los atributos se fusionan como propiedades directas.
 */
export interface IInstance {
  NAME: string;
  TYPE: "SOURCE" | "TARGET" | "TRANSFORMATION";
  TRANSFORMATION_NAME: string;
  TRANSFORMATION_TYPE: string;
  DESCRIPTION?: string;
  REUSABLE?: "YES" | "NO";
  DBDNAME?: string; // Presente para instancias de fuentes/destinos
  ASSOCIATED_SOURCE_INSTANCE?: {
    NAME: string;
  };
  TABLEATTRIBUTE?: ITableAttribute[]; // Las instancias también pueden tener atributos (ej. "Table Name Prefix" para TARGET)
}

/**
 * Define la conexión entre los puertos de dos instancias en un mapeo.
 * Los atributos se fusionan como propiedades directas.
 */
export interface IConnector {
  FROMFIELD: string;
  FROMINSTANCE: string;
  FROMINSTANCETYPE: string;
  TOFIELD: string;
  TOINSTANCE: string;
  TOINSTANCETYPE: string;
}

/**
 * Define el orden de carga para los destinos en un mapeo.
 * Los atributos se fusionan como propiedades directas.
 */
export interface ITargetLoadOrder {
  ORDER: string;
  TARGETINSTANCE: string;
}

/**
 * Una variable definida a nivel de mapeo (ej. $$AtributoPF).
 * Los atributos se fusionan como propiedades directas.
 */
export interface IMappingVariable {
  NAME: string;
  DATATYPE: string;
  ISPARAM: "YES" | "NO";
  USERDEFINED: "YES" | "NO";
  PRECISION: string;
  SCALE: string;
  DEFAULTVALUE?: string;
  DESCRIPTION?: string;
  ISEXPRESSIONVARIABLE?: "YES" | "NO";
}

/**
 * Extensión de metadatos para transformaciones.
 * Los atributos se fusionan como propiedades directas.
 */
export interface IMetaDataExtension {
  DATATYPE: string;
  DOMAINNAME: string;
  ISCLIENTEDITABLE: "YES" | "NO";
  ISCLIENTVISIBLE: "YES" | "NO";
  ISREUSABLE: "YES" | "NO";
  ISSHAREREAD: "YES" | "NO";
  ISSHAREWRITE: "YES" | "NO";
  MAXLENGTH: string;
  NAME: string;
  VALUE: string;
  VENDORNAME: string;
  DESCRIPTION?: string;
}