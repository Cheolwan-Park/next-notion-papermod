import { WithChildren } from "@/services/notion/types/block";
import { CodeBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import styles from "@/styles/notion/components.module.css";
import { plainText } from "@/services/notion/utils";
import { createElement, useContext, useEffect, useRef, useState } from "react";
import { highlightElement } from "prismjs";
import { BsClipboard, BsClipboardCheck } from "react-icons/bs";
import classNames from "classnames";
import { DarkModeContext } from "@/services/darkmode";
import { RichText } from "./richtext";
import copy from "clipboard-copy";

export const Code = ({
  block,
}: {
  block: CodeBlockObjectResponse & WithChildren;
}) => {
  const content = plainText(block.code.rich_text);
  const { isDarkMode } = useContext(DarkModeContext);

  const codeRef = useRef(null);
  useEffect(() => {
    if (codeRef.current) {
      console.log("highlight");
      highlightElement(codeRef.current);
    }
  }, [codeRef]);

  const [isCopied, setCopied] = useState(false);
  const copyTimeout = useRef<number | null>(null);
  const copyToClipboard = () => {
    copy(content);
    setCopied(true);

    if (copyTimeout.current) {
      clearTimeout(copyTimeout.current);
      copyTimeout.current = null;
    }
    copyTimeout.current = setTimeout(() => {
      setCopied(false);
    }, 1200) as unknown as number;
  };

  return (
    <div className={classNames(styles.code, isDarkMode ? "dark" : "light")}>
      <pre tabIndex={0} className={`language-${block.code.language}`}>
        <code
          className={classNames(
            "line-numbers",
            `language-${block.code.language}`,
          )}
          ref={codeRef}
        >
          {content}
        </code>
      </pre>
      <button
        onClick={copyToClipboard}
        className={styles.copy_button}
        data-nopico
      >
        {isCopied
          ? createElement(BsClipboardCheck)
          : createElement(BsClipboard)}
      </button>
      <span className={styles.caption}>
        <RichText richTexts={block.code.caption} />
      </span>
    </div>
  );
};
