// src/lib/mappingHelpers.ts

// Importa todas las interfaces necesarias desde el directorio de interfaces.
// Estas interfaces definen la forma de los datos tanto del XML original como de la estructura mapeada.
import type {
  IConfig,
  IConnectionReference,
  IConnector,
  IField,
  IInstance,
  IMappedAttribute,
  IMappedConfig,
  IMappedConnectionReference,
  IMappedConnector,
  IMappedField,
  IMappedInstance,
  IMappedMapping,
  IMappedMappingVariable,
  IMappedMetadataExtension,
  IMappedScheduler,
  IMappedSession,
  IMappedSessionComponent,
  IMappedSessionExtension,
  IMappedSessTransformationInst,
  IMappedSource,
  IMappedTarget,
  IMappedTargetLoadOrder,
  IMappedTask,
  IMappedTaskInstance,
  IMappedTransformation,
  IMappedTransformField,
  IMappedValuePair,
  IMappedWorkflow,
  IMappedWorkflowLink,
  IMappedWorkflowVariable,
  IMapping,
  IMappingVariable,
  IMetaDataExtension,
  IScheduler,
  ISession,
  ISessionComponent,
  ISessionExtension,
  ISessTransformationInst,
  ISource,
  ITableAttribute,
  ITarget,
  ITargetLoadOrder,
  ITask,
  ITaskInstance,
  ITransformation,
  ITransformField,
  IValuePair,
  IWorkflow,
  IWorkflowLink,
  IWorkflowVariable,
} from "../interfaces/index";

/**
 * Helper para asegurar que un elemento siempre se trate como un array.
 * @param item El elemento a normalizar.
 * @returns Un array de elementos.
 */
export function ensureArray<T>(item: T | T[] | undefined | null): T[] {
  if (item === undefined || item === null) {
    return [];
  }
  return Array.isArray(item) ? item : [item];
}

export function mapAttribute(attr: ITableAttribute): IMappedAttribute {
  return {
    name: attr.NAME,
    value: attr.VALUE,
  };
}

export function mapField(field: IField): IMappedField {
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

export function mapSource(source: ISource): IMappedSource {
  return {
    name: source.NAME,
    databaseType: source.DATABASETYPE,
    ownerName: source.OWNERNAME,
    description: source.DESCRIPTION,
    fields: ensureArray(source.SOURCEFIELD).map(mapField),
    isFlatFile: !!source.FLATFILE,
    attributes: ensureArray(source.TABLEATTRIBUTE).map(mapAttribute),
  };
}

export function mapTarget(target: ITarget): IMappedTarget {
  return {
    name: target.NAME,
    databaseType: target.DATABASETYPE,
    description: target.DESCRIPTION,
    fields: ensureArray(target.TARGETFIELD).map(mapField),
    attributes: ensureArray(target.TABLEATTRIBUTE).map(mapAttribute),
  };
}

export function mapTransformField(
  field: ITransformField
): IMappedTransformField {
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

export function mapMetadataExtension(
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

export function mapTransformation(
  trans: ITransformation
): IMappedTransformation {
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

export function mapInstance(instance: IInstance): IMappedInstance {
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

export function mapConnector(connector: IConnector): IMappedConnector {
  return {
    fromField: connector.FROMFIELD,
    fromInstance: connector.FROMINSTANCE,
    fromInstanceType: connector.FROMINSTANCETYPE,
    toField: connector.TOFIELD,
    toInstance: connector.TOINSTANCE,
    toInstanceType: connector.TOINSTANCETYPE,
  };
}

export function mapTargetLoadOrder(
  tlo: ITargetLoadOrder
): IMappedTargetLoadOrder {
  return {
    order: tlo.ORDER,
    targetInstance: tlo.TARGETINSTANCE,
  };
}

export function mapMappingVariable(
  mv: IMappingVariable
): IMappedMappingVariable {
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

export function mapMapping(mapping: IMapping): IMappedMapping {
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

export function mapValuePair(vp: IValuePair): IMappedValuePair {
  return {
    name: vp.NAME,
    value: vp.VALUE,
    execOrder: vp.EXECORDER,
    reverseAssignment: vp.REVERSEASSIGNMENT,
  };
}

export function mapTask(task: ITask): IMappedTask {
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

export function mapTaskInstance(taskInst: ITaskInstance): IMappedTaskInstance {
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
    decisionName: taskInst["Decision Name"],
  };
}

export function mapWorkflowLink(link: IWorkflowLink): IMappedWorkflowLink {
  return {
    fromTask: link.FROMTASK,
    toTask: link.TOTASK,
    condition: link.CONDITION,
  };
}

export function mapWorkflowVariable(
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

export function mapScheduler(scheduler: IScheduler): IMappedScheduler {
  return {
    name: scheduler.NAME,
    scheduleType: scheduler.SCHEDULEINFO?.SCHEDULETYPE || "UNKNOWN",
    description: scheduler.DESCRIPTION,
  };
}

export function mapWorkflow(workflow: IWorkflow): IMappedWorkflow {
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

export function mapSessTransformationInst(
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

export function mapConnectionReference(
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

export function mapSessionExtension(
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

export function mapSessionComponent(
  sessComp: ISessionComponent
): IMappedSessionComponent {
  return {
    refObjectName: sessComp.REFOBJECTNAME,
    reusable: sessComp.REUSABLE,
    type: sessComp.TYPE,
  };
}

export function mapSession(session: ISession): IMappedSession {
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

export function mapConfig(config: IConfig): IMappedConfig {
  return {
    name: config.NAME,
    isDefault: config.ISDEFAULT,
    description: config.DESCRIPTION,
    versionNumber: config.VERSIONNUMBER,
    attributes: ensureArray(config.ATTRIBUTE).map(mapAttribute),
  };
}
