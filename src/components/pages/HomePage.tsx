// HPI 1.6-G
import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useMember } from '@/integrations';
import { Button } from '@/components/ui/button';
import { Heart, Target, Users, ArrowRight, BrainCircuit, Apple, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Image } from '@/components/ui/image';

type AnimatedElementProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
};

const AnimatedElement: React.FC<AnimatedElementProps> = ({ children, className, delay = 0, threshold = 0.1 }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    element.classList.add('is-visible');
                }, delay);
                observer.unobserve(element);
            }
        }, { threshold });

        observer.observe(element);
        return () => observer.disconnect();
    }, [delay, threshold]);

    return <div ref={ref} className={`${className || ''} animate-reveal`}>{children}</div>;
};

const ParallaxImage = ({ id, alt }: { id: string; alt: string }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  return (
    <div ref={ref} className="absolute inset-0 overflow-clip">
      <motion.div className="w-full h-[140%] -translate-y-[20%]" style={{ y }}>
        <Image
          src={'https://static.wixstatic.com/media/906313_9d55c52f5b394e50851eaf919ca0268c~mv2.png?originWidth=1600&originHeight=896'}
          alt={alt}
          className="w-full h-full object-cover"
        />
      </motion.div>
    </div>
  );
};

export default function HomePage() {
  const { isAuthenticated, actions } = useMember();
  const heroRef = useRef(null);
  const { scrollYProgress: heroScrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroTextOpacity = useTransform(heroScrollYProgress, [0, 0.5], [1, 0]);
  const heroTextY = useTransform(heroScrollYProgress, [0, 0.5], ["0%", "-50%"]);

  const featureIcons = [
    { icon: Bot, text: "AI Зөвлөгөө", color: "primary" },
    { icon: Target, text: "Хувийн төлөвлөгөө", color: "secondary" },
    { icon: Apple, text: "Эрүүл хооллолт", color: "soft-light-green" },
    { icon: BrainCircuit, text: "Сэтгэлзүйн дэмжлэг", color: "primary" },
  ];

  return (
    <>
      <style>{`
        .animate-reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s cubic-bezier(0.215, 0.610, 0.355, 1), transform 0.8s cubic-bezier(0.215, 0.610, 0.355, 1);
        }
        .animate-reveal.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .hero-gradient::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0) 100%);
          z-index: 2;
        }
        .feature-card {
          background-color: rgba(252, 228, 236, 0.2);
          border: 1px solid rgba(252, 228, 236, 0.4);
          box-shadow: 0 8px 32px 0 rgba(242, 208, 216, 0.2);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 16px 40px 0 rgba(242, 208, 216, 0.3);
        }
        .text-balance { text-wrap: balance; }
      `}</style>
      <div className="min-h-screen bg-background font-paragraph text-foreground selection:bg-primary/50 selection:text-primary-foreground">
        
        {/* Hero Section */}
        <section ref={heroRef} className="h-screen w-full relative flex items-center justify-center text-center overflow-clip hero-gradient">
          <ParallaxImage id="hero-background-serene" alt="Pastel pink and green abstract background" />
          <motion.div 
            style={{ opacity: heroTextOpacity, y: heroTextY }}
            className="relative z-10 px-4 max-w-5xl"
          >
            <motion.h1 
              className="text-5xl md:text-7xl lg:text-8xl font-heading text-foreground mb-6 text-balance"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1, transition: { duration: 0.8, delay: 0.2, ease: "easeOut" } }}
            >
              NegOne: Нэгдмэл Нэг Аялал
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl text-foreground/80 mb-10 max-w-3xl mx-auto text-balance"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1, transition: { duration: 0.8, delay: 0.4, ease: "easeOut" } }}
            >
              AI-д суурилсан фитнес, сэтгэлзүй, эрүүл амьдралын хэв маягийн таны хувийн туслах.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1, transition: { duration: 0.8, delay: 0.6, ease: "easeOut" } }}
            >
              {isAuthenticated ? (
                <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/80 rounded-full px-8 py-6 text-lg font-semibold transition-transform duration-300 hover:scale-105">
                  <Link to="/dashboard">Хяналтын самбар</Link>
                </Button>
              ) : (
                <Button 
                  onClick={actions.login}
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/80 rounded-full px-8 py-6 text-lg font-semibold transition-transform duration-300 hover:scale-105"
                >
                  Gmail-ээр нэвтрэх
                </Button>
              )}
              <Button asChild variant="outline" size="lg" className="border-primary/50 text-foreground hover:bg-primary/20 rounded-full px-8 py-6 text-lg font-semibold transition-transform duration-300 hover:scale-105">
                <Link to="/about">Бидний тухай</Link>
              </Button>
            </motion.div>
          </motion.div>
        </section>

        {/* Features Icons Bar */}
        <section className="py-12 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {featureIcons.map((item, index) => (
                <AnimatedElement key={item.text} delay={index * 100}>
                  <div className="flex flex-col items-center gap-3">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-${item.color}/20`}>
                      <item.icon className={`w-8 h-8 text-foreground/80`} />
                    </div>
                    <p className="font-semibold text-foreground/90 text-sm md:text-base">{item.text}</p>
                  </div>
                </AnimatedElement>
              ))}
            </div>
          </div>
        </section>

        {/* Sticky Features Section */}
        <section className="py-24 md:py-32 bg-white">
          <div className="max-w-[100rem] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div className="md:sticky md:top-24">
              <AnimatedElement>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading text-foreground mb-6 text-balance">
                  Таны эрүүл мэндийн цогц хөтөч
                </h2>
                <p className="text-lg text-foreground/70 mb-8 max-w-xl">
                  AI технологи ашиглан таны биеийн галбир, зорилго, хэрэгцээнд тохирсон дасгал, хооллолт, сэтгэлзүйн дэмжлэг үзүүлнэ.
                </p>
                <Button asChild variant="link" className="text-lg text-primary-foreground/80 p-0 hover:text-primary-foreground">
                  <Link to={isAuthenticated ? "/dashboard" : "#"} onClick={!isAuthenticated ? actions.login : undefined}>
                    Илүү ихийг мэдэх <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </AnimatedElement>
            </div>
            <div className="grid grid-cols-1 gap-8">
              <AnimatedElement delay={100}>
                <div className="feature-card rounded-3xl p-8">
                  <div className="w-16 h-16 bg-primary/40 rounded-2xl flex items-center justify-center mb-6">
                    <Target className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-heading text-foreground mb-3">Хувийн зорилго</h3>
                  <p className="text-foreground/70">
                    Таны биеийн галбир, зорилгод тохирсон дасгал, хооллолтын зөвлөгөөг AI автоматаар боловсруулж өгнө.
                  </p>
                </div>
              </AnimatedElement>
              <AnimatedElement delay={200}>
                <div className="feature-card rounded-3xl p-8">
                  <div className="w-16 h-16 bg-secondary/30 rounded-2xl flex items-center justify-center mb-6">
                    <Heart className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-heading text-foreground mb-3">Сэтгэлзүйн дэмжлэг</h3>
                  <p className="text-foreground/70">
                    Өдөр тутмын сэтгэлзүйн байдлаа тэмдэглэж, өөрийгөө хайрлах, стрессээс ангижрах арга замыг олоорой.
                  </p>
                </div>
              </AnimatedElement>
              <AnimatedElement delay={300}>
                <div className="feature-card rounded-3xl p-8">
                  <div className="w-16 h-16 bg-soft-light-green/60 rounded-2xl flex items-center justify-center mb-6">
                    <Users className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-heading text-foreground mb-3">Ахиц дэвшил</h3>
                  <p className="text-foreground/70">
                    Өдөр тутмын ахиц дэвшлээ хянаж, зорилгодоо хүрэх замаа календарь болон графикаар хараарай.
                  </p>
                </div>
              </AnimatedElement>
            </div>
          </div>
        </section>

        {/* Visual Breather Section */}
        <section className="h-[70vh] w-full relative overflow-clip bg-primary/20">
          <ParallaxImage id="visual-breather-calm-water" alt="Calm, serene water with pastel reflections" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent z-10"></div>
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <AnimatedElement>
              <h3 className="text-3xl md:text-4xl font-heading text-foreground/90 text-center max-w-3xl mx-auto px-4 text-balance">
                "Өөрийгөө хайрлах аялал бол хамгийн чухал аялал юм."
              </h3>
            </AnimatedElement>
          </div>
        </section>

        {/* About Teaser Section */}
        <section className="py-24 md:py-32 bg-white">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <AnimatedElement>
              <h2 className="text-4xl md:text-5xl font-heading text-foreground mb-6">NegOne гэж юу вэ?</h2>
              <p className="text-lg text-foreground/70 max-w-3xl mx-auto mb-10 text-balance">
                <span className="font-semibold text-foreground">Neg</span> (Монгол) + <span className="font-semibold text-foreground">One</span> (Англи) = Нэгдмэл Нэг. Нэг зорилго, нэг зүрх сэтгэл, нэг баг. Дуудлагаараа "Ногоон" гэсэнтэй төстэй нь тайвшрал, эерэг сэтгэлзүйн бэлгэдэл болдог.
              </p>
              <Button asChild size="lg" className="bg-soft-light-green/80 text-primary-foreground hover:bg-soft-light-green rounded-full px-8 py-6 text-lg font-semibold transition-transform duration-300 hover:scale-105">
                <Link to="/about">Багтай танилцах</Link>
              </Button>
            </AnimatedElement>
          </div>
        </section>

        {/* CTA Section */}
        {!isAuthenticated && (
          <section className="py-24 md:py-32 bg-gradient-to-br from-primary/20 to-secondary/20">
            <div className="max-w-4xl mx-auto text-center px-6">
              <AnimatedElement>
                <h2 className="text-4xl md:text-5xl font-heading text-foreground mb-6 text-balance">
                  Өнөөдөр эхлээрэй
                </h2>
                <p className="text-lg text-foreground/70 mb-10 max-w-2xl mx-auto text-balance">
                  Таны эрүүл, аз жаргалтай амьдралын хэв маяг эндээс эхэлнэ.
                </p>
                <Button 
                  onClick={actions.login}
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/80 rounded-full px-10 py-7 text-xl font-semibold transition-transform duration-300 hover:scale-105 shadow-lg shadow-primary/30"
                >
                  Үнэгүй бүртгүүлэх
                </Button>
              </AnimatedElement>
            </div>
          </section>
        )}
      </div>
    </>
  );
}