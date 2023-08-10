import {
  seasons,
  adjectives,
  nouns,
  colors,
  animals,
  verbs,
  cosmos as cosmosWords,
} from './data/en';

import { emojis } from './data/emojis';

export * from './data/emojis';
export * from './data/en';

export const defaultWords: Record<string, SpaceSlugDictionary> = {
  en: {
    seasons,
    emojis,
    adjectives,
    nouns,
    colors,
    animals,
    verbs,
    cosmos: cosmosWords,
  },
};

export const spaceSlugDefaultOptions: Partial<SpaceSlugOptions> = {
  locale: 'en',
  separator: '-',
  dictionary: defaultWords,
};

export type SpaceSlugDictionary = Partial<{
  [key: string]: string[];
  adjectives: string[];
  animals: string[];
  colors: string[];
  cosmos: string[];
  emojis: string[];
  nouns: string[];
  seasons: string[];
  verbs: string[];
}>;

export type SpaceSlugOptions = {
  dictionary?: Record<string, SpaceSlugDictionary>;
  locale?: string;
  separator?: string;
  transform?: (word: string) => string;
};

export type SpaceSlugFn = (options: SpaceSlugOptions) => SpaceSlugFnOutput;

export type SpaceSlugFnOutput = Set<string>;

export type UniqueSpaceSlugOptions = {
  isUnique?: (slug: string) => Promise<boolean>;
  maxAttempts?: number;
  usedSlugs?: string[];
};

export const word =
  (type: string) =>
  (count?: number, _words?: string[]) =>
  (options: SpaceSlugOptions) => {
    const words = (
      _words?.length
        ? _words
        : (options.dictionary?.[options.locale!] as any)[type]
    ) as string[];

    if (!words?.length) {
      throw new Error(`No words found for ${type}`);
    }

    const c = count || 1;

    if (c > words.length) {
      throw new Error(
        `Cannot generate ${c} unique words from ${words.length} words`
      );
    }

    const set = new Set<string>();

    while (set.size < c) {
      const index = Math.floor(Math.random() * words.length);
      set.add(words[index]);
    }

    return set;
  };

export const noun = word('nouns');

export const adjective = word('adjectives');

export const color = word('colors');

export const season = word('seasons');

export const emoji = word('emojis');

export const verb = word('verbs');

export const animal = word('animals');

export const cosmos = word('cosmos');

export const starwars = word('starwars');

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const digits = (count?: number) => (options: SpaceSlugOptions) => {
  const set = new Set<string>();

  while (set.size < (count || 4)) {
    const index = Math.floor(Math.random() * 10);
    set.add(index.toString());
  }

  return new Set([Array.from(set).join('')]);
};

// eslint-disable-next-line no-underscore-dangle
const _uniqueSpaceSlug = async (
  spaceSlugFn: SpaceSlugFn[],
  options: SpaceSlugOptions & UniqueSpaceSlugOptions,
  attempts: number
): Promise<string> => {
  const slug = spaceSlug(spaceSlugFn, options);
  const maxAttempts = options.maxAttempts || 5;

  if (attempts > maxAttempts) {
    throw new Error(
      `Could not generate unique slug after ${options.maxAttempts} attempts`
    );
  }

  if (options.usedSlugs && options.usedSlugs.includes(slug)) {
    return _uniqueSpaceSlug(spaceSlugFn, options, attempts + 1);
  }

  if (options.isUnique) {
    const isUnique = await options.isUnique(slug);

    if (!isUnique) {
      return _uniqueSpaceSlug(spaceSlugFn, options, attempts + 1);
    }
  }

  return slug;
};

export const uniqueSpaceSlug = async (
  spaceSlugFn: SpaceSlugFn[],
  options: SpaceSlugOptions & UniqueSpaceSlugOptions = {}
) => _uniqueSpaceSlug(spaceSlugFn, options, 1);

export const spaceSlug = (
  spaceSlugFns?: SpaceSlugFn[],
  options: SpaceSlugOptions = {}
) => {
  const mergedOptions = {
    ...spaceSlugDefaultOptions,
    ...options,
  };

  const transformFn = mergedOptions.transform || ((x) => x);

  // eslint-disable-next-line no-underscore-dangle
  const _spaceSlugFns = !spaceSlugFns?.length
    ? [adjective(1), noun(1), digits(2)]
    : spaceSlugFns;

  const slug = _spaceSlugFns.map((fn) => {
    const set = fn(mergedOptions);
    return transformFn(Array.from(set).join(mergedOptions.separator));
  });

  return slug.join(mergedOptions.separator);
};
