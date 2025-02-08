declare module '@airtable/blocks/models' {
    export interface FieldSet {
        [key: string]: any;
    }

    export type Records<T> = readonly Record<T>[];

    export interface Record<T> {
        id: string;
        fields: T;
        get(field: string): any;
    }
} 