"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/validate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      // Salva o email na sessão
      sessionStorage.setItem("userEmail", email);

      // Se já completou o formulário, vai direto pro dashboard
      // Se não, vai pro wizard pra se cadastrar
      if (data.completedForm) {
        router.push("/dashboard");
      } else {
        router.push("/wizard");
      }
    } catch (err) {
      setError("Erro ao validar e-mail. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4 relative overflow-hidden">
      {/* Sutil gradient background - Apple style */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-serraglio-orange/5"></div>

      <div className="relative z-10 w-full max-w-lg">

        {/* Hero Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12 space-y-5"
        >
          <Image
            src="/logo.png"
            alt="50 Formatos que Escalam"
            width={400}
            height={200}
            className="mx-auto"
            priority
          />

          <p className="text-gray-300 text-lg md:text-xl max-w-md mx-auto leading-relaxed">
            Sua biblioteca exclusiva de criativos{" "}
            <span className="text-serraglio-orange font-semibold">validados</span> que{" "}
            <span className="text-serraglio-orange font-semibold">geram resultados</span>
          </p>
        </motion.div>

        {/* Login Card with enhanced Serraglio style */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <Card className="border border-white/10 backdrop-blur-xl bg-black/80 shadow-2xl rounded-2xl overflow-hidden">
            <CardContent className="relative p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <label htmlFor="email" className="block text-sm font-semibold text-white tracking-wide">
                    Digite o e-mail que você usou na hora da compra
                  </label>
                  <Input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 text-base bg-white/5 border-2 border-white/10 focus:border-serraglio-orange/50 rounded-lg text-white placeholder:text-gray-300"
                    placeholder="seu@email.com"
                    required
                  />
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm font-medium"
                  >
                    {error}
                  </motion.div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 text-base font-display font-bold"
                  size="lg"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Validando...
                    </span>
                  ) : (
                    <>
                      Acessar Biblioteca
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-8 pt-8 border-t border-white/10">
                <p className="text-sm text-gray-400 text-center leading-relaxed">
                  Apenas clientes autorizados têm acesso a este conteúdo exclusivo
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
