#!/usr/bin/env node

import inquirer from 'inquirer';
import fs from 'fs-extra';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

// Function to validate the extension name
function validateAndFormatExtensionName(input) {
  if (!input.endsWith('Extension')) {
    return 'The extension name must end with "Extension".';
  }
  if (!/^[A-Z][A-Za-z]*Extension$/.test(input)) {
    return 'The extension name must be in CamelCase and end with "Extension".';
  }
  return true;
}

function getDirname(url) {
  return dirname(fileURLToPath(url));
}

async function createExtension() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Enter the name of the extension:',
      validate: validateAndFormatExtensionName,
    }
  ]);

  const extensionName = answers.name;
  const formattedName = extensionName.charAt(0).toLowerCase() + extensionName.slice(1, -9);
  const interfaceName = `I${extensionName.slice(0, -9)}`;

  const __dirname = getDirname(import.meta.url);
  const targetDir = path.join(__dirname, '../../src/extensions', formattedName);
  const interfacesDir = path.join(targetDir, 'interfaces');

  // Create directories
  fs.ensureDirSync(targetDir);
  fs.ensureDirSync(interfacesDir);

  // Create main class file
  const mainClassContent = `import { Player } from '../../core/basePlayer';\n` +
    `import { TimeUpdateEvent } from '../../players/interfaces/IPlayers';\n` +
    `import { IPlayerExtension } from '../interfaces/ICommon';\n\n` +
    `export class ${extensionName} implements IPlayerExtension {\n` +
    `  apply(player: Player) {\n` +
    `    player.on('timeupdate', this.handleTimeUpdate);\n` +
    `  }\n\n` +
    `  handleTimeUpdate(event: TimeUpdateEvent) {\n` +
    `    console.log(event);\n` +
    `  }\n` +
    `}`;
  fs.writeFileSync(path.join(targetDir, `${formattedName}.ts`), mainClassContent);

  // Create interface file
  const interfaceContent = `export interface ${interfaceName} {\n\n}`;
  fs.writeFileSync(path.join(interfacesDir, `${interfaceName}.ts`), interfaceContent);

  // Create README.md file
  const readmeContent = `# ${extensionName}\n\n` +
    `## Description\n` +
    `This is the ${extensionName} extension.\n\n` +
    `## API Documentation\n` +
    `Detailed API documentation for ${extensionName}.\n`;
  fs.writeFileSync(path.join(targetDir, `README.md`), readmeContent);

  console.log(`${extensionName} extension generated successfully.`);
}

createExtension();
