import type { CodeLanguage } from "@/lib/insight-content"

/**
 * A small syntax highlighter for the code samples in articles. It runs while
 * the page is rendered on the server, so highlighting costs the reader no
 * JavaScript, and it needs no dependency.
 *
 * It is a lexer, not a parser: good enough for the short, well-formed samples
 * an article carries, not a general-purpose tool. TSX keeps track of whether
 * it is in code, inside a tag or in a tag's text, so words inside JSX text
 * ("for", "in", a capitalised word) are not coloured as code.
 */

export type TokenKind =
  | "plain"
  | "comment"
  | "string"
  | "keyword"
  | "number"
  | "function"
  | "type"
  | "tag"
  | "attribute"
  | "property"
  | "punctuation"

export type Token = { kind: TokenKind; text: string }

const KEYWORDS = new Set(
  (
    "as async await break case catch class const continue default delete do else enum export extends false " +
    "finally for from function if implements import in instanceof interface keyof let new null of private " +
    "protected public readonly return satisfies static super switch this throw true try type typeof undefined " +
    "var void while yield"
  ).split(" "),
)

/** Sticky, so each test matches at the current position or not at all. */
const at = (pattern: RegExp) => new RegExp(pattern.source, "y")

const WHITESPACE = at(/\s+/)
const COMMENT = at(/\/\/[^\n]*|\/\*[\s\S]*?\*\//)
const STRING = at(/"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`/)
const NUMBER = at(/\d[\d_]*(?:\.\d+)?(?:e[+-]?\d+)?/)
const IDENTIFIER = at(/[A-Za-z_$][\w$]*/)
const CALLED = at(/\s*\(/)
const TAG_NAME = at(/[A-Za-z][\w.:-]*/)
const ATTRIBUTE = at(/[A-Za-z_][\w:.-]*/)
const JSX_TEXT = at(/[^<{]+/)

/**
 * What may end the code right before a `<` that opens a JSX tag rather than a
 * comparison or a generic: `useState<T>` follows a name, `return <div>` doesn't.
 */
const OPENS_JSX = /(?:[(,=:?&|{[!>]|\breturn)$/

class Tokens {
  list: Token[] = []

  push(kind: TokenKind, text: string) {
    if (!text) return
    const last = this.list[this.list.length - 1]
    // Neighbours of one kind merge, so the markup carries fewer spans
    if (last && last.kind === kind) last.text += text
    else this.list.push({ kind, text })
  }

  /** Whether a `<` here starts JSX: at the very start, or after something that expects a value. */
  expectsValue() {
    for (let i = this.list.length - 1; i >= 0; i--) {
      const { kind, text } = this.list[i]
      // Comments and blank space say nothing about what comes next
      if (kind === "comment" || !text.trim()) continue
      return OPENS_JSX.test(text.trimEnd())
    }
    return true
  }
}

function match(pattern: RegExp, source: string, position: number) {
  pattern.lastIndex = position
  return pattern.exec(source)?.[0]
}

/** Where a `{` was opened from, so its `}` can return there. */
type Frame = { returnTo: "tag" | "text"; braces: number; depth: number }

function scanTsx(source: string): Token[] {
  const tokens = new Tokens()
  let position = 0
  let mode: "code" | "tag" | "text" = "code"
  /** Open elements whose children are being read, counted from the nearest `{`. */
  let depth = 0
  let braces = 0
  let closing = false
  const frames: Frame[] = []

  const endTag = (selfClosing: boolean) => {
    if (!selfClosing) depth += closing ? -1 : 1
    mode = depth > 0 ? "text" : "code"
  }

  const openTag = () => {
    const isClosing = source[position + 1] === "/"
    const opener = isClosing ? "</" : "<"
    tokens.push("punctuation", opener)
    position += opener.length
    closing = isClosing
    const name = match(TAG_NAME, source, position) ?? ""
    tokens.push("tag", name)
    position += name.length
    mode = "tag"
  }

  const openExpression = (returnTo: Frame["returnTo"]) => {
    frames.push({ returnTo, braces, depth })
    tokens.push("punctuation", "{")
    position += 1
    braces += 1
    depth = 0
    mode = "code"
  }

  while (position < source.length) {
    const char = source[position]

    if (mode === "text") {
      if (char === "<") openTag()
      else if (char === "{") openExpression("text")
      else {
        const text = match(JSX_TEXT, source, position) ?? char
        tokens.push("plain", text)
        position += text.length
      }
      continue
    }

    if (mode === "tag") {
      const space = match(WHITESPACE, source, position)
      if (space) {
        tokens.push("plain", space)
        position += space.length
      } else if (source.startsWith("/>", position)) {
        tokens.push("punctuation", "/>")
        position += 2
        endTag(true)
      } else if (char === ">") {
        tokens.push("punctuation", ">")
        position += 1
        endTag(false)
      } else if (char === "{") {
        openExpression("tag")
      } else if (char === '"' || char === "'") {
        const text = match(STRING, source, position) ?? char
        tokens.push("string", text)
        position += text.length
      } else {
        const name = match(ATTRIBUTE, source, position)
        if (name) {
          tokens.push("attribute", name)
          position += name.length
        } else {
          tokens.push("punctuation", char)
          position += 1
        }
      }
      continue
    }

    // Code
    const space = match(WHITESPACE, source, position)
    if (space) {
      tokens.push("plain", space)
      position += space.length
      continue
    }

    const comment = match(COMMENT, source, position)
    if (comment) {
      tokens.push("comment", comment)
      position += comment.length
      continue
    }

    const string = match(STRING, source, position)
    if (string) {
      tokens.push("string", string)
      position += string.length
      continue
    }

    if (char === "<") {
      const next = source[position + 1] ?? ""
      if (tokens.expectsValue() && /[A-Za-z>/]/.test(next)) {
        if (next === ">") {
          // A fragment opens like an element with no name
          tokens.push("punctuation", "<>")
          position += 2
          closing = false
          endTag(false)
        } else {
          openTag()
        }
        continue
      }
    }

    if (char === "{") {
      braces += 1
      tokens.push("punctuation", char)
      position += 1
      continue
    }

    if (char === "}") {
      braces -= 1
      tokens.push("punctuation", char)
      position += 1
      const frame = frames[frames.length - 1]
      if (frame && frame.braces === braces) {
        frames.pop()
        depth = frame.depth
        mode = frame.returnTo
      }
      continue
    }

    const word = match(IDENTIFIER, source, position)
    if (word) {
      position += word.length
      if (KEYWORDS.has(word)) tokens.push("keyword", word)
      else if (match(CALLED, source, position) !== undefined) tokens.push("function", word)
      else if (/^[A-Z]/.test(word)) tokens.push("type", word)
      else tokens.push("plain", word)
      continue
    }

    const number = match(NUMBER, source, position)
    if (number) {
      tokens.push("number", number)
      position += number.length
      continue
    }

    tokens.push("punctuation", char)
    position += 1
  }

  return tokens.list
}

const CSS_RULES: [TokenKind, RegExp][] = [
  ["plain", at(/\s+/)],
  ["comment", at(/\/\*[\s\S]*?\*\//)],
  ["string", at(/"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'/)],
  ["keyword", at(/@[\w-]+|!important/)],
  // A declaration's name: followed by a colon and a value that ends before any `{`
  ["property", at(/--[\w-]+(?=\s*:)|[a-z-]+(?=\s*:[^{};]*[;)])/)],
  ["number", at(/#[0-9a-fA-F]{3,8}(?![\w-])/)],
  ["type", at(/[.#][A-Za-z_][\w-]*/)],
  ["function", at(/[\w-]+(?=\()/)],
  ["keyword", at(/::?[a-zA-Z-]+/)],
  ["property", at(/--[\w-]+/)],
  ["plain", at(/[A-Za-z_][\w-]*/)],
  ["number", at(/-?(?:\d+\.?\d*|\.\d+)(?:%|[a-zA-Z]+)?/)],
]

function scanCss(source: string): Token[] {
  const tokens = new Tokens()
  let position = 0

  outer: while (position < source.length) {
    for (const [kind, pattern] of CSS_RULES) {
      const text = match(pattern, source, position)
      if (text) {
        tokens.push(kind, text)
        position += text.length
        continue outer
      }
    }
    tokens.push("punctuation", source[position])
    position += 1
  }

  return tokens.list
}

export function highlight(source: string, language: CodeLanguage): Token[] {
  return language === "css" ? scanCss(source) : scanTsx(source)
}
