import type { ITableAttribute } from './mapping.interface';


/**
 * Representa el flujo de trabajo (Workflow) que orquesta la ejecución de tareas.
 */
export interface IWorkflow {
  NAME: string;
  ISVALID: "YES" | "NO";
  ISENABLED: "YES" | "NO";
  DESCRIPTION?: string;
  VERSIONNUMBER: string;
  SERVERNAME: string;
  SERVER_DOMAINNAME: string;
  SUSPEND_ON_ERROR?: "YES" | "NO";
  TASKS_MUST_RUN_ON_SERVER?: "YES" | "NO";
  SCHEDULER: IScheduler;
  TASK?: ITask[];
  TASKINSTANCE: ITaskInstance[];
  WORKFLOWLINK: IWorkflowLink[];
  WORKFLOWVARIABLE: IWorkflowVariable[];
  ATTRIBUTE: ITableAttribute[]; // Atributos a nivel de workflow como el Parameter Filename
}

/**
 * Tarea genérica definida en el workflow (p.ej. Email).
 */
export interface ITask {
  NAME: string;
  TYPE: "Email" | "Command" | "Decision" | "Assignment" | "Start";
  REUSABLE: "YES" | "NO";
  VERSIONNUMBER: string;
  DESCRIPTION?: string;
  ATTRIBUTE?: ITableAttribute[];
}

/**
 * Instancia de una tarea o sesión dentro del flujo de trabajo.
 */
export interface ITaskInstance {
  NAME: string;
  TASKNAME: string;
  TASKTYPE: "Start" | "Session" | "Command" | "Decision" | "Assignment";
  REUSABLE: "YES" | "NO";
  ISENABLED: "YES" | "NO";
}

/**
 * Define un enlace de ejecución entre dos task instances.
 */
export interface IWorkflowLink {
  FROMTASK: string;
  TOTASK: string;
  CONDITION: string;
}

/**
 * Define una variable a nivel de workflow.
 */
export interface IWorkflowVariable {
  NAME: string;
  DATATYPE: string;
  USERDEFINED: "YES" | "NO";
  DEFAULTVALUE?: string;
  ISNULL: "YES" | "NO";
  ISPERSISTENT: "YES" | "NO";
}

/**
 * Define la configuración de scheduling del workflow.
 */
export interface IScheduler {
  NAME: string;
  REUSABLE: "YES" | "NO";
  VERSIONNUMBER: string;
  SCHEDULEINFO: {
    SCHEDULETYPE: "ONDEMAND" | "RUNONCE" | "RUNONSERVERINIT" | string;
  };
}

/**
 * Configuración por defecto de la sesión.
 */
export interface IConfig {
  NAME: string;
  ISDEFAULT: "YES" | "NO";
  DESCRIPTION?: string;
  VERSIONNUMBER: string;
  ATTRIBUTE: ITableAttribute[];
}
