import React, { useEffect, useMemo, useState } from 'react'
import { fetchProdutos, createProduto } from './api.js'
import ProductCard from './components/ProductCard.jsx'
import Modal from './components/Modal.jsx'

export default function App(){
  const [produtos, setProdutos] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [toast, setToast] = useState('')
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    (async () => {
      try{
        const data = await fetchProdutos()
        setProdutos(data)
      }catch(e){
        setErr(e.message || 'Erro ao carregar')
      }finally{
        setLoading(false)
      }
    })()
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 2000)
    return () => clearTimeout(t)
  }, [toast])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return produtos
    return produtos.filter(p => String(p.nome||'').toLowerCase().includes(q))
  }, [query, produtos])

  return (
    <div className="app">
      <div className="shell">
        <header className="header">
          <div className="logo">P</div>
          <div className="title">
            <h1>Produtos</h1>
            <span>Catálogo simples (FastAPI + CouchDB)</span>
          </div>
        </header>

        <div className="toolbar">
          <input className="input" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar por nome..." />
        </div>

        <section className="grid" role="list" aria-label="Lista de produtos">
          {loading && <div className="card">Carregando...</div>}
          {!loading && err && <div className="card">❌ {err}</div>}
          {!loading && !err && filtered.length === 0 && <div className="card empty">Nenhum produto</div>}
          {!loading && !err && filtered.map((p, i) => (
            <ProductCard key={(p._id||p.nome||'') + i} nome={p.nome} preco={p.preco} />
          ))}
        </section>

        <button className="fab" onClick={() => setOpen(true)} aria-label="Adicionar produto">+</button>
        {toast && <div className="toast">{toast}</div>}

        <AddModal open={open} onClose={() => setOpen(false)} onCreated={(novo) => {
          setProdutos(prev => [novo, ...prev])
          setToast('Produto adicionado!')
        }} />
      </div>
    </div>
  )
}

function AddModal({ open, onClose, onCreated }){
  const [nome, setNome] = useState('')
  const [preco, setPreco] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSave(){
    setError('')
    const p = parseFloat(String(preco).replace(',', '.'))
    if(!nome.trim()) { setError('Informe o nome.'); return }
    if(Number.isNaN(p) || p < 0) { setError('Preço inválido.'); return }
    try{
      setSaving(true)
      const created = await createProduto({ nome: nome.trim(), preco: p })
      onCreated?.(created)
      setNome(''); setPreco(''); onClose?.()
    }catch(e){
      setError(e.message || 'Falha ao salvar')
    }finally{
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Novo produto">
      <div className="row">
        <label htmlFor="nome">Nome</label>
        <input id="nome" className="input" value={nome} onChange={e=>setNome(e.target.value)} placeholder="Ex.: Coca-Cola Lata" />
      </div>
      <div className="row">
        <label htmlFor="preco">Preço</label>
        <input id="preco" className="input" value={preco} onChange={e=>setPreco(e.target.value)} inputMode="decimal" placeholder="Ex.: 6,50" />
        <span className="small">Use vírgula ou ponto (ex.: 6,50)</span>
      </div>
      {error && <div className="card" style={{marginBottom:12}}>❌ {error}</div>}
      <div className="actions">
        <button className="ghost" onClick={onClose}>Cancelar</button>
        <button className="button primary" disabled={saving} onClick={handleSave}>{saving ? 'Salvando...' : 'Salvar'}</button>
      </div>
    </Modal>
  )
}
