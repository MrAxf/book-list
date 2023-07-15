import { $, component$ } from "@builder.io/qwik";
import { Image } from "@unpic/qwik";
import { VStack } from "~/styled-system/jsx";
import cutString from "~/utils/cutString";

interface BookListItemProps {
    title: string,
    description: string,
    imageUrl: string
}

export const BookListItem = component$<BookListItemProps>((props) => {
  const cutStringWithDots = $(cutString)
  return <VStack>
    <Image aspectRatio="9/16" src={props.imageUrl} width={225} alt="Portada del libro" />
    <h3>{props.title}</h3>
    <p>{cutStringWithDots(props.description, 30)}</p>
  </VStack>
});