---
name: UI web coder
description: Coding user interfaces for web applications.
---

# UI web coder skill

## Description
Skill for coding UI styles into differents HTML/CSS frameworks.

## When to use
When you need to create, configure or design UI styles based on a separated file, example or prompt.

## Instructions
If prompt needs to create components based on a separated file (code, image, pdf, any file):
1. Read the file and understand the UI code or mockup view.
2. Analyze the project usage and choose the framework to use.
3. Create components or mockup view based on the chosen framework, following patterns defined in the AGENTS.md or in the context project.

If prompt needs to create components based a description:
1. Determinate a plan of what components need to be created.
2. Create the components or mockup view in the chosen framework.
3. Create components or mockup view based on the chosen framework, following patterns defined in the AGENTS.md or in the context project.


## Example
```
<table class="w-full text-left border-collapse">
<tbody>
<tr class="border-b border-slate-100 dark:border-slate-800">
<td class="p-4">Salario</td>
<td class="p-4 text-right">
<span class="px-3 py-1 rounded bg-income dark:bg-income-dark text-green-700 dark:text-green-300 font-mono mono-amount">$8.059.000</span>
</td>
</tr>
<tr class="border-b border-slate-100 dark:border-slate-800">
<td class="p-4">Credito Libranza</td>
<td class="p-4 text-right font-mono mono-amount text-red-500">-$765.000</td>
</tr>
<tr class="border-b border-slate-100 dark:border-slate-800">
<td class="p-4">Pago Bea</td>
<td class="p-4 text-right font-mono mono-amount">$500.000</td>
</tr>
</tbody>
</table>
```

Setps following Container/Presentational pattern:
1. Read the file and understand the UI components or mockup view.
2. Analyze the project usage and choose the framework to use.
3. Determinate is this component can be global and reused in other pages.
4. In this case, create a folder in shared folder (outside pages folder) and create file in components/tables/general with the table code.
5. Reuse this component in other pages or components.

Sample of reused components:
```
<AppTable>
  <AppTableHeader>
    <AppTableHeaderCell>Salario</AppTableHeaderCell>
    <AppTableHeaderCell>Credito Libranza</AppTableHeaderCell>
    <AppTableHeaderCell>Pago Bea</AppTableHeaderCell>
  </AppTableHeader>
  <AppTableBody>
    <AppTableRow>
      <AppTableCell>$8.059.000</AppTableCell>
      <AppTableCell class="text-red-500">-$765.000</AppTableCell>
      <AppTableCell>$500.000</AppTableCell>
    </AppTableRow>
  </AppTableBody>
</AppTable>
```
