import { $, component$ } from "@builder.io/qwik";
import { Image } from "@unpic/qwik";
import { HStack, VStack, styled } from "~/styled-system/jsx";
import cutString from "~/utils/cutString";
import { useBook } from "./books-provider";
import type { Book } from "~/types/books";
import { css } from "~/styled-system/css";
import { FavButton } from "../fav-button";
import SelectInput from "../forms/select-input";

interface BookListItemProps {
  book: Book;
}

const imageCss = css({
  objectFit: "cover",
  borderRadius: "lg",
  height: "full",
  transitionProperty: "all",
  transitionDuration: "fast",
  transitionTimingFunction: "ease-in-out",
  filter: "auto",
});

const titleCss = css({
  fontSize: "2xl",
  fontWeight: "bold",
});

const itemCss = css({
  cursor: "pointer",
  transitionProperty: "all",
  transitionDuration: "fast",
  transitionTimingFunction: "ease-in-out",
  _hover: {
    bg: "neutral-focus",
    "& img": {
      saturate: "2",
    },
  },
});

export const BookListItem = component$<BookListItemProps>((props) => {
  const { isBookInMyList, toogleFromMyList, readPriority, setReadPriority } =
    useBook(props.book);
  const cutStringWithDots = $(cutString);
  return (
    <HStack
      gap="10"
      bg="neutral"
      borderRadius="xl"
      p="5"
      position="relative"
      class={itemCss}
    >
      <Image
        aspectRatio="9/16"
        src={props.book.cover}
        width={225}
        alt="Portada del libro"
        class={imageCss}
      />
      <VStack flexGrow="1" gap="10">
        <h3 class={titleCss}>{props.book.title}</h3>
        <p>{cutStringWithDots(props.book.synopsis, 100)}</p>
      </VStack>
      <HStack
        position="absolute"
        top="0"
        right="0"
        p="5"
        gap="10"
        w="1/2"
        justifyContent="end"
        alignItems="start"
      >
        {isBookInMyList.value && (
          <VStack flexGrow="1" alignItems="start">
            <styled.label fontSize="xs">Prioridad de lectura:</styled.label>
            <SelectInput
              value={readPriority.value}
              onInput$={(_, el) => {
                setReadPriority(Number(el.value) as 1 | 2 | 3);
              }}
              w="full"
            >
              <option value={3} selected>
                Alta
              </option>
              <option value={2} selected>
                Media
              </option>
              <option value={1} selected>
                Baja
              </option>
            </SelectInput>
          </VStack>
        )}
        <FavButton
          onClick={toogleFromMyList}
          filled={isBookInMyList.value}
          title={
            isBookInMyList.value ? "Quitar de mi lista" : "Añadir a mi lista"
          }
        />
      </HStack>
    </HStack>
  );
});
