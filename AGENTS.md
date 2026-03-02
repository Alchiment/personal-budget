# Project overview
Project for managing personal budgets.

## Architecture
- NextJS as monolith project.
- Postgresql as database.

## Commands
- Locally installation npm pacakges with `npm install`.
- Run the project with `npm run dev` locally.
- Build project for production with `npm run build`.
- Run database migrations with `npx dotenv -e .env.local -- prisma migrate dev --name <migration_name>`.
- Generate Prisma client with `npx dotenv -e .env.local -- prisma generate`.

## Backend Architecture

### Technology Stack
- **Runtime**: Next.js (App Router)
- **Database**: PostgreSQL
- **ORM**: Prisma with PostgreSQL adapter
- **Authentication**: JWT (access + refresh tokens)

### Database Connection
Located in `app/lib/db.ts`. Uses singleton pattern to ensure single PrismaClient instance:

```typescript
import { getClient } from '@/app/lib/db';

export async function GET(request: NextRequest) {
  const sections = await getSectionsByUser(getClient(), userId);
}
```

### Authentication
Located in `app/lib/auth/`. JWT-based authentication with:
- Access token (15 minutes, in httpOnly cookie)
- Refresh token (7 days, in httpOnly cookie)
- Bearer header support for API clients

**Token Refresh Flow:**
1. Middleware intercepts all page requests (not API routes)
2. If access token is valid, request continues
3. If access token expired but refresh token exists, middleware calls `/api/auth/refresh`
4. New tokens are set in response cookies
5. User continues without being logged out

**User Resolution** (`app/lib/auth/resolveUser.ts`):
```typescript
export function resolveUser(request: NextRequest): JWTPayload {
  // Supports both Authorization header and cookies
  const { userId } = resolveUser(request);
}
```
Note: `resolveUser` only verifies tokens. Token refresh is handled by middleware for page requests.

**Middleware** (`middleware.ts`):
- Handles automatic token refresh for page navigation
- Does NOT run on API routes (excluded in matcher config)
- Calls `/api/auth/refresh` internally when access token expires

### API Routes Structure
Located in `app/api/`. Follows RESTful conventions:

| Pattern | Method | Description |
|---------|--------|-------------|
| `/api/resource` | GET | List all |
| `/api/resource` | POST | Create new |
| `/api/resource/[id]` | GET | Get one |
| `/api/resource/[id]` | PATCH | Update |
| `/api/resource/[id]` | DELETE | Delete |
| `/api/resource/[id]/children` | GET/POST | Child collection |
| `/api/resource/[id]/children/[childId]` | PATCH/DELETE | Child item |

**Standard API Route Pattern**:
```typescript
export async function GET(request: NextRequest) {
  try {
    const { userId } = resolveUser(request);
    const data = await getData(getClient(), userId);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch';
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = resolveUser(request);
    const body = await request.json();
    // Validate required fields
    // Call service function
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
```

### Services Layer
Located in `app/pages/<feature>/services/`. Contains all business logic:

```typescript
// app/pages/dashboard/services/sectionService.ts
export async function getSectionsByUser(db: PrismaClient, userId: string): Promise<SectionDTO[]> {
  // Database queries
}

export async function createSection(
  db: PrismaClient,
  userId: string,
  data: CreateSectionDTO
): Promise<SectionDTO> {
  // Business logic
}
```

### Prisma Schema
Located in `prisma/schema.prisma`. Defines all database models with:
- Comments for documentation (visible in IDE)
- Relations with cascade delete
- Enums for type safety
- Custom table names via `@@map`

```prisma
model User {
  id String @id @default(cuid())
  email String @unique
  sections Section[]
  debts Debt[]
}

model Section {
  id String @id @default(cuid())
  userId String
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  items SectionItem[]
}
```

### Error Handling
- API routes: Return `{ error: message }` with appropriate status code
- Services: Throw errors with descriptive messages
- Frontend: Catch errors and display via AlertBanner

### Database Conventions
- Use `cuid()` for IDs
- Always include `createdAt` and `updatedAt` timestamps
- Use `@updatedAt` for automatic timestamp updates
- Cascade delete relations (`onDelete: Cascade`)
- Always filter by `userId` for multi-tenant data

# Project structure
- Project is following Container/Presentational pattern.
- `app` folder contains a `pages` folder.
- Each functionality is a page component in the `pages` folder.
- Each page component has a `page.tsx` file.
- Each page component should have their respective scaffolding:
- - `page.tsx` file for the page component.
- - `components` folder for any reusable components.
- - `styles` folder for any styling files.
- - `dtos` folder for any data transfer objects.
- - `utils` folder for any utility functions.
- - and so on.

