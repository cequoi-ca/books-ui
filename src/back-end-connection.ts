export interface Book {
    name: string,
    description: string,
    price: number,
    image: string,
};

export async function listBooks(filters?: Array<{from?: number, to?: number}>) : Promise<Book[]> {
    let adapter : any = await import("/adapter.js?url");
    if (adapter) {
        let books: Book[] = await adapter.listBooks(filters);
        return books;
    }
    return [];
}