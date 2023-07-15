import { defineGlobalStyles } from "@pandacss/dev";

export default defineGlobalStyles({
  "html, body": {
    width: "full",
    overflowX: "hidden",
    position: "relative",
    display: "block",
  },
  html: {
    height: "screen",
    overflowY: "hidden",
  },
  body: {
    overflowY: "auto",
    fontFamily: "opensans",
    fontSize: "16px",
    lineHeight: "1.2em",
    backgroundColor: "base-100",
    color: "base-content",
    minH: "screen",
  },
});
