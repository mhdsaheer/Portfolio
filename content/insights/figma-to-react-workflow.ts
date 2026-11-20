import { code, h2, h3, ol, p, quote, ul, type InsightFile } from "@/lib/insight-content"

export const article: InsightFile = {
  slug: "figma-to-react-workflow",
  title: "From Figma to Functional Website: My Approach to Turning Designs into Code",
  seoTitle: "Figma to React: My Workflow for Turning Designs into Code",
  description:
    "A step-by-step Figma to React workflow: reading the design file, mapping auto layout to Flexbox and Grid, extracting tokens, building components and testing.",
  excerpt:
    "A step-by-step workflow for turning a Figma file into a responsive React website: layout, tokens, components and testing.",
  social: {
    title: "From Figma to a functional website: turning designs into code",
    description:
      "How I take a Figma file to a responsive React website: reading the design, mapping auto layout to CSS, building components from variants and testing the result.",
  },
  image: "/images/insights/figma-to-react-workflow.jpg",
  imageCrops: [
    "/images/insights/figma-to-react-workflow-4x3.jpg",
    "/images/insights/figma-to-react-workflow-1x1.jpg",
  ],
  imageAlt:
    "A Figma desktop frame with a column grid and spacing guides, overlapped by a browser window showing the same layout built as a working website",
  date: "Nov 19, 2026",
  category: "Workflow",
  tags: ["Figma", "React", "CSS", "Design Systems"],
  seo: {
    focusKeyword: "Figma to React",
    secondaryKeywords: [
      "Figma to website development",
      "convert Figma design to website",
      "Figma developer workflow",
      "UI design to front-end development",
      "Figma auto layout to CSS",
      "Figma Dev Mode",
      "design tokens",
    ],
    searchIntent:
      "Informational how-to: developers and designers looking for a dependable process to turn Figma designs into production code, and clients wanting to understand how a Figma file becomes a website.",
    semanticKeywords: [
      "auto layout",
      "Flexbox",
      "CSS Grid",
      "variants",
      "component props",
      "type scale",
      "Tailwind CSS",
      "clamp()",
      "responsive breakpoints",
      "visual QA",
    ],
  },
  intro: [
    "A Figma file looks like a finished website, which is exactly what makes it easy to misread. It’s really a set of decisions about layout, hierarchy, type, colour and behaviour, captured at a few screen sizes. Turning it into a functional website means recovering those decisions and expressing them as rules a browser can follow at every size.",
    "This is the workflow I use to go from Figma to React. It isn’t tied to a plugin or a code generator, and it works the same whether the file comes from a design team or from my own canvas.",
  ],
  body: [
    h2("1. Read the whole design before writing code"),
    p(
      "The first pass is reading, not building. I go through every page and frame, click through the prototype if there is one, and open the assets panel to see which elements the designer made into components. Figma’s [Dev Mode](https://help.figma.com/hc/en-us/articles/15023124644247-Guide-to-Dev-Mode) helps here: it shows measurements, styles and component properties without the risk of editing the file.",
    ),
    p("While reading, I keep a list of questions. Most design files raise the same ones:"),
    ul([
      "Which states are missing? Hover, focus, loading, empty, error, disabled.",
      "What happens between the drawn breakpoints, and beyond the widest one?",
      "How long can each piece of content get? Names, titles, prices, translations.",
      "Which elements repeat across pages and should become shared components?",
      "Are there interactions or animations the static frames can’t show?",
    ]),
    p(
      "Raising these early is far cheaper than discovering them halfway through the build. Many of them are design decisions, so they go back to the designer rather than being guessed in code.",
    ),

    h2("2. Analyse the layout and spacing"),
    p("Next I look at how the page is constructed, not just how it looks."),
    h3("Find the grid"),
    p(
      "Most layouts sit on a column grid. Figma’s layout grids show the column count, gutter and margin directly; when they aren’t set up, measuring the edges of a few key elements usually reveals them. A 12-column grid with 24px gutters is a very different build from a centred 720px column, and it’s worth knowing which one you’re making before writing any CSS.",
    ),
    h3("Map auto layout to Flexbox"),
    p(
      "Figma’s auto layout behaves much like [CSS Flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout), which makes this one of the most dependable parts of the translation:",
    ),
    ul([
      "Horizontal or vertical direction becomes `flex-direction`.",
      "Spacing between items becomes `gap`, and padding stays padding.",
      "Alignment maps to `align-items` and `justify-content`.",
      "“Fill container” becomes `flex: 1` with `min-width: 0`, and “Hug contents” keeps an item at its natural size.",
    ]),
    code(
      "css",
      `
      /* Figma: auto layout, horizontal, gap 12, padding 16 and 24, centred */
      .toolbar {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem 1.5rem;
      }

      /* Figma: "Fill container" */
      .toolbar__search {
        flex: 1;
        min-width: 0;
      }

      /* Figma: "Hug contents" */
      .toolbar__button {
        flex: none;
      }
      `,
      "toolbar.css",
    ),
    p(
      "That `min-width: 0` is easy to miss. Flex items won’t shrink below the width of their content by default, so a long placeholder or URL can push the whole row wider than the screen.",
    ),
    h3("Spot the spacing scale"),
    p(
      "Most designs use a spacing scale based on 4 or 8 pixels. Listing the spacing values in the file usually reveals it, along with a few outliers like 13px or 22px. Those are almost always accidents, so I round them to the nearest step and mention it to the designer, rather than hard-coding values the system doesn’t contain.",
    ),

    h2("3. Extract typography and colour into tokens"),
    p(
      "Before building a single component, I turn the file’s styles into tokens. If the designer used Figma variables and text styles, this is mostly transcription. If not, this is where I find the system hiding in the file. A few conversions are worth knowing:",
    ),
    ul([
      "Font sizes go into `rem`, so text respects the reader’s browser settings: 16px becomes `1rem`.",
      "Line height becomes a unitless ratio: 24px on 16px text is `1.5`.",
      "Figma’s letter spacing is a percentage of the font size, so -2% becomes `-0.02em`.",
      "Colours get names for their role (surface, ink, brand) rather than their hue.",
    ]),
    p("In a Tailwind CSS v4 project, the tokens go straight into the theme, which generates matching utility classes:"),
    code(
      "css",
      `
      @import "tailwindcss";

      @theme {
        /* Colour styles, named for their role */
        --color-surface: #ffffff;
        --color-ink: #111827;
        --color-brand: #2449d8;

        /* Text styles: size, line height and letter spacing together */
        --text-body: 1rem;
        --text-body--line-height: 1.6;
        --text-display: 3rem;
        --text-display--line-height: 1.1;
        --text-display--letter-spacing: -0.02em;

        --font-sans: "Inter", system-ui, sans-serif;
      }
      `,
      "globals.css",
    ),
    p(
      "Naming tokens after their role means a rebrand changes values, not class names scattered across the codebase. The [TravelOS CRM](/work/travelos) is built on the same idea: no screen names a colour directly.",
    ),

    h2("4. Turn Figma components into React components"),
    p(
      "Figma components with variants map naturally onto React components with props. A button with Variant, Size and Icon properties in Figma becomes a `Button` with `variant`, `size` and `icon` props, and keeping the names aligned means designers and developers can discuss the same component without translating:",
    ),
    code(
      "tsx",
      `
      import type { ButtonHTMLAttributes, ReactNode } from "react"
      import { cn } from "@/lib/utils"

      // Figma: Button. Variant = Primary | Secondary | Ghost, Size = Small | Medium, Icon = on | off
      type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
        variant?: "primary" | "secondary" | "ghost"
        size?: "sm" | "md"
        icon?: ReactNode
      }

      const variants = {
        primary: "bg-brand text-white hover:bg-brand/90",
        secondary: "border border-ink/20 text-ink hover:bg-ink/5",
        ghost: "text-ink hover:bg-ink/5",
      }

      const sizes = {
        sm: "h-9 gap-1.5 px-3 text-sm",
        md: "h-11 gap-2 px-5 text-body",
      }

      export function Button({
        variant = "primary",
        size = "md",
        icon,
        type = "button",
        className,
        children,
        ...props
      }: ButtonProps) {
        return (
          <button
            type={type}
            className={cn(
              "inline-flex items-center rounded-lg font-medium focus-visible:outline-2 disabled:opacity-50",
              variants[variant],
              sizes[size],
              className,
            )}
            {...props}
          >
            {icon}
            {children}
          </button>
        )
      }
      `,
      "button.tsx",
    ),
    p(
      "Two details matter here. First, Figma files usually draw interaction states (hover, pressed, focused) as variants, but in code they’re CSS states rather than props, because the browser already knows when something is hovered or focused. Only states the browser can’t detect, such as loading or selected, become props. Second, the button defaults to `type=\"button\"`, because a plain `button` inside a form submits it, which no design file can show.",
    ),

    h2("5. Build the layout with Grid, Flexbox and positioning"),
    p("With tokens and components in place, the page comes together. My rule of thumb for choosing the layout tool:"),
    ul([
      "**[CSS Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout)** for two-dimensional layouts: page structure, card grids, anything aligned in rows and columns at once.",
      "**Flexbox** for one-dimensional layouts: toolbars, navigation, the inside of a card.",
      "**Positioning** only for genuine overlap: a badge on an avatar, a sticky header, a dropdown menu.",
    ]),
    code(
      "css",
      `
      .page {
        display: grid;
        grid-template-columns: repeat(12, minmax(0, 1fr));
        column-gap: 1.5rem;
        max-width: 80rem;
        margin-inline: auto;
        padding-inline: clamp(1rem, 4vw, 3rem);
      }

      /* Mobile first: everything spans the full width */
      .page__main,
      .page__aside {
        grid-column: 1 / -1;
      }

      @media (min-width: 64rem) {
        .page__main {
          grid-column: 1 / span 8;
        }

        .page__aside {
          grid-column: 9 / -1;
        }
      }
      `,
      "layout.css",
    ),
    p(
      "The most common mistake when converting designs is reproducing Figma’s absolute coordinates with absolute positioning. It matches the frame perfectly at one width and falls apart at every other. If two elements don’t overlap in the design, they almost certainly shouldn’t be positioned in code.",
    ),
    quote("Match the design’s intent, not its coordinates."),

    h2("6. Make it responsive between the breakpoints"),
    p(
      "A design file shows a few fixed widths; the browser has all of them. I build mobile-first and treat the desktop frame as the point where the layout has the most room, not as a separate design.",
    ),
    p(
      "Fluid values remove most of the jumps between breakpoints. If a heading is 32px in the mobile frame (375px wide) and 56px in the desktop frame (1440px wide), `clamp()` can scale it smoothly between the two:",
    ),
    code(
      "css",
      `
      /* 32px in the 375px frame, 56px in the 1440px frame, fluid in between */
      .hero-title {
        font-size: clamp(2rem, 1.47rem + 2.25vw, 3.5rem);
      }
      `,
      "Fluid type between two frames",
    ),
    p(
      "The middle value is the straight line through those two points: the slope is (56 − 32) ÷ (1440 − 375), about 2.25vw, and the remaining 23.5px becomes 1.47rem. Keeping a `rem` part in the formula means the text still grows when someone zooms, which a pure viewport unit wouldn’t do. For components that move between contexts, container queries let them respond to their own width rather than the screen’s.",
    ),

    h2("7. Test and refine the interface"),
    p("A build that matches the design at 1440px is roughly halfway done. The rest is testing:"),
    ol([
      "**Visual comparison.** Check the build against the frames at the same widths, side by side or with an overlay, paying close attention to spacing, alignment and type.",
      "**Real content.** Swap placeholder text for long, short and missing content, and see what breaks.",
      "**Every width.** Drag the browser from 320px to beyond the widest frame. Layout problems live between breakpoints.",
      "**Keyboard and screen reader.** Tab through every interactive element, check the focus styles, and do a quick pass with VoiceOver or NVDA.",
      "**Performance.** Run Lighthouse for a first look, then confirm images are sized correctly and fonts aren’t hiding text while they load.",
      "**Design review in the browser.** Walk through the live build with the designer. Some decisions only look wrong, or right, once they move.",
    ]),

    h2("Pixel-perfect or faithful?"),
    p(
      "Pixel-perfect is a useful standard for spacing, alignment and typography: the details that make an interface feel crafted. It’s the wrong standard when it leads to fixed widths, text baked into images or layouts that only work at the drawn sizes.",
    ),
    p(
      "The goal is to be faithful to the design’s intent: the same hierarchy, the same rhythm and the same feel, at every size and for every user. That’s the difference between a website that matches the Figma file in a screenshot and one that still feels like it on a real phone.",
    ),
    p(
      "For the bigger picture, [UI/UX design meets front-end development](/insights/ui-ux-design-and-front-end-development) covers why this translation works best when designers and developers share a vocabulary, and [React best practices for performance](/insights/react-best-practices-performance) picks up where this workflow ends: keeping the components fast as the site grows.",
    ),
  ],
  faq: [
    {
      question: "How do you convert a Figma design into a React website?",
      answer:
        "Start by reading the whole file and listing missing states and responsive behaviour. Then map the layout (grid, auto layout and spacing scale), extract typography and colour into tokens, build reusable React components from Figma components and variants, assemble pages with CSS Grid and Flexbox, and test with real content, at every width and with a keyboard.",
    },
    {
      question: "Can Figma generate production-ready React code?",
      answer:
        "Dev Mode, plugins and AI tools can generate a useful starting point, and they’re reliable for measurements and CSS values. The output usually still needs work before production: semantic HTML, components that fit your codebase, responsive behaviour, accessibility, and the states the design file doesn’t show.",
    },
    {
      question: "How do you handle responsive design when Figma only has desktop and mobile frames?",
      answer:
        "Build mobile-first and treat the frames as reference points rather than the only sizes. Use fluid values such as clamp() for type and spacing, CSS Grid and Flexbox for layouts that reflow, and container queries for components. Then test every width between the frames and agree on the edge cases with the designer.",
    },
    {
      question: "Should I use Flexbox or CSS Grid for Figma auto layout?",
      answer:
        "Auto layout maps most directly to Flexbox, since both arrange items in a single direction with gap, padding and alignment. Use CSS Grid when a layout needs rows and columns aligned at the same time, such as the overall page structure or a grid of cards.",
    },
    {
      question: "What is Figma Dev Mode used for?",
      answer:
        "Dev Mode is Figma’s workspace for developers. It shows measurements, spacing, styles and variables, component properties, generated code snippets and which designs are marked ready for development, so you can inspect a design without accidentally changing it.",
    },
  ],
  related: ["ui-ux-design-and-front-end-development", "react-best-practices-performance", "future-of-front-end-development"],
}
