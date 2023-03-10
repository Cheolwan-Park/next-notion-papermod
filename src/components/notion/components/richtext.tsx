import { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";
import styles from "@/styles/notion/richtext.module.css";
import classNames from "classnames";
import Link from "next/link";
import { getColorClass } from "./colors";

// TODO: implement mention, equation type
export const RichText = ({
  richTexts,
}: {
  richTexts: RichTextItemResponse[];
}) => {
  return (
    <>
      {richTexts.map((richText, idx) => {
        const style = getClassNames(richText);
        const color = getColorClass(richText.annotations.color);
        const className = classNames(...style, color, "richtext");
        if (richText.type === "text") {
          const content = richText.text.content;
          const link = richText.text.link ? richText.text.link.url : null;
          return (
            <span className={className} key={idx}>
              {link ? (
                <Link className={styles.link} href={link} data-nopico>
                  <NewLineAppliedText content={content} />
                </Link>
              ) : (
                <NewLineAppliedText content={content} />
              )}
            </span>
          );
        } else {
          return <span key={idx}></span>;
        }
      })}
    </>
  );
};

const getClassNames = (richText: RichTextItemResponse) => {
  const style = richText.annotations;
  const classNames = [];
  if (style.bold) classNames.push(styles.bold);
  if (style.italic) classNames.push(styles.italic);
  if (style.strikethrough) classNames.push(styles.strikethrough);
  if (style.underline) classNames.push(styles.underline);
  return classNames;
};

const NewLineAppliedText = ({ content }: { content: string }) => {
  return (
    <>
      {content.split("\n").map((substr, idx, arr) => {
        const isMiddle = idx < arr.length - 1;
        return (
          <span key={idx}>
            {substr} {isMiddle && <br />}
          </span>
        );
      })}
    </>
  );
};
