"use strict";
// src/index.ts
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
const readline = __importStar(require("readline"));
const fileManager_1 = require("./fileManager");
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
async function handleMenu(option) {
    switch (option.trim()) {
        case '1':
            await (0, fileManager_1.listFiles)();
            showMenu();
            break;
        case '2':
            rl.question('Digite o nome do novo arquivo (ex: texto.txt): ', (fileName) => {
                rl.question('Digite o conteúdo do arquivo: ', async (content) => {
                    await (0, fileManager_1.createFile)(fileName, content);
                    showMenu();
                });
            });
            break;
        case '3':
            rl.question('Digite o nome do arquivo para abrir: ', async (fileName) => {
                await (0, fileManager_1.openFile)(fileName);
                showMenu();
            });
            break;
        case '4':
            rl.question('Digite o nome do arquivo para fechar: ', async (fileName) => {
                await (0, fileManager_1.closeFile)(fileName);
                showMenu();
            });
            break;
        case '5':
            rl.question('Digite o nome do arquivo para deletar: ', async (fileName) => {
                await (0, fileManager_1.deleteFile)(fileName);
                showMenu();
            });
            break;
        case '6':
            rl.question('Digite o nome do arquivo atual: ', (oldName) => {
                rl.question('Digite o novo nome para o arquivo: ', async (newName) => {
                    await (0, fileManager_1.renameFile)(oldName, newName);
                    showMenu();
                });
            });
            break;
        case '7':
            rl.question('Digite o nome do arquivo de origem: ', (sourceName) => {
                rl.question('Digite o nome do novo arquivo de destino: ', async (destinationName) => {
                    await (0, fileManager_1.copyFile)(sourceName, destinationName);
                    showMenu();
                });
            });
            break;
        case '8':
            rl.question('Digite o nome do arquivo: ', (fileName) => {
                rl.question('Deseja tornar somente leitura? (s/n): ', async (answer) => {
                    const makeReadOnly = answer.trim().toLowerCase() === 's';
                    await (0, fileManager_1.changeFileAttributes)(fileName, makeReadOnly);
                    showMenu();
                });
            });
            break;
        case '9':
            rl.question('Digite o nome do arquivo para editar: ', (fileName) => {
                rl.question('Digite o novo conteúdo do arquivo: ', async (newContent) => {
                    await (0, fileManager_1.editFile)(fileName, newContent);
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
    await (0, fileManager_1.ensureBaseDir)();
    showMenu();
}
main();
