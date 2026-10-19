"""Summarise one or two scripts/rank-sweep.py CSVs: where Monitorar stands per kind, which phrases are top 3 / top 10 / absent,
which competitors take the top spots, and (with a second CSV) what moved.

  python scripts/rank-report.py docs/organic/google-first-page/rankings/baseline-2026-10-19.csv [later.csv]
"""
import collections, csv, sys


def load(path):
    with open(path, encoding='utf-8') as handle:
        return {r['phrase'].lower(): r for r in csv.DictReader(handle)}


def position(row):
    value = row['target_position'] or row['best_position']
    return int(value) if value else None


def bucket(pos):
    return 'absent' if pos is None else '1' if pos == 1 else '2-3' if pos <= 3 else '4-10'


if __name__ == '__main__':
    base = load(sys.argv[1])
    later = load(sys.argv[2]) if len(sys.argv) > 2 else None
    current = later or base
    print(f"phrases: {len(current)}  (first page read per phrase; 'absent' = not among the ~10 organic links)\n")
    for kind in ('priority', 'commercial', 'head', 'geo', 'article'):
        rows = [r for r in current.values() if r['kind'] == kind]
        if rows:
            counts = collections.Counter(bucket(position(r)) for r in rows)
            print(f"{kind:10} n={len(rows):3}  #1:{counts['1']:3}  #2-3:{counts['2-3']:3}  #4-10:{counts['4-10']:3}  absent:{counts['absent']:3}")
    print('\non the first page:')
    for r in sorted((r for r in current.values() if position(r)), key=lambda r: position(r)):
        print(f"  #{position(r):<2} {r['kind']:10} {r['phrase'][:60]:60} -> {r['ours'][:90]}")
    rivals = collections.Counter(d for r in current.values() for d in r['top3'].split(' | ')[:1] if d)
    print('\nmost frequent #1 competitors:', rivals.most_common(8))
    if later:
        print('\nmoved since the first sweep:')
        for key, row in later.items():
            before = position(base[key]) if key in base else None
            after = position(row)
            if before != after:
                print(f"  {row['phrase'][:60]:60} {before or 'absent'} -> {after or 'absent'}")
