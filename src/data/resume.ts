// All site content lives here. Edit this file to update the portfolio.

export const profile = {
  name: 'Subash Shakya',
  firstName: 'Subash',
  role: 'Software Engineer',
  lede: 'Software engineer building AI agents with real guardrails, low-latency live video, and pipelines that turn flat CAD drawings into 3D.',
  intro:
    'Currently Software Engineer L3 at Outcode. Over three years I have shipped work across AI, real-time streaming, 3D, energy, data and mobile, usually owning a product from architecture to deployment.',
  location: 'Lalitpur, Nepal',
  email: 'subashshakya12@gmail.com',
  phone: '+977 9840302715',
  github: 'https://github.com/subashshakya',
  focus: ['Agentic systems', 'Retrieval & RAG', 'Live video', 'CAD to 3D', 'Multi-tenant SaaS', 'Data & BI', 'Mobile'],
}

export type Category =
  | 'AI & Agents'
  | 'Real-time & Video'
  | '3D & Graphics'
  | 'Data & BI'
  | 'Web Platforms'
  | 'Mobile'
  | 'Quality & Security'

export const categories: Category[] = [
  'AI & Agents',
  'Real-time & Video',
  '3D & Graphics',
  'Data & BI',
  'Web Platforms',
  'Mobile',
  'Quality & Security',
]

export interface Project {
  slug: string
  name: string
  tagline: string
  org: 'Outcode' | 'Bajra Technologies' | 'Personal'
  period: string
  role: string
  /** Muted autumn colour used for the project's plate and accents. */
  tone: string
  categories: Category[]
  featured?: boolean
  link?: { label: string; href: string }
  stack: string[]
  metrics?: { value: string; label: string }[]
  overview: string
  challenge: string
  highlights: { title: string; body: string }[]
  /** Ordered flow rendered as an architecture/pipeline diagram. */
  flow?: { title: string; steps: { name: string; detail: string }[] }
}

