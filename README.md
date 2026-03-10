# ContractGuard

AI-powered contract analysis that explains legal jargon in plain English.

**Live Demo:** [contract-clarity-tau.vercel.app](https://contract-clarity-tau.vercel.app)

## What it does

Upload a contract (PDF/TXT) or paste text, and ContractGuard will:
- Identify risky clauses and red flags
- Explain what they mean in simple terms
- Rate the risk level (1-10)
- Suggest what actions to take

## Built with DigitalOcean Gradient AI

- **Model:** DeepSeek R1 Distill Llama 70B via Gradient AI Agents
- **Knowledge Base:** Custom training data with 60+ contract examples covering leases, employment, loans, and terms of service
- **RAG:** Embeddings-based retrieval for context-aware analysis

See [`docs/training/`](./docs/training/) for the knowledge base and agent prompt.

## Tech Stack

- React + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- Vercel Serverless Functions
- pdf-parse for PDF text extraction

## Run Locally

```bash
npm install
npm run dev
```

For the API to work, create `.env`:
```
GRADIENT_ENDPOINT_URL=your_gradient_agent_url
GRADIENT_API_KEY=your_api_key
```

## Deploy

```bash
vercel --prod
```

Add environment variables in Vercel dashboard.

## License

MIT
