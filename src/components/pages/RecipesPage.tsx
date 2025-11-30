import { motion } from 'framer-motion';
import { Utensils } from 'lucide-react';

export default function RecipesPage() {
  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Utensils className="w-20 h-20 text-foreground/30 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-heading text-foreground mb-4">
            Эрүүл жорууд ба зууш
          </h1>
          <p className="text-lg text-foreground/60 font-paragraph max-w-2xl mx-auto">
            Энэ хэсэг одоогоор боломжгүй байна
          </p>
        </motion.div>
      </div>
    </div>
  );
}