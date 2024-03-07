export interface Book {
    name: string,
    description: string,
    price: number,
    image: string,
};

export async function listBooks(filters?: Array<{from?: number, to?: number}>) : Promise<Book[]>;