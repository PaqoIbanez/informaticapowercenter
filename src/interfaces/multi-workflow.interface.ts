import type { IMapping } from './mapping.interface';
import type { ISource, ITarget } from './powermart.interface';
import type { IWorkflow, ITaskInstance } from './workflow.interface';


/**
 * Interfaz para manejar múltiples workflows agrupados por carpeta
 */
export interface IMultiWorkflowData {
  folders: IWorkflowFolder[];
  selectedWorkflows: string[];
  searchTerm: string;
  filterCriteria: IFilterCriteria;
}

/**
 * Representa una carpeta que contiene workflows y objetos relacionados
 */
export interface IWorkflowFolder {
  id: string;
  name: string;
  description?: string;
  path: string;
  workflows: IWorkflowGroup[];
  sources: ISource[];
  targets: ITarget[];
  mappings: IMapping[];
  isExpanded: boolean;
  isSelected: boolean;
  metadata: IFolderMetadata;
}

/**
 * Agrupa un workflow con sus objetos relacionados
 */
export interface IWorkflowGroup {
  id: string;
  workflow: IWorkflow;
  sessions: ISessionGroup[];
  mappings: IMapping[];
  sources: ISource[];
  targets: ITarget[];
  dependencies: IWorkflowDependency[];
  isSelected: boolean;
  isExpanded: boolean;
  metadata: IWorkflowMetadata;
}

/**
 * Agrupa sesiones con sus objetos relacionados
 */
export interface ISessionGroup {
  id: string;
  session: ITaskInstance;
  mapping?: IMapping;
  sources: ISource[];
  targets: ITarget[];
  transformations: ITransformationInfo[];
  isSelected: boolean;
  metadata: ISessionMetadata;
}

/**
 * Información de transformaciones para visualización
 */
export interface ITransformationInfo {
  name: string;
  type: string;
  description?: string;
  inputPorts: number;
  outputPorts: number;
}

/**
 * Dependencias entre workflows
 */
export interface IWorkflowDependency {
  fromWorkflow: string;
  toWorkflow: string;
  dependencyType: "data" | "execution" | "parameter";
  description?: string;
}

/**
 * Metadatos de carpeta para análisis y visualización
 */
export interface IFolderMetadata {
  totalWorkflows: number;
  totalSessions: number;
  totalMappings: number;
  totalSources: number;
  totalTargets: number;
  lastModified?: Date;
  size: number;
  complexity: "low" | "medium" | "high";
}

/**
 * Metadatos de workflow
 */
export interface IWorkflowMetadata {
  complexity: "low" | "medium" | "high";
  estimatedRunTime?: number;
  lastExecuted?: Date;
  status: "active" | "inactive" | "error" | "unknown";
  dependencies: string[];
  tags: string[];
}

/**
 * Metadatos de sesión
 */
export interface ISessionMetadata {
  mappingName?: string;
  sourceCount: number;
  targetCount: number;
  transformationCount: number;
  estimatedRows?: number;
  lastRunStatus?: "success" | "failure" | "warning" | "unknown";
}

/**
 * Criterios de filtrado para workflows
 */
export interface IFilterCriteria {
  status?: ("active" | "inactive" | "error")[];
  complexity?: ("low" | "medium" | "high")[];
  hasErrors?: boolean;
  dateRange?: {
    from: Date;
    to: Date;
  };
  tags?: string[];
  sourceTypes?: string[];
  targetTypes?: string[];
}

/**
 * Configuración de visualización
 */
export interface IVisualizationConfig {
  viewMode: "tree" | "grid" | "graph";
  groupBy: "folder" | "complexity" | "status" | "none";
  sortBy: "name" | "date" | "complexity" | "size";
  sortOrder: "asc" | "desc";
  showMetadata: boolean;
  showDependencies: boolean;
  virtualizeList: boolean;
  itemsPerPage: number;
}

/**
 * Estado de drag and drop
 */
export interface IDragDropState {
  isDragging: boolean;
  draggedItem?: {
    id: string;
    type: "workflow" | "session" | "mapping" | "folder";
    data: any;
  };
  dropTarget?: {
    id: string;
    type: "folder" | "workflow";
    position: "before" | "after" | "inside";
  };
}

/**
 * Resultado de búsqueda
 */
export interface ISearchResult {
  id: string;
  type: "workflow" | "session" | "mapping" | "source" | "target";
  name: string;
  description?: string;
  path: string;
  parentFolder: string;
  relevanceScore: number;
  matchedFields: string[];
}

/**
 * Configuración de exportación
 */
export interface IExportConfig {
  format: "json" | "xml" | "csv" | "excel";
  includeMetadata: boolean;
  includeDependencies: boolean;
  selectedItems: string[];
  compressionLevel?: number;
}
