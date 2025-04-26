// src/fileLock.ts

// Lista para armazenar os arquivos que estão em uso
const openFiles = new Set<string>();

// Marca um arquivo como "aberto"
export function lockFile(fileName: string) {
  openFiles.add(fileName);
}

// Remove um arquivo da lista de abertos
export function unlockFile(fileName: string) {
  openFiles.delete(fileName);
}

// Verifica se o arquivo está em uso
export function isFileLocked(fileName: string): boolean {
  return openFiles.has(fileName);
}
