import type { BooksInMyList } from "~/types/books";
import useLocalStorage from "./useLocalStorage";

const useBooksInList = () => useLocalStorage<BooksInMyList>('books-in-my-list', {})

export default useBooksInList