// src/extractor.ts
import * as fs from "fs";
import * as path from "path";
import { parseString } from "xml2js";
import {
  ensureArray,
  type IConfig,
  type IConnectionReference,
  type IConnector,
  type IExtractionResult,
  type IField,
  type IFlatExtractionData,
  type IInstance,
  type IMappedAttribute,
  type IMappedConfig,
  type IMappedConnectionReference,
  type IMappedConnector,
  type IMappedField,
  type IMappedInstance,
  type IMappedMapping,
  type IMappedMappingVariable,
  type IMappedMetadataExtension,
  type IMappedScheduler,
  type IMappedSession,
  type IMappedSessionComponent,
  type IMappedSessionExtension,
  type IMappedSessTransformationInst,
  type IMappedSource,
  type IMappedTarget,
  type IMappedTargetLoadOrder,
  type IMappedTask,
  type IMappedTaskInstance,
  type IMappedTransformation,
  type IMappedTransformField,
  type IMappedValuePair,
  type IMappedWorkflow,
  type IMappedWorkflowLink,
  type IMappedWorkflowVariable,
  type IMapping,
  type IMappingVariable,
  type IMetaDataExtension,
  type IScheduler,
  type ISession,
  type ISessionComponent,
  type ISessionExtension,
  type ISessTransformationInst,
  type ISource,
  type ITableAttribute,
  type ITarget,
  type ITargetLoadOrder,
  type ITask,
  type ITaskInstance,
  type ITransformation,
  type ITransformField,
  type IValuePair,
  type IWorkflow,
  type IWorkflowLink,
  type IWorkflowVariable,
} from "./interfaces/index.ts";

const xmlFilePath = path.join(process.cwd(), "wkf_03_DI_CARGA_INDICADORES.XML");
const outputJsonFilePath = path.join(process.cwd(), "public/extraction.json"); // Guarda en public/

// --- Funciones de mapeo (para aplanar y simplificar la estructura) ---

function mapAttribute(attr: ITableAttribute): IMappedAttribute {
  return {
    name: attr.NAME,
    value: attr.VALUE,
  };
}

function mapField(field: IField): IMappedField {
  return {
    name: field.NAME,
    dataType: field.DATATYPE,
    keyType: field.KEYTYPE,
    nullable: field.NULLABLE,
    precision: field.PRECISION,
    scale: field.SCALE,
    description: field.DESCRIPTION,
    length: field.LENGTH,
    physicalLength: field.PHYSICALLENGTH,
    fieldProperty: field.FIELDPROPERTY,
    fieldType: field.FIELDTYPE,
    hidden: field.HIDDEN,
    level: field.LEVEL,
    occurs: field.OCCURS,
    offset: field.OFFSET,
    usage_flags: field.USAGE_FLAGS,
  };
}

function mapSource(source: ISource): IMappedSource {
  return {
    name: source.NAME,
    databaseType: source.DATABASETYPE,
    ownerName: source.OWNERNAME,
    description: source.DESCRIPTION,
    fields: ensureArray(source.SOURCEFIELD).map(mapField),
    isFlatFile: !!source.FLATFILE, // Comprueba si existe la etiqueta FLATFILE
    attributes: ensureArray(source.TABLEATTRIBUTE).map(mapAttribute),
  };
}

function mapTarget(target: ITarget): IMappedTarget {
  return {
    name: target.NAME,
    databaseType: target.DATABASETYPE,
    description: target.DESCRIPTION,
    fields: ensureArray(target.TARGETFIELD).map(mapField),
    attributes: ensureArray(target.TABLEATTRIBUTE).map(mapAttribute),
  };
}

function mapTransformField(field: ITransformField): IMappedTransformField {
  return {
    name: field.NAME,
    portType: field.PORTTYPE,
    dataType: field.DATATYPE,
    precision: field.PRECISION,
    scale: field.SCALE,
    expression: field.EXPRESSION,
    expressionType: field.EXPRESSIONTYPE,
    description: field.DESCRIPTION,
    isSortKey: field.ISSORTKEY,
    sortDirection: field.SORTDIRECTION,
    defaultValue: field.DEFAULTVALUE,
    pictureText: field.PICTURETEXT,
  };
}

