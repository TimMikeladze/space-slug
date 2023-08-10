# 🐌 space-slug

Generate unique slugs, usernames, numbers and more. If you need a unique string that looks like this `hyperspace-4812` or `blue-whimsical-summer` or is generated from a custom dictionary of words then this is the package for you.

```tsx
const { spaceSlug } from 'space-slug';

const slug = spaceSlug();
// Returns: jabba-3921
```

## 📡 Install

```console
npm install space-slug

yarn add space-slug

pnpm add space-slug
```

> 👋 Hello there! Follow me [@linesofcode](https://twitter.com/linesofcode) or visit [linesofcode.dev](https://linesofcode.dev) for more cool projects like this one.

## 🚀 Getting Started

```ts
const { spaceSlug, color, digits } from 'space-slug';

const slug = spaceSlug();
// Returns: serenity-2391

const slug = spaceSlug([color(), digits(2)]);
// Returns: blue-80
```

## 📚 Custom dictionaries and locales

```ts
const { spaceSlug, words } from 'space-slug';

const starwars = words('starwars')

const slug = spaceSlug([starwars(2), digits(2)], {
  dictionary: {
    en: {
      starwars: ['jabba', 'ezra']
    }
  }
});
/// Returns: jabba-ezra-39
```

## 🗃️ Tracking used slugs

```ts
const { uniqueSpaceSlug, color, digits } from 'space-slug';

const slug = await uniqueSpaceSlug([
  color(1),
  digits(4),
], {
  usedSlugs: ['orange-3918']
});
// Returns: a slug that is not orange-3918
```

## ✅ Verifying that a slug is a unique

```ts
const { uniqueSpaceSlug } from 'space-slug';

await uniqueSpaceSlug([], {
  isUnique: async (slug) => {
    // check database to see if slug is unique
    return true;
  }
});
// Returns: a slug that you have verified is unique
```

<!-- TSDOC_START -->

## :toolbox: Functions

- [word](#gear-word)
- [digits](#gear-digits)
- [uniqueSpaceSlug](#gear-uniquespaceslug)
- [spaceSlug](#gear-spaceslug)

### :gear: word

| Function | Type                                                                                                  |
| -------- | ----------------------------------------------------------------------------------------------------- |
| `word`   | `(type: string) => (count?: number, _words?: string[]) => (options: SpaceSlugOptions) => Set<string>` |

### :gear: digits

| Function | Type                                                             |
| -------- | ---------------------------------------------------------------- |
| `digits` | `(count?: number) => (options: SpaceSlugOptions) => Set<string>` |

### :gear: uniqueSpaceSlug

| Function          | Type                                                                                                     |
| ----------------- | -------------------------------------------------------------------------------------------------------- |
| `uniqueSpaceSlug` | `(spaceSlugFn: SpaceSlugFn[], options?: SpaceSlugOptions and UniqueSpaceSlugOptions) => Promise<string>` |

### :gear: spaceSlug

| Function    | Type                                                                   |
| ----------- | ---------------------------------------------------------------------- |
| `spaceSlug` | `(spaceSlugFns?: SpaceSlugFn[], options?: SpaceSlugOptions) => string` |

## :wrench: Constants

- [defaultWords](#gear-defaultwords)
- [spaceSlugDefaultOptions](#gear-spaceslugdefaultoptions)
- [noun](#gear-noun)
- [adjective](#gear-adjective)
- [color](#gear-color)
- [season](#gear-season)
- [emoji](#gear-emoji)
- [verb](#gear-verb)
- [animal](#gear-animal)
- [cosmos](#gear-cosmos)

### :gear: defaultWords

| Constant       | Type                                                                                                                                                                                                        |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defaultWords` | `Record<string, Partial<{ [key: string]: string[]; adjectives: string[]; animals: string[]; colors: string[]; cosmos: string[]; emojis: string[]; nouns: string[]; seasons: string[]; verbs: string[]; }>>` |

### :gear: spaceSlugDefaultOptions

| Constant                  | Type                        |
| ------------------------- | --------------------------- |
| `spaceSlugDefaultOptions` | `Partial<SpaceSlugOptions>` |

### :gear: noun

| Constant | Type                                                                                |
| -------- | ----------------------------------------------------------------------------------- |
| `noun`   | `(count?: number, _words?: string[]) => (options: SpaceSlugOptions) => Set<string>` |

### :gear: adjective

| Constant    | Type                                                                                |
| ----------- | ----------------------------------------------------------------------------------- |
| `adjective` | `(count?: number, _words?: string[]) => (options: SpaceSlugOptions) => Set<string>` |

### :gear: color

| Constant | Type                                                                                |
| -------- | ----------------------------------------------------------------------------------- |
| `color`  | `(count?: number, _words?: string[]) => (options: SpaceSlugOptions) => Set<string>` |

### :gear: season

| Constant | Type                                                                                |
| -------- | ----------------------------------------------------------------------------------- |
| `season` | `(count?: number, _words?: string[]) => (options: SpaceSlugOptions) => Set<string>` |

### :gear: emoji

| Constant | Type                                                                                |
| -------- | ----------------------------------------------------------------------------------- |
| `emoji`  | `(count?: number, _words?: string[]) => (options: SpaceSlugOptions) => Set<string>` |

### :gear: verb

| Constant | Type                                                                                |
| -------- | ----------------------------------------------------------------------------------- |
| `verb`   | `(count?: number, _words?: string[]) => (options: SpaceSlugOptions) => Set<string>` |

### :gear: animal

| Constant | Type                                                                                |
| -------- | ----------------------------------------------------------------------------------- |
| `animal` | `(count?: number, _words?: string[]) => (options: SpaceSlugOptions) => Set<string>` |

### :gear: cosmos

| Constant | Type                                                                                |
| -------- | ----------------------------------------------------------------------------------- |
| `cosmos` | `(count?: number, _words?: string[]) => (options: SpaceSlugOptions) => Set<string>` |

<!-- TSDOC_END -->

```

```

```

```