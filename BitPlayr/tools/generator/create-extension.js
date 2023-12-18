#!/usr/bin/env node

import inquirer from 'inquirer';
import fs from 'fs-extra';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

function validateExtensionName(input) {
  if (!input.match(/^[a-z]+(-[a-z]+)*$/)) {
    return 'The extension name must be in kebab-case.';
  }
  return true;
}

function toPascalCase(str) {
  return str.replace(/(^\w|-\w)/g, clearAndUpper);
}

function clearAndUpper(text) {
  return text.replace(/-/, "").toUpperCase();
}

function getDirname(url) {
  return dirname(fileURLToPath(url));
}

async function createExtension() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Enter the name of the extension (in kebab-case):',
      validate: validateExtensionName,
    }
  ]);

  const folderName = answers.name;
  const className = `${toPascalCase(folderName)}Extension`;
  const interfaceName = `I${toPascalCase(folderName)}`;

  const __dirname = getDirname(import.meta.url);
  const targetDir = path.join(__dirname, '../../src/extensions', folderName);
  const interfacesDir = path.join(targetDir, 'interfaces');

  fs.ensureDirSync(targetDir);
  fs.ensureDirSync(interfacesDir);

  const mainClassContent = `import { BasePlayer } from '../../player/base/base-player';\n` +
    `import { TimeUpdateEvent } from '../../player/common/common';\n` +
    `import { IPlayerExtension } from '../interfaces/common';\n\n` +
    `export class ${className} implements IPlayerExtension {\n` +
    `  apply(player: BasePlayer) {\n` +
    `    player.on('timeupdate', this.handleTimeUpdate);\n` +
    `  }\n\n` +
    `  handleTimeUpdate(event: TimeUpdateEvent) {\n` +
    `    console.log('${className}: ', event);\n` +
    `  }\n` +
    `}`;
  fs.writeFileSync(path.join(targetDir, `${folderName}.ts`), mainClassContent);

  const interfaceContent = `export interface ${interfaceName} {\n\n}`;
  fs.writeFileSync(path.join(interfacesDir, `${interfaceName}.ts`), interfaceContent);

  const readmeContent = `# ${className}\n\n` +
    `## Using Extension\n` +
    `To use this extension make sure you add it to the extensions array in the playerConfig options.\n\n` +
    `\`\`\`\n` +
    `const playerConfig = {\n` +
    `  extensions: [new ${className}()],\n` +
    `};\n\n` +
    `bitPlayrRef.current = await BitPlayr.createPlayer(videoElementId, playerConfig, device);\n` +
    `\`\`\`\n\n` +
    `You will also need to export it via index.ts to make it available via the bitplayr api.\n` +
    `\`\`\`\n` +
    `export { ${className} } from './extensions/${folderName}/${folderName}';\n` +
    `\`\`\`\n\n` +
    `## Description\n` +
    `This is the ${className} extension.\n\n` +
    `## API Documentation\n` +
    `Detailed API documentation for ${className}.\n`;
  fs.writeFileSync(path.join(targetDir, `README.md`), readmeContent);

  console.log(`${className} extension generated successfully.`);
}

createExtension();
