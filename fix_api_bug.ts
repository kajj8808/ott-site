import * as fs from 'fs';

const fixFile = (path: string, type: 'series' | 'movies') => {
  let code = fs.readFileSync(path, 'utf8');
  
  // Fix hasNext logic
  code = code.replace(
    new RegExp(`const hasNext = ${type}\\.page \\* ${type}\\.limit < ${type}\\.total;`),
    `const hasNext = ${type}.items.length === ${type}.limit;`
  );
  
  // Replace pagination UI to handle unknown total
  const paginationRegex = /<div className="flex items-center justify-center gap-2 mt-8">[\s\S]*?<\/div>\s*<\/div>/;
  
  const newPagination = `<div className="flex items-center justify-center gap-2 mt-8">
            {hasPrev ? (
              <Link
                href={pageHref(${type}.page - 1)}
                className="rounded-md border border-white/20 px-3 py-1.5 text-sm transition-colors hover:bg-white/10"
              >
                Prev
              </Link>
            ) : (
              <span className="rounded-md border border-white/10 px-3 py-1.5 text-sm text-white/30 cursor-not-allowed">
                Prev
              </span>
            )}
            
            <div className="flex items-center gap-1 mx-2">
              {hasPrev && (
                <Link
                  href={pageHref(${type}.page - 1)}
                  className="flex size-8 items-center justify-center rounded-md text-sm transition-colors hover:bg-white/10 text-white/70"
                >
                  {${type}.page - 1}
                </Link>
              )}
              
              <span className="flex size-8 items-center justify-center rounded-md text-sm transition-colors bg-white text-black font-semibold">
                {${type}.page}
              </span>
              
              {hasNext && (
                <Link
                  href={pageHref(${type}.page + 1)}
                  className="flex size-8 items-center justify-center rounded-md text-sm transition-colors hover:bg-white/10 text-white/70"
                >
                  {${type}.page + 1}
                </Link>
              )}
            </div>

            {hasNext ? (
              <Link
                href={pageHref(${type}.page + 1)}
                className="rounded-md border border-white/20 px-3 py-1.5 text-sm transition-colors hover:bg-white/10"
              >
                Next
              </Link>
            ) : (
              <span className="rounded-md border border-white/10 px-3 py-1.5 text-sm text-white/30 cursor-not-allowed">
                Next
              </span>
            )}
          </div>`;

  code = code.replace(paginationRegex, newPagination);
  
  fs.writeFileSync(path, code);
};

fixFile('app/(tabs)/series/page.tsx', 'series');
fixFile('app/(tabs)/movies/page.tsx', 'movies');
