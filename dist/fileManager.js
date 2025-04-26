"use strict";
// src/fileManager.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureBaseDir = ensureBaseDir;
exports.createFile = createFile;
exports.listFiles = listFiles;
exports.openFile = openFile;
exports.closeFile = closeFile;
exports.deleteFile = deleteFile;
exports.renameFile = renameFile;
exports.copyFile = copyFile;
exports.changeFileAttributes = changeFileAttributes;
exports.editFile = editFile;
// Importações e variáveis que você já tem aqui em cima
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const fileLock_1 = require("./fileLock");
const baseDir = path.join(__dirname, '..', 'arquivos');
// Garante que a pasta base exista
async function ensureBaseDir() {
    try {
        await fs.mkdir(baseDir);
    }
    catch (error) {
        if (error.code !== 'EEXIST') {
            throw error;
        }
    }
}
// 📁 Função para criar um novo arquivo
async function createFile(fileName, content) {
    const filePath = path.join(baseDir, fileName);
    try {
        // Verifica se o arquivo já existe
        await fs.access(filePath);
        console.log('Arquivo já existe.');
    }
    catch {
        // Arquivo não existe, podemos criar
        await fs.writeFile(filePath, content);
        console.log(`Arquivo "${fileName}" criado com sucesso!`);
    }
}
// Lista arquivos no diretório base
async function listFiles() {
    const files = await fs.readdir(baseDir);
    if (files.length === 0) {
        console.log('Nenhum arquivo encontrado.');
    }
    else {
        console.log('Arquivos disponíveis:');
        files.forEach((file) => console.log('- ' + file));
    }
}
// 📄 Função para abrir e exibir o conteúdo de um arquivo
async function openFile(fileName) {
    const filePath = path.join(baseDir, fileName);
    try {
        // Verifica se o arquivo existe
        await fs.access(filePath);
        // Verifica se o arquivo já está "travado"
        if ((0, fileLock_1.isFileLocked)(fileName)) {
            console.log('O arquivo já está aberto em outro processo.');
            return;
        }
        // Lê o conteúdo
        const content = await fs.readFile(filePath, 'utf-8');
        // Bloqueia o arquivo para simular "arquivo em uso"
        (0, fileLock_1.lockFile)(fileName);
        console.log(`\n=== Conteúdo do arquivo "${fileName}" ===`);
        console.log(content);
        console.log('========================================');
    }
    catch (error) {
        console.log('Arquivo não encontrado.');
    }
}
// 🛑 Função para fechar (desbloquear) um arquivo
async function closeFile(fileName) {
    const filePath = path.join(baseDir, fileName);
    try {
        // Verifica se o arquivo existe
        await fs.access(filePath);
        // Verifica se o arquivo está bloqueado
        if (!(0, fileLock_1.isFileLocked)(fileName)) {
            console.log('O arquivo não está aberto.');
            return;
        }
        // Desbloqueia o arquivo
        (0, fileLock_1.unlockFile)(fileName);
        console.log(`Arquivo "${fileName}" foi fechado com sucesso.`);
    }
    catch (error) {
        console.log('Arquivo não encontrado.');
    }
}
// 🗑️ Função para deletar um arquivo
async function deleteFile(fileName) {
    const filePath = path.join(baseDir, fileName);
    try {
        // Verifica se o arquivo existe
        await fs.access(filePath);
        // Verifica se o arquivo está travado
        if ((0, fileLock_1.isFileLocked)(fileName)) {
            console.log('Não é possível deletar o arquivo. Ele está aberto.');
            return;
        }
        // Deleta o arquivo
        await fs.unlink(filePath);
        console.log(`Arquivo "${fileName}" deletado com sucesso.`);
    }
    catch (error) {
        console.log('Arquivo não encontrado.');
    }
}
// ✏️ Função para renomear um arquivo
async function renameFile(oldName, newName) {
    const oldPath = path.join(baseDir, oldName);
    const newPath = path.join(baseDir, newName);
    try {
        // Verifica se o arquivo antigo existe
        await fs.access(oldPath);
        // Verifica se o arquivo está aberto
        if ((0, fileLock_1.isFileLocked)(oldName)) {
            console.log('Não é possível renomear. O arquivo está aberto.');
            return;
        }
        // Verifica se o arquivo está como somente leitura
        const stats = await fs.stat(oldPath);
        if (!(stats.mode & 0o200)) { // Verifica se não tem permissão de escrita
            console.log('Não é possível renomear. O arquivo está como somente leitura.');
            return;
        }
        // Faz a renomeação
        await fs.rename(oldPath, newPath);
        console.log(`Arquivo "${oldName}" renomeado para "${newName}".`);
    }
    catch (error) {
        console.log('Arquivo não encontrado ou erro ao renomear.');
    }
}
// 📄 Função para copiar um arquivo
async function copyFile(sourceName, destinationName) {
    const sourcePath = path.join(baseDir, sourceName);
    const destinationPath = path.join(baseDir, destinationName);
    try {
        // Verifica se o arquivo de origem existe
        await fs.access(sourcePath);
        // Não deixa copiar um arquivo aberto
        if ((0, fileLock_1.isFileLocked)(sourceName)) {
            console.log('Não é possível copiar. O arquivo está aberto.');
            return;
        }
        // Faz a cópia
        await fs.copyFile(sourcePath, destinationPath);
        console.log(`Arquivo "${sourceName}" copiado para "${destinationName}".`);
    }
    catch (error) {
        console.log('Arquivo de origem não encontrado ou erro ao copiar.');
    }
}
// 🛡️ Função para alterar atributos de um arquivo
async function changeFileAttributes(fileName, makeReadOnly) {
    const filePath = path.join(baseDir, fileName);
    try {
        // Verifica se o arquivo existe
        await fs.access(filePath);
        // Se o arquivo estiver aberto, não deixa alterar atributos
        if ((0, fileLock_1.isFileLocked)(fileName)) {
            console.log('Não é possível alterar atributos. O arquivo está aberto.');
            return;
        }
        if (makeReadOnly) {
            // Modo 0o444 => somente leitura (r--r--r--)
            await fs.chmod(filePath, 0o444);
            console.log(`Arquivo "${fileName}" agora está como somente leitura.`);
        }
        else {
            // Modo 0o666 => leitura e escrita (rw-rw-rw-)
            await fs.chmod(filePath, 0o666);
            console.log(`Arquivo "${fileName}" agora está como leitura e escrita.`);
        }
    }
    catch (error) {
        console.log('Arquivo não encontrado ou erro ao alterar atributos.');
    }
}
// ✏️ Função para editar o conteúdo de um arquivo
async function editFile(fileName, newContent) {
    const filePath = path.join(baseDir, fileName);
    try {
        // Verifica se o arquivo existe
        await fs.access(filePath);
        // Verifica se o arquivo está aberto
        if ((0, fileLock_1.isFileLocked)(fileName)) {
            console.log('Não é possível editar. O arquivo está aberto.');
            return;
        }
        // Verifica se o arquivo está como somente leitura
        const stats = await fs.stat(filePath);
        if (!(stats.mode & 0o200)) {
            console.log('Não é possível editar. O arquivo está como somente leitura.');
            return;
        }
        // Escreve o novo conteúdo
        await fs.writeFile(filePath, newContent, 'utf-8');
        console.log(`Arquivo "${fileName}" editado com sucesso.`);
    }
    catch (error) {
        console.log('Arquivo não encontrado ou erro ao editar.');
    }
}
