"use client";

import { useEffect, useState } from "react";
import { Copy, Plus, Trash2, Key, ShieldCheck, Lock, Eye, EyeOff, Search } from "lucide-react";

interface PasswordEntry {
  id: string;
  name: string;
  password: string;
}

export default function Dashboard() {
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [newName, setNewName] = useState("");
  const [newPass, setNewPass] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchPasswords();
  }, []);

  const fetchPasswords = async () => {
    setLoading(true);
    const res = await fetch("/api/passwords");
    const data = await res.json();
    setPasswords(data);
    setLoading(false);
  };

  const addPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPass) return;

    const res = await fetch("/api/passwords", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, password: newPass }),
    });

    if (res.status === 409) {
      alert("Erro: Este serviço já existe!");
      return;
    }

    if (res.ok) {
      setNewName("");
      setNewPass("");
      fetchPasswords();
    }
  };

  const deletePassword = async (id: string) => {
    const res = await fetch("/api/passwords", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      fetchPasswords();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Visual feedback could be added here
  };

  const toggleVisibility = (id: string) => {
    setVisiblePasswords((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <main className="min-h-screen p-6 md:p-24 max-w-6xl mx-auto flex flex-col gap-16">
      <header className="flex flex-col md:flex-row items-baseline justify-between border-l-4 border-primary pl-6 animate-reveal">
        <div>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none italic">
            Bela-Senhas
          </h1>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0 text-white/40">
          <ShieldCheck size={16} />
          <span className="text-[10px] uppercase font-bold">Encrypted Mode Active</span>
        </div>
      </header>

      <section className="animate-reveal [animation-delay:200ms]">
        <form onSubmit={addPassword} className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="NOME DO SERVIÇO"
            className="input-brutalist flex-1"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <div className="relative flex-1">
            <input
              type="password"
              placeholder="SENHA"
              className="input-brutalist w-full"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
            />
            <Key size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20" />
          </div>
          <button type="submit" className="btn-primary group flex items-center gap-2">
            <Plus size={20} className="group-hover:rotate-90 transition-transform" />
            ADICIONAR
          </button>
        </form>
      </section>

      <section className="animate-reveal [animation-delay:400ms]">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white/20">Cofre de Senhas</h2>
            <div className="relative w-full max-w-xs transition-all focus-within:max-w-md">
              <input
                type="text"
                placeholder="BUSCAR SERVIÇO..."
                className="input-brutalist w-full pl-10 text-xs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full py-12 text-center text-white/20 animate-pulse uppercase font-black tracking-widest">
                Scanning Vault...
              </div>
            ) : passwords.length === 0 ? (
              <div className="col-span-full py-12 text-center text-white/20 border border-dashed border-white/10 italic">
                Nenhuma senha salva. Comece adicionando uma acima.
              </div>
            ) : (
              passwords
                .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((item) => {
                  const isVisible = visiblePasswords.has(item.id);
                  return (
                    <div key={item.id} className="card-brutalist group relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                        <button
                          onClick={() => toggleVisibility(item.id)}
                          className={`p-2 hover:bg-white/10 ${isVisible ? 'text-primary' : 'text-white'}`}
                          title={isVisible ? "Ocultar Senha" : "Ver Senha"}
                        >
                          {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <button
                          onClick={() => copyToClipboard(item.password)}
                          className="p-2 hover:bg-white/10 text-white"
                          title="Copiar Senha"
                        >
                          <Copy size={16} />
                        </button>
                        <button
                          onClick={() => deletePassword(item.id)}
                          className="p-2 hover:bg-primary/20 text-primary"
                          title="Excluir"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="mb-4">
                        <span className="text-[10px] text-primary font-mono uppercase block mb-1 tracking-widest">Serviço</span>
                        <h3 className="text-xl font-bold uppercase truncate pr-24">{item.name}</h3>
                      </div>
                      <div className="flex items-center gap-2 text-foreground/40">
                        <Lock size={14} />
                        <span className="font-mono text-sm">
                          {isVisible ? item.password : '********'}
                        </span>
                      </div>
                      <div className="absolute -bottom-4 -right-4 text-foreground/5 font-black text-6xl pointer-events-none group-hover:text-primary/10 transition-colors">
                        {item.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      </section>

      <footer className="mt-auto pt-12 border-t border-white/5 flex justify-between items-center text-[10px] uppercase font-bold text-white/20 tracking-widest animate-reveal [animation-delay:600ms]">
        <span>Gerenciador de Senhas Local</span>
        <span>Build v1.0.0-PRO</span>
      </footer>

      <style jsx>{`
        @keyframes typing {
          from { width: 0 }
          to { width: 100% }
        }
      `}</style>
    </main>
  );
}
