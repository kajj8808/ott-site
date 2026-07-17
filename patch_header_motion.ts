import * as fs from 'fs';

const path = 'app/components/Header.tsx';
let code = fs.readFileSync(path, 'utf8');

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
        <motion.form
          onSubmit={handleSearch}
          initial={false}
          animate={{
            width: isSearchOpen ? "16rem" : "1.25rem",
          }}
          transition={{ type: "spring", bounce: 0, duration: 0.3 }}
          className="relative flex items-center h-8.5 overflow-hidden rounded-2xl"
        >
          <div className="absolute left-0 flex h-full items-center pl-1">
            <MagnifyingGlassIcon
              className="size-5 cursor-pointer text-white flex-shrink-0"
              onClick={() => {
                if (!isSearchOpen) setIsSearchOpen(true);
              }}
            />
          </div>
          
          <motion.input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search"
            className="bg-background/70 w-full h-full rounded-2xl border border-white/15 py-1.5 pl-8 pr-3 text-sm outline-none placeholder:text-white/40 focus:border-white/40"
            initial={false}
            animate={{
              opacity: isSearchOpen ? 1 : 0,
            }}
            transition={{ duration: 0.2 }}
            autoFocus={isSearchOpen}
            onBlur={() => {
              if (!query) setIsSearchOpen(false);
            }}
          />
        </motion.form>
`;

code = code.replace(oldSearchBlock, newSearchBlock.trim());
fs.writeFileSync(path, code);
