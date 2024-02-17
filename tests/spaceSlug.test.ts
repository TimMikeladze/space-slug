import { describe, it, expect } from 'vitest';
import {
  spaceSlug,
  animal,
  spaceSlugDefaultDictionary,
  digits,
  noun,
  word,
  uniqueSpaceSlug,
  SpaceSlugDictionary,
} from '../src';

const dictionary: SpaceSlugDictionary = {
  en: {
    starwars: ['jabba', 'hutt'],
  },
};

describe('word', () => {
  it('size default', () => {
    const res = word('starwars')()({
      locale: 'en',
      dictionary,
      separator: '-',
    });

    expect(res.size).toBe(1);
  });
  it('size n', () => {
    const res = word('starwars')(2)({
      locale: 'en',
      dictionary,
      separator: '-',
    });

    expect(res.size).toBe(2);

    expect(res.has('jabba')).toBe(true);
    expect(res.has('hutt')).toBe(true);
  });
  it('throw error if count is more than words', () => {
    expect(() =>
      word('starwars')(3)({
        locale: 'en',
        dictionary,
        separator: '-',
      })
    ).toThrowError();
  });
});

describe('digits', () => {
  it('size default', () => {
    const res = digits()({
      locale: 'en',
      dictionary: {},
      separator: '-',
    });

    expect(res.length).toBe(4);
  });

  it('size 10', () => {
    const res = digits(10)({
      locale: 'en',
      dictionary: {},
      separator: '-',
    });

    expect(res.length).toBe(10);
  });
});

describe('spaceSlug', () => {
  it('works by default', () => {
    const slug = spaceSlug();
    const parts = slug.split('-');
    expect(parts).toHaveLength(3);
  });
  it('works', () => {
    const slug = spaceSlug([noun(2), animal(1), digits(3)]);

    const parts = slug.split('-');

    expect(parts).toHaveLength(4);

    expect(
      spaceSlugDefaultDictionary.en.nouns!.includes(parts[0])
    ).toBeTruthy();

    expect(
      spaceSlugDefaultDictionary.en.nouns!.includes(parts[1])
    ).toBeTruthy();

    expect(
      spaceSlugDefaultDictionary.en.animals!.includes(parts[2])
    ).toBeTruthy();

    expect(parts[3]).toHaveLength(3);
  });

  it('custom separator', () => {
    const slug = spaceSlug([word('starwars')(2), digits(3)], {
      separator: '_',
      dictionary,
    });

    const parts = slug.split('_');

    expect(parts).toHaveLength(3);

    if (parts[0] === 'jabba' || parts[0] === 'hutt') {
      expect(parts[1]).toBe(parts[0] === 'jabba' ? 'hutt' : 'jabba');
    }

    if (parts[0] === 'jabba' || parts[0] === 'hutt') {
      expect(parts[1]).toBe(parts[0] === 'jabba' ? 'hutt' : 'jabba');
    }

    expect(parts[2]).toHaveLength(3);
  });

  it('no separator', () => {
    const slug = spaceSlug([word('starwars')(2), digits(3)], {
      separator: '',
      dictionary,
    });

    const parts = slug.split('');

    expect(parts).toHaveLength(12);
  });

  it('custom words', () => {
    const slug = spaceSlug([word('starwars')(2), digits(3)], {
      dictionary,
    });

    const parts = slug.split('-');

    expect(parts).toHaveLength(3);

    if (parts[0] === 'jabba' || parts[0] === 'hutt') {
      expect(parts[1]).toBe(parts[0] === 'jabba' ? 'hutt' : 'jabba');
    }

    if (parts[0] === 'jabba' || parts[0] === 'hutt') {
      expect(parts[1]).toBe(parts[0] === 'jabba' ? 'hutt' : 'jabba');
    }

    expect(parts[2]).toHaveLength(3);
  });

  it('custom transform', () => {
    const slug = spaceSlug([word('starwars')(2)], {
      dictionary,
      transform: (str) => str.toUpperCase(),
    });

    if (slug === 'JABBA-HUTT') {
      expect(slug).toBe('JABBA-HUTT');
    } else {
      expect(slug).toBe('HUTT-JABBA');
    }
  });

  it('hardcoded inputs', () => {
    expect(
      spaceSlug([word('starwars')(2), 'ezra'], {
        dictionary,
      }).endsWith('-ezra')
    ).toBe(true);

    expect(
      spaceSlug([word('starwars')(2), ['ezra', 'holocron']], {
        dictionary,
      }).endsWith('-ezra-holocron')
    ).toBe(true);

    expect(
      spaceSlug([word('starwars')(2), new Set(['ezra', 'holocron'])], {
        dictionary,
      }).endsWith('-ezra-holocron')
    ).toBe(true);
  });

  it('cleans string', () => {
    expect(
      spaceSlug(
        [
          '#a very',
          `b@d
        string`,
        ],
        {
          dictionary,
        }
      )
    ).toBe('a-very-bd-string');

    expect(
      spaceSlug(['a very', 'b@d  string'], {
        dictionary,
        separator: '',
      })
    ).toBe('averybdstring');

    expect(
      spaceSlug(['-_foo!bar-', 'JABBA'], {
        dictionary,
      })
    ).toBe('foobar-jabba');

    expect(spaceSlug(['space-slug'])).toEqual('space-slug');

    expect(spaceSlug(['space--slug'])).toEqual('space-slug');

    expect(
      spaceSlug([
        `-#
space---slug-@-`,
      ])
    ).toEqual('space-slug');
  });
});

describe('uniqueSpaceSlug', () => {
  it('respects max attempts', async () => {
    expect(
      uniqueSpaceSlug([word('starwars')(2)], {
        usedSlugs: ['jabba-hutt', 'hutt-jabba'],
        dictionary,
      })
    ).rejects.toThrowError();
  });
  it('respects used slugs', () => {
    const slug = uniqueSpaceSlug([word('starwars')(2)], {
      usedSlugs: ['jabba-hutt'],
      dictionary,
      maxAttempts: 10,
    });

    expect(slug).resolves.toBe('hutt-jabba');
  });
  it('respects isUnique function', () => {
    expect(
      uniqueSpaceSlug([word('starwars')(2)], {
        dictionary,
        isUnique: async () => false,
      })
    ).rejects.toThrowError();

    expect(
      uniqueSpaceSlug([word('starwars')(2)], {
        dictionary,
        isUnique: async () => true,
      })
    ).resolves.toEqual(expect.any(String));
  });
});
