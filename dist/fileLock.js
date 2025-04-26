"use strict";
// src/fileLock.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.lockFile = lockFile;
exports.unlockFile = unlockFile;
exports.isFileLocked = isFileLocked;
// Lista para armazenar os arquivos que estão em uso
const openFiles = new Set();
// Marca um arquivo como "aberto"
function lockFile(fileName) {
    openFiles.add(fileName);
}
// Remove um arquivo da lista de abertos
function unlockFile(fileName) {
    openFiles.delete(fileName);
}
// Verifica se o arquivo está em uso
function isFileLocked(fileName) {
    return openFiles.has(fileName);
}
