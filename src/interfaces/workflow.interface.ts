// src/interfaces/workflow.interface.ts
import type { ITableAttribute } from "./mapping.interface";

/**
 * Representa el flujo de trabajo (Workflow) que orquesta la ejecución de tareas.
 * Los atributos se fusionan como propiedades directas.
 */
export interface IWorkflow {
  NAME: string;
  ISVALID: "YES" | "NO";
  ISENABLED: "YES" | "NO";
  VERSIONNUMBER: string;
  SERVERNAME: string;
  SERVER_DOMAINNAME: string;
  DESCRIPTION?: string;
  REUSABLE_SCHEDULER?: "NO";
  SCHEDULERNAME?: string; // Ejemplo: "Scheduler"
  SUSPEND_ON_ERROR?: "YES" | "NO";
  TASKS_MUST_RUN_ON_SERVER?: "YES" | "NO";
  SCHEDULER: IScheduler;
  TASK?: ITask[]; // Tareas reutilizables definidas directamente en la carpeta
  TASKINSTANCE?: ITaskInstance[];
  WORKFLOWLINK?: IWorkflowLink[];
  WORKFLOWVARIABLE?: IWorkflowVariable[];
  ATTRIBUTE?: ITableAttribute[]; // Atributos a nivel de workflow como el Parameter Filename
}

/**
 * Una tarea reutilizable definida en la carpeta (ej. Email, Command).
 * Los atributos se fusionan como propiedades directas.
 */
export interface ITask {
  NAME: string;
  TYPE: "Email" | "Command" | "Decision" | "Assignment" | "Start";
  REUSABLE: "YES" | "NO";
  VERSIONNUMBER: string;
  DESCRIPTION?: string;
  ATTRIBUTE?: ITableAttribute[];
  VALUEPAIR?: IValuePair[]; // Para tareas de Command, Decision, Assignment
}

/**
 * Representa un par clave-valor, a menudo utilizado en tareas de comando para parámetros.
 * Los atributos se fusionan como propiedades directas.
 */
export interface IValuePair {
  EXECORDER: string;
  NAME: string;
  REVERSEASSIGNMENT: "YES" | "NO";
  VALUE: string;
}

/**
 * Instancia de una tarea o sesión dentro del flujo de trabajo.
 * Los atributos se fusionan como propiedades directas.
 */
export interface ITaskInstance {
  NAME: string;
  TASKNAME: string;
  TASKTYPE: "Start" | "Session" | "Command" | "Decision" | "Assignment";
  ISENABLED: "YES" | "NO";
  // Atributos adicionales presentes en TASKINSTANCE en el XML:
  DESCRIPTION?: string;
  REUSABLE?: "YES" | "NO";
  FAIL_PARENT_IF_INSTANCE_DID_NOT_RUN?: "NO";
  FAIL_PARENT_IF_INSTANCE_FAILS?: "NO";
  TREAT_INPUTLINK_AS_AND?: "YES";
  // Específicos para tareas Decision
  "Decision Name"?: string; // Nombre del atributo en el XML
  ATTRIBUTE?: ITableAttribute[]; // Las instancias de tareas pueden tener atributos
  // Aunque el ejemplo no las muestra, una instancia de tarea podría tener SessionExtension
  // si es una sesión con overrides en línea. De momento no se añade aquí.
}

/**
 * Define un enlace de ejecución entre dos instancias de tareas.
 * Los atributos se fusionan como propiedades directas.
 */
export interface IWorkflowLink {
  FROMTASK: string;
  TOTASK: string;
  CONDITION?: string; // Condición para el enlace
}

/**
 * Define una variable a nivel de workflow.
 * Los atributos se fusionan como propiedades directas.
 */
export interface IWorkflowVariable {
  NAME: string;
  DATATYPE: string;
  USERDEFINED: "YES" | "NO";
  ISNULL: "YES" | "NO";
  ISPERSISTENT: "YES" | "NO";
  DEFAULTVALUE?: string;
  DESCRIPTION?: string;
}

/**
 * Define la configuración de scheduling del workflow.
 * Los atributos se fusionan como propiedades directas.
 */
export interface IScheduler {
  NAME: string;
  REUSABLE: "YES" | "NO";
  VERSIONNUMBER: string;
  DESCRIPTION?: string;
  SCHEDULEINFO: IScheduleInfo;
}

/**
 * Detalles sobre el schedule.
 * Los atributos se fusionan como propiedades directas.
 */
export interface IScheduleInfo {
  SCHEDULETYPE: "ONDEMAND" | "RUNONCE" | "RUNONSERVERINIT" | string;
}

/**
 * Configuración por defecto de la sesión.
 * Los atributos se fusionan como propiedades directas.
 */
export interface IConfig {
  NAME: string;
  ISDEFAULT: "YES" | "NO";
  VERSIONNUMBER: string;
  DESCRIPTION?: string;
  ATTRIBUTE?: ITableAttribute[];
}
