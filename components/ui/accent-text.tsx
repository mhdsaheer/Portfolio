import { ACCENT, ACCENT_GLOW } from "@/components/about/tokens"

/**
 * Text edited under Pages, with the words between asterisks set in the
 * accent italic - "with *a designer's eye.*". Everything else stays text, so
 * nothing typed in the admin is ever parsed as HTML.
 */
export function AccentText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*[^*]+\*)/).map((part, index) =>
        part.length > 2 && part.startsWith("*") && part.endsWith("*") ? (
          <em
            key={index}
            className="font-serif text-[1.06em] font-normal italic"
            style={{ color: ACCENT, textShadow: ACCENT_GLOW }}
          >
            {part.slice(1, -1)}
          </em>
        ) : (
          part
        ),
      )}
    </>
  )
}
