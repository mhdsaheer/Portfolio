import { CopyButton } from "@/components/insights/copy-button"
import { highlight, type TokenKind } from "@/lib/highlight"
import type { CodeLanguage } from "@/lib/insight-content"

const LANGUAGE: Record<CodeLanguage, string> = {
  tsx: "TSX",
  ts: "TypeScript",
  css: "CSS",
}

/**
 * Token colours on the block's ground (#0a1522). Every one clears 4.5:1 there,
 * so the code is as readable as the prose around it.
 */
const TOKEN: Record<TokenKind, string | undefined> = {
  plain: undefined,
  comment: "italic text-[#8fa7c0]",
  string: "text-[#a6e3a1]",
  keyword: "text-[#c9b1ff]",
  number: "text-[#fab387]",
  function: "text-[#8cc8ff]",
  type: "text-[#f9e2af]",
  tag: "text-[#7dd3fc]",
  attribute: "text-[#f5c2e7]",
  property: "text-[#94e2d5]",
  punctuation: "text-[#a3b6ca]",
}

/**
 * A code sample, highlighted on the server. The caption names the file it
 * would live in, or the language when there isn't one, and so names the
 * figure. The sample scrolls sideways rather than wrapping, and takes keyboard
 * focus so it can. The copy button sits over the caption's bar, outside the
 * caption itself, so it doesn't become part of the figure's name.
 */
export function CodeBlock({ code, language, caption }: { code: string; language: CodeLanguage; caption?: string }) {
  const tokens = highlight(code, language)
  const name = caption ?? LANGUAGE[language]

  return (
    <figure className="relative my-8 overflow-hidden rounded-2xl border border-white/10 bg-[#0a1522] shadow-[0_24px_60px_-32px_rgba(4,10,18,0.9)] md:my-10">
      <figcaption className="truncate border-b border-white/10 py-3 pl-4 pr-28 font-mono text-xs leading-5 text-white/75">
        {name}
      </figcaption>
      <pre
        tabIndex={0}
        className="overflow-x-auto p-5 font-mono text-[13px] leading-[1.75] text-[#e2ebf5] [tab-size:2] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent md:px-6 md:text-sm"
      >
        <code>
          {tokens.map((token, index) => {
            const className = TOKEN[token.kind]
            return className ? (
              <span key={index} className={className}>
                {token.text}
              </span>
            ) : (
              token.text
            )
          })}
        </code>
      </pre>
      <CopyButton
        text={code}
        label="Copy"
        accessibleLabel={`Copy code: ${name}`}
        className="absolute right-2 top-2"
      />
    </figure>
  )
}
