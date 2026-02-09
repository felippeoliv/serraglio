# Sistema de Design Serraglio

## Identidade Visual

### Paleta de Cores

```css
/* Cores principais */
--serraglio-orange: #ff4d00
--serraglio-orangeLight: #fc4900
--serraglio-orangeLighter: #ffab8c
--serraglio-orangeDark: #ed3a1d
--serraglio-black: #000000
--serraglio-white: #ffffff
```

### Degradês

```css
/* Degradê principal */
background: linear-gradient(135deg, #fc4900 0%, #ffab8c 50%, #ed3a1d 100%);

/* Degradê para texto */
.gradient-serraglio-text {
  background: linear-gradient(135deg, #fc4900 0%, #ffab8c 50%, #ed3a1d 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### Tipografia

#### Fontes
- **Display/Títulos**: League Spartan (700-900 weight)
- **Corpo/Textos**: Inter (300-700 weight)

#### Classes Tailwind
```jsx
// Títulos
className="font-display text-4xl font-black tracking-tight"

// Subtítulos
className="font-display text-xl font-bold"

// Corpo
className="text-base text-gray-400 leading-relaxed"
```

### Border Radius

```jsx
// Pequeno
rounded-xl // 1.5rem

// Médio
rounded-2xl // 2rem

// Grande
rounded-3xl // 2.5rem
```

## Componentes

### Badges

```jsx
<div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-serraglio-orange/15 to-serraglio-orangeDark/15 border-2 border-serraglio-orange/30 backdrop-blur-sm shadow-lg shadow-serraglio-orange/10">
  <span className="font-display text-sm font-bold text-white uppercase tracking-[0.15em]">
    Texto do Badge
  </span>
</div>
```

### Cards

```jsx
<Card className="border-2 border-serraglio-orange/20 backdrop-blur-2xl bg-gradient-to-br from-black/90 via-black/80 to-serraglio-orange/5 shadow-2xl shadow-serraglio-orange/20 rounded-3xl">
  {/* Conteúdo */}
</Card>
```

### Buttons

```jsx
// Botão primário
<Button className="bg-gradient-to-r from-serraglio-orange to-serraglio-orangeDark hover:from-serraglio-orangeLight hover:to-serraglio-orange rounded-2xl shadow-lg shadow-serraglio-orange/40">
  Texto
</Button>

// Botão outline
<Button variant="outline" className="border-white/20 hover:border-serraglio-orange/50 hover:bg-serraglio-orange/10 rounded-xl">
  Texto
</Button>
```

### Inputs

```jsx
<Input className="h-16 text-base bg-white/5 border-2 border-white/10 hover:border-serraglio-orange/30 focus:border-serraglio-orange/50 rounded-2xl text-white placeholder:text-gray-500" />
```

## Efeitos e Animações

### Orbs Flutuantes

```jsx
<div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-serraglio-orange/30 via-serraglio-orangeLight/20 to-transparent rounded-full blur-3xl animate-float"></div>
```

### Glow Effects

```jsx
// Glow sutil
className="shadow-lg shadow-serraglio-orange/20"

// Glow forte
className="shadow-xl shadow-serraglio-orange/40"

// Glow pulsante
className="animate-glow-pulse"
```

### Hover States

```jsx
// Scale e lift
className="hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300"

// Borda animada
className="border-2 border-serraglio-orange/20 hover:border-serraglio-orange/50"
```

## Framer Motion

### Animações de Entrada

```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
>
  {/* Conteúdo */}
</motion.div>
```

### Hover Animations

```jsx
<motion.div
  whileHover={{ scale: 1.02, y: -4 }}
  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
>
  {/* Conteúdo */}
</motion.div>
```

## Background Patterns

### Noise Texture

```jsx
<div
  className="absolute inset-0 opacity-[0.015] mix-blend-soft-light pointer-events-none"
  style={{
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
  }}
/>
```

## Scrollbar Personalizado

Já aplicado globalmente em `globals.css`:
- Cor: Gradiente laranja
- Largura: 10px
- Hover: Glow effect

## Acessibilidade

- Contraste mínimo: 4.5:1 (WCAG AA)
- Focus states visíveis com ring-serraglio-orange
- Tamanhos de toque mínimos: 44x44px
- Transições suaves para usuários sem redução de movimento

## Exemplo Completo de Página

```jsx
<div className="min-h-screen bg-black p-4 relative overflow-hidden">
  {/* Background orbs */}
  <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-serraglio-orange/30 via-serraglio-orangeLight/20 to-transparent rounded-full blur-3xl animate-float"></div>

  <div className="relative z-10 max-w-lg mx-auto">
    {/* Badge */}
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-10"
    >
      <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-serraglio-orange/15 to-serraglio-orangeDark/15 border-2 border-serraglio-orange/30">
        <span className="font-display text-sm font-bold text-white uppercase tracking-[0.15em]">
          Badge Text
        </span>
      </div>
    </motion.div>

    {/* Title */}
    <h1 className="font-display text-6xl font-black text-white tracking-tight mb-4">
      Título <span className="gradient-serraglio-text">Destaque</span>
    </h1>

    {/* Card */}
    <Card className="border-2 border-serraglio-orange/20 backdrop-blur-2xl bg-gradient-to-br from-black/90 to-serraglio-orange/5 shadow-2xl rounded-3xl p-10">
      {/* Conteúdo */}
    </Card>
  </div>
</div>
```