function mapMetadataExtension(
  ext: IMetaDataExtension
): IMappedMetadataExtension {
  return {
    name: ext.NAME,
    value: ext.VALUE,
    dataType: ext.DATATYPE,
    description: ext.DESCRIPTION,
    vendorName: ext.VENDORNAME,
    domainName: ext.DOMAINNAME,
    isClientEditable: ext.ISCLIENTEDITABLE,
    isClientVisible: ext.ISCLIENTVISIBLE,
    isReusable: ext.ISREUSABLE,
    isShareRead: ext.ISSHAREREAD,
    isShareWrite: ext.ISSHAREWRITE,
    maxLength: ext.MAXLENGTH,
  };
}

function mapTransformation(trans: ITransformation): IMappedTransformation {
  return {
    name: trans.NAME,
    type: trans.TYPE,
    description: trans.DESCRIPTION,
    reusable: trans.REUSABLE,
    fields: ensureArray(trans.TRANSFORMFIELD).map(mapTransformField),
    attributes: ensureArray(trans.TABLEATTRIBUTE).map(mapAttribute),
    metadataExtensions: ensureArray(trans.METADATAEXTENSION).map(
      mapMetadataExtension
    ),
  };
}

function mapInstance(instance: IInstance): IMappedInstance {
  return {
    name: instance.NAME,
    type: instance.TYPE,
    transformationName: instance.TRANSFORMATION_NAME,
    transformationType: instance.TRANSFORMATION_TYPE,
    description: instance.DESCRIPTION,
    associatedSourceInstanceName: instance.ASSOCIATED_SOURCE_INSTANCE?.NAME,
    attributes: ensureArray(instance.TABLEATTRIBUTE).map(mapAttribute),
  };
}

function mapConnector(connector: IConnector): IMappedConnector {
  return {
    fromField: connector.FROMFIELD,
    fromInstance: connector.FROMINSTANCE,
    fromInstanceType: connector.FROMINSTANCETYPE,
    toField: connector.TOFIELD,
    toInstance: connector.TOINSTANCE,
    toInstanceType: connector.TOINSTANCETYPE,
  };
}

function mapTargetLoadOrder(tlo: ITargetLoadOrder): IMappedTargetLoadOrder {
  return {
    order: tlo.ORDER,
    targetInstance: tlo.TARGETINSTANCE,
  };
}

function mapMappingVariable(mv: IMappingVariable): IMappedMappingVariable {
  return {
    name: mv.NAME,
    dataType: mv.DATATYPE,
    isParam: mv.ISPARAM,
    defaultValue: mv.DEFAULTVALUE,
    precision: mv.PRECISION,
    scale: mv.SCALE,
    isExpressionVariable: mv.ISEXPRESSIONVARIABLE,
    userDefined: mv.USERDEFINED,
    description: mv.DESCRIPTION,
  };
}

function mapMapping(mapping: IMapping): IMappedMapping {
  return {
    name: mapping.NAME,
    isValid: mapping.ISVALID,
    description: mapping.DESCRIPTION,
    transformations: ensureArray(mapping.TRANSFORMATION).map(mapTransformation),
    instances: ensureArray(mapping.INSTANCE).map(mapInstance),
    connectors: ensureArray(mapping.CONNECTOR).map(mapConnector),
    targetLoadOrders: ensureArray(mapping.TARGETLOADORDER).map(
      mapTargetLoadOrder
    ),
    variables: ensureArray(mapping.MAPPINGVARIABLE).map(mapMappingVariable),
  };
}

function mapValuePair(vp: IValuePair): IMappedValuePair {
  return {
    name: vp.NAME,
    value: vp.VALUE,
    execOrder: vp.EXECORDER,
    reverseAssignment: vp.REVERSEASSIGNMENT,
  };
}

function mapTask(task: ITask): IMappedTask {
  return {
    name: task.NAME,
    type: task.TYPE,
    description: task.DESCRIPTION,
    reusable: task.REUSABLE,
    versionNumber: task.VERSIONNUMBER,
    attributes: ensureArray(task.ATTRIBUTE).map(mapAttribute),
    valuePairs: ensureArray(task.VALUEPAIR).map(mapValuePair),
  };
}

