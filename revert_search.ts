import * as fs from 'fs';

// Remove SearchInput from search page
const searchPath = 'app/(tabs)/search/page.tsx';
let searchCode = fs.readFileSync(searchPath, 'utf8');

searchCode = searchCode.replace(/import SearchInput from "@\/app\/components\/SearchInput";\n/, '');
searchCode = searchCode.replace(/<SearchInput \/>\n/g, '');

fs.writeFileSync(searchPath, searchCode);
