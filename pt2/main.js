const readline = require('readline-sync');
const { rodarMigracao } = require('./migracao');
const { gerarRelatorios } = require('./relatorios');

async function menu() {
  let sair = false;
  while (!sair) {
    console.log('\n=== TRABALHO 2: ETL E AGREGACOES ===');
    console.log('1. Executar Migracao (CSV para Banco)');
    console.log('2. Gerar Relatorios de Agregacao');
    console.log('0. Sair');

    const op = readline.questionInt('Escolha: ');
    if (op === 1) await rodarMigracao();
    else if (op === 2) await gerarRelatorios();
    else if (op === 0) process.exit();
  }
}

menu();