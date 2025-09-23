// src/interfaces/multi-workflow.interface.ts
// Importa las interfaces base sin el "$" para el mapeo
import type { IMapping, ITransformation, ITableAttribute, IInstance, IConnector, ITargetLoadOrder, IMappingVariable, IMetaDataExtension, ITransformField } from './mapping.interface';
import type { ISource, ITarget, IField, IFlatFile } from './powermart.interface';
import type { IWorkflow, ITask, IValuePair, ITaskInstance, IWorkflowLink, IWorkflowVariable, IScheduler, IScheduleInfo, IConfig } from './workflow.interface';
import type { ISession, ISessTransformationInst, ISessionExtension, IConnectionReference, IConfigReference, ISessionComponent } from './sessiones.interface';
import type { IPowerMart } from './powermart.interface';


/**
 * Helper para asegurar que un elemento siempre se trate como un array.
 * Útil cuando `xml2js` con `explicitArray: false` devuelve un objeto simple
 * en lugar de un array de un objeto si solo hay un elemento.
 * @param item El elemento a normalizar.
 * @returns Un array de elementos (vacío si es undefined/null, o con el elemento/s).
 */
export function ensureArray<T>(item: T | T[] | undefined): T[] {
  if (item === undefined || item === null) {
    return [];
  }
  if (Array.isArray(item)) {
    return item;
  }
  return [item];
}

/**
 * Estructura de datos crudos extraída, coincidiendo con el XML.
 */
export interface IExtractionResult {
  POWERMART: IPowerMart;
}

/**
 * Representa la estructura de datos extraída y aplanada, más fácil de consumir por la UI.
 * Evita la anidación profunda del XML y normaliza los tipos.
 */
export interface IFlatExtractionData {
  repositoryName: string;
  folderName: string;
  summary: {
    totalWorkflows: number;
    totalSessions: number;
    totalMappings: number;
    totalSources: number;
    totalTargets: number;
    totalTransformations: number;
  };
  mappings: IMappedMapping[];
  workflows: IMappedWorkflow[];
  sources: IMappedSource[];
  targets: IMappedTarget[];
  sessions: IMappedSession[];
  configs: IMappedConfig[];
  reusableTasks: IMappedTask[]; // Tareas definidas directamente bajo FOLDER
  allTasksInstances: IMappedTaskInstance[]; // Todas las instancias de tareas dentro de los workflows
}

/**
 * Estructura simplificada para una fuente mapeada.
 */
export interface IMappedSource {
  name: string;
  databaseType: string;
  ownerName: string;
  description?: string;
  fields: IMappedField[];
  isFlatFile: boolean;
  attributes?: IMappedAttribute[];
}

/**
 * Estructura simplificada para un destino mapeado.
 */
export interface IMappedTarget {
  name: string;
  databaseType: string;
  description?: string;
  fields: IMappedField[];
  attributes?: IMappedAttribute[];
}

/**
 * Estructura simplificada para un campo (columna) mapeado.
 */
export interface IMappedField {
  name: string;
  dataType: string;
  keyType: string;
  nullable: string;
  precision: string;
  scale: string;
  description?: string;
  length?: string;
  physicalLength?: string;
  fieldProperty?: string;
  fieldType?: string;
  hidden?: "YES" | "NO";
  level?: string;
  occurs?: string;
  offset?: string;
  usage_flags?: string;
}

/**
 * Estructura simplificada para un mapeo mapeado.
 */
export interface IMappedMapping {
  name: string;
  isValid: "YES" | "NO";
  description?: string;
  transformations: IMappedTransformation[];
  instances: IMappedInstance[];
  connectors: IMappedConnector[];
  targetLoadOrders: IMappedTargetLoadOrder[];
  variables: IMappedMappingVariable[];
}

/**
 * Estructura simplificada para una transformación mapeada.
 */
export interface IMappedTransformation {
  name: string;
  type: string;
  description?: string;
  reusable: "YES" | "NO";
  fields: IMappedTransformField[];
  attributes: IMappedAttribute[];
  metadataExtensions?: IMappedMetadataExtension[];
}

/**
 * Estructura simplificada para un campo de transformación mapeado.
 */
export interface IMappedTransformField {
  name: string;
  portType: string;
  dataType: string;
  precision: string;
  scale: string;
  expression?: string;
  expressionType?: string;
  description?: string;
  isSortKey?: "YES" | "NO";
  sortDirection?: "ASCENDING" | "DESCENDING";
  defaultValue?: string;
  pictureText?: string;
}

/**
 * Estructura simplificada para una instancia mapeada.
 */
export interface IMappedInstance {
  name: string;
  type: string;
  transformationName: string;
  transformationType: string;
  description?: string;
  associatedSourceInstanceName?: string;
  attributes?: IMappedAttribute[];
}

/**
 * Estructura simplificada para un conector mapeado.
 */
export interface IMappedConnector {
  fromField: string;
  fromInstance: string;
  fromInstanceType: string;
  toField: string;
  toInstance: string;
  toInstanceType: string;
}

/**
 * Estructura simplificada para un orden de carga de destino mapeado.
 */
export interface IMappedTargetLoadOrder {
  order: string;
  targetInstance: string;
}

/**
 * Estructura simplificada para una variable de mapeo mapeada.
 */
