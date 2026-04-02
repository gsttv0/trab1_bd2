const { Film, Inventory, Customer, Rental } = require('./models');

async function listarEntidades(tipo) {
  try {
    // 1. LISTA FILMES: Foca no agregado de estoque (Item B do roteiro)
    if (tipo === 'film') {
      const filmes = await Film.findAll({ limit: 5, include: [Inventory] });
      console.log('\n--- RESUMO DE ESTOQUE (FILMES) ---');
      filmes.forEach(f => {
        console.log(`Filme: ${f.title} | Total de Copias no Banco: ${f.Inventories.length}`);
      });
    } 
    // 2. LISTA CLIENTES: Foca no agregado de atividade (Item B do roteiro)
    else if (tipo === 'customer') {
      const clientes = await Customer.findAll({ limit: 5, include: [Rental] });
      console.log('\n--- RESUMO DE ATIVIDADE (CLIENTES) ---');
      clientes.forEach(c => {
        console.log(`Cliente: ${c.firstName} ${c.lastName} | Total de Alugueis: ${c.Rentals.length}`);
      });
    } 
    // 3. LISTA ALUGUEIS: Agora mostra os 5 MAIS RECENTES (Eager Loading)
    else if (tipo === 'rental') {
      const alugueis = await Rental.findAll({ 
        limit: 5, 
        order: [['rentalId', 'DESC']], // Garante os mais recentes primeiro
        include: [{ model: Customer }, { model: Inventory, include: [Film] }] 
      });
      console.log('\n--- 5 ULTIMOS ALUGUEIS REALIZADOS ---');
      alugueis.forEach(r => {
        console.log(`ID: ${r.rentalId} | Data: ${r.rentalDate.toLocaleString()} | Cliente: ${r.Customer.firstName} | Filme: ${r.Inventory.Film.title}`);
      });
    }
  } catch (e) { console.error('Erro na listagem: ', e.message); }
}

module.exports = { listarEntidades };