function mapTaskInstance(taskInst: ITaskInstance): IMappedTaskInstance {
  return {
    name: taskInst.NAME,
    taskName: taskInst.TASKNAME,
    taskType: taskInst.TASKTYPE,
    isEnabled: taskInst.ISENABLED,
    failParentIfFails: taskInst.FAIL_PARENT_IF_INSTANCE_FAILS,
    failParentIfDidNotRun: taskInst.FAIL_PARENT_IF_INSTANCE_DID_NOT_RUN,
    treatInputLinkAsAnd: taskInst.TREAT_INPUTLINK_AS_AND,
    attributes: ensureArray(taskInst.ATTRIBUTE).map(mapAttribute),
    description: taskInst.DESCRIPTION,
    reusable: taskInst.REUSABLE,
    decisionName: taskInst["Decision Name"], // Acceso directo al atributo del XML
  };
}

function mapWorkflowLink(link: IWorkflowLink): IMappedWorkflowLink {
  return {
    fromTask: link.FROMTASK,
    toTask: link.TOTASK,
    condition: link.CONDITION,
  };
}

function mapWorkflowVariable(
  wfVar: IWorkflowVariable
): IMappedWorkflowVariable {
  return {
    name: wfVar.NAME,
    dataType: wfVar.DATATYPE,
    userDefined: wfVar.USERDEFINED,
    defaultValue: wfVar.DEFAULTVALUE,
    isPersistent: wfVar.ISPERSISTENT,
    description: wfVar.DESCRIPTION,
    isNull: wfVar.ISNULL,
  };
}

function mapScheduler(scheduler: IScheduler): IMappedScheduler {
  return {
    name: scheduler.NAME,
    scheduleType: scheduler.SCHEDULEINFO?.SCHEDULETYPE || "UNKNOWN",
    description: scheduler.DESCRIPTION,
  };
}

function mapWorkflow(workflow: IWorkflow): IMappedWorkflow {
  return {
    name: workflow.NAME,
    isValid: workflow.ISVALID,
    isEnabled: workflow.ISENABLED,
    description: workflow.DESCRIPTION,
    serverName: workflow.SERVERNAME,
    tasks: ensureArray(workflow.TASKINSTANCE).map(mapTaskInstance),
    links: ensureArray(workflow.WORKFLOWLINK).map(mapWorkflowLink),
    variables: ensureArray(workflow.WORKFLOWVARIABLE).map(mapWorkflowVariable),
    attributes: ensureArray(workflow.ATTRIBUTE).map(mapAttribute),
    scheduler: mapScheduler(workflow.SCHEDULER),
  };
}

function mapSessTransformationInst(
  stInst: ISessTransformationInst
): IMappedSessTransformationInst {
  return {
    instanceName: stInst.SINSTANCENAME,
    transformationName: stInst.TRANSFORMATIONNAME,
    transformationType: stInst.TRANSFORMATIONTYPE,
    pipeline: stInst.PIPELINE,
    stage: stInst.STAGE,
    isRepartitionPoint: stInst.ISREPARTITIONPOINT,
    partitionType: stInst.PARTITIONTYPE,
    attributes: ensureArray(stInst.ATTRIBUTE).map(mapAttribute),
    partition: ensureArray(stInst.PARTITION).map((p) => ({
      name: p.NAME,
      description: p.DESCRIPTION,
    })),
  };
}

function mapConnectionReference(
  connRef: IConnectionReference
): IMappedConnectionReference {
  return {
    name: connRef.CNXREFNAME,
    type: connRef.CONNECTIONTYPE,
    variable: connRef.VARIABLE,
    connectionName: connRef.CONNECTIONNAME,
    connectionNumber: connRef.CONNECTIONNUMBER,
    connectionSubtype: connRef.CONNECTIONSUBTYPE,
  };
}

function mapSessionExtension(
  sessExt: ISessionExtension
): IMappedSessionExtension {
  return {
    name: sessExt.NAME,
    instanceName: sessExt.SINSTANCENAME,
    subType: sessExt.SUBTYPE,
    transformationType: sessExt.TRANSFORMATIONTYPE,
    type: sessExt.TYPE,
    connectionReference: sessExt.CONNECTIONREFERENCE
      ? mapConnectionReference(sessExt.CONNECTIONREFERENCE)
      : undefined,
    attributes: ensureArray(sessExt.ATTRIBUTE).map(mapAttribute),
    dsqInstanceName: sessExt.DSQINSTNAME,
    dsqInstanceType: sessExt.DSQINSTTYPE,
  };
}