export const projects: Project[] = [
  {
    slug: 'stockpilot',
    name: 'StockPilot',
    tagline: 'An AI sales agent that answers customers, checks live stock and creates orders across every inbox.',
    org: 'Personal',
    period: 'Personal project',
    role: 'Full-Stack AI Engineer',
    tone: '#4f5a3a',
    categories: ['AI & Agents', 'Web Platforms'],
    featured: true,
    link: { label: 'go-godaam.space', href: 'https://go-godaam.space' },
    stack: ['Django (ASGI)', 'Claude', 'Gemini', 'LangGraph', 'PostgreSQL', 'pgvector', 'Celery', 'Redis', 'Next.js', 'TypeScript', 'Supabase', 'Voyage AI'],
    metrics: [
      { value: '4', label: 'channels — WhatsApp, Instagram, Facebook, Gmail' },
      { value: 'Hybrid', label: 'RAG: vectors + full-text + RRF' },
      { value: '2', label: 'LLM providers with automatic fallback' },
    ],
    overview:
      'StockPilot is a multi-tenant SaaS for merchants who sell through chat. It connects WhatsApp, Instagram, Facebook and Gmail to an AI agent that replies to customers, checks live inventory and creates orders on its own — with a merchant dashboard to watch and steer everything.',
    challenge:
      'Customer messages are noisy, arrive from four platforms at once and often repeat. The agent has to match vague product descriptions to real inventory, never double-process a webhook, survive crashes mid-conversation, and keep LLM costs billable per tenant.',
    highlights: [
      { title: 'Multi-step LangGraph agent', body: 'A LangGraph pipeline runs inside Celery workers, with conversation state in Redis and crash recovery from Postgres so no conversation is lost when a worker dies.' },
      { title: 'Hybrid retrieval', body: 'Voyage embeddings in pgvector plus Postgres full-text search, fused with Reciprocal Rank Fusion and refined by a cross-encoder reranker. Tiered fallback matching handles misspelled or vague product names.' },
      { title: 'Resilient webhook ingestion', body: 'Meta and Gmail webhooks are signature-verified, deduplicated idempotently through Redis and processed asynchronously.' },
      { title: 'LLM cost & reliability layer', body: 'Model routing, Anthropic prompt caching, automatic Gemini fallback on failures and per-call token/cost tracking that feeds tenant billing.' },
      { title: 'Merchant dashboard', body: 'Next.js/React app with inbox, leads, inventory and billing, live-updated through SSE streaming and WebSockets behind a BFF proxy layer.' },
      { title: 'Billing & strict multi-tenancy', body: 'Khalti and eSewa payments; tenancy enforced through JWT claims, tenant-scoped queries and Supabase Row Level Security.' },
    ],
    flow: {
      title: 'Message lifecycle',
      steps: [
        { name: 'Webhook', detail: 'Meta / Gmail, signature verified' },
        { name: 'Dedupe', detail: 'Redis idempotency keys' },
        { name: 'Agent', detail: 'LangGraph in Celery' },
        { name: 'Retrieve', detail: 'pgvector + FTS → RRF → rerank' },
        { name: 'Act', detail: 'Check stock, create order' },
        { name: 'Reply', detail: 'Back to the customer channel' },
      ],
    },
  },
  {
    slug: 'paddok',
    name: 'Paddok',
    tagline: 'An AI concierge that runs guest conversations for vehicle-rental businesses — safely.',
    org: 'Outcode',
    period: 'Dec 2024 — Present',
    role: 'Architect & Lead Developer',
    tone: '#a4532f',
    categories: ['AI & Agents', 'Web Platforms'],
    featured: true,
    stack: ['Claude', 'TypeScript', 'Node.js', 'PostgreSQL', 'Prisma', 'Playwright', 'Next.js', 'Twilio'],
    metrics: [
      { value: '13', label: 'domain-specific LLM tools' },
      { value: '9', label: 'guardrail checks on input & output' },
      { value: 'A2P 10DLC', label: 'compliant SMS workflows' },
    ],
    overview:
      'Paddok automates guest interactions for vehicle-rental operators: availability questions, vehicle information, lead capture, quoting and handing off to a human when it matters. A Claude-based agent does the talking; a Next.js admin portal lets staff manage conversations, leads and FAQs and take over live chats.',
    challenge:
      'A customer-facing LLM that quotes prices and talks about bookings cannot make things up, leak staff contacts or get prompt-injected. Every answer has to be grounded in real fleet data, and anything outside supported rental requests has to be stopped or routed for approval.',
    highlights: [
      { title: 'Tool-driven orchestration loop', body: '13 domain tools covering fleet availability, vehicle info, knowledge retrieval, booking lookup, lead capture, quotes, request triage, verification and human handoff.' },
      { title: 'Safety & guardrails pipeline', body: 'Prompt-injection detection, PII and staff-contact protection, content safety, price-claim validation, booking-confirmation checks, LLM classification, rate limiting, safe fallbacks and full guardrail event auditing.' },
      { title: 'RAG knowledge retrieval', body: 'Semantic search with reranking, caching, configurable retrieval parameters and retrieval auditing in PostgreSQL. FAQ and vehicle knowledge are unified, and staff-written content survives automated rescrapes.' },
      { title: 'Request-triage rules engine', body: 'Allow/deny decisions, approval workflows, decision auditing and pending-approval reasons, so only supported rental requests are handled automatically.' },
      { title: 'Twilio SMS infrastructure', body: 'Webhooks, message reconciliation, E.164 normalization, consent management, opt-in/opt-out, verification codes and A2P 10DLC compliance workflows.' },
      { title: 'CRM sync & admin portal', body: 'Playwright-based CRM synchronization, Prisma data modeling and a Next.js portal for conversations, leads, FAQ editing and live chat takeover.' },
    ],
    flow: {
      title: 'Agent turn',
      steps: [
        { name: 'Inbound', detail: 'SMS / chat message' },
        { name: 'Input guards', detail: 'Injection, PII, safety, rate limit' },
        { name: 'Triage', detail: 'Rules engine: allow / deny / approve' },
        { name: 'Claude + tools', detail: '13 tools, RAG retrieval' },
        { name: 'Output guards', detail: 'Price claims, booking checks' },
        { name: 'Reply or handoff', detail: 'Audited, human takeover ready' },
      ],
    },
  },
  {
    slug: 'vgraph',
    name: 'VGraph',
    tagline: 'Edit videos in plain English — rendered by deterministic FFmpeg, not AI-generated code.',
    org: 'Personal',
    period: 'Personal project',
    role: 'Backend Engineer',
    tone: '#6f2c26',
    categories: ['AI & Agents', 'Real-time & Video'],
    featured: true,
    stack: ['FastAPI', 'LangGraph', 'Gemini', 'FFmpeg', 'Celery', 'AWS S3'],
    metrics: [
      { value: '8', label: 'phase LangGraph pipeline' },
      { value: '0', label: 'lines of AI-generated render code' },
      { value: 'Multi', label: 'platform auto-publishing' },
    ],
    overview:
      'VGraph turns plain-English editing instructions into finished videos and publishes them to social platforms. Gemini understands the footage; a planner turns intent into a deterministic edit plan that compiles into FFmpeg commands.',
    challenge:
      'Letting an LLM write code that renders video is unpredictable and expensive. The goal was AI-level flexibility in what users can ask for, with the cost and reliability of a fixed, testable rendering path.',
    highlights: [
      { title: 'Deterministic by design', body: 'Gemini video understanding produces structured intent; the system maps it to known FFmpeg operations. Rendering is predictable, repeatable and cheap.' },
      { title: '8-phase LangGraph pipeline', body: 'Ingestion → Gemini analysis → intent resolution → deterministic edit planning → parallel FFmpeg execution → quality-gated re-editing → multi-platform publishing.' },
      { title: 'Parallel rendering', body: 'FFmpeg jobs fan out across Celery workers, with media stored in AWS S3.' },
      { title: 'Quality gate', body: 'Rendered output is checked and sent back for re-editing when it does not meet the bar, before anything is published.' },
    ],
    flow: {
      title: 'Pipeline phases',
      steps: [
        { name: 'Ingest', detail: 'Upload to S3' },
        { name: 'Analyze', detail: 'Gemini video understanding' },
        { name: 'Resolve intent', detail: 'Plain English → structured edits' },
        { name: 'Plan', detail: 'Deterministic edit plan' },
        { name: 'Render', detail: 'Parallel FFmpeg via Celery' },
        { name: 'Quality gate', detail: 'Re-edit if needed' },
        { name: 'Publish', detail: 'Social platforms' },
      ],
    },
  },
  {
    slug: 'eventflo',
    name: 'Eventflo',
    tagline: 'Interactive live-event streaming with in-browser ML video effects.',
    org: 'Outcode',
    period: 'Dec 2024 — Present',
    role: 'Architect & Developer',
    tone: '#4d5d63',
    categories: ['Real-time & Video', 'Web Platforms'],
    featured: true,
    stack: ['Angular', 'Django', 'AWS IVS', 'TensorFlow.js', 'Web Workers', 'Node.js', 'Puppeteer', 'React 19', 'Angular Material', 'Tailwind', 'GitHub Actions', 'AWS'],
    metrics: [
      { value: 'Low-latency', label: 'live video via AWS IVS' },
      { value: 'On-device', label: 'ML background segmentation' },
      { value: 'Headless', label: 'event sessions via Puppeteer' },
    ],
    overview:
      'Eventflo is a scalable platform for interactive live events. Hosts stream through AWS IVS while audiences take part in real time; the browser applies ML-powered background segmentation and custom filters directly to the video stream.',
    challenge:
      'Running ML inference on every video frame in the browser freezes the UI if done naively. Streams also had to stay private — a shared link must never let anyone outside the event watch.',
    highlights: [
      { title: 'Real-time streaming', body: 'AWS Interactive Video Service for low-latency streams with live audience interaction and event-based workflows.' },
      { title: 'Client-side ML video', body: 'TensorFlow.js background segmentation and custom visual filters applied to live frames.' },
      { title: 'Off the main thread', body: 'Frame processing and ML inference run in Web Workers inside Angular, keeping rendering smooth.' },
      { title: 'Secure access', body: 'Link sharing designed so only event participants can access a stream — no cross-access.' },
      { title: 'Django REST backend', body: 'APIs for streaming sessions, user roles, event lifecycle and metadata, coordinating the frontend and streaming infrastructure.' },
      { title: 'Headless event engine', body: 'A Node.js service creates and manages headless browser sessions with child_process and OS process management; Puppeteer launches events running a React 19 app.' },
      { title: 'Lean Angular architecture', body: 'Module decomposition with lazy loading, efficient component state, styled with Angular Material and Tailwind.' },
      { title: 'Cloud & CI/CD', body: 'Deployed on AWS services with GitHub Actions pipelines for fast, repeatable releases.' },
    ],
    flow: {
      title: 'Stream path',
      steps: [
        { name: 'Camera', detail: 'Host video frames' },
        { name: 'Web Worker', detail: 'TF.js segmentation + filters' },
        { name: 'AWS IVS', detail: 'Low-latency ingest & delivery' },
        { name: 'Django API', detail: 'Sessions, roles, lifecycle' },
        { name: 'Audience', detail: 'Participants only' },
      ],
    },
  },
  {
    slug: 'remington-pools',
    name: 'Remington Pools',
    tagline: 'Turns 2D AutoCAD drawings into explorable 3D pool models in the browser.',
    org: 'Outcode',
    period: 'Dec 2024 — Present',
    role: 'Full-Stack Developer',
    tone: '#5f7a72',
    categories: ['3D & Graphics', 'Web Platforms'],
    featured: true,
    stack: ['React', 'Three.js', 'Node.js', 'FastAPI', 'Blender SDK', 'AWS EC2', 'AWS S3'],
    metrics: [
      { value: '2D → 3D', label: 'DXF to interactive model' },
      { value: 'Async', label: 'processing for large CAD files' },
    ],
    overview:
      'Remington Pools loads DXF (AutoCAD) files onto a canvas and turns flat 2D geometry into 3D using isometric transformations and a chain of file-conversion pipelines — so clients can see a pool design before it is built.',
    challenge:
      'CAD files are large and not built for the web. Parsing them, converting geometry into 3D-ready formats and rendering smoothly in a browser needed a dedicated processing pipeline and careful memory handling.',
    highlights: [
      { title: 'Three.js renderer', body: 'React + Three.js frontend that renders converted CAD geometry as an interactive 3D scene.' },
      { title: 'Conversion pipeline', body: 'FastAPI with the Blender SDK parses DXF files and converts them into 3D-compatible formats.' },
      { title: 'Built for big files', body: 'Asynchronous processing and efficient memory handling in Node.js keep large CAD files responsive.' },
      { title: 'AWS deployment', body: 'Hosted on EC2 with S3 for file storage and fast retrieval.' },
    ],
    flow: {
      title: 'Conversion pipeline',
      steps: [
        { name: 'DXF upload', detail: 'Stored in S3' },
        { name: 'Parse', detail: 'FastAPI + Blender SDK' },
        { name: 'Transform', detail: 'Isometric 2D → 3D' },
        { name: 'Convert', detail: '3D-compatible format' },
        { name: 'Render', detail: 'Three.js in React' },
      ],
    },
  },
  {
    slug: 'gather',
    name: 'Gather',
    tagline: 'A multi-tenant US patent acceptance platform for GTT Group.',
    org: 'Outcode',
    period: 'Dec 2024 — Present',
    role: 'Frontend Engineer',
    tone: '#6b4a33',
    categories: ['Web Platforms'],
    stack: ['Angular 17', 'RxJS', 'TypeScript', 'JWT', 'REST APIs', 'webpack-bundle-analyzer', 'GitHub'],
    metrics: [
      { value: 'Multi', label: 'tenant, multi-role architecture' },
      { value: '3', label: 'categories of bulk-validation errors' },
    ],
    overview:
      'Gather is a web app for US patent acceptance workflows, serving many roles and multiple clients on one multi-tenant architecture. Built entirely in Angular 17.',
    challenge:
      'Many roles and clients share one app, with large asset uploads that can conflict across projects. State and async data flow had to stay predictable, and errors had to be specific enough to act on.',
    highlights: [
      { title: 'Reactive state', body: 'Complex app state and async data flow handled with RxJS and service-based state patterns.' },
      { title: 'End-to-end API integration', body: 'JWT authentication flows plus consistent error and loading states across the app.' },
      { title: 'Bulk asset validation', body: 'Categorized error handling for duplicates, cross-project conflicts and assets that cannot be found.' },
      { title: 'Performance', body: 'Bundle size and load time cut with webpack-bundle-analyzer and lazy loading.' },
      { title: 'Team workflow', body: 'Agile team with Git-based code review through GitHub PRs.' },
    ],
  },
  {
    slug: 'popular-power',
    name: 'Popular Power',
    tagline: 'Real-time monitoring of solar inverters across multiple brands.',
    org: 'Bajra Technologies',
    period: 'Jun 2023 — Dec 2024',
    role: 'Full-Stack Developer',
    tone: '#b98a3e',
    categories: ['Data & BI', 'Web Platforms'],
    featured: true,
    stack: ['Angular', 'Angular Material', 'RxJS', 'Ruby on Rails', 'AWS Elastic Beanstalk', 'AWS RDS', 'GitHub Actions', 'i18n'],
    metrics: [
      { value: '3', label: 'languages — English, Spanish, Portuguese' },
      { value: 'Multi', label: 'vendor inverter integrations' },
      { value: 'Real-time', label: 'energy production & consumption' },
    ],
    overview:
      'Popular Power is an inverter management platform that tracks solar panel performance and energy conversion in real time, pulling telemetry from several inverter brands into one view.',
    challenge:
      'Every inverter vendor exposes different APIs and data shapes. The platform had to ingest them all, normalize the data and present it live — in three languages.',
    highlights: [
      { title: 'Vendor integrations', body: 'Multiple inverter systems integrated through vendor APIs for seamless data ingestion and live monitoring.' },
      { title: 'Telemetry normalization', body: 'Scalable Ruby on Rails services process and normalize data from different inverter brands.' },
      { title: 'Reactive frontend', body: 'Angular with Angular Material, using RxJS for state management.' },
      { title: 'Internationalization', body: 'Dynamic i18n across the whole app in Spanish, Portuguese and English.' },
      { title: 'AWS + CI/CD', body: 'Hosted on Elastic Beanstalk with RDS; GitHub Actions automate testing and deployment.' },
    ],
    flow: {
      title: 'Telemetry flow',
      steps: [
        { name: 'Inverters', detail: 'Multiple vendor APIs' },
        { name: 'Ingest', detail: 'Rails services' },
        { name: 'Normalize', detail: 'Unified telemetry model' },
        { name: 'Store', detail: 'AWS RDS' },
        { name: 'Monitor', detail: 'Angular dashboard, 3 languages' },
      ],
    },
  },
  {
    slug: 'popular-power-crm',
    name: 'Popular Power CRM',
    tagline: 'Customer outreach for the Popular Power platform.',
    org: 'Bajra Technologies',
    period: 'Jun 2023 — Dec 2024',
    role: 'Full-Stack Developer',
    tone: '#c07a5a',
    categories: ['Web Platforms'],
    stack: ['Angular', 'Node.js', 'Calendly', 'Email services'],
    overview:
      'A CRM built alongside Popular Power to help the team reach customers, integrating Calendly scheduling and mailing services.',
    challenge:
      'Sales and support needed one place to manage customer outreach and bookings instead of juggling separate tools.',
    highlights: [
      { title: 'Scheduling built in', body: 'Calendly integration for booking calls with customers.' },
      { title: 'Email outreach', body: 'Mailing services integrated to contact customers directly from the CRM.' },
      { title: 'Angular + Node.js', body: 'Angular frontend with a Node.js backend.' },
    ],
  },
  {
    slug: 'parliament-speech-to-text',
    name: 'Parliament Speech-to-Text',
    tagline: 'Transcribing Nepali parliament speeches into Devanagari text.',
    org: 'Bajra Technologies',
    period: 'Jun 2023 — Dec 2024',
    role: 'Frontend Developer',
    tone: '#5a3a3e',
    categories: ['AI & Agents', 'Web Platforms'],
    stack: ['Angular', 'PrimeNG', 'FastAPI', 'Custom Transformers', 'Jasmine', 'Karma'],
    overview:
      'A speech-to-text application that converts Nepali parliament speeches into Devanagari text, powered by custom-built transformer models served through FastAPI.',
    challenge:
      'Nepali speech recognition needs custom models, and the interface had to make long transcriptions easy to review and use.',
    highlights: [
      { title: 'Frontend UI', body: 'Built the Angular + PrimeNG interface for uploading and reviewing transcriptions.' },
      { title: 'Model serving', body: 'Custom transformer models exposed through FastAPI endpoints.' },
      { title: 'Tested', body: 'Unit tests with Jasmine and the Karma test runner.' },
    ],
    flow: {
      title: 'Transcription flow',
      steps: [
        { name: 'Audio', detail: 'Parliament speech' },
        { name: 'FastAPI', detail: 'Model endpoints' },
        { name: 'Transformer', detail: 'Custom Nepali ASR' },
        { name: 'Devanagari', detail: 'Text in the Angular UI' },
      ],
    },
  },
  {
    slug: 'bi-platform',
    name: 'Internal BI Platform',
    tagline: 'Business intelligence for project and operations visibility.',
    org: 'Bajra Technologies',
    period: 'Jun 2023 — Dec 2024',
    role: 'Solo Developer',
    tone: '#6e6a3a',
    categories: ['Data & BI'],
    stack: ['Apache Superset', 'React', 'Flask', 'Snowflake', 'PostgreSQL', 'GitLab CI/CD', 'Kubernetes', 'Docker'],
    metrics: [
      { value: 'Solo', label: 'design to deployment' },
      { value: 'Zero', label: 'downtime deploys on Kubernetes' },
    ],
    overview:
      'A BI tool that gives management a clear view of team progress, project management and internal operations. Built solo on Apache Superset with a custom visualization library.',
    challenge:
      'Leadership wanted to drill from company-wide numbers down to individual teams quickly, over data spread across Snowflake and PostgreSQL.',
    highlights: [
      { title: 'Superset at the core', body: 'Apache Superset as the backbone, extended for internal needs.' },
      { title: 'Custom viz library', body: 'React + Flask visualization library for advanced drill-downs.' },
      { title: 'Fast queries', body: 'Heavily optimized Snowflake and PostgreSQL queries for quick drill-downs.' },
      { title: 'Zero-downtime delivery', body: 'GitLab CI/CD with container registries, deployed on Kubernetes.' },
    ],
  },
  {
    slug: 'oho-super-app',
    name: 'OHO Super App',
    tagline: 'A super app for Nepal: shopping, ride sharing, vendors and more.',
    org: 'Bajra Technologies',
    period: 'Jun 2023 — Dec 2024',
    role: 'Mobile Developer',
    tone: '#b0693a',
    categories: ['Mobile'],
    stack: ['Ionic', 'Angular 15', 'Firebase Firestore', 'Maps', 'QR codes'],
    overview:
      'OHO is a super app for the Nepali market that combines e-commerce, ride sharing, vendor management, a calendar and more in one mobile app.',
    challenge:
      'Many services in one app, all needing real-time updates on mobile networks, plus engaging offer mechanics.',
    highlights: [
      { title: 'Cross-platform mobile', body: 'Built with Ionic on an Angular 15 base.' },
      { title: 'Real-time data', body: 'Firebase Firestore and Maps for live in-app updates.' },
      { title: 'Offers engine', body: 'QR code scratch cards integrated with offers management.' },
    ],
  },
  {
    slug: 'oho-admin-portal',
    name: 'OHO Admin Portal',
    tagline: 'One control center for every module in the OHO platform.',
    org: 'Bajra Technologies',
    period: 'Jun 2023 — Dec 2024',
    role: 'Full-Stack Developer',
    tone: '#7d5a44',
    categories: ['Web Platforms', 'Quality & Security'],
    stack: ['Angular', 'NGXS', 'Ruby on Rails', 'RBAC'],
    overview:
      'A centralized admin portal for overseeing platform-wide operations across the OHO super app.',
    challenge:
      'Different teams manage different parts of the platform. Each needs exactly the right permissions — no more, no less.',
    highlights: [
      { title: 'Dynamic frontend', body: 'Angular with NGXS for predictable state management.' },
      { title: 'Scalable backend', body: 'Ruby on Rails services behind the portal.' },
      { title: 'RBAC & authorization', body: 'Role-based access control and authorization across multiple application modules.' },
    ],
  },
  {
    slug: 'hercules',
    name: 'Hercules',
    tagline: 'Test coverage for a pharmaceutical platform.',
    org: 'Outcode',
    period: 'Dec 2024 — Present',
    role: 'Test Engineer',
    tone: '#8a9277',
    categories: ['Quality & Security'],
    stack: ['Jasmine', 'Karma', 'Istanbul', 'Azure DevOps', 'Azure'],
    overview:
      'Unit testing for Hercules, a pharmaceuticals project, with measured coverage and an Azure-based delivery workflow.',
    challenge:
      'In pharma software, regressions are costly. The codebase needed reliable unit tests and visible coverage.',
    highlights: [
      { title: 'Unit tests', body: 'Written with Jasmine on the Karma test runner.' },
      { title: 'Coverage reporting', body: 'Istanbul coverage reports to track what is tested.' },
      { title: 'Azure DevOps', body: 'Used for project management, version control and deployment to Azure production.' },
    ],
  },
  {
    slug: 'probation-tracker-audit',
    name: 'Probation Tracker Audit',
    tagline: 'A security audit of a sensitive jail probation tracking system.',
    org: 'Outcode',
    period: 'Dec 2024 — Present',
    role: 'Code Auditor',
    tone: '#5b5148',
    categories: ['Quality & Security'],
    stack: ['Angular', 'Spring Boot', 'Security review'],
    overview:
      'A code audit of a jail probation tracker built with Angular and Spring Boot, focused on security vulnerabilities in a high-sensitivity system.',
    challenge:
      'The application handles sensitive personal data. It had to be fault tolerant and secure, and the team needed a clear list of what to fix.',
    highlights: [
      { title: 'Vulnerability review', body: 'Audited the Angular frontend and Spring Boot backend for security weaknesses.' },
      { title: 'Actionable findings', body: 'Reported pain points with concrete improvements and optimizations.' },
      { title: 'Resilience', body: 'Recommendations aimed at making the app fault tolerant as well as secure.' },
    ],
  },
]

