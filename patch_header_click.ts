import * as fs from 'fs';

const path = 'app/components/Header.tsx';
let code = fs.readFileSync(path, 'utf8');

const regex = /<motion\.form[\s\S]*?<\/motion\.form>/;

const newBlock = `<motion.form
          onSubmit={handleSearch}
          initial={false}
          animate={{
            width: isSearchOpen ? "16rem" : "1.25rem",
          }}
          transition={{ type: "spring", bounce: 0, duration: 0.3 }}
          className="relative flex items-center h-8.5 overflow-hidden rounded-2xl cursor-pointer"
          onClick={() => {
            if (!isSearchOpen) setIsSearchOpen(true);
          }}
        >
          <div className="absolute left-0 flex h-full items-center pl-1 pointer-events-none z-10">
            <MagnifyingGlassIcon
              className="size-5 text-white flex-shrink-0"
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
            style={{
              pointerEvents: isSearchOpen ? "auto" : "none",
            }}
            autoFocus={isSearchOpen}
            onBlur={() => {
              if (!query) setIsSearchOpen(false);
            }}
          />
        </motion.form>`;

code = code.replace(regex, newBlock);
fs.writeFileSync(path, code);
