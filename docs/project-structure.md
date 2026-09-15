# Project structure

The project follows a classic monorepo structure:

```bash
platform/
├── apps/
│   ├── web/                    # Next.js / React app
│   └── api/                    # Nest.js / Node.js app
│
├── packages/
│   ├── contracts/              # Shared platform contracts
│   ├── ui/                     # Shared theme and UI components
|   |
│   ├── eslint-config/          # Shared ESLint configuration
│   ├── jest-config/            # Shared Jest configuration
│   └── typescript-config/      # Shared TypeScript configuration
│
│── docs/                       # Documentation
│── infra/                      # docker-compose setup
├── package.json                # Root workspace scripts/dependencies
├── turbo.json                  # Turborepo pipeline/task configuration
└── README.md
```

The platform core is the contracts package. Every new feature starts here. Contracts define intent; entities and primitives define shape. The api will translate these into a DB schema and a controller, and the web app will do the same with a form.

The UI package on the other side provides not only basic components but a reusable visual identity, thanks to the exported theme.css. The theme contains token definitions (a color palette, font sizes, and some utilities) that will help you keep a cohesive look across the frontend(s).
