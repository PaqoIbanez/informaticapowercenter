/**
 * Representa un mapeo (Mapping) que define el flujo de datos.
 */
export interface IMapping {
  NAME: string;
  DESCRIPTION?: string;
  ISVALID: "YES" | "NO";
  VERSIONNUMBER: string;
  OBJECTVERSION: string;
  TRANSFORMATION?: ITransformation[];
  INSTANCE?: IInstance[];
  CONNECTOR?: IConnector[];
  TARGETLOADORDER?: ITargetLoadOrder[];
  MAPPINGVARIABLE?: IMappingVariable[];
}

/**
 * Representa una transformación dentro de un mapeo (p.ej. Expression, Filter).
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
    | "Update Strategy";
  DESCRIPTION?: string;
  OBJECTVERSION: string;
  REUSABLE: "YES" | "NO";
  VERSIONNUMBER: string;
  TRANSFORMFIELD: ITransformField[];
  TABLEATTRIBUTE: ITableAttribute[];
  METADATAEXTENSION?: IMetaDataExtension[];
}

/**
 * Representa un puerto (port) dentro de una transformación.
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
  DATATYPE: string;
  PRECISION: string;
  SCALE: string;
  DEFAULTVALUE?: string;
  DESCRIPTION?: string;
  EXPRESSION?: string;
  EXPRESSIONTYPE?: "GENERAL" | "GROUPBY";
  PICTURETEXT?: string;
}

/**
 * Atributos clave-valor que definen el comportamiento de una transformación
 * (p.ej. 'Sql Query', 'Join Condition', 'Filter Condition').
 */
export interface ITableAttribute {
  NAME: string;
  VALUE: string;
}

/**
 * Instancia de una transformación, fuente o destino dentro de un mapeo.
 */
export interface IInstance {
  NAME: string;
  TYPE: "SOURCE" | "TARGET" | "TRANSFORMATION";
  TRANSFORMATION_NAME: string;
  TRANSFORMATION_TYPE: string;
  DESCRIPTION?: string;
  REUSABLE?: "YES" | "NO";
  DBDNAME?: string;
  ASSOCIATED_SOURCE_INSTANCE?: { NAME: string };
}

/**
 * Define la conexión entre los puertos de dos instancias en un mapeo.
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
 */
export interface ITargetLoadOrder {
  ORDER: string;
  TARGETINSTANCE: string;
}

/**
 * Variable definida a nivel de mapeo (p.ej. $$AtributoPF).
 */
export interface IMappingVariable {
  NAME: string;
  DATATYPE: string;
  ISPARAM: "YES" | "NO";
  USERDEFINED: "YES" | "NO";
  DEFAULTVALUE?: string;
  PRECISION: string;
  SCALE: string;
}

/**
 * Extensión de metadatos para transformaciones.
 */
export interface IMetaDataExtension {
  DATATYPE: string;
  DESCRIPTION?: string;
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
}
