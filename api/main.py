import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
from dotenv import load_dotenv
from pydantic import BaseModel

# Carrega variáveis de ambiente
load_dotenv()

# Inicializa o cliente Groq
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

app = FastAPI(
    title="Auto-Doc AI API",
    description="Engine Serverless para documentação técnica",
    version="1.1.0"
)

# Configuração de CORS 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DocRequest(BaseModel):
    title: str
    raw_json: dict

@app.get("/api")
async def root():
    return {
        "status": "online",
        "service": "Auto-Doc AI Serverless",
        "author": "Maria Eduarda Silva"
    }

@app.post("/api/generate")
async def generate_doc(request: DocRequest):
    prompt = f"""
    Aja como um Arquiteto de Software e Technical Writer Sênior. 
    Analise o JSON da API '{request.title}': {request.raw_json}
    
    Instruções Obrigatórias:
    1. Identifique se as strings são formatos específicos (Email, UUID, ISO8601, URL, etc).
    2. Crie uma tabela Markdown com: Campo, Tipo de Dado, Exemplo e Descrição Sugerida.
    3. Adicione uma seção de 'Exemplo de Comando cURL' para uma requisição POST.
    4. Adicione uma seção de 'Tratamento de Erros' sugerindo códigos 400 e 401.
    
    Responda apenas em Markdown.
    """

    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile", 
            messages=[
                {"role": "system", "content": "Você é um especialista que gera apenas Markdown puro."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2, 
        )
        return {"markdown": completion.choices[0].message.content}
        
    except Exception as e:
        print(f"Erro: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao processar com a IA.")