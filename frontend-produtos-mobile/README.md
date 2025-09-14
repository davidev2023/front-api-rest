# Front-end Mobile (Produtos)

Frontend simples e **mobile-first** para sua API FastAPI (CouchDB).

## 🚀 Como rodar

1) Baixe o ZIP e extraia.
2) No terminal, entre na pasta e rode:
   ```bash
   npm install
   npm run dev
   ```
3) Certifique-se de que sua API está rodando em `http://127.0.0.1:3044` (ou ajuste o `.env.local`).

### Configurar URL da API
Crie um arquivo `.env.local` na raiz (copie do `.env.example`) e defina:
```
VITE_API_URL=http://127.0.0.1:3044
```

## 📦 Funcionalidades
- Listar produtos (`GET /produtos`)
- Criar produto (`POST /produtos`)
- Busca por nome no cliente
- Layout responsivo e limpo, pensado para celular
- Tratamento de erro quando o backend retorna `{"erro": "..."}` para nome duplicado

> O front **não** implementa editar/apagar porque sua API enviada tinha apenas GET/POST.
