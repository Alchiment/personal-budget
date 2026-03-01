---
name: NextJS developer
description: Building NextJS features following SOLID principles and good practices.
---

# NextJS developer skill

## Description
Skill for implementing features, pages, API routes, and business logic in a NextJS application following SOLID principles, clean code practices, and the project's architectural conventions.

## When to use
When you need to:
- Create or refactor pages, components, API routes, or services.
- Implement new features end-to-end (UI, logic, data layer).
- Ensure code follows SOLID principles and project conventions defined in AGENTS.md.

---

## SOLID principles applied to NextJS

### S — Single Responsibility Principle
- Each file, component, hook, or service must have one clear responsibility.
- A page component (`page.tsx`) should only orchestrate layout and data fetching. Business logic must live in services or hooks.
- A component should either fetch data (container) OR render UI (presentational), never both.

### O — Open/Closed Principle
- Components and services should be open for extension but closed for modification.
- Use composition over inheritance: extend behavior by wrapping or composing components, not by modifying existing ones.
- Use props and slots (children, render props) to extend UI components without rewriting them.

### L — Liskov Substitution Principle
- DTOs implementing interfaces must fulfill the interface contract completely.
- Any component receiving an interface-typed prop must work correctly with any class implementing that interface.
- Avoid adding extra required dependencies in subclasses or implementations that break the abstraction.

### I — Interface Segregation Principle
- Define narrow, focused interfaces. Do not force a component or class to depend on methods/props it does not use.
- Split large interfaces into smaller ones if a consumer only needs a subset.
- Example: separate `ReadableRepositoryInterface` from `WritableRepositoryInterface` instead of one monolithic `RepositoryInterface`.

### D — Dependency Inversion Principle
- High-level modules (pages, containers) should depend on abstractions (interfaces), not concrete implementations.
- Inject dependencies (services, repositories) through props, context, or constructor arguments rather than instantiating them directly inside the consumer.
- Use React Context or dependency injection patterns to provide implementations to consumers.

---

## Code conventions (from AGENTS.md)

### File & folder structure
- Pages live in `app/pages/<feature>/page.tsx`.
- Each page has its own scaffolding: `components/`, `styles/`, `dtos/`, `services/`, `utils/`, etc.
- `services/` contains business logic and data-access functions (e.g. `sectionService.ts`, `debtService.ts`).
- `utils/` contains pure helper/formatting functions with no side effects or data-access concerns.
- Shared/reusable components live outside `pages/`, in a `shared/` or `components/` root folder.

### Container / Presentational pattern
- **Container**: responsible for data fetching, state, and business logic. Passes data to presentational components via props.
- **Presentational**: responsible only for rendering UI. Receives all data via props. Must be stateless when possible.

---

## Instructions

### When creating a new feature end-to-end:
1. Understand the feature requirements and identify all responsibilities involved (UI, data fetching, business logic, persistence).
2. Define interfaces for each data entity and service involved. Place them in the `dtos/` folder.
3. Create DTO classes implementing those interfaces.
4. Implement service functions or classes for business logic. Each service has a single responsibility (SRP).
5. Create the container component that fetches data and orchestrates logic.
6. Create presentational components that receive data via props and only render UI.
7. Wire everything together in the `page.tsx` file.
8. Ensure no component directly depends on a concrete data-fetching implementation — use abstractions or hooks.

### When refactoring existing code:
1. Identify violations of SOLID principles (mixed responsibilities, direct concrete dependencies, large interfaces).
2. Extract business logic into dedicated service files or custom hooks.
3. Split components that are doing both data fetching and rendering into container + presentational pairs.
4. Replace concrete dependencies with interface-typed abstractions where applicable.
5. Verify all DTOs correctly implement their interfaces.

### When creating API routes:
1. Each API route file handles one resource and one HTTP concern (SRP).
2. Validate input at the boundary (API route level) using DTOs or validation schemas.
3. Delegate business logic to service functions — never inline it in the route handler.
4. Return consistent response shapes; define response DTOs if needed.

---

## Examples

### Interface + DTO (dtos/transaction.ts)
```typescript
export interface TransactionInterface {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  date: string;
}

export class TransactionDTO implements TransactionInterface {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  date: string;
}
```

### Service with single responsibility (services/transactionService.ts)
```typescript
import { TransactionDTO } from '../dtos/transaction';

export function groupTransactionsByType(
  transactions: TransactionDTO[]
): Record<TransactionType, TransactionDTO[]> {
  return transactions.reduce((acc, tx) => {
    acc[tx.type] = [...(acc[tx.type] ?? []), tx];
    return acc;
  }, {} as Record<TransactionType, TransactionDTO[]>);
}
```

### Container component
```typescript
// TransactionsContainer.tsx
import { fetchTransactions } from '../services/transactionService';
import { TransactionList } from './TransactionList';
```

### Container component
```typescript
// TransactionsContainer.tsx
import { fetchTransactions } from '../utils/transactionService';
import { TransactionList } from './TransactionList';

export async function TransactionsContainer() {
  const transactions = await fetchTransactions();
  return <TransactionList transactions={transactions} />;
}
```

### Presentational component
```typescript
// TransactionList.tsx
import { TransactionDTO } from '../dtos/transaction';

interface TransactionListInterface {
  transactions: TransactionDTO[];
}

export function TransactionList({ transactions }: TransactionListInterface) {
  return (
    <ul>
      {transactions.map((tx) => (
        <li key={tx.id}>{tx.description} — {tx.amount}</li>
      ))}
    </ul>
  );
}
```

### API route with delegated logic (app/api/transactions/route.ts)
```typescript
import { NextResponse } from 'next/server';
import { getTransactions } from '@/app/pages/transactions/services/transactionService';

export async function GET() {
  const transactions = await getTransactions();
  return NextResponse.json(transactions);
}
```

---

## Checklist before finishing any task
- [ ] Each file/class/function has a single, clear responsibility.
- [ ] No component fetches data AND renders UI — container/presentational split applied.
- [ ] All data entities have an interface and a DTO class.
- [ ] Interfaces are narrow and specific to consumer needs.
- [ ] High-level modules depend on interfaces, not concrete implementations.
- [ ] New components/services are added without modifying stable existing ones (composition used).
- [ ] Naming conventions followed: `Interface`, `DTO`, `Type`, `Enum`, `UPPER_SNAKE_CASE` constants.
- [ ] Business logic and data-access live in `services/`, not in components or API route handlers.
- [ ] Pure helper/formatting functions live in `utils/`, not mixed with service logic.
