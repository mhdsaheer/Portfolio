import { code, h2, h3, ol, p, quote, ul, type InsightSource } from "@/lib/insight-content"

export const article: InsightSource = {
  slug: "ui-ux-design-and-front-end-development",
  title: "UI/UX Design Meets Front-End Development: Why Both Matter",
  seoTitle: "UI/UX Design and Front-End Development: Why Both Matter",
  description:
    "How UI/UX design and front-end development shape each other: what developers gain from design principles, and what designers gain from knowing the browser.",
  excerpt:
    "People only ever use the version of a product that runs in the browser. Why designers and developers each need to understand the other’s side.",
  social: {
    title: "Why UI/UX design and front-end development belong together",
    description:
      "The interface in Figma and the one in the browser are never quite the same. What closes the gap, from interaction states to shared design tokens.",
  },
  image: "/images/insights/ui-ux-design-and-front-end-development.jpg",
  imageCrops: [
    "/images/insights/ui-ux-design-and-front-end-development-4x3.jpg",
    "/images/insights/ui-ux-design-and-front-end-development-1x1.jpg",
  ],
  imageAlt:
    "A sign-up form split down the middle: the left half shows design redlines and spacing measurements, the right half the finished interface built in code",
  date: "Nov 19, 2026",
  category: "Design",
  tags: ["UI/UX Design", "Front-End Development", "Collaboration", "Accessibility"],
  seo: {
    focusKeyword: "UI/UX design and front-end development",
    secondaryKeywords: [
      "UI/UX designer and front-end developer",
      "front-end developer design skills",
      "designer developer collaboration",
      "Figma to React development",
      "user-centred web development",
      "design handoff",
      "accessible web design",
    ],
    searchIntent:
      "Informational, with commercial investigation: readers weighing how the two disciplines relate, whether to learn both, or whether to hire someone who does both.",
    semanticKeywords: [
      "design system",
      "design tokens",
      "interaction states",
      "visual hierarchy",
      "usability",
      "WCAG",
      "responsive design",
      "Core Web Vitals",
      "component library",
    ],
  },
  intro: [
    "Every digital product has two versions of its interface. One lives in a design file: tidy, static and filled with perfect content at two or three screen widths. The other runs in a browser, on a mid-range phone, with a surname longer than anyone expected, a patchy network and someone moving through it with a keyboard. Users only ever meet the second one.",
    "UI/UX design and front-end development are the two disciplines responsible for that gap. When they work as one continuous process rather than a hand-off, the product people use stays close to the product that was designed. When they don’t, the difference shows up in a hundred small details.",
  ],
  body: [
    h2("Where design and development actually meet"),
    p(
      "It’s tempting to see design as the picture and development as a copy of that picture in code. The real boundary is blurrier. A design is a set of decisions about hierarchy, behaviour and priority, and code is where those decisions are tested against reality.",
    ),
    p("Take a simple sign-up form. The Figma frame shows a label, an input and a button. The working version also needs:"),
    ul([
      "A focus style that stays visible against the background",
      "Validation, and an error message that screen readers announce",
      "A loading state while the request is in flight, so nobody submits twice",
      "Sensible behaviour with autofill, a 60-character email address and a 320px-wide screen",
      "A logical tab order, and a form that submits with the Enter key",
    ]),
    p(
      "None of these is purely a design problem or purely a development problem. Each needs a visual decision and a technical one, and the best results come when the same conversation covers both.",
    ),

    h2("Why front-end developers should understand design principles"),
    p(
      "No design file is complete. There’s always a state nobody drew, a width between two frames, or content that doesn’t fit. A developer who understands the principles behind a design can fill those gaps in the same spirit, instead of guessing.",
    ),
    h3("Visual hierarchy is a technical decision too"),
    p(
      "Hierarchy tells people what matters first. On screen it comes from size, weight, colour and spacing; in code it also comes from structure. A heading that looks like a heading but is marked up as a styled `div` breaks the outline that screen readers and search engines rely on. Getting both right means understanding why the designer made one line larger than another, then expressing that in semantic HTML as well as CSS.",
    ),
    h3("Spacing and rhythm need a system"),
    p(
      "Most well-made interfaces sit on a spacing scale, usually multiples of 4 or 8 pixels. A developer who spots the scale reads 23px in the inspect panel as 24px that drifted, not as a deliberate choice. Building with the scale keeps layouts consistent long after the original design file has gone out of date.",
    ),
    h3("Interaction design lives in the code"),
    p(
      "Hover, focus, loading, empty and error states are where an interface feels either considered or unfinished, and most of them only fully exist in code. A form field shows how much design thinking sits inside a few lines of React:",
    ),
    code(
      "tsx",
      `
      import { useId, type InputHTMLAttributes } from "react"

      type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
        label: string
        hint?: string
        error?: string
      }

      export function TextField({ label, hint, error, ...props }: TextFieldProps) {
        const id = useId()
        const hintId = hint ? id + "-hint" : undefined
        const errorId = error ? id + "-error" : undefined
        const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined

        return (
          <div className="field">
            <label htmlFor={id}>{label}</label>
            <input id={id} aria-invalid={Boolean(error)} aria-describedby={describedBy} {...props} />
            {hint && <p id={hintId}>{hint}</p>}
            {error && <p id={errorId} className="field-error">{error}</p>}
          </div>
        )
      }
      `,
      "text-field.tsx",
    ),
    p(
      "The visible label, the hint and the error message are design decisions. Wiring them up with `htmlFor`, `aria-describedby` and `aria-invalid` is what lets those decisions reach everyone, including people who will never see the red border.",
    ),

    h2("Why designers should understand technical constraints"),
    p(
      "The reverse matters just as much. Designers don’t need to write production code, but knowing how the browser behaves leads to designs that survive real content, real devices and real users.",
    ),
    h3("Real content breaks perfect layouts"),
    p(
      "Design files tend to use ideal content: short names, square photos, exactly three cards in a row. Real data includes a 40-character surname, a missing image, and a list with one item or two hundred. Designing for the range of content rather than the ideal case saves a round of fixes after launch. A useful habit is pasting the longest real string you can find into every text layer before calling a frame finished.",
    ),
    h3("The browser decides the breakpoints"),
    p(
      "A Figma file might show a 375px phone and a 1440px desktop, but people use every width in between, and they zoom. Layouts built with Flexbox, Grid and fluid values like `clamp()` adapt continuously; layouts designed as fixed snapshots break at the widths nobody drew. Designers who describe rules (“the cards wrap when each can’t be at least 280px wide”) rather than snapshots give developers something they can build faithfully.",
    ),
    h3("Every font, image and animation has a cost"),
    p(
      "Three font families in four weights, a background video in the hero and scroll-triggered animation on every section can look wonderful in a prototype and still feel sluggish on a phone. Google’s [Core Web Vitals](https://web.dev/articles/vitals) measure how quickly the main content appears, how fast the page responds to input and how stable the layout stays while it loads. Design decisions move all three.",
    ),
    h3("Accessibility is a design input, not a QA step"),
    p(
      "Colour contrast, text size, focus visibility and target size are settled in the design file long before anyone writes code. The [WCAG 2.2 guidelines](https://www.w3.org/TR/WCAG22/) ask for a contrast ratio of at least 4.5:1 for normal text and, with a few exceptions, pointer targets of at least 24 by 24 CSS pixels. Checking them while designing takes minutes; retrofitting them after launch costs far more.",
    ),
    quote(
      "A design isn’t finished when it looks right. It’s finished when it still works with real content, on a real device, for everyone who uses it.",
    ),

    h2("From Figma to a working interface"),
    p(
      "The hand-off is where most of the gap opens. A design file describes intent; a codebase needs explicit rules. Turning one into the other means reading the layout as a system: the grid, the spacing scale, the type styles, the components and their variants.",
    ),
    p(
      "I’ve covered that process step by step in [From Figma to Functional Website](/insights/figma-to-react-workflow), including how auto layout maps to Flexbox, how variants become props and how to test the result. The short version is that the translation goes best when both sides use the same names for the same things.",
    ),

    h2("Design tokens: a shared language for both sides"),
    p(
      "Design tokens are named values for colour, spacing, typography, radius and motion. In Figma they usually live as variables and styles; in code they become CSS custom properties or theme values. When both sides use the same names, a conversation about “the primary action colour” points to exactly one value.",
    ),
    code(
      "css",
      `
      :root {
        /* Primitives: the raw palette, named for what they are */
        --blue-600: #2449d8;
        --slate-900: #0f172a;
        --slate-50: #f8fafc;

        /* Semantic tokens: named for what they're for */
        --color-action: var(--blue-600);
        --color-text: var(--slate-900);
        --color-surface: var(--slate-50);

        /* Spacing on a 4px base */
        --space-2: 0.5rem;
        --space-4: 1rem;
        --radius-control: 0.5rem;
      }

      .button-primary {
        padding: var(--space-2) var(--space-4);
        border-radius: var(--radius-control);
        background: var(--color-action);
        color: var(--color-surface);
      }
      `,
      "tokens.css",
    ),
    p(
      "Splitting primitive tokens (the raw palette) from semantic tokens (what each value is for) is what keeps a design system flexible. If the brand blue changes, it changes in one place, and components never need to know. In the [TravelOS CRM](/work/travelos), every colour is a token and no screen names a colour directly, which is what lets each module carry its own colour through every button, icon and tint with a single class.",
    ),

    h2("How designers and developers can collaborate better"),
    p("Good collaboration is mostly a handful of small habits:"),
    ol([
      "**Bring developers in before the design is final.** Five minutes on how a component behaves on mobile is cheaper than a redesign after it’s built.",
      "**Design the states, not just the screens.** Empty, loading, error, long-content and no-permission states belong in the file alongside the happy path.",
      "**Name things the same way.** If Figma has `Button / Primary / Small`, the code should have a `Button` with `variant=\"primary\"` and `size=\"sm\"`.",
      "**Review in the browser.** Screenshots hide hover states, transitions, focus order and real performance. A preview link shows all of them.",
      "**Keep one source of truth.** A component library in code, mirrored by components in Figma, stops the two from drifting into different products.",
    ]),

    h2("When one person does both"),
    p(
      "On small teams and early-stage products, one person often owns both the design and the front-end. The benefit isn’t only one fewer hand-off. Design decisions can be checked against the implementation immediately, and implementation problems can be solved with a design change instead of a workaround.",
    ),
    p(
      "That’s how I prefer to work: designing in Figma, then building the same components in React and Next.js, so the system stays consistent from the first wireframe to the deployed page. In the [TecZ campaign](/work/tecz), for example, the identity, the art direction and the event website were designed and built as one piece of work.",
    ),
    p(
      "It doesn’t replace specialists. In-depth user research, complex motion and large design systems often deserve dedicated people. But a designer who understands code, or a developer who understands design, makes every specialist around them more effective, because less gets lost in translation.",
    ),

    h2("Key takeaways"),
    ul([
      "People only experience the version of a product that runs in the browser, so design and development are judged together.",
      "Developers who understand hierarchy, spacing and interaction design make better decisions in the gaps every design file leaves.",
      "Designers who understand content variability, fluid layout, performance and accessibility produce work that survives real use.",
      "Shared tokens and component names turn a hand-off into a conversation in one language.",
      "The more closely the two disciplines work, the less of the original intent is lost on the way to production.",
    ]),
  ],
  faq: [
    {
      question: "What is the difference between UI/UX design and front-end development?",
      answer:
        "UI/UX design decides what a product should do and how it should look and feel: research, user flows, wireframes, visual design and prototypes, usually in a tool like Figma. Front-end development builds that experience in the browser with HTML, CSS and JavaScript, often with React, and makes it responsive, accessible and fast. The first produces the plan; the second produces the thing people actually use.",
    },
    {
      question: "Should front-end developers learn UI/UX design?",
      answer:
        "Yes, at least the fundamentals: visual hierarchy, spacing systems, typography, interaction states and accessibility. You don’t need to become a full-time designer, but understanding why a design works lets you fill the gaps every design file has, and make better calls when real content or a small screen breaks the layout.",
    },
    {
      question: "Do UI/UX designers need to know how to code?",
      answer:
        "Designers don’t need to ship production code, but understanding how layouts, components and the browser work makes their designs easier to build and more resilient. Knowing what Flexbox and Grid can do, how text reflows and what a design system costs to maintain leads to designs that survive contact with real content.",
    },
    {
      question: "What does a UI/UX designer and front-end developer do?",
      answer:
        "A designer-developer takes a product from user flows and wireframes to a working interface. They design in Figma, then build the result in code as reusable components, keeping the design system, accessibility and performance consistent between the two. For startups and small teams, this removes a hand-off and shortens the feedback loop.",
    },
    {
      question: "How can designers and developers collaborate better?",
      answer:
        "Agree on shared names and design tokens, involve developers in early design reviews, design every state rather than only the happy path, review work in the browser instead of in screenshots, and keep one component library that both sides treat as the source of truth.",
    },
  ],
  related: ["figma-to-react-workflow", "react-best-practices-performance", "future-of-front-end-development"],
}
