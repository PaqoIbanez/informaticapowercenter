// src/types/extraction.ts
export type ExtractionSummary = {
  totalWorkflows: number;
  totalSessions: number;
  totalMappings: number;
  totalSources: number;
  totalTargets: number;
  totalTransformations: number;
};

export type MappingField = {
  name: string;
  portType?: string;
  dataType?: string;
  precision?: string;
  scale?: string;
  description?: string;
};

export type MappingTransformation = {
  name: string;
  type: string; // p.ej. "Expression", "Joiner", "Source Qualifier" …
  description?: string;
  reusable?: string; // "YES" | "NO"
  fields?: MappingField[];
};

export type MappingInstance = {
  name: string;
  type: "SOURCE" | "TARGET" | "TRANSFORMATION";
  transformationName: string;
  transformationType: string; // p.ej. "Expression", "Source Definition", "Target Definition" …
};

export type MappingConnector = {
  fromInstance: string;
  fromInstanceType: string;
  toInstance: string;
  toInstanceType: string;
  fromField?: string;
  toField?: string;
};

export type Mapping = {
  name: string;
  isValid?: string; // "YES" | "NO"
  description?: string;
  transformations?: MappingTransformation[];
  instances?: MappingInstance[];
  connectors?: MappingConnector[];
};

export type Extraction = {
  repositoryName?: string;
  folderName?: string;
  summary?: ExtractionSummary;
  mappings?: Mapping[];
  // workflows?: Workflow[]; // si existe, puedes tiparlo luego
};
