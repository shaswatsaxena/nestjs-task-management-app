
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
export enum TaskStatus {
    OPEN = "OPEN",
    IN_PROGRESS = "IN_PROGRESS",
    DONE = "DONE"
}

export class AuthCredentialsInput {
    username: string;
    password: string;
}

export class AccessToken {
    accessToken: string;
}

export abstract class IMutation {
    abstract signIn(credentials: AuthCredentialsInput): AccessToken | Promise<AccessToken>;

    abstract signUp(credentials: AuthCredentialsInput): boolean | Promise<boolean>;

    abstract createTask(title: string, description: string): Task | Promise<Task>;

    abstract deleteTask(id: string): boolean | Promise<boolean>;

    abstract updateTaskStatus(id: string, status: TaskStatus): Task | Promise<Task>;
}

export abstract class IQuery {
    abstract getTasks(search?: string, status?: string): Task[] | Promise<Task[]>;

    abstract getTaskById(id: string): Task | Promise<Task>;
}

export class Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    userId: number;
}
