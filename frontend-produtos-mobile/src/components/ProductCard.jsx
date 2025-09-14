import React from 'react'

const fmtBRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export default function ProductCard({ nome, preco }) {
  return (
    <div className="card product" role="listitem" aria-label={`Produto ${nome}`}>
      <div style={{flex:1, minWidth:0}}>
        <h3 title={nome}>{nome}</h3>
        <span className="badge">catálogo</span>
      </div>
      <div className="price">{preco !== undefined && preco !== null ? fmtBRL.format(Number(preco) || 0) : '-'}</div>
    </div>
  )
}