export interface Job {
  company: string
  title: string
  period: string
  summary: string
  points: string[]
  projects: string[]
}

export const experience: Job[] = [
  {
    company: 'Outcode',
    title: 'Software Engineer L3',
    period: 'Dec 2024 — Present',
    summary: 'Architecting AI, streaming and 3D products for international clients.',
    points: [
      'Architected Paddok, a Claude-based AI concierge with 13 tools, a guardrails pipeline, RAG and Twilio SMS.',
      'Built Eventflo: AWS IVS streaming, TensorFlow.js effects in Web Workers and a Puppeteer-driven event engine.',
      'Delivered Remington Pools, a DXF-to-3D viewer with React, Three.js and a Blender-based pipeline.',
      'Built Gather for GTT Group in Angular 17; tested Hercules; audited a probation tracker for security.',
      'Contribute to estimates for new projects, setting assumptions and a development plan for clients.',
    ],
    projects: ['paddok', 'eventflo', 'remington-pools', 'gather', 'hercules', 'probation-tracker-audit'],
  },
  {
    company: 'Bajra Technologies',
    title: 'Associate Software Engineer',
    period: 'Jun 2023 — Dec 2024',
    summary: 'Full-stack work across energy, government, e-commerce and internal data.',
    points: [
      'Built Popular Power, a real-time multi-vendor solar inverter platform, and its CRM.',
      'Created the UI for a Nepali parliament speech-to-text system on custom transformer models.',
      'Built an internal BI platform solo on Superset, Snowflake and Kubernetes.',
      'Developed the OHO super app (Ionic) and its RBAC-secured admin portal.',
      'Mentored trainees and tracked their progress through to hiring decisions.',
    ],
    projects: ['popular-power', 'popular-power-crm', 'parliament-speech-to-text', 'bi-platform', 'oho-super-app', 'oho-admin-portal'],
  },
]

