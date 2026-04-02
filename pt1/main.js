const readline = require('readline-sync');
const { listarEntidades } = require('./listagem');
const { inserirDados } = require('./insercao');

async function main() {
  let sair = false;
  while (!sair) {
    console.log('\n=======================================');
    console.log('      SAKILA ORM - TRABALHO 1');
    console.log('=======================================');
    console.log('1. Ver 5 Alugueis Mais Recentes');
    console.log('2. Resumo de Filmes (Estoque)');
    console.log('3. Resumo de Clientes (Atividade)');
    console.log('4. Inserir/Adicionar Dados');
    console.log('0. Sair');
    
    const op = readline.questionInt('\nOpcao: ');

    switch (op) {
      case 1: await listarEntidades('rental'); break;
      case 2: await listarEntidades('film'); break;
      case 3: await listarEntidades('customer'); break;
      case 4: await inserirDados(); break;
      case 0: sair = true; process.exit(); break;
      default: console.log('Opcao invalida.');
    }
  }
}

main();