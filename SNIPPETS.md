# Snippets Úteis - Serraglio Design System

## 🎨 Componentes Rápidos

### 1. Página Completa com Background

```jsx
export default function Page() {
  return (
    <div className="min-h-screen bg-black p-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-serraglio-orange/30 via-serraglio-orangeLight/20 to-transparent rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-tl from-serraglio-orangeDark/25 via-serraglio-orange/15 to-transparent rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }}></div>

      <div className="relative z-10 max-w-7xl mx-auto py-10">
        {/* Conteúdo aqui */}
      </div>
    </div>
  );
}
```

### 2. Hero Section

```jsx
<div className="text-center mb-12 space-y-6">
  {/* Badge */}
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-serraglio-orange/15 to-serraglio-orangeDark/15 border-2 border-serraglio-orange/30 backdrop-blur-sm shadow-lg shadow-serraglio-orange/10">
      <Sparkles className="w-4 h-4 text-serraglio-orange" />
      <span className="font-display text-sm font-bold text-white uppercase tracking-[0.15em]">
        Badge Text
      </span>
    </div>
  </motion.div>

  {/* Título */}
  <motion.h1
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, delay: 0.1 }}
    className="font-display text-6xl md:text-7xl font-black leading-[0.95] tracking-tight"
  >
    <span className="text-white block">Texto Normal</span>
    <span className="gradient-serraglio-text block mt-2">Texto Destaque</span>
  </motion.h1>

  {/* Subtítulo */}
  <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
    Descrição do serviço ou produto com{" "}
    <span className="text-serraglio-orange font-semibold">palavras destacadas</span>
  </p>
</div>
```

### 3. Card Serraglio

```jsx
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.5 }}
>
  <Card className="border-2 border-serraglio-orange/20 backdrop-blur-2xl bg-gradient-to-br from-black/90 via-black/80 to-serraglio-orange/5 shadow-2xl shadow-serraglio-orange/20 rounded-3xl overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-serraglio-orange/5 to-transparent opacity-50 pointer-events-none"></div>

    <CardContent className="relative p-10">
      {/* Conteúdo do card */}
    </CardContent>
  </Card>
</motion.div>
```

### 4. Button Group

```jsx
<div className="flex gap-4">
  <Button
    className="bg-gradient-to-r from-serraglio-orange to-serraglio-orangeDark hover:from-serraglio-orangeLight hover:to-serraglio-orange"
  >
    Ação Primária
  </Button>

  <Button
    variant="outline"
    className="border-white/20 hover:border-serraglio-orange/50"
  >
    Ação Secundária
  </Button>
</div>
```

### 5. Lista com Ícones

```jsx
<div className="space-y-4">
  {items.map((item, i) => (
    <motion.div
      key={i}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: i * 0.1 }}
      className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border-2 border-white/10 hover:border-serraglio-orange/30 transition-all duration-300"
    >
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-serraglio-orange to-serraglio-orangeDark flex items-center justify-center">
        <Check className="w-5 h-5 text-white" />
      </div>
      <div>
        <h3 className="font-display font-bold text-white">{item.title}</h3>
        <p className="text-sm text-gray-400">{item.description}</p>
      </div>
    </motion.div>
  ))}
</div>
```

### 6. Grid Responsivo de Cards

```jsx
<div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {items.map((item, i) => (
    <motion.div
      key={i}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.05 }}
      whileHover={{ scale: 1.02, y: -4 }}
    >
      <Card className="border-2 border-serraglio-orange/20 hover:border-serraglio-orange/50 bg-gradient-to-br from-black/90 to-serraglio-orange/5 rounded-2xl cursor-pointer transition-all duration-300">
        <CardContent className="p-6">
          {/* Conteúdo */}
        </CardContent>
      </Card>
    </motion.div>
  ))}
</div>
```

### 7. Input com Label

```jsx
<div className="space-y-3">
  <label className="block text-sm font-semibold text-white/90 tracking-wide">
    Nome do Campo
  </label>
  <Input
    type="text"
    placeholder="Digite aqui..."
    className="h-16 text-base bg-white/5 border-2 border-white/10 hover:border-serraglio-orange/30 focus:border-serraglio-orange/50 rounded-2xl"
  />
</div>
```

