let produtos = [];
let produtoAtual = null;

fetch("331-appshee.csv")
  .then(response => response.text())
  .then(texto => {
    const linhas = texto.split("\n");

    // Remove cabeçalho
    produtos = linhas.slice(1).map(linha =>
      linha.split(";").map(col => col.trim())
    );
  })
  .catch(() => {
    document.getElementById("resultado").innerText =
      "Erro ao carregar o arquivo CSV.";
  });

function buscarProduto() {
  const codigo = document.getElementById("codigo").value.trim();
  const resultado = document.getElementById("resultado");

  if (!codigo) {
    resultado.innerHTML = "⚠️ Informe um código.";
    return;
  }

  produtoAtual = produtos.find(linha =>
    linha[0].toLowerCase() === codigo.toLowerCase()
  );

  if (!produtoAtual) {
    resultado.innerHTML = "❌ Produto não encontrado.";
    return;
  }

  atualizarPreco();
}

function atualizarPreco() {
  if (!produtoAtual) return;

  const resultado = document.getElementById("resultado");
  const descontoInput = document.getElementById("desconto").value;
  const desconto = descontoInput ? Number(descontoInput) : 0;

  if (desconto < 0 || desconto > 30) {
    resultado.innerHTML = "⚠️ Desconto permitido apenas entre 0% e 30%.";
    return;
  }

  const codigo = produtoAtual[0];
  const descricao = produtoAtual[1];
  const estoque = Number(produtoAtual[2]);
  const precoBruto = Number(
  produtoAtual[3].replace(".", "").replace(",", ".")
);

  const precoFinal = precoBruto - (precoBruto * desconto / 100);

  const estoqueTexto =
    estoque > 0
      ? `✅ <strong>Estoque:</strong> ${estoque} unidades`
      : `❌ <strong>Estoque:</strong> indisponível`;

  resultado.innerHTML = `
    <strong>Código:</strong> ${codigo}<br>
    <strong>Descrição:</strong> ${descricao}<br>
    ${estoqueTexto}<br><br>

    <strong>Preço bruto:</strong> R$ ${precoBruto.toLocaleString("pt-BR", {
      minimumFractionDigits: 2
    })}<br>

    <strong>Desconto:</strong> ${desconto}%<br>

    <strong style="color: green;">
      Preço final: R$ ${precoFinal.toLocaleString("pt-BR", {
        minimumFractionDigits: 2
      })}
    </strong>
  `;
}
