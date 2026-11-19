/** One colour from a product's design system, read from its code rather than its spec. */
export type Swatch = {
  name: string
  hex: string
  /** What the colour is for. Leave out where the name already says it. */
  role?: string
  /** The darker shade a filled button sits on and presses into. */
  lip?: string
  /** The pale tint the colour is laid on: badges, active rows, module bands. */
  soft?: string
  /** The words on the sample button or badge. Defaults to the name. */
  sample?: string
}

export type CaseStudy = {
  slug: string
  index: number
  title: string
  category: string
  /** The service on offer, not the domain - this is what the index lists. */
  discipline: "Branding" | "Design" | "Development" | "Design & Development"
  description: string
  /** The work index's one line: where the project started, and what it became. */
  summary: string
  image: string
  tags: string[]
  year: string
  role?: string
  timeline: string
  client: string
  platform: string
  /** The finished work, where it can be seen. Shows as a link under the title. */
  liveUrl?: string
  overview: string[]
  challenge: {
    title: string
    body: string[]
    pains: string[]
  }
  approach: {
    step: string
    title: string
    body: string
  }[]
  /** The product's own design system. Leave out when there is none to show; the section goes with it. */
  designSystem?: {
    /** What the section is called beside its number. Defaults to "The design system". */
    label?: string
    title: string
    intro: string
    palettes: {
      name: string
      note: string
      swatches: Swatch[]
    }[]
    typeface?: {
      family: string
      weights: { label: string; weight: number }[]
      /** A line from the product, set in the typeface. */
      sample: string
      note: string
    }
  }
  gallery: {
    src: string
    alt: string
    caption?: string
  }[]
  results: {
    value: string
    label: string
  }[]
  /** The outcome section's heading, for work with no before and after to report. Defaults to "What changed". */
  outcomeHeading?: string
  outcome: string[]
  /** Leave out when there is no real quote to show; the section goes with it. */
  testimonial?: {
    quote: string
    author: string
    role: string
  }
  stack: string[]
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "tecz",
    index: 1,
    title: "TecZ Campaign & Identity",
    category: "Web Design & Development",
    discipline: "Design & Development",
    description: "A Malayalam-first campaign and event identity telling Gen Z to learn what AI can't replace",
    summary:
      "An open house for a tech academy, turned into TecZ: a career conclave with its own name, identity, campaign line and event site.",
    image: "/images/work-tecz.jpg",
    tags: ["Campaign", "Brand Identity", "Web Design", "Web Development", "Event Coordination"],
    year: "2026",
    role: "Campaign Concept, Brand Identity, Art Direction, Web Design, Web Development, Event Coordination",
    timeline: "Event on 1 October 2026",
    client: "Technodot Academy of R&D&I",
    platform: "Outdoor, social, print, web and on-site",
    liveUrl: "https://tecz-conclave.vercel.app/",
    overview: [
      "Technodot Academy of R&D&I wanted to reach students while they are still deciding what to study, and to bring them and their parents through its doors. The work runs on two levels: an academy-wide campaign, and TecZ, the career discovery event that campaign leads to.",
      "The campaign opens with a question in everyday Malayalam, “എന്തിനാ വെറുതെ പഠിക്കുന്നേ?” (why study for nothing?), and answers it in English: learn what AI can't replace. TecZ, short for Technology Education Conclave, gives that answer a place to happen: a free day at the academy in Kerala to explore courses, meet mentors and see the career paths ahead.",
    ],
    challenge: {
      title: "Students were asking whether studying still pays off",
      body: [
        "The usual education ad lists courses and promises placements. The students this campaign speaks to have harder questions: will this lead to a job, can I stand on my own feet, and will any of it still matter once AI can do the work?",
        "The audience is also wide. TecZ is open to Plus Two, degree and engineering students, with no tech background needed, and their parents are invited too. And an open house is easy to skip, so the event needed a name and a look of its own while still reading as Technodot.",
      ],
      pains: [
        "Worry that a course won't end in a stable job",
        "Confusion about which career to choose",
        "Uncertainty about which skills will outlast AI",
        "Wanting to earn and be independent sooner",
        "An open house gives people little reason to show up",
      ],
    },
    approach: [
      {
        step: "01",
        title: "Started from the question students already ask",
        body: "“എന്തിനാ വെറുതെ പഠിക്കുന്നേ?” sounds like something said at home rather than printed by a college. Two English lines answer it: when you can earn while learning, and learn what AI can't replace. Keeping the hook in Malayalam makes it feel local before it makes a promise.",
      },
      {
        step: "02",
        title: "Split the message into four tracks",
        body: "Twelve social messages sit under branding, benefits, courses and the event. Most open with a hook and follow with a plain next step, and the copy mixes Malayalam and English the way students talk. Some of it leans on wordplay: “സ്വന്തം കാലിലല്ലേ നല്ല കാലം” puns on kaal (foot) and kaalam (time) to sell financial independence.",
      },
      {
        step: "03",
        title: "Gave the campaign a character",
        body: "A skateboarding student with a stuffed backpack and a pencil trailing behind carries the campaign across a hoarding and square and vertical social formats. The magenta-to-violet background and slanted, outlined Malayalam lettering keep it recognisable at every size, and the social pieces add the courses on offer: Digital Finance & Taxation, Python Full Stack, Cloud Computing and Data Analytics.",
      },
      {
        step: "04",
        title: "Named the event and drew its mark",
        body: "TEC stands for Technology Education Conclave and the Z for Gen Z, and the whole word folds Technodot and Gen Z together. In the wordmark, three geometric letters lead into a Z written as one loose ribbon in an orange-to-violet gradient. The Z also works alone, as an app-style icon and inside circular seals.",
      },
      {
        step: "05",
        title: "Built a kit of parts for the event",
        body: "Twelve colours, Cabinet Grotesk, Nicky Sans, a starburst and a looping arm with a pointing hand make up the system. Rearranged as colour blocks, they cover a hoarding, a lanyard badge, a cap, an entrance arch, a stage screen and a flag.",
      },
      {
        step: "06",
        title: "Designed and built the event site",
        body: "The homepage opens on “Learn what AI can't replace”, with the student on a magenta starburst, a Reserve your seat button and a yellow ticker running the event lines in English. Below that it answers what a student or parent would ask: five reasons to attend, eight domains to explore, and an FAQ on coding experience and whether parents are welcome. On a phone, the same colour blocks hold the countdown and the reasons to attend. The site is built in Next.js and deployed on Vercel.",
      },
    ],
    gallery: [
      {
        src: "/images/work-tecz.jpg",
        alt: "TecZ event site on a laptop, with the headline Learn what AI can't replace and a skateboarding student on a magenta starburst",
      },
      {
        src: "/images/work-tecz-phone.jpg",
        alt: "TecZ event site on a phone, showing a countdown above the section Five reasons to spend the day here",
      },
    ],
    results: [
      { value: "12", label: "Social messages across four tracks" },
      { value: "6", label: "Event touchpoints, from badge to stage" },
      { value: "8", label: "Career domains on the event site" },
      { value: "2", label: "Languages working in one campaign" },
    ],
    outcomeHeading: "What came out of it",
    outcome: [
      "One idea now holds across very different surfaces. The same line and the same student run from a hoarding to an Instagram post to the event homepage, and TecZ keeps a look of its own with the Technodot name sitting above it.",
      "Because the identity is a set of parts instead of a fixed layout, new formats can be composed from the same colour blocks, ribbon and starburst without redrawing anything.",
    ],
    stack: ["Cabinet Grotesk", "Nicky Sans", "Malayalam & English copy", "Next.js", "Vercel"],
  },
  {
    slug: "travelos",
    index: 2,
    title: "TravelOS Agency CRM",
    category: "SaaS Product",
    discipline: "Design & Development",
    description:
      "A bright, action-first CRM that takes a travel booking from the first WhatsApp message to the trip itself",
    summary:
      "A CRM that carries every travel booking from the first WhatsApp message to the trip, with a portal each for agents, managers, finance and admins.",
    image: "/images/work-travelos-marble.jpg",
    tags: ["SaaS", "Product Design", "Design System", "Front-end"],
    year: "2026",
    role: "Product Design, Design System, Front-end Development",
    timeline: "2026, in progress",
    client: "TravelOS, a SaaS product for travel agencies",
    platform: "Web app for desktop and mobile",
    overview: [
      "TravelOS is a CRM for travel agencies in the Gulf and India. It follows a booking from the first enquiry through fare, payment and ticket to the trip itself, with a portal each for agents, managers, finance and admins.",
      "The goal came from one line of the spec: if an agent has to think for more than one second about what to tap next, the design has failed.",
    ],
    challenge: {
      title: "An agent with 30 leads a day has no second to spare",
      body: [
        "Agents work on calls, in airports and with several customers waiting at once. Most enquiries arrive on WhatsApp, and each one has to be carried from a first message to a fare, a payment, a ticket and a trip.",
        "The same bookings are read by people with different jobs, and no one should land on a page that isn't theirs.",
      ],
      pains: [
        "Around 80% of Gulf enquiries arrive on WhatsApp, not through a form",
        "Thirty or more leads a day, each at a different stage",
        "Work done one-handed, mid-call or on the move",
        "Four roles that need different views of the same bookings",
      ],
    },
    approach: [
      {
        step: "01",
        title: "Set five rules before any screen",
        body: "Action first, zero dead ends, one thumb, speed over beauty and memory reduction. So empty lists offer a next step, the main action on a phone sits just above the tab bar, and forms arrive already filled in.",
      },
      {
        step: "02",
        title: "Went bright, with one green for go",
        body: "The spec asked for a dark, blue interface. The build went light: a near-white ground, Plus Jakarta Sans, and one green, #007653, for every main action. WhatsApp gets its own green, #009956, and filled buttons press 1px into a darker lip.",
      },
      {
        step: "03",
        title: "Gave every module its own colour",
        body: "Eight hues at the same lightness, from terracotta Enquiries to teal Finance. A screen sets its module with one class, and every button, icon and tint inside it follows.",
      },
      {
        step: "04",
        title: "Drew the booking as a path",
        body: "Each lead shows seven steps, from Enquiry to Travelled. The current step pulses with its next action written beside it, so the stepper is also the button.",
      },
      {
        step: "05",
        title: "Made a new enquiry three questions",
        body: "Who's asking, what they need, last details. Defaults fill the rest, a known phone number offers the existing customer instead of a duplicate, and a past date warns without blocking.",
      },
      {
        step: "06",
        title: "Put WhatsApp at the centre of the lead",
        body: "Chat, Call, Share fare and To trip sit at the top of every lead. A fare is previewed as the exact message before it goes, and the activity log reads like a chat.",
      },
      {
        step: "07",
        title: "Split one product into four portals",
        body: "Agents, managers, finance and admins each sign in to their own portal and see only the pages their role can open: a sidebar on desktop, bottom tabs on a phone.",
      },
    ],
    designSystem: {
      title: "A colour for going forward, and one for every module",
      intro:
        "Every colour in TravelOS is a token, and no screen names a colour directly. These are the values behind those tokens.",
      palettes: [
        {
          name: "Ground and text",
          note: "A near-white ground and blue-grey neutrals, so white cards lift off the page.",
          swatches: [
            { name: "Background", hex: "#f9fafc", role: "The page ground" },
            { name: "Card", hex: "#ffffff", role: "Cards, sheets and the sidebar" },
            { name: "Muted text", hex: "#5b646f", role: "Labels and timestamps" },
            { name: "Foreground", hex: "#141b26", role: "Headings and body text" },
          ],
        },
        {
          name: "Actions",
          note: "One green means go. Filled buttons sit on a darker lip of their own colour and press into it.",
          swatches: [
            { name: "Go", hex: "#007653", role: "Every main action", lip: "#00563b", soft: "#e6f6ee", sample: "Add enquiry" },
            { name: "WhatsApp", hex: "#009956", role: "Chat and Share fare", lip: "#006f38" },
            { name: "Destructive", hex: "#db2b33", role: "Unread counts and deletes", lip: "#cc272e" },
          ],
        },
        {
          name: "Status and tags",
          note: "A pale tint, strong text and an icon each, so a status never relies on colour alone.",
          swatches: [
            { name: "New", hex: "#006eb3", role: "New enquiries", soft: "#dff1ff" },
            { name: "Contacted", hex: "#a16100", role: "Contacted leads and notes", soft: "#fff0c5" },
            { name: "Confirmed", hex: "#007834", role: "Confirmed and paid", soft: "#d8f9dd" },
            { name: "Lost", hex: "#cc272e", role: "Lost and overdue", soft: "#ffe5e1" },
            { name: "VIP", hex: "#9d6400", role: "VIP customers", soft: "#ffedb9" },
            { name: "Umrah", hex: "#006557", role: "Umrah and Hajj trips", soft: "#cff5ec" },
          ],
        },
        {
          name: "Modules",
          note: "A fill, a lip and a tint for each. All eight share one lightness, and white text holds 4.8:1 contrast or more on every fill.",
          swatches: [
            { name: "Home", hex: "#007653", lip: "#00563b", soft: "#e6f6ee" },
            { name: "Enquiries", hex: "#b1582b", lip: "#89401c", soft: "#fef0e9" },
            { name: "Trips", hex: "#2266a4", lip: "#054980", soft: "#ecf5fd" },
            { name: "Finance", hex: "#086b6c", lip: "#004e4e", soft: "#e9f7f6" },
            { name: "Customers", hex: "#a0446d", lip: "#792f50", soft: "#fcf0f4" },
            { name: "Tasks", hex: "#8a5f18", lip: "#694500", soft: "#fbf3e1" },
            { name: "Reports", hex: "#425490", lip: "#2d3c6f", soft: "#f0f3fc" },
            { name: "Settings", hex: "#444e5b", lip: "#2f3640", soft: "#eff2f5" },
          ],
        },
      ],
      typeface: {
        family: "Plus Jakarta Sans",
        weights: [
          { label: "Regular", weight: 400 },
          { label: "Medium", weight: 500 },
          { label: "SemiBold", weight: 600 },
          { label: "Bold", weight: 700 },
        ],
        sample: "Fare for Madinah: SAR 28,800 for 6 pax.",
        note: "One family for headings and text, at four weights.",
      },
    },
    gallery: [
      {
        src: "/images/work-travelos-marble.jpg",
        alt: "TravelOS on two laptops: the Home dashboard with a 6 of 8 goal ring and a revenue chart, and a lead's booking journey with WhatsApp, Call, Share fare and To trip buttons",
      },
    ],
    results: [
      { value: "8", label: "Module colours on one set of tokens" },
      { value: "4.8:1", label: "Lowest contrast of white text on a module colour" },
      { value: "7", label: "Booking stages on one stepper" },
      { value: "4", label: "Role portals sharing one set of screens" },
    ],
    outcomeHeading: "Where it stands",
    outcome: [
      "All four portals sign in with real accounts, and each role sees only its own pages. Bookings and payments are still sample data, held behind one store so a real API can replace it without touching a screen.",
      "Next are Arabic with right-to-left layouts, a command palette, a Kanban board for enquiries, flight search and a quotation builder.",
    ],
    stack: ["React", "TypeScript", "TanStack Start", "Tailwind CSS", "Supabase", "Recharts", "Plus Jakarta Sans"],
  },
  {
    slug: "havana-foods",
    index: 3,
    title: "Havana Foods Brand Identity",
    category: "Brand Identity",
    discipline: "Branding",
    description: "A fork that is also the H of Havana, in a red picked for appetite and a white kept for cleanliness",
    summary:
      "A caterer's name, turned into a mark: a fork whose tines draw the H, in an appetite red on clean white, carried from the shopfront to the napkin.",
    image: "/images/work-havana.jpg",
    tags: ["Brand Identity", "Logo Design", "Brand Collateral"],
    year: "2026",
    role: "Brand Identity, Logo Design, Collateral Design",
    timeline: "2026",
    client: "Havana Foods, Caters & Events",
    platform: "Signage, print, packaging and uniform",
    overview: [
      "Havana Foods is a catering and events business in Kerala, with a menu that runs from a sadya on a banana leaf to dum biriyani. It needed an identity for the things a caterer actually puts in front of people: a shopfront sign, a takeaway box, a napkin, a staff shirt.",
      "The identity rests on three decisions. The mark is a fork and the H of Havana at once. The red is there to make people hungry. And the white around both is there to say the kitchen is clean.",
    ],
    challenge: {
      title: "A caterer is judged before anyone tastes the food",
      body: [
        "People book a caterer for a wedding or a function on trust. They can't taste the food first, so they judge by what they can see: the sign, the box, the people serving. The identity had to stir an appetite and, in the same glance, reassure about hygiene.",
        "Those two pull in different directions. Appetite wants warmth and a strong colour, while cleanliness wants space and restraint. The name gave no help either, since Havana on its own says nothing about food.",
      ],
      pains: [
        "Food sold on trust, to people who haven't tasted it yet",
        "Appetite and cleanliness to signal in the same glance",
        "A name that doesn't say food by itself",
        "A mark that has to hold on a shirt chest and a paper napkin",
        "One identity across signage, print, packaging and uniform",
      ],
    },
    approach: [
      {
        step: "01",
        title: "Drew one shape that is a fork and an H",
        body: "The mark is a fork cut out of a solid block, its handle running out through the top and bottom edges. The slots between the tines, crossed by a single bar, draw the H of Havana. One shape says food and says the name, so nothing else has to be added to explain it.",
      },
      {
        step: "02",
        title: "Kept the block soft and a little off upright",
        body: "The block has rounded corners and leans a few degrees, and the tines end in rounded tips. A shape this heavy could look like a stamp; the lean and the curves make it look like something to eat with.",
      },
      {
        step: "03",
        title: "Picked a red for appetite",
        body: "The brand colour is #9A2021, a deep, cooked red, nearer to chilli and gravy than to a warning sign. Red is the colour most tied to food craving, and it is the only colour the identity owns, so the mark prints the same on a box, a napkin and a shirt.",
      },
      {
        step: "04",
        title: "Left the rest white for cleanliness",
        body: "The mark sits red on white or white on red. White carries the hygiene side of the brief: a white plate, a white napkin, a white box, with nothing on them but the mark. The empty space around the logo does as much of the talking as the logo.",
      },
      {
        step: "05",
        title: "Set the name plainly",
        body: "Havana Foods is set in Lexend Regular, a wide, open sans that stays readable from across a road. Caters & Events sits beneath in letterspaced capitals. The logo comes as the mark alone, a stacked lockup and a horizontal one, each in red and in white.",
      },
      {
        step: "06",
        title: "Carried it onto what a caterer hands over",
        body: "Large red surfaces get a quiet pattern of soft, darker shapes, so a shopfront sign isn't one flat slab. From there the identity goes onto a takeaway box, a paper napkin, a staff polo with the mark on the chest, and a loyalty card with the line “Good food. Great moments.” and three steps: Eat, Earn, Enjoy.",
      },
    ],
    designSystem: {
      label: "The palette",
      title: "One red for appetite, and white for a clean kitchen",
      intro:
        "The whole palette is one red and white, with two darker reds for the pattern. The values are read from the logo files and the presentation.",
      palettes: [
        {
          name: "Brand colours",
          note: "Red does the craving, white does the cleanliness. The mark is one on the other, either way round.",
          swatches: [
            { name: "Havana red", hex: "#9a2021", role: "The mark, the name and the brand's surfaces" },
            { name: "White", hex: "#ffffff", role: "Napkins, boxes and the space around the mark" },
          ],
        },
        {
          name: "Pattern",
          note: "Two deeper reds, laid as soft shapes behind the logo on large surfaces.",
          swatches: [
            { name: "Pattern light", hex: "#7f1417", role: "The shapes" },
            { name: "Pattern dark", hex: "#6e0f10", role: "The ground behind them" },
          ],
        },
      ],
    },
    gallery: [
      {
        src: "/images/work-havana.jpg",
        alt: "A red Havana Foods shopfront sign on a concrete building, with the white fork mark beside the name and Caters & Events beneath it",
        caption: "Shopfront sign",
      },
      {
        src: "/images/work-havana-logo.jpg",
        alt: "The white fork mark above the name Havana and Caters & Events, on deep red with a pattern of soft darker shapes",
        caption: "The mark on Havana red",
      },
      {
        src: "/images/work-havana-card.jpg",
        alt: "Two red and white Havana loyalty cards with the fork mark, the line Good food. Great moments. and the steps Eat, Earn, Enjoy",
        caption: "Loyalty card",
      },
      {
        src: "/images/work-havana-table.jpg",
        alt: "A white napkin on a white plate, printed with the red Havana Foods logo, with a fork and spoon either side on a red tablecloth",
        caption: "Table setting",
      },
      {
        src: "/images/work-havana-uniform.jpg",
        alt: "A red staff polo with grey collar and cuffs and the fork mark on the chest, beside the mark shown large in red",
        caption: "Staff uniform",
      },
    ],
    results: [
      { value: "2", label: "Ideas in one mark: a fork and an H" },
      { value: "1", label: "Red, with white doing the rest" },
      { value: "3", label: "Lockups, each in red and in white" },
      { value: "5", label: "Touchpoints, from shopfront to napkin" },
    ],
    outcomeHeading: "What came out of it",
    outcome: [
      "Havana Foods has a mark that explains itself. It can be read as a fork or as an H, and either reading is right. Because it is one flat shape in one colour, it holds on a shopfront sign and on a napkin without being redrawn.",
      "The red and the white split the job between them: red for the craving, white for the clean kitchen. That leaves a simple rule for anything made next, from a menu to an event banner.",
    ],
    stack: ["Adobe Illustrator", "Lexend", "Google Sans"],
  },
  {
    slug: "tda-certify",
    index: 4,
    title: "TDA Certified Student Portal",
    category: "Web Application",
    discipline: "Design & Development",
    description:
      "A paper NOC form and a manual certificate process, replaced by one portal that clears, issues and proves every document",
    summary:
      "A paper form that collected six signatures, turned into a portal: one request, five clearances in order, and a certificate anyone can verify by scanning its QR code.",
    image: "/images/work-tda-certify.jpg",
    tags: ["Web App", "Workflow", "Full-stack", "PDF Generation", "API Integration"],
    year: "2026",
    role: "Full-stack Development, UI Design, Integrations, CI/CD",
    timeline: "About 8 weeks, September to October 2026",
    client: "Technodot Academy of R&D&I, through Febno Technologies",
    platform: "Web portal for students, parents and staff",
    overview: [
      "Before a student at Technodot Academy could receive a certificate, a paper No Objection Certificate had to collect signatures from Finance, the trainer, the Department Head, Placement and the Academic Coordinator, and then be issued by the Academic Head. TDA Certified replaces that form and the manual certificate process behind it.",
      "A student raises one request online. Five departments clear it in a fixed order, the NOC is issued, the student completes a checklist, Placement verifies it, and the system generates and issues the Course Certificate and Internship Letter as PDFs. Each carries a QR code that anyone can scan to confirm the document is genuine.",
      "Around that core the portal grew to cover the rest of a student's time at the academy: tasks, weekly reviews, projects, mock interviews, leave and late requests, fingerprint attendance, course feedback, placements, a parent dashboard and ID cards.",
    ],
    challenge: {
      title: "A form that could be signed without anyone checking",
      body: [
        "On paper, nobody could see where a form was stuck or for how long. It could be signed with fees outstanding or an internship unfinished, because the checks depended on each signer remembering them. Afterwards there was no reliable record of who had approved what, and when.",
        "The certificate at the end had the same weakness. An employer holding a printed copy had no way to check it without contacting the academy. And the facts needed to decide a clearance were scattered: attendance on the fingerprint device, tasks and reviews with trainers, fees with Finance.",
      ],
      pains: [
        "No view of where a request was waiting",
        "Rules that depended on each signer's memory",
        "Certificates an employer couldn't check",
        "No record of who approved what, and when",
        "Student data spread across separate systems",
      ],
    },
    approach: [
      {
        step: "01",
        title: "Modelled the approval process as data",
        body: "Stages, their order, the role each needs and the rules each checks are rows in the database, editable from an admin screen. Stages with the same order number run in parallel, and different numbers run in sequence. The five clearances were first built to run in parallel. When the academy asked for a strict signing order starting with Finance, the change was a set of order numbers and one migration.",
      },
      {
        step: "02",
        title: "Put the rules in the system, with a reason",
        body: "Each stage carries named checks that must pass before it can be approved, fifteen in all. Finance cannot clear a request with a balance owing, a trainer cannot clear an unfinished course, and the NOC cannot issue with a department row still pending. An approver who is blocked is told why, in a sentence they can act on.",
      },
      {
        step: "03",
        title: "Made the record impossible to quietly change",
        body: "Every audit entry includes a hash of the one before it, so a later alteration breaks the chain, and the chain is checked every night. Workflow history is append-only. Serial numbers are allocated in the same transaction as the document, so a failed generation never leaves a gap. An approval stores the signature as it was at that moment, so changing a signature later does not rewrite past documents.",
      },
      {
        step: "04",
        title: "Let anyone verify a document",
        body: "Each issued document has a 12-character ID, drawn from an alphabet with the look-alike letters left out, and a public page reached by its QR code with no login. A verifier can also submit the SHA-256 fingerprint of the PDF they hold, and the page confirms whether it is identical to the original. A revoked document stops being downloadable.",
      },
      {
        step: "05",
        title: "Generated documents the academy already recognises",
        body: "The NOC, Certificate and Internship Letter are HTML and CSS templates stored in the database and rendered to PDF with the academy's letterhead, seal and typeface. The NOC matches the paper form it replaces, with the five department rows and their signatures. A wording change is made on an admin screen and does not need a developer.",
      },
      {
        step: "06",
        title: "Read from the systems staff already used",
        body: "Students are synced from the academy's HR system every night, with a button for a manual sync, so nobody enters a roster twice. Attendance is read from the existing fingerprint export and scored by the academy's own rules: a first punch by 10:05 is Present, by 11:00 Late, and after that a half day.",
      },
      {
        step: "07",
        title: "Gave thirteen roles a view each",
        body: "Students, parents, trainers, department heads, finance, placement and administrators each sign in to their own pages and queues. A parent sees today's check-in, the attendance calendar, tasks and reviews for each child linked to them. A Student Administrator sees only ID cards: photo cropping, the two card faces, print and PDF. The browser never calls the API directly. Every request goes through the Next.js server, which keeps sign-in tokens in cookies the page's scripts cannot read.",
      },
      {
        step: "08",
        title: "Tested with drills, and shipped with a way back",
        body: "A backup-restore drill exposed a broken audit chain, caused by two logins at the same instant linking to the same previous entry. It was reproduced with a burst of concurrent logins and fixed with a database lock. Rendering a real NOC beside the paper form showed a sixth row that didn't belong. Every deploy takes a database backup, health-checks the new version and restores the previous one automatically if the check fails.",
      },
    ],
    designSystem: {
      label: "The interface",
      title: "One teal for every action, on white",
      intro:
        "The portal shares its look with the academy's existing student management system, so staff moving between the two see one product. These are the values behind its tokens.",
      palettes: [
        {
          name: "Ground and text",
          note: "A white page with a faint dot grid, and grey fills for table heads and row hovers.",
          swatches: [
            { name: "Page", hex: "#ffffff", role: "The page and its cards" },
            { name: "Surface muted", hex: "#f3f4f6", role: "Table heads, tabs and row hovers" },
            { name: "Line", hex: "#e5e7eb", role: "Borders and dividers" },
            { name: "Muted", hex: "#6b7280", role: "Labels and secondary text" },
            { name: "Ink", hex: "#111827", role: "Headings and body text" },
          ],
        },
        {
          name: "Action",
          note: "One colour for buttons, links, focus rings and the active item in the sidebar.",
          swatches: [
            { name: "Primary", hex: "#087f9c", role: "Every main action", lip: "#066a82", sample: "Issue ID" },
          ],
        },
        {
          name: "Status",
          note: "The three answers an approver can give, and the states a request passes through.",
          swatches: [
            { name: "Approved", hex: "#16a34a", role: "Approved, issued and valid" },
            { name: "Returned", hex: "#d97706", role: "Returned and pending" },
            { name: "Rejected", hex: "#dc2626", role: "Rejected, absent and unread counts" },
          ],
        },
      ],
      typeface: {
        family: "Space Grotesk",
        weights: [
          { label: "Regular", weight: 400 },
          { label: "Medium", weight: 500 },
          { label: "Bold", weight: 700 },
        ],
        sample: "REQ-2026-000004 is issued and verifiable.",
        note: "One family for headings and text, with IBM Plex Mono for request numbers and fingerprints.",
      },
    },
    gallery: [
      {
        src: "/images/work-tda-certify.jpg",
        alt: "TDA Certified on three devices: the ID Cards staff screen on a laptop, a student's request with its approval steps on a tablet, and a certificate verification page marked Valid on a phone",
        caption: "ID cards, a request's approval steps, and public verification",
      },
      {
        src: "/images/work-tda-certify-request.jpg",
        alt: "A request as staff see it: the student's course and dates, identity documents, a bar showing the NOC cleared, and each department's step marked Approved or Returned with the approver's name and time",
        caption: "A request and its clearance steps",
      },
      {
        src: "/images/work-tda-certify-verify.jpg",
        alt: "The public verification page for a course completion certificate, headed Valid in green, listing the student, course, serial number, issuing authority and the document's SHA-256 fingerprint",
        caption: "Public verification",
      },
      {
        src: "/images/work-tda-certify-parent.jpg",
        alt: "The Parent Dashboard for one student, with a chip for each child at the top, today's check-in status, the week from Monday to Saturday and the month's attendance so far",
        caption: "Parent Dashboard",
      },
      {
        src: "/images/work-tda-certify-id-cards.jpg",
        alt: "The ID Cards screen, with counts of students, pending and issued cards above a table listing each student's course, batch, enrolment and card status",
        caption: "ID card module",
      },
    ],
    results: [
      { value: "13", label: "Roles, each with its own view" },
      { value: "15", label: "Rule checks enforced before an approval" },
      { value: "16", label: "States a request can move through" },
      { value: "356", label: "Automated tests across 48 files" },
    ],
    outcomeHeading: "Where it stands",
    outcome: [
      "The request, the approvals, the documents and the proof that they are genuine now live in one place, with every action recorded. The checks that used to depend on memory cannot be skipped, and an employer can confirm a certificate without calling the academy.",
      "Because the process is data, the signing order and several role reassignments were absorbed during the build without a redesign. Small changes the academy asked for, such as review scores to one decimal and trainers limited to their own batches, shipped within days, each on its own branch.",
      "Email covers every hand-off today, with 28 notification types sent through a queue that retries. WhatsApp messages are specified and waiting on template approval, and embedded digital signatures on the PDFs are the step after that.",
    ],
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "TanStack Query",
      "Django REST Framework",
      "PostgreSQL",
      "Celery",
      "WeasyPrint",
      "Docker",
      "GitLab CI/CD",
    ],
  },
]

/**
 * The work index filters by service rather than by discipline directly: each
 * pill is mapped onto the disciplines that belong to it, so a project that was
 * both designed and built sits under Development and UI/UX alike. Retag a
 * study's `discipline` and it moves between pills.
 */
export const serviceFilters = {
  Development: ["Development", "Design & Development"],
  "UI/UX": ["Design", "Design & Development"],
  Branding: ["Branding"],
} satisfies Record<string, CaseStudy["discipline"][]>

export type ServiceFilter = keyof typeof serviceFilters

/** The pills, in the order the index lists them. */
export const services = Object.keys(serviceFilters) as ServiceFilter[]

/** The pills a study is filed under. */
export function servicesOf(study: CaseStudy) {
  return services.filter((service) => (serviceFilters[service] as readonly string[]).includes(study.discipline))
}

export function getCaseStudy(slug: string) {
  return caseStudies.find((study) => study.slug === slug)
}

export function getNextCaseStudy(slug: string) {
  const current = caseStudies.findIndex((study) => study.slug === slug)
  if (current === -1) return undefined
  return caseStudies[(current + 1) % caseStudies.length]
}
