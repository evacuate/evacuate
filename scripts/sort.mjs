import fs from 'node:fs';
import path from 'node:path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Path of package.json
const packageJsonPath = path.resolve(__dirname, '../package.json');

// Read package.json
fs.readFile(packageJsonPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading package.json:', err);
    return;
  }

  let packageJson;
  try {
    packageJson = JSON.parse(data);
  } catch (parseErr) {
    console.error('Error parsing package.json:', parseErr);
    return;
  }

  // Define custom sorting for devDependencies
  function customSortDependencies(dependencies) {
    if (!dependencies || typeof dependencies !== 'object') return dependencies;

    return Object.keys(dependencies)
      .sort((a, b) => {
        const aIsScoped = a.startsWith('@');
        const bIsScoped = b.startsWith('@');

        if (aIsScoped && !bIsScoped) return -1;
        if (!aIsScoped && bIsScoped) return 1;
        return a.localeCompare(b);
      })
      .reduce((acc, key) => {
        acc[key] = dependencies[key];
        return acc;
      }, {});
  }

  // Sort object keys based on the default order
  function sortObjectKeys(obj, sortOrder) {
    if (typeof obj === 'object' && !Array.isArray(obj) && obj !== null) {
      const sortedObj = {};
      const keys = Object.keys(obj);
      const privateKeys = keys.filter((key) => key.startsWith('_'));
      const publicKeys = keys.filter((key) => !key.startsWith('_'));
      const sortedKeys = [
        ...sortOrder,
        ...publicKeys.sort(),
        ...privateKeys.sort(),
      ];
      for (const key of sortedKeys) {
        if (key === 'devDependencies' || key === 'dependencies') {
          sortedObj[key] = customSortDependencies(obj[key]);
        } else {
          sortedObj[key] = sortObjectKeys(obj[key], sortOrder);
        }
      }
      return sortedObj;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => sortObjectKeys(item, sortOrder));
    }

    return obj;
  }

  const defaultSortOrder = [
    '$schema',
    'name',
    'displayName',
    'version',
    'private',
    'description',
    'categories',
    'keywords',
    'homepage',
    'bugs',
    'repository',
    'funding',
    'license',
    'qna',
    'author',
    'maintainers',
    'contributors',
    'publisher',
    'sideEffects',
    'type',
    'imports',
    'exports',
    'main',
    'svelte',
    'umd:main',
    'jsdelivr',
    'unpkg',
    'module',
    'source',
    'jsnext:main',
    'browser',
    'react-native',
    'types',
    'typesVersions',
    'typings',
    'style',
    'example',
    'examplestyle',
    'assets',
    'bin',
    'man',
    'directories',
    'files',
    'workspaces',
    'binary',
    'scripts',
    'betterScripts',
    'contributes',
    'activationEvents',
    'husky',
    'simple-git-hooks',
    'pre-commit',
    'commitlint',
    'lint-staged',
    'nano-staged',
    'config',
    'nodemonConfig',
    'browserify',
    'babel',
    'browserslist',
    'xo',
    'prettier',
    'eslintConfig',
    'eslintIgnore',
    'npmpkgjsonlint',
    'npmPackageJsonLintConfig',
    'npmpackagejsonlint',
    'release',
    'remarkConfig',
    'stylelint',
    'ava',
    'jest',
    'jest-junit',
    'jest-stare',
    'mocha',
    'nyc',
    'c8',
    'tap',
    'oclif',
    'resolutions',
    'dependencies',
    'devDependencies',
    'dependenciesMeta',
    'peerDependencies',
    'peerDependenciesMeta',
    'optionalDependencies',
    'bundledDependencies',
    'bundleDependencies',
    'extensionPack',
    'extensionDependencies',
    'flat',
    'packageManager',
    'engines',
    'engineStrict',
    'volta',
    'languageName',
    'os',
    'cpu',
    'preferGlobal',
    'publishConfig',
    'icon',
    'badges',
    'galleryBanner',
    'preview',
    'markdown',
    'pnpm',
  ];

  // Apply sorting
  const sortedPackageJson = sortObjectKeys(packageJson, defaultSortOrder);

  // Stringify JSON with 2-space indentation
  let jsonString = JSON.stringify(sortedPackageJson, null, 2);

  // Modify "keywords" and "files" to be single-line
  const arrayProperties = ['keywords', 'files'];
  for (const property of arrayProperties) {
    const regex = new RegExp(
      `("${property}":\\s*)\\[\\s*\\n([\\s\\S]*?)\\s*\\]`,
    );
    jsonString = jsonString.replace(regex, (_, p1, p2) => {
      // Split the array items into individual lines, trim them, and join with ', '
      const items = p2
        .split('\n')
        .map((line) => line.trim().replace(/,$/, ''))
        .filter((line) => line.length > 0)
        .join(', ');
      return `${p1}[${items}]`;
    });
  }

  // Write sorted content with a trailing newline
  fs.writeFile(
    packageJsonPath,
    `${jsonString}\n`, // Add a newline at the end
    (writeErr) => {
      if (writeErr) {
        console.error('Error writing package.json:', writeErr);
      } else {
        console.log('package.json has been sorted.');
      }
    },
  );
});
