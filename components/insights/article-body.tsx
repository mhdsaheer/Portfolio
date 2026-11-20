import { CodeBlock } from "@/components/insights/code-block"
import { InlineText } from "@/components/insights/inline-text"
import type { Block } from "@/lib/insight-content"

/**
 * The reading measure: about 70 characters a line at the body size. The
 * blocks are spaced with plain vertical margins, which collapse between
 * neighbours - so a heading's space above wins over a paragraph's below.
 */
export const PROSE =
  "my-5 break-words text-pretty text-[1.0625rem] leading-[1.8] text-white/85 md:text-lg md:leading-[1.8]"

/** Clears the fixed header when a heading is jumped to. Focus lands on it, without a ring. */
const ANCHOR = "scroll-mt-28 focus:outline-none"

export const HEADING_2 =
  "mb-5 mt-16 text-balance text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.025em] text-white md:mt-20 md:text-[2.125rem]"

const HEADING_3 =
  "mb-4 mt-11 text-balance text-xl font-semibold leading-snug tracking-[-0.015em] text-white md:text-[1.375rem]"

/** An article's body, block by block. */
export function ArticleBody({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, index) => (
        <BlockView key={index} block={block} />
      ))}
    </>
  )
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "paragraph":
      return (
        <p className={PROSE}>
          <InlineText text={block.text} />
        </p>
      )

    case "heading": {
      const Heading = block.level === 2 ? "h2" : "h3"
      return (
        <Heading id={block.id} tabIndex={-1} className={`${ANCHOR} ${block.level === 2 ? HEADING_2 : HEADING_3}`}>
          <InlineText text={block.text} />
        </Heading>
      )
    }

    case "list": {
      const List = block.ordered ? "ol" : "ul"
      return (
        <List
          className={`${PROSE} space-y-3 pl-6 ${
            block.ordered
              ? "list-decimal marker:font-mono marker:text-[0.85em] marker:text-accent"
              : "list-disc marker:text-accent"
          }`}
        >
          {block.items.map((item) => (
            <li key={item} className="pl-1.5">
              <InlineText text={item} />
            </li>
          ))}
        </List>
      )
    }

    case "code":
      return <CodeBlock code={block.code} language={block.language} caption={block.caption} />

    case "quote":
      return (
        <figure className="my-12 md:my-14">
          <blockquote className="border-l-2 border-accent pl-6 text-xl font-medium leading-[1.45] text-balance text-white md:pl-8 md:text-2xl">
            <p>
              <InlineText text={block.text} />
            </p>
          </blockquote>
        </figure>
      )

    // Design types, comparisons, cards and callouts belong to the guide layout, which renders them itself
    default:
      return null
  }
}
