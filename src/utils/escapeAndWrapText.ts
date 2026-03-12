import _ from "lodash";

export function escapeAndWrapText(text: string) {
  const paragraphs = _.escape(text).split("\n");

  return paragraphs
    .map((paragraph) => wrapParagraph(paragraph))
    .join("<br/>\n");
}

function wrapParagraph(text: string) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  for (const word of words) {
    if (line.length + word.length < 40) {
      line += " " + word;
    } else {
      lines.push(line);
      line = word;
    }
  }
  lines.push(line);
  return lines.join("<br/>");
}
