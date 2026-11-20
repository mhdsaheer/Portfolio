import { cards, designType, h2, p, ul, type InsightFile } from "@/lib/insight-content"

/** Where this guide's example images live. Each is an original mockup of a fictional brand. */
const EXAMPLES = "/images/insights/types-of-website-design"

export const article: InsightFile = {
  slug: "types-of-website-design",
  title: "Types of Website Design: 15 Popular Website Styles Every Designer Should Know",
  seoTitle: "15 Types of Website Design and Layouts with Examples",
  description:
    "Explore 15 types of website design, from minimalist and brutalist styles to grid, one-page and responsive layouts, with examples, use cases, pros and cons.",
  excerpt:
    "A visual guide to 15 website design styles, layouts and techniques: what each looks like, when to use it, where it falls short and real sites to study.",
  social: {
    title: "15 types of website design, with an example of each",
    description:
      "Minimalist, brutalist, glassmorphism, grid, one-page, responsive and more: a visual reference for choosing a website style, with real sites to study.",
  },
  image: "/images/insights/types-of-website-design.jpg",
  imageCrops: ["/images/insights/types-of-website-design-4x3.jpg", "/images/insights/types-of-website-design-1x1.jpg"],
  imageAlt:
    "A tilted collage of fifteen website mockups in different styles, including a yellow brutalist studio site, a dark analytics dashboard, a frosted-glass finance page and a coffee shop shown on three devices",
  date: "Nov 19, 2026",
  category: "Design",
  tags: ["Web Design", "UI/UX Design", "Website Layouts", "Responsive Design"],
  layout: "guide",
  seo: {
    focusKeyword: "types of website design",
    secondaryKeywords: [
      "different types of website design",
      "website design styles",
      "website layout types",
      "types of web design",
      "modern website design",
      "website design inspiration",
      "UI/UX design styles",
      "creative website layouts",
      "website design examples",
    ],
    searchIntent:
      "Informational, with some inspiration-seeking: designers, developers, students and business owners comparing website styles and layouts before choosing a direction for a project.",
    semanticKeywords: [
      "minimalist web design",
      "brutalism",
      "glassmorphism",
      "neumorphism",
      "dark mode",
      "layout grid",
      "asymmetrical layout",
      "parallax scrolling",
      "one-page website",
      "landing page",
      "responsive web design",
      "adaptive design",
      "visual hierarchy",
      "white space",
      "WCAG contrast",
      "Core Web Vitals",
    ],
  },
  intro: [
    "Open ten websites and you’ll find ten answers to the same two questions: how should this look, and how should it work? A speaker brand strips everything back to one product and a lot of white space. A newspaper fits dozens of stories onto its homepage. A design studio sets its name in letters taller than the screen. None of them is wrong; each suits its content, its audience and what it needs people to do.",
    "This guide covers 15 types of website design you’ll meet again and again. Each comes with an example mockup, the projects it suits, where it falls short and live websites worth studying, so you can come back to it whenever a project needs a direction.",
  ],
  body: [
    h2("What is website design?"),
    p(
      "Website design is the planning of how a website looks, how its content is organised and how people move through it. It brings together four kinds of decision:",
    ),
    ul([
      "**Visual design:** colour, typography, imagery and spacing.",
      "**Layout:** where content sits on each screen, and how it reflows on others.",
      "**Information architecture:** how pages and content are grouped, named and linked.",
      "**Interaction design:** what happens when someone clicks, scrolls, types or waits.",
    ]),
    p(
      "Design decides what the experience should be; front-end development turns those decisions into HTML, CSS and JavaScript that work on real devices. Each shapes the other, which is why I treat them as one process rather than a hand-off, as I explain in [UI/UX design meets front-end development](/insights/ui-ux-design-and-front-end-development).",
    ),

    h2("Why understanding different website design styles matters"),
    p(
      "Knowing the main types of web design gives you a shared vocabulary. When a client asks for something “clean and modern”, you can show them what minimalist, corporate and landing page approaches look like and agree on a direction before anyone opens Figma.",
    ),
    p(
      "It also makes the trade-offs visible early. Brutalism buys personality at the cost of familiarity. Parallax buys atmosphere at the cost of performance and of comfort for people sensitive to motion. Neumorphism looks tactile but struggles with contrast. Spotting that at the moodboard stage is far cheaper than after launch.",
    ),

    h2("The 15 types of website design at a glance"),
    p(
      "Lists like this one mix several kinds of decision. Separating them makes the list more useful, because each kind answers a different question:",
    ),
    {
      type: "kindMap",
      kinds: [
        { kind: "Visual style", question: "How does it look and feel?" },
        { kind: "Website type", question: "What is the site for?" },
        { kind: "Site structure", question: "How are its pages organised?" },
        { kind: "Layout approach", question: "How is each screen arranged?" },
        { kind: "Technique", question: "How does it move and adapt?" },
      ],
    },
    p(
      "Because they answer different questions, they combine freely. A real project might be an e-commerce site (type) with a minimalist look (style) on a strict grid (layout), offered in a dark theme (style) and built responsively (technique). Each section below names its kind and the types it pairs well with.",
    ),

    designType({
      id: "minimalist-website-design",
      number: 1,
      name: "Minimalist website design",
      kind: "Visual style",
      intro: [
        "Minimalist design removes everything that doesn’t help someone understand the content or take the next step. What’s left gets room to breathe. It isn’t the same as empty: the white space does real work, grouping related content and separating the rest.",
      ],
      image: {
        src: `${EXAMPLES}/minimalist-website-design-example.webp`,
        alt: "Minimalist website design example: a speaker brand’s product page with a large serif headline, short navigation, generous white space and a single black call-to-action button",
        caption:
          "A fictional speaker brand: one product image, a two-word serif headline and four links in generous white space, with a single muted accent and one primary button.",
      },
      characteristics: [
        "Generous white space that groups and separates content",
        "A restrained palette, often neutrals plus one accent",
        "Few type sizes, one primary action per screen",
      ],
      bestFor: ["Premium products", "Launch pages", "Portfolios"],
      advantages: ["Key content is hard to miss", "Fewer elements, faster pages"],
      limitations: ["Can leave questions unanswered", "Feels generic without strong type and imagery"],
      references: [
        {
          name: "Apple",
          href: "https://www.apple.com/",
          note: "A stack of full-width product panels, each with a headline of a few words and two links.",
        },
      ],
      pairsWith: ["grid-based-website-design", "landing-page-design", "portfolio-website-design"],
      tip: "Minimal doesn’t mean low contrast. Pale grey text is a common side effect of the style, but body text still needs at least 4.5:1 under [WCAG](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).",
    }),

    designType({
      id: "corporate-website-design",
      number: 2,
      name: "Corporate website design",
      kind: "Website type",
      intro: [
        "A corporate website represents an organisation rather than a product. It speaks to clients, partners, investors and future employees at once, so it favours structure, consistency and evidence. Its job is to build trust quickly and route each visitor to the part of the business that concerns them.",
      ],
      image: {
        src: `${EXAMPLES}/corporate-website-design-example.webp`,
        alt: "Corporate website design example: an advisory firm’s homepage with blue accents, a city skyline illustration, client logos, service cards and a floating client testimonial",
        caption:
          "A fictional advisory firm: a clear value statement, blue accents, credentials, client logos, service cards and a testimonial, all building trust.",
      },
      characteristics: [
        "A consistent identity applied through a design system",
        "Navigation organised by services, industries and audiences",
        "Trust signals such as client logos, case studies and testimonials",
      ],
      bestFor: ["Professional services", "B2B companies", "Institutions"],
      advantages: ["Credible to cautious buyers", "Scales across many pages and teams"],
      limitations: ["Easily bland and interchangeable", "Needs ongoing content governance"],
      references: [
        {
          name: "IBM",
          href: "https://www.ibm.com/",
          note: "Stacked product tiles, customer stories, training and news, each ending in a clear call to action.",
        },
        {
          name: "Stripe",
          href: "https://stripe.com/",
          note: "Customer logos, headline figures, case studies with named testimonials and sections by business size.",
        },
      ],
      pairsWith: ["minimalist-website-design", "grid-based-website-design", "responsive-and-adaptive-website-design"],
    }),

    designType({
      id: "ecommerce-website-design",
      number: 3,
      name: "E-commerce website design",
      kind: "Website type",
      intro: [
        "E-commerce design is built around finding, judging and buying products. Category pages help people narrow a range down, product pages answer their questions, and checkout removes anything that might make them hesitate. Small details, like a filter that remembers its state, directly affect sales.",
      ],
      image: {
        src: `${EXAMPLES}/ecommerce-website-design-example.webp`,
        alt: "E-commerce website design example: a colourful online shop with a sale banner, a filter sidebar and product cards, beside a mobile product page with colour and size options and an add-to-bag button",
        caption:
          "A fictional shop: a sale banner, category links, filters and product cards with quick-add buttons, beside the same shop’s product page on a phone.",
      },
      characteristics: [
        "Product cards with consistent images, prices and ratings",
        "Search, filters and sorting for large catalogues",
        "A short, predictable basket and checkout",
      ],
      bestFor: ["Online retailers", "Direct-to-consumer brands", "Marketplaces"],
      advantages: ["Decisions measurable against sales", "Familiar patterns feel effortless"],
      limitations: ["Large catalogues need careful structure", "Images weigh heavily on performance"],
      references: [
        {
          name: "IKEA UK",
          href: "https://www.ikea.com/gb/en/",
          note: "A huge catalogue organised through category tiles, product carousels and room inspiration, with filters on category pages.",
        },
      ],
      pairsWith: ["grid-based-website-design", "minimalist-website-design", "responsive-and-adaptive-website-design"],
      tip: "Product photos are often what [Largest Contentful Paint](https://web.dev/articles/vitals) measures. Serve them at their displayed size and give them fixed dimensions so the grid doesn’t jump as they load.",
    }),

    designType({
      id: "portfolio-website-design",
      number: 4,
      name: "Portfolio website design",
      kind: "Website type",
      intro: [
        "A portfolio site shows someone’s work and makes the case for hiring them. The work is the hero, but the framing matters as much: a short introduction, a few chosen projects and case studies that explain the thinking. It’s also where designers can take the most creative risks.",
      ],
      image: {
        src: `${EXAMPLES}/portfolio-website-design-example.webp`,
        alt: "Portfolio website design example: a product designer’s homepage with an oversized headline, an availability badge and colourful project thumbnails for a banking app, a brand website and a dashboard",
        caption:
          "A fictional product designer: an oversized headline mixing a bold sans-serif with an italic serif, then colourful project thumbnails labelled by discipline and year.",
      },
      characteristics: [
        "Personal branding through type, colour and tone of voice",
        "Curated projects that lead into case studies",
        "Simple routes between work, about and contact",
      ],
      bestFor: ["Designers and developers", "Photographers", "Studios and freelancers"],
      advantages: ["Shows skill instead of describing it", "Room for creative layouts"],
      limitations: ["Clever navigation can hurt usability", "Goes stale without updates"],
      references: [
        {
          name: "Awwwards: portfolio websites",
          href: "https://www.awwwards.com/websites/portfolio/",
          note: "A curated gallery of portfolio sites, filterable by category, technology, typeface and colour.",
        },
        {
          name: "Bruno Simon",
          href: "https://bruno-simon.com/",
          note: "A developer portfolio you explore by driving a car around a 3D world: personality-led to the extreme.",
        },
      ],
      pairsWith: ["asymmetrical-website-design", "minimalist-website-design", "parallax-and-interactive-website-design"],
      tip: "For a quieter approach, my own [work page](/work) lets visitors filter projects by discipline before opening a case study.",
    }),

    designType({
      id: "landing-page-design",
      number: 5,
      name: "Landing page design",
      kind: "Site structure",
      intro: [
        "A landing page is a single page with a single goal: sign up, book a demo, buy. Visitors arrive from an advert, an email or a search result, so the page must confirm they’re in the right place, then lead them to one action with as few distractions as possible.",
      ],
      image: {
        src: `${EXAMPLES}/landing-page-design-example.webp`,
        alt: "Landing page design example: a planning app’s landing page with a benefit-led headline, a gradient call-to-action button, a weekly planner screenshot, customer logos, benefit cards and a testimonial",
        caption:
          "A fictional planning app: a benefit-led headline, one prominent call to action, a product screenshot, logos, benefits and a testimonial, in the classic order.",
      },
      characteristics: [
        "A hero that states the offer and its main benefit",
        "One primary call to action, repeated down the page",
        "Minimal navigation, so there are fewer ways out",
      ],
      bestFor: ["Product launches", "Ad campaigns", "Lead generation"],
      advantages: ["Focused and easy to test", "Quick to build and iterate"],
      limitations: ["Too narrow for explorers", "Persuasion can tip into pressure"],
      references: [
        {
          name: "Linear",
          href: "https://linear.app/",
          note: "A short headline, a one-line subheading and two actions, “Get started” and “Contact sales”, above a large product preview.",
        },
        {
          name: "Notion",
          href: "https://www.notion.com/",
          note: "A short headline, one supporting line and two calls to action, followed by customer logos as social proof.",
        },
      ],
      pairsWith: ["minimalist-website-design", "one-page-website-design", "dark-mode-website-design"],
    }),

    designType({
      id: "editorial-and-magazine-website-design",
      number: 6,
      name: "Editorial and magazine website design",
      kind: "Website type",
      intro: [
        "Editorial design borrows from print: expressive typography, a clear hierarchy between the lead story and the rest, and photography that sets the mood. The challenge on the web is scale. A homepage may hold dozens of stories, and every article must stay comfortable to read for ten minutes or more.",
      ],
      image: {
        src: `${EXAMPLES}/editorial-magazine-website-design-example.webp`,
        alt: "Editorial website design example: a magazine homepage with a serif masthead, section navigation, a large illustrated coastal photograph, an expressive headline with a drop cap, and a row of article cards",
        caption:
          "A fictional magazine: a serif masthead, a large lead image with an expressive headline and drop cap, then a four-column row of stories.",
      },
      characteristics: [
        "Typography-led, with a distinctive headline face",
        "A clear hierarchy from lead story outwards",
        "Multi-column homepages, single-column articles",
      ],
      bestFor: ["News sites", "Magazines", "Long-form blogs"],
      advantages: ["Handles volume gracefully", "Builds a recognisable voice"],
      limitations: ["Dense homepages overwhelm", "Ads and embeds break layouts"],
      references: [
        {
          name: "The Guardian",
          href: "https://www.theguardian.com/international",
          note: "Groups a large volume of news into banded sections, an approach from its 2015 redesign, when “containers” replaced columns ([Journalism.co.uk](https://www.journalism.co.uk/key-principles-behind-the-new-guardian-website/)).",
        },
      ],
      pairsWith: ["grid-based-website-design", "minimalist-website-design", "dark-mode-website-design"],
      tip: "Long reads need a comfortable line length and generous line spacing. This page keeps its paragraphs to roughly 70 characters a line for the same reason.",
    }),

    designType({
      id: "brutalist-website-design",
      number: 7,
      name: "Brutalist website design",
      kind: "Visual style",
      intro: [
        "Brutalist web design takes its name from Brutalist architecture and its raw concrete. It rejects polish on purpose: default-looking fonts, visible borders, clashing colours and layouts closer to a zine than a template. Done well, it’s memorable. Done carelessly, it’s simply hard to use.",
      ],
      image: {
        src: `${EXAMPLES}/brutalist-website-design-example.webp`,
        alt: "Brutalist website design example: a design studio site with oversized black condensed type on bright yellow, thick black borders, underlined blue links, a red block and a raw email sign-up form",
        caption:
          "A fictional design studio: oversized condensed type, harsh yellow, black and red, thick borders, monospace text and default blue links.",
      },
      characteristics: [
        "Oversized or system-default typography",
        "Exposed structure: borders, raw links, visible boxes",
        "High contrast and unexpected colours",
      ],
      bestFor: ["Creative studios", "Artists and musicians", "Culture and fashion"],
      advantages: ["Instantly distinctive", "Often lightweight"],
      limitations: ["Unfamiliar navigation confuses", "Attitude can trump accessibility"],
      references: [
        {
          name: "Brutalist Websites",
          href: "https://brutalistwebsites.com/",
          note: "A long-running gallery of sites in the style, many with short interviews with their makers.",
        },
      ],
      pairsWith: ["portfolio-website-design", "asymmetrical-website-design", "grid-based-website-design"],
    }),

    designType({
      id: "glassmorphism-website-design",
      number: 8,
      name: "Glassmorphism website design",
      kind: "Visual style",
      intro: [
        "Glassmorphism makes panels look like frosted glass: translucent, blurred and layered over colourful backgrounds. In CSS it combines `backdrop-filter: blur()`, a translucent fill and a thin light border. It creates depth, but only when there’s something worth seeing behind the glass and the text stays readable.",
      ],
      image: {
        src: `${EXAMPLES}/glassmorphism-website-design-example.webp`,
        alt: "Glassmorphism website design example: a finance site with frosted-glass cards for a balance, a payment card, a savings goal and recent transactions over vivid pink, orange and blue gradients",
        caption:
          "A fictional finance app: frosted cards with thin light borders float over vivid gradients, with text kept on the most opaque layers.",
      },
      characteristics: [
        "Translucent panels with background blur",
        "Vivid gradients or imagery behind the glass",
        "Thin, light borders and layered depth",
      ],
      bestFor: ["Dashboards", "Navigation and overlays", "Hero sections"],
      advantages: ["Depth without heavy shadows", "Keeps context visible behind menus"],
      limitations: ["Contrast shifts with the background", "Blur is costly on low-end devices"],
      references: [
        {
          name: "Microsoft Fluent Design: Acrylic",
          href: "https://learn.microsoft.com/en-us/windows/apps/design/style/acrylic",
          note: "Documentation for Acrylic, a material combining translucency, blur and noise to add depth.",
        },
        {
          name: "Apple: Liquid Glass",
          href: "https://www.apple.com/newsroom/2025/06/apple-introduces-a-delightful-and-elegant-new-software-design/",
          note: "Apple’s June 2025 announcement of a translucent material that reflects and refracts what’s behind it.",
        },
      ],
      pairsWith: ["dark-mode-website-design", "landing-page-design", "parallax-and-interactive-website-design"],
      tip: "[`backdrop-filter`](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter) works in current browsers, but test each panel over the busiest part of its background and give it a solid fallback colour.",
    }),

    designType({
      id: "neumorphism-website-design",
      number: 9,
      name: "Neumorphism website design",
      kind: "Visual style",
      intro: [
        "Neumorphism, or soft UI, makes elements look pressed out of or into the background. Controls share the background colour, and depth comes from two soft shadows, one light and one dark. The result is calm and tactile, and the style here most likely to fail accessibility checks.",
      ],
      image: {
        src: `${EXAMPLES}/neumorphism-website-design-example.webp`,
        alt: "Neumorphism website design example: a smart-home control page in soft grey with an embossed thermostat dial, raised mode buttons, inset toggle switches and a brightness slider, with notes on raised and inset shadows",
        caption:
          "A fictional smart-home app: a dial, buttons, toggles and a slider all formed from the background colour, with notes showing how raised and inset shadows work.",
      },
      characteristics: [
        "Elements the same colour as the background",
        "Paired shadows for raised and inset states",
        "Soft, rounded, low-contrast shapes",
      ],
      bestFor: ["Device controls", "Media players", "Small tools"],
      advantages: ["Calm and tactile", "Distinctive in small doses"],
      limitations: ["Boundaries are hard to see", "Pressed states are easily confused"],
      references: [
        {
          name: "Neumorphism.io",
          href: "https://neumorphism.io/",
          note: "A CSS generator for neumorphic shadows that shows exactly how the two-shadow effect is built.",
        },
      ],
      pairsWith: ["minimalist-website-design", "glassmorphism-website-design"],
      tip: "WCAG asks for 3:1 contrast on the boundaries of controls ([Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)). Pure neumorphism rarely gets there, so add a border, icon or colour change to anything people press.",
    }),

    designType({
      id: "dark-mode-website-design",
      number: 10,
      name: "Dark mode website design",
      kind: "Visual style",
      intro: [
        "Dark mode sets light text on dark surfaces, either as a site’s only theme or as an option chosen by hand or through the [`prefers-color-scheme`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) media query. Good dark interfaces are rarely pure black; Material Design recommends dark grey (#121212), which keeps shadows visible.",
      ],
      image: {
        src: `${EXAMPLES}/dark-mode-website-design-example.webp`,
        alt: "Dark mode website design example: an analytics product page with charcoal surfaces, off-white text, a violet gradient button and a dashboard of charts, with the light theme and a theme switch shown alongside",
        caption:
          "A fictional analytics product: charcoal surfaces in several elevations, off-white text and one violet accent, with the light theme and a theme switch alongside.",
      },
      characteristics: [
        "Dark grey surfaces, lighter when raised",
        "Off-white text rather than pure white",
        "Accents adjusted for dark backgrounds",
      ],
      bestFor: ["Developer tools", "Media and film", "Dashboards"],
      advantages: ["Imagery and accents stand out", "Comfortable in low light"],
      limitations: ["Long light-on-dark text tires some readers", "Every colour needs testing in both themes"],
      references: [
        {
          name: "Material Design: Dark theme",
          href: "https://m2.material.io/design/color/dark-theme.html",
          note: "Google’s guidance, including the #121212 surface colour and lighter surfaces for higher elevation.",
        },
        {
          name: "Linear: How we redesigned the Linear UI",
          href: "https://linear.app/now/how-we-redesigned-the-linear-ui",
          note: "How Linear generates light and dark themes from a base colour, an accent and a contrast level.",
        },
      ],
      pairsWith: ["glassmorphism-website-design", "minimalist-website-design", "landing-page-design"],
    }),

    designType({
      id: "grid-based-website-design",
      number: 11,
      name: "Grid-based website design",
      kind: "Layout approach",
      intro: [
        "A grid-based design places content on an underlying system of columns, gutters and margins. Visitors never see the grid, but they feel it: edges line up, spacing repeats and a full page still reads as orderly. Almost every layout uses a grid; here it becomes the organising principle.",
      ],
      image: {
        src: `${EXAMPLES}/grid-based-website-design-example.webp`,
        alt: "Grid-based website design example: an architecture journal homepage with its twelve-column layout grid shown in pink, and a headline, intro and three illustrated article cards aligned to the columns",
        caption:
          "A fictional architecture journal with its 12-column grid switched on: every block spans whole columns and shares the same 24px gutters.",
      },
      characteristics: [
        "A column system, often 12 columns on wide screens",
        "Modular blocks that span whole columns",
        "Fewer columns at smaller breakpoints",
      ],
      bestFor: ["Content-rich sites", "Catalogues", "Dashboards"],
      advantages: ["Orders large amounts of content", "Makes decisions repeatable"],
      limitations: ["Can feel rigid", "Odd-shaped content looks awkward"],
      references: [
        {
          name: "Dribbble",
          href: "https://dribbble.com/shots",
          note: "A uniform grid of identically proportioned shot cards that makes thousands of images easy to scan.",
        },
        {
          name: "Bootstrap grid system",
          href: "https://getbootstrap.com/docs/5.3/layout/grid/",
          note: "Bootstrap’s mobile-first, 12-column grid: a clear reference for how columns respond across breakpoints.",
        },
      ],
      pairsWith: ["editorial-and-magazine-website-design", "ecommerce-website-design", "minimalist-website-design"],
      tip: "CSS Grid expresses this directly with `grid-template-columns: repeat(12, 1fr)` and a `gap`. My [Figma to React workflow](/insights/figma-to-react-workflow) covers reading a layout grid from a design file.",
    }),

    designType({
      id: "asymmetrical-website-design",
      number: 12,
      name: "Asymmetrical website design",
      kind: "Layout approach",
      intro: [
        "Asymmetrical design balances a page without mirroring it. A large image on one side is weighed against dense text on the other; elements overlap, sit off-centre or break their columns. The imbalance is deliberate: it creates movement and pulls the eye where the designer wants.",
      ],
      image: {
        src: `${EXAMPLES}/asymmetrical-website-design-example.webp`,
        alt: "Asymmetrical website design example: a creative agency homepage with a headline overlapping an off-centre image of arches and a sun, a rotated thumbnail, a circular badge and text blocks of different widths",
        caption:
          "A fictional agency: an off-centre image, an overlapping headline, a rotated thumbnail and uneven blocks that still follow a hidden grid.",
      },
      characteristics: [
        "Weight balanced by contrast, not symmetry",
        "Offset and overlapping images and text",
        "A hidden grid that keeps it coherent",
      ],
      bestFor: ["Creative agencies", "Fashion brands", "Campaign pages"],
      advantages: ["Energy and a clear focal point", "Feels bespoke"],
      limitations: ["Hard to adapt to phones", "Overlaps can muddle reading order"],
      references: [
        {
          name: "Webdesigner Depot: Asymmetrical balance in web design",
          href: "https://webdesignerdepot.com/asymmetrical-balance-in-web-design/",
          note: "Patrick McNeil on balancing elements that don’t mirror each other. Agency sites change often, so galleries such as [Awwwards](https://www.awwwards.com/websites/portfolio/) are the best source of live examples.",
        },
      ],
      pairsWith: ["portfolio-website-design", "brutalist-website-design", "grid-based-website-design"],
      tip: "Keep the HTML in a logical order even when the visual order isn’t, because screen reader and keyboard users follow the source.",
    }),

    designType({
      id: "parallax-and-interactive-website-design",
      number: 13,
      name: "Parallax and interactive website design",
      kind: "Technique",
      intro: [
        "Parallax scrolling moves layers at different speeds as the page scrolls, so the background seems further away. It belongs to a wider family of interactive techniques, from scroll-triggered animation to 3D scenes, that turn a page into something people explore rather than just read.",
      ],
      image: {
        src: `${EXAMPLES}/parallax-scrolling-website-design-example.webp`,
        alt: "Parallax website design example: a travel site hero with layered purple mountains, a glowing sun and a serif headline, beside an exploded view of its sky, peaks, hills and trees layers labelled with their scroll speeds",
        caption:
          "A fictional travel guide: a hero built from landscape layers, with an exploded view showing the speed each layer moves at as the page scrolls.",
      },
      characteristics: [
        "Layers that move at different speeds",
        "Animation tied to scroll position",
        "Stories revealed step by step",
      ],
      bestFor: ["Product stories", "Campaigns", "Data journalism"],
      advantages: ["Memorable and immersive", "Controls the order of discovery"],
      limitations: ["Heavy assets hurt Core Web Vitals", "Motion can cause discomfort"],
      references: [
        {
          name: "Firewatch",
          href: "https://www.firewatchgame.com/",
          note: "The game’s site opens on a layered landscape whose parallax header developers have recreated in many tutorials.",
        },
        {
          name: "The Pudding",
          href: "https://pudding.cool/",
          note: "Visual essays where charts, interaction and scrolling are part of how each story is told.",
        },
      ],
      pairsWith: ["one-page-website-design", "landing-page-design", "editorial-and-magazine-website-design"],
      tip: "Animate `transform` and `opacity`, and switch effects off under [`prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion). My guide to [React performance](/insights/react-best-practices-performance) covers the loading side.",
    }),

    designType({
      id: "one-page-website-design",
      number: 14,
      name: "One-page website design",
      kind: "Site structure",
      intro: [
        "A one-page website puts all its content on one long page divided into sections. The navigation jumps to them with anchor links such as `#menu` and `#visit` instead of loading new pages, so the site reads as one continuous story.",
      ],
      image: {
        src: `${EXAMPLES}/one-page-website-design-example.webp`,
        alt: "One-page website design example: a café website with a sticky navigation bar highlighting Home, a coffee cup illustration and a menu section, beside an overview mapping the page’s six sections to their anchor links",
        caption:
          "A fictional café: a sticky bar and section dots at the top of the page, beside a map of all six sections and their anchor links.",
      },
      characteristics: [
        "Sticky navigation linked to sections",
        "A clear order, from introduction to action",
        "The current section highlighted in the menu",
      ],
      bestFor: ["Small businesses", "Events", "Personal sites and CVs"],
      advantages: ["Simple to navigate on a phone", "A focused, natural flow"],
      limitations: ["Doesn’t scale to lots of content", "One URL limits search reach"],
      references: [
        {
          name: "One Page Love",
          href: "https://onepagelove.com/",
          note: "A gallery dedicated to one-page websites, hand-picked since 2008.",
        },
        {
          name: "Carrd",
          href: "https://carrd.com/",
          note: "A builder made for simple, fully responsive one-page sites, from profiles to landing pages.",
        },
      ],
      pairsWith: ["landing-page-design", "parallax-and-interactive-website-design", "responsive-and-adaptive-website-design"],
      tip: "Use real anchor links to headings with matching ids: they work without JavaScript, can be shared and move keyboard users to the right place, as this page’s contents do.",
    }),

    designType({
      id: "responsive-and-adaptive-website-design",
      number: 15,
      name: "Responsive and adaptive website design",
      kind: "Technique",
      intro: [
        "Responsive design uses fluid layouts, flexible images and media queries so one layout reflows to fit any screen; Ethan Marcotte named it in a [2010 article for A List Apart](https://alistapart.com/article/responsive-web-design/). Adaptive design instead switches between a few fixed layouts built for set screen sizes.",
        "Responsive is now the default, and the setup [Google recommends](https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing) for mobile-first indexing, where the mobile version of a page is the one indexed. Adaptive thinking still helps with components like data tables that need a different design on phones.",
      ],
      image: {
        src: `${EXAMPLES}/responsive-website-design-example.webp`,
        alt: "Responsive website design example: a coffee roaster’s website on a desktop monitor, a tablet and a phone, with three product columns on desktop, a stacked tablet layout and a single column with a menu button on mobile",
        caption:
          "A fictional coffee roaster at 1440, 768 and 390 pixels: the same markup goes from three products per row to two, then one, with the menu behind a button.",
      },
      characteristics: [
        "Mobile-first CSS that adds complexity as space allows",
        "Fluid units such as `%`, `fr`, `rem` and `clamp()`",
        "Images sized with `srcset` and `sizes`",
      ],
      bestFor: ["Every public website", "Web apps", "Online shops"],
      advantages: ["One codebase and URL for every device", "Matches Google’s recommendation"],
      limitations: ["Complex components need extra thought", "Adaptive layouts multiply upkeep"],
      references: [
        {
          name: "GOV.UK Design System: Layout",
          href: "https://design-system.service.gov.uk/styles/layout/",
          note: "Advises designing for small screens first, starting with one column, with grid classes for wider screens.",
        },
        {
          name: "A List Apart: Responsive Web Design",
          href: "https://alistapart.com/article/responsive-web-design/",
          note: "Ethan Marcotte’s May 2010 article: fluid grids, flexible images and media queries.",
        },
      ],
      pairsWith: ["grid-based-website-design", "one-page-website-design", "ecommerce-website-design"],
      tip: "MDN’s guide to [responsive images](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images) explains `srcset` and `sizes`. On a phone, the table below scrolls sideways rather than squashing its columns.",
    }),

    h2("Comparison of the 15 website design types"),
    p("Each type in a line, so you can scan the whole list. Select a name to jump back to its section."),
    {
      type: "comparison",
      caption: "The 15 types of website design compared by kind, best use, main strength and main risk",
      rows: [
        { id: "minimalist-website-design", bestFor: "Premium products, portfolios", strength: "Focus and clarity", watchOut: "Feeling generic" },
        { id: "corporate-website-design", bestFor: "Services, B2B, institutions", strength: "Credibility", watchOut: "Blandness" },
        { id: "ecommerce-website-design", bestFor: "Retailers, marketplaces", strength: "Shopping that converts", watchOut: "Catalogue complexity" },
        { id: "portfolio-website-design", bestFor: "Designers, developers, studios", strength: "Shows skill directly", watchOut: "Over-clever navigation" },
        { id: "landing-page-design", bestFor: "Launches, campaigns", strength: "One clear action", watchOut: "Too narrow for explorers" },
        { id: "editorial-and-magazine-website-design", bestFor: "News, magazines, blogs", strength: "Hierarchy at volume", watchOut: "Cluttered homepages" },
        { id: "brutalist-website-design", bestFor: "Studios, artists, culture", strength: "Distinctiveness", watchOut: "Usability" },
        { id: "glassmorphism-website-design", bestFor: "Dashboards, overlays", strength: "Depth with context", watchOut: "Text contrast" },
        { id: "neumorphism-website-design", bestFor: "Device controls, small tools", strength: "Tactile calm", watchOut: "Low contrast" },
        { id: "dark-mode-website-design", bestFor: "Developer tools, media", strength: "Vivid imagery", watchOut: "Long-text readability" },
        { id: "grid-based-website-design", bestFor: "Content-rich sites", strength: "Order", watchOut: "Rigidity" },
        { id: "asymmetrical-website-design", bestFor: "Agencies, fashion", strength: "Energy", watchOut: "Small screens" },
        { id: "parallax-and-interactive-website-design", bestFor: "Stories, campaigns", strength: "Immersion", watchOut: "Performance and motion" },
        { id: "one-page-website-design", bestFor: "Small businesses, events", strength: "Simple story", watchOut: "Limited reach" },
        { id: "responsive-and-adaptive-website-design", bestFor: "Every public website", strength: "Works on any screen", watchOut: "Complex components" },
      ],
    },

    h2("How to choose the right website design style"),
    p("There’s no best type of website design, only the best fit. I work through these questions in roughly this order:"),
    cards("steps", [
      {
        title: "Start with the goal",
        text: "Sell, inform, persuade or recruit? The answer usually settles the website type and structure before any visual style.",
      },
      {
        title: "Know the audience",
        text: "Who visits, on what device and how often? A booking site used yearly and a dashboard used daily need different things.",
      },
      {
        title: "Use the content you have",
        text: "Minimalism needs strong photography; editorial needs a steady supply of articles. Design around real content, not placeholders.",
      },
      {
        title: "Match the brand",
        text: "A law firm and a skate brand can both be “modern” without feeling the same. Express the brand, not the latest trend.",
      },
      {
        title: "Check the constraints",
        text: "Budget, timeline, who updates the site and how fast it must load. Scroll storytelling costs far more than a well-made grid.",
      },
      {
        title: "Prototype and test",
        text: "Mock up two directions, try them on real devices with real users, and let what you observe decide.",
      },
    ]),

    h2("Modern website design trends worth exploring"),
    p("Trends are useful when they serve the content. These rest on features that browsers and major design systems now support:"),
    cards("trends", [
      {
        title: "Bento-style grids",
        text: "Modular cards of different sizes that summarise many features on one screen, and adapt well to smaller ones.",
      },
      {
        title: "Translucent materials",
        text: "Apple’s Liquid Glass and Microsoft’s Acrylic have made translucency part of major design systems.",
      },
      {
        title: "Scroll-driven animation",
        text: "[CSS scroll-driven animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations) tie motion to scroll position with less JavaScript, where supported.",
      },
      {
        title: "View transitions",
        text: "The [View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API) animates between states, and even between pages, for app-like continuity.",
      },
      {
        title: "Expressive typography",
        text: "Variable fonts hold many weights and widths in one file, making characterful headlines practical.",
      },
      {
        title: "Theme-aware design",
        text: "Light and dark themes built from shared design tokens, following the system setting by default.",
      },
    ]),

    h2("Common website design mistakes to avoid"),
    cards("mistakes", [
      {
        title: "Choosing a style before the goal",
        text: "A striking brutalist homepage won’t help a pharmacy fill prescriptions. Decide what the site is for first.",
      },
      {
        title: "Putting trends before usability",
        text: "Neumorphic buttons nobody can find and glass panels nobody can read are style without function.",
      },
      {
        title: "Ignoring contrast",
        text: "[WCAG](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) asks for 4.5:1 for body text and 3:1 for large text, whatever the style.",
      },
      {
        title: "Designing for desktop only",
        text: "Squeezing a desktop layout onto a phone at the end rarely works. Start small and add complexity.",
      },
      {
        title: "Heavy, unoptimised media",
        text: "Oversized images, autoplaying video and big animation libraries weigh on [Core Web Vitals](https://web.dev/articles/vitals).",
      },
      {
        title: "Motion without an off switch",
        text: "Respect `prefers-reduced-motion`, and never animate text people are trying to read.",
      },
    ]),

    h2("Bringing it together"),
    p(
      "The 15 types of website design in this guide aren’t boxes to pick one from. They’re ingredients, and good websites combine several: a corporate site with a minimalist look on a solid grid, a portfolio with an asymmetrical layout and a dark theme, a landing page with a little parallax. What matters is choosing each one for a reason, then checking the result still works for the people using it.",
    ),
    p(
      "That last step is the part I care about most. I combine design thinking with front-end development to create visually engaging, functional, and user-friendly digital experiences, and a style only proves itself in a real browser, on a real device, in front of a real person.",
    ),
  ],
  faq: [
    {
      question: "What are the main types of website design?",
      answer:
        "Common types include minimalist, corporate, e-commerce, portfolio, landing page, editorial, brutalist, glassmorphism, neumorphism, dark mode, grid-based, asymmetrical, parallax, one-page and responsive design. Some are visual styles, others website types, layouts, structures or techniques, so most sites combine several.",
    },
    {
      question: "What is the difference between responsive and adaptive web design?",
      answer:
        "Responsive design uses one fluid layout that reflows to fit any screen width. Adaptive design switches between a few fixed layouts built for specific screen sizes. Responsive is the usual default today.",
    },
    {
      question: "Which website design style is best for a small business?",
      answer:
        "Usually a clean, responsive design that makes the essentials easy to find: what the business offers, where it is and how to get in touch. A one-page site suits a focused offer; several services need several pages.",
    },
    {
      question: "Is parallax scrolling bad for SEO or accessibility?",
      answer:
        "Not in itself. Search engines can index parallax pages when the content is real text in the HTML. The risks are slow loading and strong motion, so keep effects light and turn them off when reduced motion is requested.",
    },
    {
      question: "Are glassmorphism and neumorphism accessible?",
      answer:
        "They can be, with care. Both tend to lower contrast, so add solid fallbacks, visible borders, clear focus states and text that meets WCAG contrast ratios.",
    },
  ],
  related: ["ui-ux-design-and-front-end-development", "figma-to-react-workflow", "react-best-practices-performance"],
}
