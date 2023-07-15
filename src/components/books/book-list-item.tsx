import { $, component$ } from "@builder.io/qwik";
import { Image } from "@unpic/qwik";
import { VStack } from "~/styled-system/jsx";
import cutString from "~/utils/cutString";
import { useBook } from "./books-provider";
import type { Book } from "~/types/books";

interface BookListItemProps {
  book: Book
}

export const BookListItem = component$<BookListItemProps>((props) => {
  const { isBookInMyList, toogleFromMyList } = useBook(props.book)
  const cutStringWithDots = $(cutString);
  return (
    <VStack>
      <Image
        aspectRatio="9/16"
        src={props.book.cover}
        width={225}
        alt="Portada del libro"
      />
      <h3>{props.book.title}</h3>
      <p>{cutStringWithDots(props.book.synopsis, 50)}</p>
      <button onClick$={() => toogleFromMyList()}>{isBookInMyList.value ? "Eliminar de mi lista" : "Añadir a mi lista"}</button>
    </VStack>
  );
});
