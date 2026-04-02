const fs = require('fs');
const csv = require('csv-parser');
const { Person } = require('./models');
const sequelize = require('./database');

async function rodarMigracao() {
  const listaParaInserir = [];
  console.log('--- INICIANDO PROCESSO DE ETL ---');
  
  // Limpa a tabela para começar do zero
  await sequelize.sync({ force: true }); 
  console.log('Passo 1: Tabela preparada no MySQL.');

  return new Promise((resolve, reject) => {
    fs.createReadStream('people-100000.csv')
      .pipe(csv({
        separator: ',', 
        quote: '', // Desativa o tratamento de aspas automático que estava bugando
        mapHeaders: ({ header }) => header.replace(/['"]+/g, '').trim() // Limpa as aspas do cabeçalho
      }))
      .on('data', (row) => {
        // Criamos um objeto limpando as aspas de todos os valores da linha
        const cleanRow = {};
        Object.keys(row).forEach(key => {
          const cleanKey = key.replace(/['"]+/g, '').trim();
          // Remove aspas do valor e espaços em branco
          cleanRow[cleanKey] = row[key] ? row[key].replace(/['"]+/g, '').trim() : '';
        });

        // Agora o 'index' deve ser encontrado corretamente
        const idx = cleanRow['Index'] || cleanRow['index'];

        if (idx && idx !== 'Index') { // Garante que não é o cabeçalho repetido
          listaParaInserir.push({
            index: idx,
            userId: cleanRow['User Id'],
            firstName: cleanRow['First Name'],
            lastName: cleanRow['Last Name'],
            sex: cleanRow['Sex'],
            email: cleanRow['Email'],
            phone: cleanRow['Phone'],
            dateOfBirth: cleanRow['Date of birth'],
            jobTitle: cleanRow['Job Title']
          });
        }
      })
      .on('end', async () => {
        console.log(`Passo 2: ${listaParaInserir.length} registros prontos para carga.`);
        
        if (listaParaInserir.length === 0) {
          console.error('ERRO: O sistema ainda não conseguiu ler as linhas. Verifique se o arquivo está na pasta correta.');
          return resolve();
        }

        try {
          console.log('Passo 3: Enviando dados ao banco (Bulk Insert)...');
          // Inserção em lotes para performance
          await Person.bulkCreate(listaParaInserir, { 
            chunkSize: 5000, 
            logging: false 
          });

          console.log(`--- SUCESSO: ${listaParaInserir.length} registros migrados! ---`);
          resolve();
        } catch (err) {
          console.error('Erro na persistência:', err.message);
          reject(err);
        }
      })
      .on('error', (err) => {
        console.error('Erro na leitura do arquivo:', err.message);
        reject(err);
      });
  });
}

module.exports = { rodarMigracao };