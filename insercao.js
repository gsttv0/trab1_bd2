const readline = require('readline-sync');
const { Customer, Inventory, Rental, Address, City, Country, Film } = require('./models');
const sequelize = require('./database');

async function executarInsercoes() {
  console.log('\n====================================');
  console.log('   SISTEMA DE GESTÃO SAKILA');
  console.log('====================================');
  console.log('1. Cadastrar NOVO CLIENTE (Completo)');
  console.log('2. Adicionar FILME AO ESTOQUE (Quantidade)');
  console.log('3. Registrar NOVO ALUGUEL (Verifica Disponibilidade)');
  console.log('0. Sair');
  
  const opcao = readline.questionInt('\nEscolha uma opcao: ');

  try {
    switch (opcao) {
      case 1: // --- CADASTRO DE CLIENTE EM CADEIA ---
        console.log('\n--- Passo 1/4: Localização ---');
        const pNome = readline.question('Nome do Pais: ');
        const nPais = await Country.create({ country: pNome });
        
        const cNome = readline.question('Nome da Cidade: ');
        const nCid = await City.create({ city: cNome, country_id: nPais.country_id });

        const rua = readline.question('Rua e Numero: ');
        const est = readline.question('Estado (District): ');
        const fone = readline.question('Telefone: ');
        
        const nEnd = await Address.create({
          address: rua, district: est, city_id: nCid.city_id, phone: fone,
          location: sequelize.fn('ST_GeomFromText', 'POINT(0 0)')
        });

        console.log('\n--- Passo 2/4: Dados Pessoais ---');
        const nome = readline.question('Nome: ');
        const sobrenome = readline.question('Sobrenome: ');
        const email = readline.question('Email: ');
        const loja = readline.questionInt('ID da Loja (1 ou 2): ');

        const nCli = await Customer.create({
          first_name: nome.toUpperCase(), last_name: sobrenome.toUpperCase(),
          email: email, address_id: nEnd.address_id, store_id: loja
        });

        console.log(`\n✅ Sucesso! Cliente criado com ID: ${nCli.customer_id}`);
        break;

      case 2: // --- CADASTRO DE ESTOQUE COM QUANTIDADE ---
        const fIdEstoque = readline.questionInt('\nDigite o ID do Filme: ');
        const filmeEstoque = await Film.findByPk(fIdEstoque);

        if (!filmeEstoque) {
          console.log('❌ Filme não encontrado!');
        } else {
          console.log(`🎬 FILME: ${filmeEstoque.title}`);
          const sId = readline.questionInt('ID da Loja (1 ou 2): ');
          const qtd = readline.questionInt('Quantas unidades adicionar ao estoque? ');

          for (let i = 0; i < qtd; i++) {
            await Inventory.create({ film_id: fIdEstoque, store_id: sId });
          }
          console.log(`\n✅ ${qtd} copias de "${filmeEstoque.title}" adicionadas!`);
        }
        break;

      case 3: // --- ALUGUEL COM VERIFICAÇÃO DE DISPONIBILIDADE ---
        const fIdAluguel = readline.questionInt('\nDigite o ID do Filme que deseja alugar: ');
        const filmeAluguel = await Film.findByPk(fIdAluguel);

        if (!filmeAluguel) {
          console.log('❌ Filme não encontrado!');
          break;
        }

        const copias = await Inventory.findAll({ where: { film_id: fIdAluguel } });
        if (copias.length === 0) {
          console.log(`❌ O filme "${filmeAluguel.title}" não possui estoque. Sugerimos outro título.`);
          break;
        }

        console.log(`\n🎬 Filme: ${filmeAluguel.title}`);
        console.log('📋 Situação das cópias:');

        const listaStatus = [];
        for (let cp of copias) {
          const aluguelAtivo = await Rental.findOne({
            where: { inventory_id: cp.inventory_id, return_date: null }
          });
          const status = aluguelAtivo ? 'alugado' : 'disponivel';
          listaStatus.push({ id: cp.inventory_id, status });
          console.log(`${cp.inventory_id} (${status})`);
        }

        const temDisponivel = listaStatus.some(item => item.status === 'disponivel');
        if (!temDisponivel) {
          console.log('\n⚠️ Todas as cópias estão alugadas. Tente outro filme.');
          break;
        }

        let invId;
        let copiaValida = false;
        while (!copiaValida) {
          invId = readline.questionInt('\nDigite o ID da copia disponivel: ');
          const escolha = listaStatus.find(item => item.id === invId);
          if (!escolha) {
            console.log('❌ ID inválido para este filme.');
          } else if (escolha.status === 'alugado') {
            console.log('❌ Esta cópia já está alugada! Escolha outra.');
          } else {
            copiaValida = true;
          }
        }

        const cliId = readline.questionInt('ID do Cliente: ');
        const staId = readline.questionInt('ID do Funcionario (1 ou 2): ');

        const nRent = await Rental.create({
          rental_date: new Date(), customer_id: cliId, inventory_id: invId, staff_id: staId
        });

        console.log(`\n✅ Sucesso! Aluguel ${nRent.rental_id} realizado.`);
        break;

      case 0:
        process.exit();
    }
  } catch (err) {
    console.error('\n❌ Erro:', err.message);
  } finally {
    process.exit();
  }
}

executarInsercoes();