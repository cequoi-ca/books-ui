declare module "adapter" {
    declare module mod_assignment_1 {
        export interface Book {
            name: string,
            author: string,
            description: string,
            price: number,
            image: string,
        };

        export function listBooks(filters?: Array<{from?: number, to?: number}>): Promise<Book[]>;

        export const assignment = "assignment-1";
    }

    declare module mod_assignment_2 {
        export interface Book {
            id?: BookID,
            name: string,
            author: string,
            description: string,
            price: number,
            image: string,
        };

        export function listBooks(filters?: Array<{from?: number, to?: number}>): Promise<Book[]>;

        export function createOrUpdateBook(book: Book): Promise<BookID> ;
        
        export function removeBook(book: BookID): Promise<void>;

        export const assignment = "assignment-2";
    }

    type default_export = assignment_1 | assignment_2;

    const ex: default_export;

    export default ex;

    export type assignment_1 = mod_assignment_1;
    export type assignment_2 = mod_assignment_2;
}