### 8. Loading Spinner

```jsx
<motion.div
  animate={{ rotate: 360 }}
  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
  className="w-8 h-8 border-3 border-white/20 border-t-serraglio-orange rounded-full"
/>
```

### 9. Toast/Alert Serraglio

```jsx
<motion.div
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  className="p-4 rounded-2xl bg-gradient-to-r from-serraglio-orange/20 to-serraglio-orangeDark/20 border-2 border-serraglio-orange/40 backdrop-blur-xl shadow-lg"
>
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-serraglio-orange to-serraglio-orangeDark flex items-center justify-center">
      <AlertCircle className="w-5 h-5 text-white" />
    </div>
    <div>
      <h4 className="font-display font-bold text-white">Título do Alert</h4>
      <p className="text-sm text-gray-300">Mensagem descritiva</p>
    </div>
  </div>
</motion.div>
```

### 10. Stat Card (Métricas)

```jsx
<div className="p-6 rounded-2xl bg-gradient-to-br from-serraglio-orange/10 to-serraglio-orangeDark/10 border-2 border-serraglio-orange/30 backdrop-blur-xl">
  <div className="text-sm font-display text-gray-400 uppercase tracking-wider mb-2">
    Métrica
  </div>
  <div className="font-display text-4xl font-black text-white mb-1">
    1,234
  </div>
  <div className="flex items-center gap-2 text-sm">
    <TrendingUp className="w-4 h-4 text-green-400" />
    <span className="text-green-400 font-semibold">+12.5%</span>
    <span className="text-gray-500">vs. mês anterior</span>
  </div>
</div>
```

## 🎨 Classes Utilitárias

### Gradientes

```jsx
// Texto com gradiente
className="gradient-serraglio-text"

// Background com gradiente
className="bg-gradient-to-r from-serraglio-orange to-serraglio-orangeDark"

// Gradiente de três cores
className="bg-gradient-to-br from-serraglio-orange via-serraglio-orangeLighter to-serraglio-orangeDark"
```

### Glow Effects

```jsx
// Sutil
className="shadow-lg shadow-serraglio-orange/20"

// Médio
className="shadow-xl shadow-serraglio-orange/40"

// Forte
className="shadow-2xl shadow-serraglio-orange/60"
```

### Glass Morphism

```jsx
className="backdrop-blur-xl bg-white/5 border-2 border-white/10"
```

### Hover States

```jsx
// Scale + Lift
className="hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300"

// Border Glow
className="border-2 border-white/10 hover:border-serraglio-orange/50 hover:shadow-lg hover:shadow-serraglio-orange/20"
```

## 📱 Layouts Responsivos

### Container Centralizado

```jsx
<div className="max-w-7xl mx-auto px-4 py-10">
  {/* Conteúdo */}
</div>
```

### Grid Adaptativo

```jsx
// 1 col mobile, 2 tablet, 3 desktop
className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

// 1 col mobile, 3 desktop
className="grid gap-6 grid-cols-1 lg:grid-cols-3"

// Auto-fit com min-width
className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]"
```

### Flex Responsivo

```jsx
// Stack mobile, row desktop
className="flex flex-col lg:flex-row gap-4"

// Centralizado
className="flex items-center justify-center"
```

## 🎭 Animações Framer Motion

### Fade In

```jsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.6 }}
>
  {/* Conteúdo */}
</motion.div>
```

### Slide Up

```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
>
  {/* Conteúdo */}
</motion.div>
```

### Stagger Children

```jsx
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }}
>
  {items.map((item) => (
    <motion.div
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
    >
      {/* Item */}
    </motion.div>
  ))}
</motion.div>
```

## 🎯 Dicas de Performance

1. **Otimize animações pesadas**:
```jsx
// Use will-change para animações frequentes
className="will-change-transform"
```

2. **Lazy load de imagens**:
```jsx
<Image
  src="/image.jpg"
  alt="Description"
  loading="lazy"
  className="rounded-2xl"
/>
```

3. **Memoize componentes pesados**:
```jsx
const ExpensiveComponent = React.memo(({ data }) => {
  // Renderização pesada
});
```

---

**Criado com ❤️ usando o Design System Serraglio**