export interface IMappedMappingVariable {
  name: string;
  dataType: string;
  isParam: "YES" | "NO";
  defaultValue?: string;
  precision: string;
  scale: string;
  isExpressionVariable?: "YES" | "NO";
  userDefined: "YES" | "NO";
  description?: string;
}

/**
 * Estructura simplificada para una extensión de metadatos mapeada.
 */
export interface IMappedMetadataExtension {
  name: string;
  value: string;
  dataType: string;
  description?: string;
  vendorName: string;
  domainName: string;
  isClientEditable: "YES" | "NO";
  isClientVisible: "YES" | "NO";
  isReusable: "YES" | "NO";
  isShareRead: "YES" | "NO";
  isShareWrite: "YES" | "NO";
  maxLength: string;
}

/**
 * Estructura simplificada para un workflow mapeado.
 */
export interface IMappedWorkflow {
  name: string;
  isValid: "YES" | "NO";
  isEnabled: "YES" | "NO";
  description?: string;
  serverName: string;
  tasks: IMappedTaskInstance[]; // Instancias de tareas/sesiones dentro de este workflow
  links: IMappedWorkflowLink[];
  variables: IMappedWorkflowVariable[];
  attributes: IMappedAttribute[];
  scheduler: IMappedScheduler;
}

/**
 * Estructura simplificada para una instancia de tarea mapeada.
 */
export interface IMappedTaskInstance {
  name: string;
  taskName: string;
  taskType: string;
  isEnabled: "YES" | "NO";
  failParentIfFails?: "YES" | "NO";
  failParentIfDidNotRun?: "YES" | "NO";
  treatInputLinkAsAnd?: "YES" | "NO";
  attributes?: IMappedAttribute[];
  // sessionExtensions?: IMappedSessionExtension[]; // Si las extensiones están directamente bajo la instancia de tarea (no en este XML)
  description?: string;
  reusable?: "YES" | "NO";
  decisionName?: string;
}

/**
 * Estructura simplificada para un enlace de workflow mapeado.
 */
export interface IMappedWorkflowLink {
  fromTask: string;
  toTask: string;
  condition?: string;
}

/**
 * Estructura simplificada para una variable de workflow mapeada.
 */
export interface IMappedWorkflowVariable {
  name: string;
  dataType: string;
  userDefined: "YES" | "NO";
  defaultValue?: string;
  isPersistent: "YES" | "NO";
  description?: string;
  isNull: "YES" | "NO";
}

/**
 * Estructura simplificada para un scheduler mapeado.
 */
export interface IMappedScheduler {
  name: string;
  scheduleType: string;
  description?: string;
}

/**
 * Estructura simplificada para una sesión mapeada.
 */
export interface IMappedSession {
  name: string;
  mappingName: string;
  isValid: "YES" | "NO";
  description?: string;
  transformationInstances: IMappedSessTransformationInst[];
  sessionExtensions: IMappedSessionExtension[];
  attributes: IMappedAttribute[];
  configReferenceName: string;
  sessionComponents?: IMappedSessionComponent[];
  reusable: "YES" | "NO";
  versionNumber: string;
  sortOrder?: string;
}

/**
 * Estructura simplificada para una instancia de transformación de sesión mapeada.
 */
export interface IMappedSessTransformationInst {
  instanceName: string;
  transformationName: string;
  transformationType: string;
  pipeline: string;
  stage: string;
  isRepartitionPoint: "YES" | "NO";
  partitionType: string;
  attributes?: IMappedAttribute[];
  partition?: {
    name: string;
    description?: string;
  }[];
}

/**
 * Estructura simplificada para una extensión de sesión mapeada.
 */
export interface IMappedSessionExtension {
  name: string;
  instanceName: string;
  subType: string;
  transformationType: string;
  type: string;
  connectionReference?: IMappedConnectionReference;
  attributes: IMappedAttribute[];
  dsqInstanceName?: string;
  dsqInstanceType?: string;
}

/**
 * Estructura simplificada para una referencia de conexión mapeada.
 */
export interface IMappedConnectionReference {
  name: string;
  type: string;
  variable: string;
  connectionName?: string;
  connectionNumber?: string;
  connectionSubtype?: string;
}

/**
 * Estructura simplificada para un componente de sesión mapeado.
 */
export interface IMappedSessionComponent {
  refObjectName: string;
  reusable: "YES" | "NO";
  type: string;
}

/**
 * Estructura simplificada para un atributo mapeado.
 */
export interface IMappedAttribute {
  name: string;
  value: string;
}

/**
 * Estructura simplificada para una configuración mapeada.
 */
export interface IMappedConfig {
  name: string;
  isDefault: "YES" | "NO";
  description?: string;
  attributes: IMappedAttribute[];
  versionNumber: string;
}

/**
 * Estructura simplificada para una tarea reutilizable mapeada (definida en la carpeta).
 */
export interface IMappedTask {
  name: string;
  type: string;
  description?: string;
  reusable: "YES" | "NO";
  attributes?: IMappedAttribute[];
  valuePairs?: IMappedValuePair[];
  versionNumber: string;
}

/**
 * Estructura simplificada para un par clave-valor mapeado.
 */
export interface IMappedValuePair {
  name: string;
  value: string;
  execOrder: string;
  reverseAssignment: "YES" | "NO";
}