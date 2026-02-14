import { copyFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const docsDir = join(process.cwd(), '../../docs');

// Copy index.html to 404.html for SPA routing
copyFileSync(join(docsDir, 'index.html'), join(docsDir, '404.html'));
console.log('✓ Created docs/404.html for SPA routing');

// Create .nojekyll to prevent Jekyll processing
writeFileSync(join(docsDir, '.nojekyll'), '');
console.log('✓ Created docs/.nojekyll to disable Jekyll');

console.log('✓ GitHub Pages build complete!');
