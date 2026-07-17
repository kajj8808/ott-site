import * as fs from 'fs';

const path = 'app/(tabs)/search/page.tsx';
let code = fs.readFileSync(path, 'utf8');

// Remove the inline import
code = code.replace(/import SearchInput from "@\/app\/components\/SearchInput";\n\n/g, '');

// Add the import to the top of the file
if (!code.includes('import SearchInput from "@/app/components/SearchInput";')) {
  code = code.replace(
    /import { authWithUserSession } from "@\/app\/lib\/server\/auth";/,
    `import { authWithUserSession } from "@/app/lib/server/auth";\nimport SearchInput from "@/app/components/SearchInput";`
  );
}

fs.writeFileSync(path, code);
