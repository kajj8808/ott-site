import * as fs from 'fs';

const fixFile = (path: string, type: 'series' | 'movies') => {
  let code = fs.readFileSync(path, 'utf8');
  
  const regex = new RegExp(`\\{${type}\\.total > ${type}\\.limit && \\(\\s*<div className="flex items-center justify-center gap-2 mt-8">([\\s\\S]*?)</div>\\s*\\)\\}`, 'g');
  
  code = code.replace(regex, (match, inner) => {
    return `<div className="flex items-center justify-center gap-2 mt-8">${inner}</div>`;
  });
  
  fs.writeFileSync(path, code);
};

fixFile('app/(tabs)/series/page.tsx', 'series');
fixFile('app/(tabs)/movies/page.tsx', 'movies');