export const skills: { group: string; items: string[] }[] = [
  { group: 'Languages & Frameworks', items: ['TypeScript', 'JavaScript', 'Python', 'Angular', 'React', 'Next.js', 'Django', 'FastAPI', 'Express', 'Node.js', 'Ruby on Rails'] },
  { group: 'AI & Agentic Systems', items: ['Claude / Anthropic', 'Gemini', 'OpenAI', 'LangGraph', 'RAG', 'Hybrid retrieval + RRF', 'Cross-encoder reranking', 'pgvector', 'Voyage AI', 'Prompt caching', 'Multi-agent orchestration', 'LLM guardrails', 'TensorFlow.js'] },
  { group: 'Cloud & Infrastructure', items: ['AWS EC2', 'S3', 'RDS', 'IVS', 'ECS', 'ECR', 'Fargate', 'Elastic Beanstalk', 'Azure VMs', 'Blob Storage', 'Azure SQL', 'AKS', 'ACR', 'Container Apps'] },
  { group: 'Data & Messaging', items: ['PostgreSQL', 'Prisma', 'Redis', 'Celery', 'Snowflake', 'Firebase', 'Supabase', 'Twilio', 'Apache Superset'] },
  { group: 'DevOps & Quality', items: ['Docker', 'Kubernetes', 'GitHub Actions', 'GitLab CI/CD', 'Azure DevOps', 'Playwright', 'Puppeteer', 'Jasmine', 'Karma'] },
]

export const education = [
  { school: 'Lalitpur Engineering College', place: 'Chakupat, Lalitpur', degree: 'Bachelor of Engineering in Computer Engineering', period: 'Nov 2019 — Mar 2024' },
  { school: 'Omega International College', place: 'Kumaripati, Lalitpur', degree: 'High School', period: 'Jul 2016 — Apr 2018' },
  { school: 'A.V.M Higher Secondary School', place: 'Manbhawan, Lalitpur', degree: 'School', period: 'Apr 2005 — Apr 2016' },
]
