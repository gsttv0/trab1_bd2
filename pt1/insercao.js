const readline = require('readline-sync');
const { Film, Inventory, Customer, Rental } = require('./models');

async function inserirDados() {
  console.log('\n--- INSERCAO DE DADOS (PARAMETROS VIA TECLADO) ---');
  console.log('1. Adicionar Quantidade ao Estoque (Film/Inventory)');
  console.log('2. Novo Cliente (Customer)');
  console.log('3. Novo Aluguel (Rental)');
  
  const escolha = readline.questionInt('Escolha: ');

  try {
    if (escolha === 1) {
      const idFilme = readline.questionInt('Digite o ID do Filme existente: ');
      const filme = await Film.findByPk(idFilme);
      
      if (filme) {
        const qtd = readline.questionInt('Quantidade a adicionar: ');
        for (let i = 0; i < qtd; i++) {
          await Inventory.create({ 
            filmId: idFilme, 
            storeId: 1 
          });
        }
        console.log('Sucesso: ' + qtd + ' copias adicionadas ao filme ' + filme.title);
      } else {
        console.log('Erro: Filme nao encontrado.');
      }

    } else if (escolha === 2) {
      const nome = readline.question('Nome: ');
      const sobrenome = readline.question('Sobrenome: ');
      
      const c = await Customer.create({ 
        firstName: nome.toUpperCase(), 
        lastName: sobrenome.toUpperCase(),
        addressId: 1, 
        storeId: 1 
      });
      console.log('Cliente criado com ID: ' + c.customerId);

    } else if (escolha === 3) {
      const idCli = readline.questionInt('ID do Cliente: ');
      const idInv = readline.questionInt('ID do Inventario (Copia): ');
      
      await Rental.create({
        rentalDate: new Date(),
        customerId: idCli,
        inventoryId: idInv,
        staffId: 1
      });
      console.log('Aluguel registrado com sucesso.');
    }
  } catch (e) {
    console.error('Erro na insercao: ', e.message);
  }
}

module.exports = { inserirDados };