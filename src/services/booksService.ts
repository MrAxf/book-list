import booksData from "~/content/books.json";

export async function getBooks() {
  return await booksData.library.map((item) => item.book);
}
