
window.onload = function() {
    renderizarCancelados();
};

function renderizarCancelados() {
    const container = document.getElementById("containerCancelados");
    if (!container) return;

    container.innerHTML = "";
    let lista = JSON.parse(localStorage.getItem("meuBanco")) || [];

    // Filtra apenas os CANCELADOS
    const cancelados = lista.filter(u => u.cancelado === true);

    // Estatísticas de Perda
    const totalPerda = cancelados.reduce((acc, curr) => acc + parseFloat(curr.preco.replace(',', '.')), 0);
    document.getElementById("totalCancelados").innerText = cancelados.length;
    document.getElementById("perdaTotal").innerText = `R$ ${totalPerda.toFixed(2).replace('.', ',')}`;

    cancelados.forEach((usuario) => {
        const card = document.createElement("div");
        card.className = "cardFilho";
        card.style.border = "1px solid #e74c3c"; // Borda vermelha

        card.innerHTML = `
            <div class="info-cliente-home">
                <h3 style="color: #e74c3c; text-decoration: line-through;">${usuario.nome.toUpperCase()}</h3>
                <p style="opacity: 0.7;">CANCELADO</p>
                <small>Data: ${usuario.data.split('-').reverse().join('/')}</small>
            </div>
            <div style="color: #95a5a6; font-size: 18px; text-decoration: line-through;">
                R$ ${usuario.preco.replace('.', ',')}
            </div>
            <div class="lixo" onclick="excluirDefinitivo(${usuario.id})">
                <i class="bi bi-trash" style="color: #e74c3c; cursor:pointer;"></i>
            </div>
        `;
        container.appendChild(card);
    });
}

function excluirDefinitivo(id) {
    if(confirm("Excluir permanentemente do banco de dados?")) {
        let lista = JSON.parse(localStorage.getItem("meuBanco")) || [];
        lista = lista.filter(u => u.id !== id);
        localStorage.setItem("meuBanco", JSON.stringify(lista));
        renderizarCancelados();
    }
}