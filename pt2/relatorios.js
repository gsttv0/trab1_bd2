const { Person } = require('./models');
const { fn, col, Op, where } = require('sequelize');

async function gerarRelatorios() {
  // Relatorio 1: Contagem por Profissao (Agregacao Simples)
  const porProfissao = await Person.findAll({
    attributes: ['jobTitle', [fn('COUNT', col('index')), 'total']],
    group: ['jobTitle'],
    limit: 10,
    order: [[fn('COUNT', col('index')), 'DESC']],
    raw: true // Essencial para performance e dados planos
  });

  console.log('\n--- TOP 10 PROFISSOES ---');
  console.table(porProfissao);

  // Relatorio 2: Profissoes com mais de 500 pessoas (Uso de HAVING)
  const elite = await Person.findAll({
    attributes: ['jobTitle', [fn('COUNT', col('index')), 'total']],
    group: ['jobTitle'],
    having: where(fn('COUNT', col('index')), { [Op.gt]: 500 }),
    raw: true
  });

  console.log('\n--- PROFISSOES COM MAIS DE 500 PESSOAS (HAVING) ---');
  console.table(elite);
}

module.exports = { gerarRelatorios };