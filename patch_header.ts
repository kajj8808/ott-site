import * as fs from 'fs';

const headerPath = 'app/components/Header.tsx';
let code = fs.readFileSync(headerPath, 'utf8');

// Replace the states and handleSearch
code = code.replace(
  /  const \[query, setQuery\] = useState\(""\);\n  const \[isSearchOpen, setIsSearchOpen\] = useState\(false\);\n\n  const handleSearch = \([\s\S]*?};\n\n/m,
  ''
);

// Remove framer-motion import
code = code.replace(
  /import { motion } from "motion\/react";\n/m,
  ''
);

// Remove useState import if it's not used elsewhere
code = code.replace(
  /import { useState } from "react";\n/m,
  ''
);

// Replace the search UI
const searchUIRegex = /{isSearchOpen \? \([\s\S]*?\) : \([\s\S]*?\)}/m;
code = code.replace(
  searchUIRegex,
  `<Link href="/search" className="flex h-8.5 items-center">
          <MagnifyingGlassIcon className="size-5 cursor-pointer transition-colors hover:text-white/75" />
        </Link>`
);

fs.writeFileSync(headerPath, code);
