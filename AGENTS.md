# Project overview
Project for managing personal budgets.

## Architecture
- NextJS as monolith project.
- Postgresql as database.

## Commands
- Locally installation npm pacakges with `npm install`.
- Run the project with `npm run dev` locally.
- Build project for production with `npm run build`.

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