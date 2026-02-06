---
name: UI web designer
description: Designing user interfaces for web applications.
---

# UI web designer skill

## Description
Skill for mocking up UI styles into differents HTML/CSS frameworks.

## When to use
When you need to create, configure or design UI styles based on a separated file, example or prompt.

## Instructions
If prompt needs to create styles based on a separated file (code, image, pdf, any file):
1. Read the file and understand the UI styles or mockup view.
2. Analyze the project usage and choose the HTML/CSS framework to use.
3. Create the styles or mockup view in the chosen framework.
4. Separate styles based on the conect: dropdown, forms/inputs, buttons, etc.
5. Add a styles folder into the root app project.

If prompt needs to create styles based a description:
1. Determinate a plan of what styles need to be created.
2. Create the styles or mockup view in the chosen framework.
3. Separate styles based on the conect: dropdown, forms/inputs, buttons, etc.
4. Add a styles folder into the root app project.


## Example
```
body {
  background: var(--background);
  color: var(--foreground);
  font-family: Arial, Helvetica, sans-serif;
}

button {
  color: var(--foreground);
  background: var(--foreground);
}

button.btn-red {
  color: var(--foreground);
  background: var(--red);
}

form {
  padding: 1rem;
  border-radius: 0.5rem;
}
```

Setps:
1. Read the file and understand the UI styles or mockup view.
2. Analyze the project usage and choose the HTML/CSS framework to use.
3. Create file in styles/core/general.scss with the body style.
4. Create file in styles/components/buttons/general.scss with the button style.
5. Create file in styles/components/buttons/red.scss with the red button style.
6. Create file in styles/components/forms/general.scss with the form style.
