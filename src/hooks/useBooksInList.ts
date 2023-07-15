import useLocalStorage from "./useLocalStorage";

const useBooksInList = () => useLocalStorage<string[]>('books-in-list', [])

export default useBooksInList