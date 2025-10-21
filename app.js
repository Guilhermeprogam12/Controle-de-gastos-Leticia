const notaInput = document.getElementById('notaInput');
const valorDetectado = document.getElementById('valorDetectado');
const resultado = document.getElementById('resultado');
const categoriaSelect = document.getElementById('categoria');
const listaGastos = document.getElementById('listaGastos');

let valorAtual = 0;

notaInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const { data: { text } } = await Tesseract.recognize(file, 'por');
  const match = text.match(/(?:total|valor total|valor)\s*[R$]?\s*(\d+[,.]\d{2})/i);
  valorAtual = match ? parseFloat(match[1].replace(',', '.')) : 0;

  valorDetectado.textContent = `R$ ${valorAtual.toFixed(2)}`;
  resultado.style.display = 'block';
});

function salvarGasto() {
  const categoria = categoriaSelect.value;
  const gasto = {
    valor: valorAtual,
    categoria,
    data: new Date().toLocaleString('pt-BR')
  };

  const db = JSON.parse(localStorage.getItem('gastos') || '[]');
  db.push(gasto);
  localStorage.setItem('gastos', JSON.stringify(db));

  atualizarHistorico();
  resultado.style.display = 'none';
  notaInput.value = '';
}

function atualizarHistorico() {
  const db = JSON.parse(localStorage.getItem('gastos') || '[]');
  listaGastos.innerHTML = '';
  db.reverse().forEach(g => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${g.categoria.toUpperCase()}</strong> - R$ ${g.valor.toFixed(2)} em ${g.data}`;
    listaGastos.appendChild(li);
  });
}

atualizarHistorico();
