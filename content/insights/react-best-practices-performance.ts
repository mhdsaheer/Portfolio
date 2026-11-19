import { code, h2, h3, ol, p, quote, ul, type InsightSource } from "@/lib/insight-content"

export const article: InsightSource = {
  slug: "react-best-practices-performance",
  title: "React Best Practices for Performance and User Experience",
  description:
    "Practical React best practices for fast, accessible websites: component architecture, state, API integration, Core Web Vitals and the mistakes to avoid.",
  excerpt:
    "Component architecture, state, data fetching, performance and accessibility: the React habits that keep a website fast and usable as it grows.",
  social: {
    title: "React best practices for performance and user experience",
    description:
      "The React habits that keep a site fast and pleasant to use as it grows, with code for composition, data fetching, code splitting and responsive components.",
  },
  image: "/images/insights/react-best-practices-performance.jpg",
  imageCrops: [
    "/images/insights/react-best-practices-performance-4x3.jpg",
    "/images/insights/react-best-practices-performance-1x1.jpg",
  ],
  imageAlt:
    "A React component tree drawn as connected nodes beside a panel of Core Web Vitals readings for LCP, INP and CLS, each marked good",
  date: "Nov 19, 2026",
  category: "Development",
  tags: ["React", "Performance", "Accessibility", "Front-End Development"],
  seo: {
    focusKeyword: "React best practices",
    secondaryKeywords: [
      "React.js best practices",
      "modern React development",
      "React performance optimisation",
      "React website performance",
      "responsive React websites",
      "React front-end development",
      "reusable React components",
    ],
    searchIntent:
      "Informational: developers and technical leads looking for current, practical guidance on building React websites that stay fast, accessible and maintainable.",
    semanticKeywords: [
      "Core Web Vitals",
      "component composition",
      "React Server Components",
      "code splitting",
      "Suspense",
      "useDeferredValue",
      "React Compiler",
      "data fetching",
      "container queries",
      "accessibility",
    ],
  },
  intro: [
    "React makes it easy to build an interface that works. It makes it just as easy to build one that grows heavier, harder to change and less pleasant to use with every feature that lands. The difference rarely comes down to one big decision. It comes from a set of habits applied consistently.",
    "These are the React best practices I rely on for websites and web apps, organised around the two things users actually feel: how fast the site is, and how easy it is to use.",
  ],
  body: [
    h2("Start with a component architecture that scales"),
    p(
      "Components are React’s unit of reuse, but splitting an interface into components only helps if the boundaries sit in the right places.",
    ),
    h3("Split by responsibility"),
    p(
      "A good component does one job: render a card, manage a form, lay out a page. If describing a component takes the word “and” more than once, it’s usually two components. The React team’s guide [Thinking in React](https://react.dev/learn/thinking-in-react) recommends the same approach: break the interface into a hierarchy where each component matches one piece of your data.",
    ),
    h3("Prefer composition over configuration"),
    p(
      "Reusable components tend to collect props until nobody can predict what they render. Composition keeps them small: the component provides structure and behaviour, and the caller passes in the content.",
    ),
    code(
      "tsx",
      `
      // Configuration: every new requirement becomes another prop
      <Card
        title="Pro plan"
        subtitle="Billed yearly"
        showBadge
        badgeText="Popular"
        footerText="Cancel anytime"
      />

      // Composition: the card owns the structure, the caller owns the content
      <Card>
        <Card.Header>
          <h3>Pro plan</h3>
          <Badge>Popular</Badge>
        </Card.Header>
        <p>Billed yearly</p>
        <Card.Footer>Cancel anytime</Card.Footer>
      </Card>
      `,
    ),
    p(
      "The composed version accepts new content without a new prop, and the markup it produces is easier to read and easier to make accessible, because the heading is a real heading.",
    ),
    h3("Keep rendering pure"),
    p(
      "Given the same props and state, a component should return the same output, with no side effects during render. Pure components are easier to test, safe to render more than once, and they’re what allows the [React Compiler](https://react.dev/learn/react-compiler) to optimise your code automatically.",
    ),

    h2("Manage state deliberately"),
    p(
      "Many React bugs are state bugs: a value stored in two places, an effect that copies one piece of state into another, or global state used for something only one component needs.",
    ),
    h3("Keep state close to where it’s used"),
    p(
      "Start with local state and lift it up only when two components genuinely need the same value. Context or a global store is for data that really is app-wide, such as the signed-in user or the theme, not for a dropdown that’s open in one place.",
    ),
    h3("Derive values instead of syncing them"),
    p(
      "If a value can be calculated from props or existing state, calculate it during render. Copying it into state and keeping the copy in sync with an effect costs an extra render and opens up a whole category of bugs.",
    ),
    code(
      "tsx",
      `
      // Avoid: a copy of the data in state, kept in sync by an effect
      const [visible, setVisible] = useState<Product[]>([])

      useEffect(() => {
        setVisible(products.filter((product) => product.name.includes(query)))
      }, [products, query])

      // Prefer: calculate it while rendering
      const visible = products.filter((product) => product.name.includes(query))
      `,
    ),
    p(
      "The React docs cover this pattern in depth in [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect). It’s worth rereading whenever an effect starts to look complicated.",
    ),

    h2("Integrate APIs without hurting the experience"),
    p(
      "Data fetching is where performance and user experience meet most directly. A slow API is bad. A slow API with no feedback, or with stale results flashing over fresh ones, is worse.",
    ),
    h3("Fetch on the server when you can"),
    p(
      "With a framework like Next.js, Server Components can fetch data before the page reaches the browser, so the HTML arrives with content in it and the fetching code never ships to the client. It also keeps secrets on the server. In the [TDA Certified student portal](/work/tda-certify), the browser never calls the API directly: every request goes through the Next.js server, which keeps sign-in tokens in cookies that page scripts can’t read.",
    ),
    h3("Design every state of a request"),
    p(
      "Every request has at least three outcomes: loading, failed and succeeded, and a successful response can still be empty. Modelling them explicitly in TypeScript makes it impossible to forget one:",
    ),
    code(
      "tsx",
      `
      type RequestState<T> =
        | { status: "loading" }
        | { status: "error"; message: string }
        | { status: "success"; data: T }

      export function ProductList({ state }: { state: RequestState<Product[]> }) {
        if (state.status === "loading") return <ProductListSkeleton />
        if (state.status === "error") return <ErrorMessage message={state.message} />
        if (state.data.length === 0) return <EmptyState />

        return (
          <ul>
            {state.data.map((product) => (
              <li key={product.id}>{product.name}</li>
            ))}
          </ul>
        )
      }
      `,
      "product-list.tsx",
    ),
    p(
      "When data has to be fetched in the browser, a library such as [TanStack Query](https://tanstack.com/query/latest) handles caching, retries and race conditions for you. If you do fetch inside an effect, always clean up, so a slow response to an old query can’t overwrite the result of a newer one:",
    ),
    code(
      "tsx",
      `
      useEffect(() => {
        const controller = new AbortController()

        fetch("/api/products?q=" + encodeURIComponent(query), { signal: controller.signal })
          .then((response) => {
            if (!response.ok) throw new Error("Request failed: " + response.status)
            return response.json()
          })
          .then((data: Product[]) => setState({ status: "success", data }))
          .catch((error: Error) => {
            if (error.name !== "AbortError") setState({ status: "error", message: error.message })
          })

        // A newer query aborts the older request, so stale results can't win the race
        return () => controller.abort()
      }, [query])
      `,
    ),

    h2("Optimise performance where users feel it"),
    p(
      "Performance work pays off when it targets what people notice. Google’s [Core Web Vitals](https://web.dev/articles/vitals) are the best place to start. A page counts as good when at least 75% of visits meet all three thresholds:",
    ),
    ul([
      "**Largest Contentful Paint (LCP)** of 2.5 seconds or less, for loading",
      "**Interaction to Next Paint (INP)** of 200 milliseconds or less, for responsiveness",
      "**Cumulative Layout Shift (CLS)** of 0.1 or less, for visual stability",
    ]),
    h3("Ship less JavaScript"),
    p(
      "Every kilobyte of JavaScript has to be downloaded, parsed and executed before it helps anyone, and on a mid-range phone that cost is real. Server Components keep the non-interactive parts of a page on the server, and code splitting holds back heavy, rarely used components until they’re needed:",
    ),
    code(
      "tsx",
      `
      import { lazy, Suspense } from "react"

      // The charting library is only downloaded when the chart first renders
      const SalesChart = lazy(() => import("./sales-chart"))

      export function Dashboard() {
        return (
          <Suspense fallback={<ChartSkeleton />}>
            <SalesChart />
          </Suspense>
        )
      }
      `,
      "dashboard.tsx",
    ),
    p(
      "In Next.js, `next/dynamic` wraps the same idea. Good candidates are charts, rich-text editors, maps and anything that only appears after a click.",
    ),
    quote("The fastest JavaScript is the JavaScript the browser never has to download."),
    h3("Treat images and fonts as part of the layout"),
    p(
      "A large image is often the LCP element, and images without dimensions are a classic cause of layout shift. Give every image explicit dimensions or an aspect ratio, load the hero image eagerly and everything below the fold lazily, and serve modern formats at the size they’re displayed. The Next.js [Image component](https://nextjs.org/docs/app/api-reference/components/image) does most of this by default. For fonts, limit the weights you ship and load them in a way that never hides text while they download.",
    ),
    h3("Memoise with evidence"),
    p(
      "`useMemo`, `useCallback` and `memo` skip work, but they add complexity, and sprinkling them everywhere rarely fixes a slow page. Profile first with the React DevTools Profiler, find the component that really renders too often, and fix that. If your project uses the React Compiler, most manual memoisation becomes unnecessary, because the compiler applies it for you.",
    ),
    h3("Keep interactions responsive"),
    p(
      "INP suffers when a keystroke triggers an expensive render. React’s concurrent features let urgent updates, like typing, happen first while the expensive ones catch up:",
    ),
    code(
      "tsx",
      `
      import { useDeferredValue, useState } from "react"

      export function ProductSearch({ products }: { products: Product[] }) {
        const [query, setQuery] = useState("")
        // Typing stays instant; the expensive list catches up a moment later
        const deferredQuery = useDeferredValue(query)

        return (
          <>
            <label htmlFor="search">Search products</label>
            <input id="search" value={query} onChange={(event) => setQuery(event.target.value)} />
            {/* ProductResults is memoised, so it can skip the urgent render */}
            <ProductResults products={products} query={deferredQuery} />
          </>
        )
      }
      `,
      "product-search.tsx",
    ),

    h2("Build responsive layouts in CSS, not JavaScript"),
    p(
      "A common anti-pattern is tracking the window width in state and rendering different components for mobile and desktop. It re-renders on every resize and causes hydration mismatches when the server guesses the screen size wrong. CSS handles responsiveness better: media queries for the page layout, and [container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries) for components that should adapt to the space they’re given.",
    ),
    code(
      "css",
      `
      .product-card {
        container-type: inline-size;
      }

      .product-card__body {
        display: grid;
        gap: 1rem;
      }

      /* The card responds to its own width, wherever it's placed */
      @container (min-width: 28rem) {
        .product-card__body {
          grid-template-columns: 8rem 1fr;
        }
      }
      `,
      "product-card.css",
    ),
    p("A card built this way works in a sidebar, a grid or a full-width section without knowing where it has been placed."),

    h2("Make accessibility part of the component API"),
    p(
      "Accessible components are usually simpler, not more complex, because the browser already does most of the work when you use the right element:",
    ),
    code(
      "tsx",
      `
      // Looks like a button, but keyboard and screen reader users can't use it
      <div className="button" onClick={addToCart}>Add to cart</div>

      // A real button: focusable, works with Enter and Space, announced as a button
      <button type="button" className="button" onClick={addToCart}>
        Add to cart
      </button>
      `,
    ),
    ul([
      "Use semantic elements (`button`, `a`, `nav`, `main`, `label`) before reaching for ARIA.",
      "Give every meaningful image useful `alt` text, and decorative images an empty `alt`.",
      "Manage focus when content changes: into a dialog when it opens, back to the trigger when it closes. Well-tested primitives such as [Radix UI](https://www.radix-ui.com/primitives) handle this for you.",
      "Respect `prefers-reduced-motion` for anything that animates.",
    ]),

    h2("Common React mistakes to avoid"),
    ol([
      "**Using array indexes as keys** for lists that can be reordered, filtered or edited. React then attaches state to the wrong item. Use a stable ID.",
      "**Defining components inside other components.** The inner component is recreated on every render, so its state resets and its DOM is rebuilt.",
      "**Fetching without loading, error and empty states**, which leaves people staring at a blank area whenever something goes wrong.",
      "**One giant context for everything.** Every consumer re-renders when any value changes. Split contexts by how often their values change.",
      "**Effects for things that aren’t synchronisation**, such as deriving data or responding to a click. Event handlers and render-time calculations are simpler and faster.",
      "**Optimising before measuring.** Without a profile, it’s easy to spend a day memoising components that were never the problem.",
    ]),

    h2("A checklist before you ship"),
    ul([
      "Each component has one responsibility and takes content through composition.",
      "No value is stored twice; anything derivable is calculated during render.",
      "Every request handles loading, error and empty states, and cancels stale responses.",
      "Heavy components are split out, images have dimensions and font weights are limited.",
      "The feature works with a keyboard, survives a screen reader check and holds up at 200% zoom.",
      "Core Web Vitals are checked with real-user data, not only in Lighthouse.",
    ]),
    p(
      "Performance and user experience aren’t separate goals. A fast interface that confuses people still fails, and so does a polished one that takes seconds to respond. If you’re building components from a design file, [my Figma to React workflow](/insights/figma-to-react-workflow) covers how I structure them, and [UI/UX design meets front-end development](/insights/ui-ux-design-and-front-end-development) explains why the two sides belong together.",
    ),
  ],
  faq: [
    {
      question: "What are the most important React best practices?",
      answer:
        "Keep components small and focused, prefer composition over long lists of props, keep rendering pure, store each piece of state once and derive the rest, handle loading, error and empty states for every request, ship as little JavaScript as possible, and build accessibility into components from the start with semantic HTML.",
    },
    {
      question: "How do I make a React website faster?",
      answer:
        "Measure first with Core Web Vitals and the React DevTools Profiler. Then reduce client-side JavaScript with Server Components and code splitting, optimise images and fonts, avoid unnecessary re-renders by fixing the components that render too often, and use concurrent features such as useDeferredValue to keep typing and clicking responsive.",
    },
    {
      question: "Is React good for SEO?",
      answer:
        "React can be very good for SEO when pages are rendered on the server or generated at build time, as frameworks like Next.js do by default, because search engines receive complete HTML. A client-only React app that renders everything in the browser is harder to index reliably and is usually slower to show its main content.",
    },
    {
      question: "Do I still need useMemo and useCallback?",
      answer:
        "Less often than before. They are worth using when profiling shows a real problem, such as an expensive calculation or a memoised child that re-renders because of a new function or object. Projects that use the React Compiler get most of this memoisation automatically.",
    },
    {
      question: "How do you make a React website responsive?",
      answer:
        "Handle responsiveness in CSS rather than in JavaScript state. Build mobile-first with Flexbox and Grid, use media queries for page-level layout and container queries for components, and use fluid values like clamp() for type and spacing. Then test at every width, not just at the breakpoints in the design.",
    },
  ],
  related: ["figma-to-react-workflow", "ui-ux-design-and-front-end-development", "future-of-front-end-development"],
}
