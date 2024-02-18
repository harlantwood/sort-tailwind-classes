# sort-tailwind-classes

A CLI to order tailwind classes.

This uses the [recommended class order](https://tailwindcss.com/blog/automatic-class-sorting-with-prettier#how-classes-are-sorted) that is used in the [Prettier plugin for Tailwind](https://tailwindcss.com/blog/automatic-class-sorting-with-prettier).

## Usage

```sh
npx --yes github:harlantwood/sort-tailwind-classes [PATHS_OR_GLOBS...]
```

## Examples

File paths:

```sh
npx --yes github:harlantwood/sort-tailwind-classes app/views/home/dashboard.html.erb app/views/home/landing.html.erb
```

Globs:

```sh
npx --yes github:harlantwood/sort-tailwind-classes app/views/home/**/*.html.erb public/**/*.html
```

## Provenance

Originally forked from https://github.com/tailwindlabs/prettier-plugin-tailwindcss
