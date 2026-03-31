const { Rental, Customer, Inventory, Film } = require('./models');

async function listarAlugueisCompletos() {
  try {
    console.log('\n=============================================================');
    console.log('             RELATÓRIO DETALHADO DE ALUGUÉIS');
    console.log('=============================================================\n');

    const alugueis = await Rental.findAll({
      limit: 10,
      order: [['rental_id', 'DESC']],
      include: [
        { 
          model: Customer, 
          attributes: ['customer_id', 'first_name', 'last_name'] 
        },
        {
          model: Inventory,
          attributes: ['inventory_id', 'film_id'],
          include: [{ 
            model: Film, 
            attributes: ['film_id', 'title'] 
          }]
        }
      ]
    });

    for (const aluguel of alugueis) {
      const cliente = aluguel.Customer;
      const filme = aluguel.Inventory.Film;

      // --- LÓGICA DE ESTOQUE DISPONÍVEL ---
      
      // 1. Contamos o total de cópias que o filme tem no sistema
      const totalCopias = await Inventory.count({
        where: { film_id: filme.film_id }
      });

      // 2. Contamos quantas dessas cópias estão "na rua" (alugadas e não devolvidas)
      const copiasAlugadas = await Rental.count({
        include: [{
          model: Inventory,
          where: { film_id: filme.film_id }
        }],
        where: { return_date: null }
      });

      // 3. Estoque disponível = Total - Alugadas
      const estoqueDisponivel = totalCopias - copiasAlugadas;

      const dataHora = aluguel.rental_date.toLocaleString('pt-BR');

      console.log(`ALUGUEL ID: ${aluguel.rental_id}`);
      console.log(`📅 DATA/HORA: ${dataHora}`);
      console.log(`👤 CLIENTE:   [ID: ${cliente.customer_id}] ${cliente.first_name} ${cliente.last_name}`);
      console.log(`🎬 FILME:     [ID: ${filme.film_id}] ${filme.title}`);
      console.log(`📦 ITEM FÍSICO (ID Estoque): ${aluguel.inventory_id}`);
      console.log(`📊 DISPONÍVEL: ${estoqueDisponivel}`); // Apenas o número do que sobrou na prateleira
      console.log('-------------------------------------------------------------');
    }

  } catch (error) {
    console.error('\n❌ Erro ao gerar listagem:', error.message);
  } finally {
    process.exit();
  }
}

listarAlugueisCompletos();