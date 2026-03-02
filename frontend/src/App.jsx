import { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import './App.css';

function App() {
  const [title, setTitle] = useState('');
  const [jsonInput, setJsonInput] = useState('');
  const [markdown, setMarkdown] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [view, setView] = useState('preview');

  const handleGenerate = async () => {
    if (!jsonInput.trim()) {
      setError('Por favor, insira um JSON válido.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/api/generate', {
        title: title || "API Sem Nome",
        raw_json: JSON.parse(jsonInput)
      });
      
      setMarkdown(response.data.markdown);
      setView('preview');
    } catch (err) {
      console.error(err);
      setError('Erro na conexão ou JSON inválido.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white font-sans flex flex-col items-center">
      <div className="w-full max-w-360 px-6 py-10 md:py-16 flex flex-col grow">
        
        <header className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-5 bg-emerald-400 rounded-full"></span>
              <span className="text-[11px] font-bold tracking-[0.3em] text-emerald-400 uppercase">AI Engine</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter bg-linear-to-r from-white to-white/60 bg-clip-text text-transparent">
              AUTO<span className="text-emerald-400">DOC</span><span className="text-violet-400">.</span>
            </h1>
          </div>
          <p className="text-gray-400 text-[11px] font-medium uppercase tracking-[0.2em] border-l-2 border-white/20 pl-4 mb-1 max-w-md">
            Uma ferramenta de produtividade desenvolvida para transformar estruturas JSON em documentações Markdown.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 grow">
          <section className="lg:col-span-4">
            <div className="glass-card p-6 md:p-8 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-xl h-full flex flex-col gap-6">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-300 mb-3 block">Project Identity</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nome da API..."
                  className="w-full bg-white/10 border-b border-white/20 p-3 focus:border-emerald-400 outline-none transition-all text-sm font-medium placeholder:text-gray-500 rounded-t-lg"
                />
              </div>

              <div className="grow flex flex-col">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-300 mb-3 block">Input JSON</label>
                <textarea 
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder='{ "data": "value" }'
                  className="w-full grow min-h-87.5 bg-black/30 border border-white/10 rounded-xl p-5 font-mono text-[12px] focus:border-violet-400 outline-none transition-all resize-none scrollbar-custom placeholder:text-gray-600"
                />
              </div>

              <button 
                onClick={handleGenerate}
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold tracking-widest uppercase text-[12px] transition-all ${
                  loading ? 'bg-gray-800 text-gray-400' : 'bg-white text-black hover:bg-emerald-400 hover:scale-[1.02] active:scale-95'
                }`}
              >
                {loading ? 'Processando...' : 'Gerar Docs'}
              </button>

              {error && <p className="text-red-400 text-[10px] text-center uppercase font-bold bg-red-500/10 p-2 rounded-lg">{error}</p>}
            </div>
          </section>

          <section className="lg:col-span-8">
            <div className="glass-card h-full min-h-125 border border-white/10 rounded-2xl bg-white/5 flex flex-col overflow-hidden">
              <div className="flex items-center gap-6 px-8 py-4 border-b border-white/10 bg-white/5">
                {['preview', 'source'].map((t) => (
                  <button 
                    key={t}
                    onClick={() => setView(t)}
                    className={`text-[10px] font-bold uppercase tracking-widest transition-all pb-1 border-b-2 ${view === t ? 'text-emerald-400 border-emerald-400' : 'text-gray-400 border-transparent hover:text-white'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              
              <div className="p-8 md:p-10 prose prose-invert max-w-none grow overflow-y-auto scrollbar-custom markdown-container">
                {markdown ? (
                  view === 'preview' ? <ReactMarkdown>{markdown}</ReactMarkdown> : 
                  <pre className="text-[12px] font-mono text-violet-300 bg-black/40 p-6 rounded-xl border border-white/10 whitespace-pre-wrap">{markdown}</pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-50 py-20 text-center">
                    <div className="h-px w-12 bg-white/50 mb-4"></div>
                    <p className="text-[11px] uppercase tracking-[0.3em] font-medium">Aguardando Processamento</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>

        <footer className="mt-12 pt-6 border-t border-white/10 flex justify-between items-center opacity-100">
          <p className="text-[9px] tracking-[0.4em] font-bold text-gray-400">© 2026 AUTODOC</p>
          <p className="text-[10px] tracking-[0.2em] font-bold text-white uppercase">
            Dev: Maria Eduarda Silva
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;