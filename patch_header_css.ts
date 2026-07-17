import * as fs from 'fs';

const path = 'app/components/Header.tsx';
let code = fs.readFileSync(path, 'utf8');

// Replace framer-motion import and usages
code = code.replace(/import { motion } from "motion\/react";\n/, '');

const oldSearchBlock = `{isSearchOpen ? (
          <motion.form
            onSubmit={handleSearch}
            className="w-full max-w-64"
            layoutId="search-box"
          >
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search"
              className="bg-background/70 w-full rounded-2xl border border-white/15 px-3 py-1.5 text-sm transition-colors outline-none placeholder:text-white/40 focus:border-white/40"
            />
          </motion.form>
        ) : (
          <motion.div className="flex h-8.5 items-center" layoutId="search-box">
            <MagnifyingGlassIcon
              className="size-5 cursor-pointer"
              onClick={() => setIsSearchOpen(true)}
            />
          </motion.div>
        )}`;

const newSearchBlock = `
        <form
          onSubmit={handleSearch}
          className={\`relative flex items-center transition-all duration-300 ease-out \${
            isSearchOpen ? "w-full max-w-64" : "w-5"
          }\`}
        >
          {isSearchOpen ? (
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search"
              className="bg-background/70 w-full rounded-2xl border border-white/15 py-1.5 pl-9 pr-3 text-sm transition-colors outline-none placeholder:text-white/40 focus:border-white/40"
              autoFocus
              onBlur={() => {
                if (!query) setIsSearchOpen(false);
              }}
            />
          ) : null}
          <MagnifyingGlassIcon
            className={\`size-5 cursor-pointer \${isSearchOpen ? "absolute left-2.5 text-white/50" : "text-white"}\`}
            onClick={() => setIsSearchOpen(true)}
          />
        </form>
`;

code = code.replace(oldSearchBlock, newSearchBlock.trim());

fs.writeFileSync(path, code);
