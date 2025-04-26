// src/fileManager.ts

import * as fs from 'fs/promises';
import * as path from 'path';
import { isFileLocked, lockFile, unlockFile } from './fileLock';

const baseDir = path.join(__dirname, '..', 'arquivos');

// 🏠 Garante que a pasta base exista
export async function ensureBaseDir() {
  try {
    await fs.mkdir(baseDir);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
      throw error;
    }
  }
}

// 📁 Cria um novo arquivo
export async function createFile(fileName: string, content: string) {
  const filePath = path.join(baseDir, fileName);

  try {
    await fs.access(filePath);
    console.log('Arquivo já existe.');
  } catch {
    await fs.writeFile(filePath, content);
    console.log(`Arquivo "${fileName}" criado com sucesso!`);
  }
}

// 📋 Lista todos os arquivos no diretório base
export async function listFiles() {
  const files = await fs.readdir(baseDir);
  if (files.length === 0) {
    console.log('Nenhum arquivo encontrado.');
  } else {
    console.log('Arquivos disponíveis:');
    files.forEach((file) => console.log('- ' + file));
  }
}

// 📖 Abre (lê) um arquivo
export async function openFile(fileName: string) {
  const filePath = path.join(baseDir, fileName);

  try {
    await fs.access(filePath);

    if (isFileLocked(fileName)) {
      console.log('O arquivo já está aberto em outro processo.');
      return;
    }

    const content = await fs.readFile(filePath, 'utf-8');
    lockFile(fileName);

    console.log(`\n=== Conteúdo do arquivo "${fileName}" ===`);
    console.log(content);
    console.log('========================================');
  } catch (error) {
    console.log('Arquivo não encontrado.');
  }
}

// 🛑 Fecha (desbloqueia) um arquivo
export async function closeFile(fileName: string) {
  const filePath = path.join(baseDir, fileName);

  try {
    await fs.access(filePath);

    if (!isFileLocked(fileName)) {
      console.log('O arquivo não está aberto.');
      return;
    }

    unlockFile(fileName);
    console.log(`Arquivo "${fileName}" foi fechado com sucesso.`);
  } catch (error) {
    console.log('Arquivo não encontrado.');
  }
}

// 🗑️ Deleta um arquivo
export async function deleteFile(fileName: string) {
  const filePath = path.join(baseDir, fileName);

  try {
    await fs.access(filePath);

    if (isFileLocked(fileName)) {
      console.log('Não é possível deletar. O arquivo está aberto.');
      return;
    }

    await fs.unlink(filePath);
    console.log(`Arquivo "${fileName}" deletado com sucesso.`);
  } catch (error) {
    console.log('Arquivo não encontrado.');
  }
}

// ✏️ Renomeia um arquivo
export async function renameFile(oldName: string, newName: string) {
  const oldPath = path.join(baseDir, oldName);
  const newPath = path.join(baseDir, newName);

  try {
    await fs.access(oldPath);

    if (isFileLocked(oldName)) {
      console.log('Não é possível renomear. O arquivo está aberto.');
      return;
    }

    const stats = await fs.stat(oldPath);
    if (!(stats.mode & 0o200)) {
      console.log('Não é possível renomear. O arquivo está como somente leitura.');
      return;
    }

    await fs.rename(oldPath, newPath);
    console.log(`Arquivo "${oldName}" renomeado para "${newName}".`);
  } catch (error) {
    console.log('Arquivo não encontrado ou erro ao renomear.');
  }
}

// 📄 Copia um arquivo
export async function copyFile(sourceName: string, destinationName: string) {
  const sourcePath = path.join(baseDir, sourceName);
  const destinationPath = path.join(baseDir, destinationName);

  try {
    await fs.access(sourcePath);

    if (isFileLocked(sourceName)) {
      console.log('Não é possível copiar. O arquivo está aberto.');
      return;
    }

    await fs.copyFile(sourcePath, destinationPath);
    console.log(`Arquivo "${sourceName}" copiado para "${destinationName}".`);
  } catch (error) {
    console.log('Arquivo de origem não encontrado ou erro ao copiar.');
  }
}

// 🔒 Altera atributos do arquivo (Somente leitura ↔ Editável)
export async function changeFileAttributes(fileName: string, makeReadOnly: boolean) {
  const filePath = path.join(baseDir, fileName);

  try {
    await fs.access(filePath);

    if (isFileLocked(fileName)) {
      console.log('Não é possível alterar atributos. O arquivo está aberto.');
      return;
    }

    if (makeReadOnly) {
      await fs.chmod(filePath, 0o444); // Somente leitura
      console.log(`Arquivo "${fileName}" agora está como somente leitura.`);
    } else {
      await fs.chmod(filePath, 0o644); // Leitura e escrita para o dono
      console.log(`Arquivo "${fileName}" agora está como leitura e escrita.`);
    }
  } catch (error) {
    console.log('Arquivo não encontrado ou erro ao alterar atributos.');
  }
}

// 📝 Edita o conteúdo de um arquivo
export async function editFile(fileName: string, newContent: string) {
  const filePath = path.join(baseDir, fileName);

  try {
    await fs.access(filePath);

    if (isFileLocked(fileName)) {
      console.log('Não é possível editar. O arquivo está aberto.');
      return;
    }

    const stats = await fs.stat(filePath);
    if (!(stats.mode & 0o200)) {
      console.log('Não é possível editar. O arquivo está como somente leitura.');
      return;
    }

    await fs.writeFile(filePath, newContent, 'utf-8');
    console.log(`Arquivo "${fileName}" editado com sucesso.`);
  } catch (error) {
    console.log('Arquivo não encontrado ou erro ao editar.');
  }
}
