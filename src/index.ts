// src/index.ts

import * as readline from 'readline';
import {
  ensureBaseDir,
  listFiles,
  createFile,
  openFile,
  closeFile,
  deleteFile,
  renameFile,
  copyFile,
  changeFileAttributes,
  editFile, // <-- nova importação para edição de conteúdo
} from './fileManager';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Função que mostra o menu
function showMenu() {
  console.log('\n=== Gerenciador de Arquivos CLI ===');
  console.log('1. Listar arquivos');
  console.log('2. Criar novo arquivo');
  console.log('3. Abrir arquivo');
  console.log('4. Fechar arquivo');
  console.log('5. Deletar arquivo');
  console.log('6. Renomear arquivo');
  console.log('7. Copiar arquivo');
  console.log('8. Alterar atributos de arquivo');
  console.log('9. Editar conteúdo de arquivo'); // <-- nova opção
  console.log('0. Sair');
  rl.question('Escolha uma opção: ', handleMenu);
}

// Função que trata o que o usuário digitou
async function handleMenu(option: string) {
  switch (option.trim()) {
    case '1':
      await listFiles();
      showMenu();
      break;
    case '2':
      rl.question('Digite o nome do novo arquivo (ex: texto.txt): ', (fileName) => {
        rl.question('Digite o conteúdo do arquivo: ', async (content) => {
          await createFile(fileName, content);
          showMenu();
        });
      });
      break;
    case '3':
      rl.question('Digite o nome do arquivo para abrir: ', async (fileName) => {
        await openFile(fileName);
        showMenu();
      });
      break;
    case '4':
      rl.question('Digite o nome do arquivo para fechar: ', async (fileName) => {
        await closeFile(fileName);
        showMenu();
      });
      break;
    case '5':
      rl.question('Digite o nome do arquivo para deletar: ', async (fileName) => {
        await deleteFile(fileName);
        showMenu();
      });
      break;
    case '6':
      rl.question('Digite o nome do arquivo atual: ', (oldName) => {
        rl.question('Digite o novo nome para o arquivo: ', async (newName) => {
          await renameFile(oldName, newName);
          showMenu();
        });
      });
      break;
    case '7':
      rl.question('Digite o nome do arquivo de origem: ', (sourceName) => {
        rl.question('Digite o nome do novo arquivo de destino: ', async (destinationName) => {
          await copyFile(sourceName, destinationName);
          showMenu();
        });
      });
      break;
    case '8':
      rl.question('Digite o nome do arquivo: ', (fileName) => {
        rl.question('Deseja tornar somente leitura? (s/n): ', async (answer) => {
          const makeReadOnly = answer.trim().toLowerCase() === 's';
          await changeFileAttributes(fileName, makeReadOnly);
          showMenu();
        });
      });
      break;
    case '9':
      rl.question('Digite o nome do arquivo para editar: ', (fileName) => {
        rl.question('Digite o novo conteúdo do arquivo: ', async (newContent) => {
          await editFile(fileName, newContent);
          showMenu();
        });
      });
      break;
    case '0':
      console.log('Encerrando programa...');
      rl.close();
      process.exit(0);
    default:
      console.log('Opção inválida.');
      showMenu();
  }
}

// Função principal
async function main() {
  await ensureBaseDir();
  showMenu();
}

main();
