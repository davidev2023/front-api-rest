const BASE_URL = import.meta.env.VITE_API_URL || 'https://api-rest-27f17c723ce7.herokuapp.com/produtos'

export async function fetchProdutos() {
  const res = await fetch(`${BASE_URL}/produtos`)
  if (!res.ok) throw new Error('Falha ao carregar produtos')
  const data = await res.json()
  // Alguns documentos do Couch podem não ter os campos esperados; filtramos.
  return (Array.isArray(data) ? data : []).filter(p => p && (p.nome ?? p.preco) !== undefined)
}

export async function createProduto({ nome, preco }) {
  const res = await fetch(`${BASE_URL}/produtos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, preco })
  })
  // O teu backend retorna 200 sempre, com {"erro": "..."} quando duplicado.
  const json = await res.json().catch(() => ({}))
  if (json && json.erro) {
    const err = new Error(json.erro)
    err.code = 409
    throw err
  }
  if (!res.ok) {
    throw new Error('Falha ao criar produto')
  }
  return json
}
