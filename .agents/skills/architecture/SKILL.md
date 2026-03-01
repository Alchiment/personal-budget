---
name: Architecture developer
description: Building features following SOLID principles and good practices.
---

# Architecture developer skill

## Description
Skill for implementing features, pages, API routes, and business logic following SOLID principles, clean code practices, and the project's architectural conventions.

## When to use
Any momento when you need to generate code, refactor existing code, or implement new features following the project's architectural conventions defined in AGENTS.md.
This skill will be focusing on giving you an overall conversion.

---

### Module Organization
This folder organization will be agnostic to the specific technologies used in the project.
Its a complement to the project's architectural conventions defined in AGENTS.md.
Here will be just focus on the folder organization, structure, scaffolding project or patterns implementation
will be configured in AGENTS.md file.

1. **DTOs**: `dtos/` - Data transfer objects, interfaces or classes for API contracts
2. **Utils**: `utils/` - Utility functions and helpers
3. **Hooks**: `hooks/` - Custom React hooks for shared logic
4. **Mappers**: `mappers/` - Transform between DTOs and schemas
5. **Guards**: `guards/` - Route protection and authorization
6. **Decorators**: `decorators/` - Custom parameter decorators
7. **Interceptors**: `interceptors/` - Transform response data or handle errors
8. **Typescript Types**: `types/` - Custom types for better type checking
9. **Constants**: `constants/` - Constants used throughout the project
