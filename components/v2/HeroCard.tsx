"use client";

import { motion } from "framer-motion";

export default function HeroCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-5xl mx-auto mb-16"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-serraglio-orangeLight via-serraglio-orangeLighter to-serraglio-orangeDark rounded-[3rem] blur-3xl opacity-20 animate-glow-pulse"></div>

      {/* Main card */}
      <div className="relative bg-black rounded-[3rem] border-[5px] border-serraglio-orange overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,77,0,0.1) 10px, rgba(255,77,0,0.1) 20px)`
          }}></div>
        </div>

        {/* Content */}
        <div className="relative px-8 sm:px-16 py-12 sm:py-16 flex flex-col sm:flex-row items-center gap-8 sm:gap-12">
          {/* Badge */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              duration: 1,
              delay: 0.3,
              ease: [0.34, 1.56, 0.64, 1],
              type: "spring"
            }}
            className="relative flex-shrink-0"
          >
            {/* Badge glow */}
            <div className="absolute inset-0 bg-serraglio-gradient rounded-full blur-2xl opacity-60 scale-110"></div>

            {/* Badge circle */}
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-serraglio-gradient flex items-center justify-center shadow-2xl">
              <div className="w-[90%] h-[90%] rounded-full bg-serraglio-orange flex items-center justify-center">
                <span className="font-display text-6xl sm:text-7xl font-black text-white">50</span>
              </div>

              {/* Decorative notches */}
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-3 h-3 bg-serraglio-orange rounded-full"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `rotate(${i * 30}deg) translateY(-70px)`,
                  }}
                ></div>
              ))}
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 text-center sm:text-left"
          >
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tight mb-3">
              FORMATOS
            </h1>
            <p className="font-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white/90 leading-tight">
              que <span className="font-semibold">escalam</span>
            </p>
          </motion.div>
        </div>

        {/* Bottom gradient bar */}
        <div className="h-8 bg-serraglio-gradient"></div>
      </div>
    </motion.div>
  );
}