function mapSessionComponent(
  sessComp: ISessionComponent
): IMappedSessionComponent {
  return {
    refObjectName: sessComp.REFOBJECTNAME,
    reusable: sessComp.REUSABLE,
    type: sessComp.TYPE,
  };
}

function mapSession(session: ISession): IMappedSession {
  return {
    name: session.NAME,
    mappingName: session.MAPPINGNAME,
    isValid: session.ISVALID,
    description: session.DESCRIPTION,
    reusable: session.REUSABLE,
    versionNumber: session.VERSIONNUMBER,
    sortOrder: session.SORTORDER,
    transformationInstances: ensureArray(session.SESSTRANSFORMATIONINST).map(
      mapSessTransformationInst
    ),
    sessionExtensions: ensureArray(session.SESSIONEXTENSION).map(
      mapSessionExtension
    ),
    attributes: ensureArray(session.ATTRIBUTE).map(mapAttribute),
    configReferenceName: session.CONFIGREFERENCE?.REFOBJECTNAME || "UNKNOWN",
    sessionComponents: ensureArray(session.SESSIONCOMPONENT).map(
      mapSessionComponent
    ),
  };
}

function mapConfig(config: IConfig): IMappedConfig {
  return {
    name: config.NAME,
    isDefault: config.ISDEFAULT,
    description: config.DESCRIPTION,
    versionNumber: config.VERSIONNUMBER,
    attributes: ensureArray(config.ATTRIBUTE).map(mapAttribute),
  };
}

// --- Lógica principal de extracción ---

fs.readFile(
  xmlFilePath,
  "utf8",
  (err: NodeJS.ErrnoException | null, data: string) => {
    if (err) {
      console.error("Error reading XML file:", err);
      return;
    }

    // Configuración de xml2js:
    // - explicitArray: false -> Los elementos hijos únicos no se envuelven en un array.
    // - mergeAttrs: true    -> Los atributos XML se fusionan como propiedades directas del objeto.
    parseString(
      data,
      { explicitArray: false, mergeAttrs: true },
      (err: Error | null, result: IExtractionResult) => {
        if (err) {
          console.error("Error parsing XML:", err);
          return;
        }

        const powerMart = result.POWERMART;
        const folder = powerMart.REPOSITORY.FOLDER;

        const mappedSources = ensureArray(folder.SOURCE).map(mapSource);
        const mappedTargets = ensureArray(folder.TARGET).map(mapTarget);
        const mappedMappings = ensureArray(folder.MAPPING).map(mapMapping);
        const mappedSessions = ensureArray(folder.SESSION).map(mapSession);
        // Workflow es singular en este XML, por eso se maneja con un condicional
        const mappedWorkflows = folder.WORKFLOW
          ? [mapWorkflow(folder.WORKFLOW)]
          : [];
        const mappedConfigs = ensureArray(folder.CONFIG).map(mapConfig);
        const mappedReusableTasks = ensureArray(folder.TASK).map(mapTask); // Tareas directamente bajo FOLDER

        let allTasksInstances: IMappedTaskInstance[] = [];
        mappedWorkflows.forEach((wf) => {
          allTasksInstances = allTasksInstances.concat(wf.tasks);
        });

        const extractionResult: IFlatExtractionData = {
          repositoryName: powerMart.REPOSITORY.NAME,
          folderName: folder.NAME,
          summary: {
            totalWorkflows: mappedWorkflows.length,
            totalSessions: mappedSessions.length,
            totalMappings: mappedMappings.length,
            totalSources: mappedSources.length,
            totalTargets: mappedTargets.length,
            totalTransformations: mappedMappings.reduce(
              (acc, m) => acc + (m.transformations?.length || 0),
              0
            ),
          },
          mappings: mappedMappings,
          workflows: mappedWorkflows,
          sources: mappedSources,
          targets: mappedTargets,
          sessions: mappedSessions,
          configs: mappedConfigs,
          reusableTasks: mappedReusableTasks,
          allTasksInstances: allTasksInstances, // Todas las instancias de tareas de todos los workflows
        };

        console.log(JSON.stringify(extractionResult, null, 2));

        // Guardar en archivo
        fs.writeFileSync(
          outputJsonFilePath,
          JSON.stringify(extractionResult, null, 2)
        );
        console.log(`Extraction data saved to ${outputJsonFilePath}`);
      }
    );
  }
);
