import * as fs from 'fs';

const path = 'app/(tabs)/series/page.tsx';
let code = fs.readFileSync(path, 'utf8');

const paginationRegex = /<div className="flex items-center justify-center gap-3">[\s\S]*?<\/div>/;

const newPagination = `
        {series.total > series.limit && (
          <div className="flex items-center justify-center gap-2 mt-8">
            {hasPrev ? (
              <Link
                href={pageHref(series.page - 1)}
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
              {Array.from({ length: Math.ceil(series.total / series.limit) })
                .map((_, i) => i + 1)
                .filter(p => p === 1 || p === Math.ceil(series.total / series.limit) || Math.abs(p - series.page) <= 2)
                .map((p, i, arr) => (
                  <React.Fragment key={p}>
                    {i > 0 && arr[i - 1] !== p - 1 && (
                      <span className="px-2 text-white/50">...</span>
                    )}
                    <Link
                      href={pageHref(p)}
                      className={\`flex size-8 items-center justify-center rounded-md text-sm transition-colors \${
                        p === series.page
                          ? "bg-white text-black font-semibold"
                          : "hover:bg-white/10 text-white/70"
                      }\`}
                    >
                      {p}
                    </Link>
                  </React.Fragment>
                ))}
            </div>

            {hasNext ? (
              <Link
                href={pageHref(series.page + 1)}
                className="rounded-md border border-white/20 px-3 py-1.5 text-sm transition-colors hover:bg-white/10"
              >
                Next
              </Link>
            ) : (
              <span className="rounded-md border border-white/10 px-3 py-1.5 text-sm text-white/30 cursor-not-allowed">
                Next
              </span>
            )}
          </div>
        )}
`;

code = code.replace(paginationRegex, newPagination);

if (!code.includes("import React from")) {
  code = `import React from "react";\n` + code;
}

fs.writeFileSync(path, code);