## Atomic Pattern
Components follow the Atomic Design methodology with these categories:

### Atoms (`app/components/atoms/`)
Basic building blocks with no dependencies on other components.
- Examples: Button, Icon, Input, Label, ErrorMessage, Card, Badge
- Should be dumb components with only presentational logic

### Molecules (`app/components/molecules/`)
Simple groups of atoms that work together.
- Examples: AlertBanner, ConfirmModal, FormField, SectionHeader, CurrencyInput, Navbar, Footer
- Can have simple interactions but are still relatively simple components

### Organisms (`app/components/organisms/`)
Complex UI components composed of atoms and molecules.
- Examples: LoginForm, RegisterForm, SummaryCard, DebtsContainer
- Should have some business logic but remain focused on a single purpose

### Templates (`app/components/templates/`)
Page-level layouts that compose organisms.
- Examples: AuthTemplate, DashboardTemplate
- Define the structure of a page without specific data

### Pages (`app/pages/`)
Route handlers that connect data to templates.
- Should be thin wrappers that fetch data and pass to templates
- Use server components for data fetching

## Code guidelines

### Dto and Interface declaration
- All interfaces should be declared in the `dtos` folder.
- Interfaces should follow the `PascalCase` naming convention finished with `Interface`.
- Interfaces should be in the same folder as the Dto they are used for.
- All dtos should be declared in the `dtos` folder.
- Dtos should follow the `PascalCase` naming convention finished with `DTO`.
- Dtos should be in the same folder as the component they are used for.
- Each Dto should be a class implementing the respective interface.

Sample of interface for props:
```typescript

interface DashboardTemplateInterface {
  sections: React.ReactNode;
  sidebar: React.ReactNode;
}

export function DashboardTemplate({ 
  sections, 
  sidebar
}: DashboardTemplateInterface) {
    //...
}
```

Sample of interface and dto:
```typescript
export interface SectionInterface {
  id: string;
  title: string;
  icon: string;
  type: 'simple_list' | 'summary_list';
  total?: number;
  items: SectionItemDTO[];
  action?: {
    label: string;
  };
}

export class SectionDTO implements SectionInterface {
  id: string;
  title: string;
  icon: string;
  total?: number;
  items: SectionItemDTO[];
  action?: {
    label: string;
  };
}
```
### Types, Constants and Enums implementations
- All types, constants and enums should be declared in their respective (types, consts or enums) folder.
- Types should follow the `PascalCase` naming convention finished with `Type`.
- Constants should follow the `UPPER_SNAKE_CASE` naming convention.
- If constant is a object, nested values should follow the `UPPER_SNAKE_CASE` naming convention.
- Enums should follow the `PascalCase` naming convention finished with `Enum`.

Sample of type (same way for consts and enums):
```typescript
export type SectionType = 'simple_list' | 'summary_list';

export class SectionDTO implements SectionInterface {
  type: SectionType;
}
```

### Dashboard Save Pattern
For features requiring bulk save operations (parent + children entities):

1. **Server-side service** (`services/dashboardService.ts`):
   - `saveDashboard(db, userId, data)` function that handles create/update/delete
   - Deletes entities not in received data
   - Syncs children items by comparing existing IDs vs received IDs
   - Uses transaction for atomic operations

2. **Client-side service** (`services/dashboardSaveService.ts`):
   - Single `saveDashboard(sections, debts)` function
   - Calls `POST /api/dashboard` endpoint
   - Returns persisted data with real IDs

3. **API Endpoint** (`app/api/dashboard/route.ts`):
   - Single POST endpoint receiving all data
   - Delegates to server-side service

### Context Error Handling Pattern
For managing save errors in React Context:

1. Add state and callback in context:
```typescript
const [saveError, setSaveError] = useState<string | null>(null);
const clearSaveError = useCallback(() => setSaveError(null), []);
```

2. Expose in context value:
```typescript
<DashboardContext.Provider value={{
  saveError,
  clearSaveError,
  // ...
}}>
```

3. Display in template using AlertBanner:
```typescript
{saveError && (
  <AlertBanner message={saveError} onClose={clearSaveError} />
)}
```

### Temporary ID Pattern
- Use `tmp_` prefix for new entities created on client
- Server detects `tmp_` prefix to determine if entity is new
- Server replaces with real ID after creation

Helper function:
```typescript
function isTmpId(id: string): boolean {
  return id.startsWith('tmp_');
}
```