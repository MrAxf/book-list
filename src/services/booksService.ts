import booksData from "~/content/books.json";
import type { Book, BooksFilter, BooksInMyList } from "~/types/books";
import MiniSearch from "minisearch";

let books: Book[] = [];
const minisearch = new MiniSearch({
  fields: ["title", "genre", "synopsis", "year", "ISBN", "author.name"],
  idField: "ISBN",
  extractField: (document, fieldName) => {
    return fieldName.split(".").reduce((doc, key) => doc && doc[key], document);
  },
  searchOptions: {
    boost: { title: 8, synopsis: 1, "author.name": 1 },
    fuzzy: 0.2,
    filter(result) {
      return result.score >= 5;
    },
  },
});

export function getBooks() {
  if (books.length === 0) {
    books = booksData.library.map((item) => item.book);
    minisearch.addAll(books);
  }
  return books;
}

export function filterBooks(filter: BooksFilter, myBookList: BooksInMyList) {
  if (books.length === 0) getBooks();

  const searchedBooks = filter.searchText
    ? (minisearch
        .search(filter.searchText)
        .map((item) => books.find((book) => book.ISBN === item.id)) as Book[])
    : books;

  const filteredBooks = searchedBooks.filter(
    (item) =>
      (!filter.isInMyList || filterBookInMyList(item, myBookList)) &&
      (!filter.genre ||
        filter.genre === "none" ||
        filterGenre(item, filter.genre)) &&
      (!filter.minPages || filterPages(item, filter.minPages))
  );

  if(filter.priorityOrder === undefined) return filteredBooks

  const orderedBooks = filteredBooks.sort(
    (item1, item2) => 
      orderPriority(
        myBookList[item1.ISBN],
        myBookList[item2.ISBN],
        filter.priorityOrder as boolean
      )
  );

  return orderedBooks;
}

function filterBookInMyList(book: Book, myList: BooksInMyList) {
  return Boolean(myList[book.ISBN]);
}

function filterGenre(book: Book, genre: string) {
  return book.genre === genre;
}

function filterPages(book: Book, minPages: number) {
  return book.pages >= minPages;
}

function orderPriority(
  item1: number | undefined,
  item2: number | undefined,
  priority: boolean
) {
  return ((item1 || 0) - (item2 || 0)) * (priority ? -1 : 1);
}
