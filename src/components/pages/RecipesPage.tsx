import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Utensils, Sparkles, X, Loader2, AlertCircle, Flame, Clock, Zap } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Image } from '@/components/ui/image';
import { BaseCrudService } from '@/integrations';
import { HealthyRecipesandSnacks } from '@/entities';

// Fallback image mapping based on recipe type and ingredients
const FALLBACK_IMAGES: Record<string, string> = {
  // Salads
  'салат': 'https://static.wixstatic.com/media/906313_2b1868ded2464d20b142c5fa322b6d9d~mv2.png?originWidth=384&originHeight=192',
  'цөцгий': 'https://static.wixstatic.com/media/906313_2b303e502aaa46e39be003a82fec163e~mv2.png?originWidth=384&originHeight=192',
  'авокадо': 'https://static.wixstatic.com/media/906313_3dac49888ecc456ea128c557b1749cd0~mv2.png?originWidth=384&originHeight=192',
  
  // Smoothies & Drinks
  'жүүс': 'https://static.wixstatic.com/media/906313_4d71f9e2e5934fd0b7283899257f9ea4~mv2.png?originWidth=384&originHeight=192',
  'смүүси': 'https://static.wixstatic.com/media/906313_6b7d0bd0e5494cd6b0cbc36a0d70bf09~mv2.png?originWidth=384&originHeight=192',
  'цай': 'https://static.wixstatic.com/media/906313_a3c5fdf683a54c9bab0c37b1962b907b~mv2.png?originWidth=384&originHeight=192',
  
  // Breakfast
  'өндөг': 'https://static.wixstatic.com/media/906313_8bde755ccf5f4b24809dd003eca214f1~mv2.png?originWidth=384&originHeight=192',
  'үрийн': 'https://static.wixstatic.com/media/906313_b80a7da2613746cdbd6af2ff8fe378fd~mv2.png?originWidth=384&originHeight=192',
  'хүнсний': 'https://static.wixstatic.com/media/906313_1bb8c2ea731649ad91a87dbdf31e171d~mv2.png?originWidth=384&originHeight=192',
  
  // Soups
  'шөл': 'https://static.wixstatic.com/media/906313_2cf61cc049bd4ab79b28b481c401f068~mv2.png?originWidth=384&originHeight=192',
  'нэрс': 'https://static.wixstatic.com/media/906313_f9375cf510e24065a714105913d97e94~mv2.png?originWidth=384&originHeight=192',
  
  // Proteins
  'мах': 'https://static.wixstatic.com/media/906313_2c2b1a0a86b54195aa7fbd34ca87ceac~mv2.png?originWidth=384&originHeight=192',
  'цыпилон': 'https://static.wixstatic.com/media/906313_28b80740003a495791d5c1de873ef229~mv2.png?originWidth=384&originHeight=192',
  'загас': 'https://static.wixstatic.com/media/906313_0acddb55b2d1445faa26ef0f3de58bc3~mv2.png?originWidth=384&originHeight=192',
  
  // Grains & Carbs
  'будаа': 'https://static.wixstatic.com/media/906313_97cedb589104419e9cfab9a497fd1e37~mv2.png?originWidth=384&originHeight=192',
  'макарон': 'https://static.wixstatic.com/media/906313_33f097e1340f49f0a0836b85b6b1340a~mv2.png?originWidth=384&originHeight=192',
  'талх': 'https://static.wixstatic.com/media/906313_2ea16bf273344f31aa1061cee35862b5~mv2.png?originWidth=384&originHeight=192',
  
  // Vegetables
  'төмс': 'https://static.wixstatic.com/media/906313_9ff04f07db9c4c6dad2f350f7d7a31df~mv2.png?originWidth=384&originHeight=192',
  'сонгино': 'https://static.wixstatic.com/media/906313_000e17889363429e85cab1036de05c60~mv2.png?originWidth=384&originHeight=192',
  'томат': 'https://static.wixstatic.com/media/906313_6d79aab922314ab8868e58cf36120cf7~mv2.png?originWidth=384&originHeight=192',
  
  // Fruits
  'жимс': 'https://static.wixstatic.com/media/906313_89e2deec0b7244b1a29a17f50cf25339~mv2.png?originWidth=384&originHeight=192',
  'алим': 'https://static.wixstatic.com/media/906313_f71495667ebd40939fd3a9609fea15d9~mv2.png?originWidth=384&originHeight=192',
  'банан': 'https://static.wixstatic.com/media/906313_c923c851b53445ec9627dcd22e133af8~mv2.png?originWidth=384&originHeight=192',
  
  // Snacks
  'зууш': 'https://static.wixstatic.com/media/906313_d4a31e6145884d63be95040b2487a2e7~mv2.png?originWidth=384&originHeight=192',
  'түрэмгий': 'https://static.wixstatic.com/media/906313_6b68a002ffc74dbe9f943d7ed383831a~mv2.png?originWidth=384&originHeight=192',
  'үр': 'https://static.wixstatic.com/media/906313_efe1c9f0e5b844cfbdca02e51d093c37~mv2.png?originWidth=384&originHeight=192',
  
  // Default
  'default': 'https://static.wixstatic.com/media/906313_33f48af3d6be4e6b9dd7c541eb3dcc3d~mv2.png?originWidth=384&originHeight=192',
};

// Function to get fallback image based on recipe name and ingredients
function getFallbackImage(recipeName?: string, ingredients?: string): string {
  const searchText = `${recipeName || ''} ${ingredients || ''}`.toLowerCase();
  
  // Check for exact matches in fallback images
  for (const [keyword, imageUrl] of Object.entries(FALLBACK_IMAGES)) {
    if (keyword !== 'default' && searchText.includes(keyword)) {
      return imageUrl;
    }
  }
  
  // Return default if no match found
  return FALLBACK_IMAGES.default;
}

interface ParsedRecipe {
  name: string;
  type: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  totalCalories: number;
  caloriesPerServing: number;
  servings: number;
  prepTime?: number;
  cookTime?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  tags?: string[];
  image?: string;
  imagePrompt?: string;
}

interface RecipeModalProps {
  recipe: ParsedRecipe | HealthyRecipesandSnacks | null;
  isOpen: boolean;
  onClose: () => void;
}

// Typo correction mapping for common Mongolian ingredients
const INGREDIENT_CORRECTIONS: Record<string, string> = {
  'өндг': 'өндөг',
  'өндгө': 'өндөг',
  'сүүнэй': 'сүү',
  'авокадо': 'авокадо',
  'авокад': 'авокадо',
  'лимон': 'лимон',
  'лимонд': 'лимон',
  'томат': 'томат',
  'томатны': 'томат',
  'салат': 'салат',
  'сонгино': 'сонгино',
  'сонгин': 'сонгино',
  'цөцгий': 'цөцгий',
  'цөцгийн': 'цөцгий',
  'сарай': 'сарай',
  'сараймаа': 'сарай',
  'төмс': 'төмс',
  'төмсний': 'төмс',
  'гахай': 'гахай',
  'гахайн': 'гахай',
  'мах': 'мах',
  'махны': 'мах',
  'цыпилон': 'цыпилон',
  'цыпилонны': 'цыпилон',
  'сүүтэй': 'сүү',
  'сүүний': 'сүү',
  'ус': 'ус',
  'усны': 'ус',
  'нар': 'нарны тос',
  'нарны': 'нарны тос',
  'хүнсний': 'хүнсний тос',
  'хүнсний тос': 'хүнсний тос',
  'цагаан сахар': 'цагаан сахар',
  'сахар': 'сахар',
  'давс': 'давс',
  'давсны': 'давс',
  'сармис': 'сармис',
  'сармисны': 'сармис',
  'цэцэг': 'цэцэг',
  'цэцэгний': 'цэцэг',
  'хүрэл': 'хүрэл',
  'хүрэлний': 'хүрэл',
};

function correctIngredient(ingredient: string): string {
  const lower = ingredient.toLowerCase().trim();
  return INGREDIENT_CORRECTIONS[lower] || ingredient;
}

// Determine meal type/health goal tag based on recipe name and ingredients
function getMealTypeTag(recipeName: string, ingredients: string): string {
  const searchText = `${recipeName} ${ingredients}`.toLowerCase();
  
  // Breakfast indicators
  if (searchText.includes('өглөө') || searchText.includes('цай') || 
      (searchText.includes('өндөг') && !searchText.includes('үдийн')) ||
      searchText.includes('үр') || searchText.includes('гарнир')) {
    return 'Өглөөний цай';
  }
  
  // Lunch indicators
  if (searchText.includes('үдийн') || searchText.includes('үдээс') ||
      searchText.includes('шөл') || searchText.includes('нэрс') ||
      (searchText.includes('мах') && searchText.includes('шөл'))) {
    return 'Үдийн хоол';
  }
  
  // Weight loss indicators
  if (searchText.includes('жин хасах') || searchText.includes('диет') ||
      searchText.includes('салат') || searchText.includes('цөцгий') ||
      (searchText.includes('авокадо') && searchText.includes('салат'))) {
    return 'Жин хасах';
  }
  
  // Healthy food indicators
  if (searchText.includes('эрүүл') || searchText.includes('органик') ||
      searchText.includes('жимс') || searchText.includes('ногоо')) {
    return 'Эрүүл хоол';
  }
  
  // Drink indicators
  if (searchText.includes('смүүси') || searchText.includes('жүүс') ||
      searchText.includes('уух')) {
    return 'Уух';
  }
  
  // Default to healthy food
  return 'Эрүүл хоол';
}

function generateHealthyTags(recipeName: string, ingredients: string[]): string[] {
  const tags: string[] = [];
  const nameAndIngredients = `${recipeName} ${ingredients.join(' ')}`.toLowerCase();
  
  if (nameAndIngredients.includes('салат') || nameAndIngredients.includes('цөцгий')) tags.push('Салат');
  if (nameAndIngredients.includes('смүүси') || nameAndIngredients.includes('жүүс')) tags.push('Уух');
  if (nameAndIngredients.includes('өндөг')) tags.push('Өндөг');
  if (nameAndIngredients.includes('загас')) tags.push('Загас');
  if (nameAndIngredients.includes('цыпилон') || nameAndIngredients.includes('мах')) tags.push('Мах');
  if (nameAndIngredients.includes('авокадо')) tags.push('Авокадо');
  if (nameAndIngredients.includes('сүү')) tags.push('Сүүтэй');
  if (nameAndIngredients.includes('жимс')) tags.push('Жимс');
  
  return tags.length > 0 ? tags.slice(0, 2) : ['Эрүүл'];
}

function generateMacros(caloriesPerServing: number): { protein: number; carbs: number; fat: number } {
  // Estimate macros based on calories (rough approximation)
  const protein = Math.round((caloriesPerServing * 0.3) / 4);
  const carbs = Math.round((caloriesPerServing * 0.45) / 4);
  const fat = Math.round((caloriesPerServing * 0.25) / 9);
  
  return { protein, carbs, fat };
}

// Estimate realistic prep and cook times based on recipe type and ingredients
// All times are between 5-25 minutes total
function estimateCookingTimes(recipeName: string, ingredients: string): { prepTime: number; cookTime: number } {
  const searchText = `${recipeName} ${ingredients}`.toLowerCase();
  
  // EASY RECIPES (5-7 minutes total)
  
  // Drinks & Smoothies - minimal prep, no cooking
  if (searchText.includes('смүүси') || searchText.includes('жүүс') || searchText.includes('цай')) {
    return { prepTime: 5, cookTime: 0 };
  }
  
  // Fruits - minimal prep, no cooking
  if (searchText.includes('жимс') || searchText.includes('алим') || searchText.includes('банан')) {
    return { prepTime: 5, cookTime: 0 };
  }
  
  // Snacks - quick prep
  if (searchText.includes('зууш') || searchText.includes('түрэмгий') || searchText.includes('үр')) {
    return { prepTime: 5, cookTime: 0 };
  }
  
  // Salads - prep only, no cooking (easy)
  if (searchText.includes('салат') || searchText.includes('цөцгий')) {
    return { prepTime: 7, cookTime: 0 };
  }
  
  // MODERATE RECIPES (10-15 minutes total)
  
  // Eggs - quick prep and cooking
  if (searchText.includes('өндөг') && !searchText.includes('шөл')) {
    return { prepTime: 5, cookTime: 10 };
  }
  
  // Pasta - moderate cooking
  if (searchText.includes('макарон')) {
    return { prepTime: 5, cookTime: 10 };
  }
  
  // Rice/Grain dishes - moderate cooking
  if (searchText.includes('будаа') || searchText.includes('гарнир')) {
    return { prepTime: 5, cookTime: 10 };
  }
  
  // COMPLEX RECIPES (20-25 minutes total)
  
  // Soups - longer cooking time
  if (searchText.includes('шөл') || searchText.includes('нэрс')) {
    return { prepTime: 5, cookTime: 20 };
  }
  
  // Fish - moderate prep and cooking
  if (searchText.includes('загас')) {
    return { prepTime: 5, cookTime: 20 };
  }
  
  // Chicken - moderate prep and cooking
  if (searchText.includes('цыпилон') || (searchText.includes('мах') && searchText.includes('цыпилон'))) {
    return { prepTime: 5, cookTime: 20 };
  }
  
  // Meat dishes - longer cooking
  if (searchText.includes('мах') && !searchText.includes('салат')) {
    return { prepTime: 5, cookTime: 20 };
  }
  
  // Vegetables - moderate prep and cooking
  if (searchText.includes('төмс') || searchText.includes('сонгино') || searchText.includes('томат')) {
    return { prepTime: 5, cookTime: 15 };
  }
  
  // Bread - longer cooking
  if (searchText.includes('талх')) {
    return { prepTime: 5, cookTime: 20 };
  }
  
  // Default estimate for unknown recipes (moderate complexity)
  return { prepTime: 5, cookTime: 10 };
}

function parseRecipesText(text: string): ParsedRecipe[] {
  const recipes: ParsedRecipe[] = [];
  const recipeBlocks = text.split('---').filter(block => block.trim());

  for (const block of recipeBlocks) {
    const lines = block.trim().split('\n').filter(line => line.trim());
    if (lines.length === 0) continue;

    let recipe: Partial<ParsedRecipe> = {
      ingredients: [],
      instructions: [],
      prepTime: 15,
      cookTime: 20,
    };

    let currentSection = '';

    for (const line of lines) {
      const trimmed = line.trim();

      if (trimmed.startsWith('ЖОР')) {
        const nameMatch = trimmed.match(/ЖОР\s*\d*:\s*(.+)/);
        if (nameMatch) recipe.name = nameMatch[1].trim();
      } else if (trimmed.startsWith('Төрөл:')) {
        recipe.type = trimmed.replace('Төрөл:', '').trim();
      } else if (trimmed.startsWith('Тайлбар:')) {
        recipe.description = trimmed.replace('Тайлбар:', '').trim();
      } else if (trimmed.startsWith('Бэлтгэл:')) {
        const prepMatch = trimmed.match(/Бэлтгэл:\\s*(\\d+)/);
        if (prepMatch) recipe.prepTime = parseInt(prepMatch[1]);
      } else if (trimmed.startsWith('Уураг:')) {
        const proteinMatch = trimmed.match(/Уураг:\\s*(\\d+)/);
        if (proteinMatch) recipe.protein = parseInt(proteinMatch[1]);
      } else if (trimmed.startsWith('Нүүрс:')) {
        const carbsMatch = trimmed.match(/Нүүрс:\\s*(\\d+)/);
        if (carbsMatch) recipe.carbs = parseInt(carbsMatch[1]);
      } else if (trimmed.startsWith('Өөх:')) {
        const fatMatch = trimmed.match(/Өөх:\\s*(\\d+)/);
        if (fatMatch) recipe.fat = parseInt(fatMatch[1]);
      } else if (trimmed.startsWith('Шошго:')) {
        const tagsText = trimmed.replace('Шошго:', '').trim();
        recipe.tags = tagsText.split(',').map(t => t.trim()).filter(t => t);
      } else if (trimmed.startsWith('Зургийн сэдэв:')) {
        recipe.imagePrompt = trimmed.replace('Зургийн сэдэв:', '').trim();
      } else if (trimmed.startsWith('Орцууд:')) {
        currentSection = 'ingredients';
      } else if (trimmed.startsWith('Хийх арга:')) {
        currentSection = 'instructions';
      } else if (trimmed.startsWith('Калори:')) {
        currentSection = 'calories';
        const calorieMatch = trimmed.match(/Нийт\s*(\d+)\s*калори\s*\|\s*Нэг хэсэгт\s*(\d+)\s*калори\s*\(\s*(\d+)\s*хэсэг\s*\)/);
        if (calorieMatch) {
          recipe.totalCalories = parseInt(calorieMatch[1]);
          recipe.caloriesPerServing = parseInt(calorieMatch[2]);
          recipe.servings = parseInt(calorieMatch[3]);
        }
      } else if (currentSection === 'ingredients' && trimmed.startsWith('-')) {
        const ingredient = trimmed.substring(1).trim();
        if (ingredient) recipe.ingredients?.push(ingredient);
      } else if (currentSection === 'instructions' && /^\d+\./.test(trimmed)) {
        const instruction = trimmed.replace(/^\d+\.\s*/, '').trim();
        if (instruction) recipe.instructions?.push(instruction);
      }
    }

    if (recipe.name && recipe.ingredients && recipe.ingredients.length > 0) {
      const caloriesPerServing = recipe.caloriesPerServing || 300;
      // Use parsed macros if available, otherwise generate them
      const macros = {
        protein: recipe.protein || generateMacros(caloriesPerServing).protein,
        carbs: recipe.carbs || generateMacros(caloriesPerServing).carbs,
        fat: recipe.fat || generateMacros(caloriesPerServing).fat,
      };
      
      // Estimate realistic cooking times based on recipe type
      const cookingTimes = estimateCookingTimes(recipe.name || '', recipe.ingredients.join(' '));
      
      recipes.push({
        name: recipe.name || 'Үл мэдэгдэх жор',
        type: recipe.type || 'Үл мэдэгдэх',
        description: recipe.description || '',
        ingredients: recipe.ingredients,
        instructions: recipe.instructions || [],
        totalCalories: recipe.totalCalories || 0,
        caloriesPerServing: caloriesPerServing,
        servings: recipe.servings || 1,
        prepTime: recipe.prepTime || cookingTimes.prepTime,
        cookTime: recipe.cookTime || cookingTimes.cookTime,
        protein: macros.protein,
        carbs: macros.carbs,
        fat: macros.fat,
        tags: recipe.tags && recipe.tags.length > 0 ? recipe.tags : generateHealthyTags(recipe.name || '', recipe.ingredients),
        imagePrompt: recipe.imagePrompt,
      });
    }
  }

  return recipes;
}

// Recipe Modal Component
function RecipeModal({ recipe, isOpen, onClose }: RecipeModalProps) {
  if (!isOpen || !recipe) return null;

  const isCmsRecipe = 'dishImage' in recipe;
  const image = isCmsRecipe ? (recipe as HealthyRecipesandSnacks).dishImage : (recipe as ParsedRecipe).image;
  const name = isCmsRecipe ? (recipe as HealthyRecipesandSnacks).recipeName : (recipe as ParsedRecipe).name;
  const description = isCmsRecipe ? (recipe as HealthyRecipesandSnacks).description : (recipe as ParsedRecipe).description;
  const ingredients = isCmsRecipe ? (recipe as HealthyRecipesandSnacks).ingredients?.split('\n') || [] : (recipe as ParsedRecipe).ingredients;
  const instructions = isCmsRecipe ? (recipe as HealthyRecipesandSnacks).instructions?.split('\n') || [] : (recipe as ParsedRecipe).instructions;
  const calories = isCmsRecipe ? (recipe as HealthyRecipesandSnacks).caloriesPerServing : (recipe as ParsedRecipe).caloriesPerServing;
  const parsedRecipe = recipe as ParsedRecipe;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Image */}
          {image && (
            <div className="w-full h-64 overflow-hidden bg-foreground/5">
              <Image
                src={image}
                alt={name || 'Recipe'}
                width={800}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6 md:p-8 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-3xl font-heading text-foreground mb-2">{name}</h2>
                {description && (
                  <p className="text-foreground/70 font-paragraph">{description}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-foreground/60 hover:text-foreground transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Macro Info - Simple Text */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-paragraph text-foreground/70">Калори:</span>
                <span className="font-heading font-bold text-foreground">{calories}</span>
              </div>
              {parsedRecipe.protein && (
                <div className="flex items-center justify-between">
                  <span className="font-paragraph text-foreground/70">Уураг:</span>
                  <span className="font-heading font-bold text-foreground">{parsedRecipe.protein}г</span>
                </div>
              )}
              {parsedRecipe.carbs && (
                <div className="flex items-center justify-between">
                  <span className="font-paragraph text-foreground/70">Нүүрс ус:</span>
                  <span className="font-heading font-bold text-foreground">{parsedRecipe.carbs}г</span>
                </div>
              )}
              {parsedRecipe.fat && (
                <div className="flex items-center justify-between">
                  <span className="font-paragraph text-foreground/70">Өөх тос:</span>
                  <span className="font-heading font-bold text-foreground">{parsedRecipe.fat}г</span>
                </div>
              )}
            </div>

            {/* Time Info */}
            {(parsedRecipe.prepTime || parsedRecipe.cookTime) && (
              <div className="flex gap-4">
                {parsedRecipe.prepTime && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="font-paragraph text-sm text-foreground/70">Бэлтгэл: {parsedRecipe.prepTime} мин</span>
                  </div>
                )}
                {parsedRecipe.cookTime && (
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-primary" />
                    <span className="font-paragraph text-sm text-foreground/70">Хоол: {parsedRecipe.cookTime} мин</span>
                  </div>
                )}
              </div>
            )}

            {/* Ingredients */}
            <div>
              <h3 className="text-lg font-heading text-foreground mb-3">Орцуу</h3>
              <ul className="space-y-2">
                {ingredients.map((ingredient, i) => (
                  <li key={i} className="flex items-start gap-3 text-foreground/80 font-paragraph">
                    <span className="text-primary font-bold mt-0.5">•</span>
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            {instructions.length > 0 && (
              <div>
                <h3 className="text-lg font-heading text-foreground mb-3">Хийх арга</h3>
                <ol className="space-y-3">
                  {instructions.map((instruction, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="font-heading text-primary font-bold shrink-0 w-6">{i + 1}.</span>
                      <span className="text-foreground/80 font-paragraph">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Close Button */}
            <Button
              onClick={onClose}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-paragraph h-11"
            >
              Хаах
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Recipe Card Component for AI-generated recipes
function RecipeCard({ recipe, onCardClick }: { recipe: ParsedRecipe; onCardClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onClick={onCardClick}
      className="cursor-pointer group"
    >
      <div className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-lg transition-shadow h-full flex flex-col">
        {/* Content Container */}
        <div className="p-5 flex flex-col flex-1">
          {/* Header: Title + Calorie Chip */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="text-lg font-heading font-bold text-foreground flex-1 line-clamp-2">
              {recipe.name}
            </h3>
            {/* Calorie Chip - Right aligned */}
            <div className="bg-pink-100 text-pink-600 rounded-full px-3 py-1 text-xs font-bold whitespace-nowrap">
              {recipe.caloriesPerServing} ккал
            </div>
          </div>

          {/* Description */}
          {recipe.description && (
            <p className="text-foreground/60 font-paragraph text-xs line-clamp-2 mb-3">
              {recipe.description}
            </p>
          )}

          {/* Time + Tag Row */}
          <div className="flex items-center justify-between gap-2 mb-4">
            {/* Time Info - Show total time */}
            {(recipe.prepTime || recipe.cookTime) && (
              <div className="flex items-center gap-1 text-foreground/70">
                <Clock className="w-4 h-4 text-foreground/70" />
                <span className="font-paragraph text-xs">
                  {recipe.prepTime && recipe.cookTime 
                    ? `${recipe.prepTime + recipe.cookTime} мин`
                    : recipe.prepTime 
                    ? `${recipe.prepTime} мин`
                    : `${recipe.cookTime} мин`
                  }
                </span>
              </div>
            )}
            
            {/* Tag - Thin red border */}
            {recipe.tags && recipe.tags.length > 0 && (
              <div className="border border-destructive text-destructive rounded-full px-3 py-1 text-xs font-paragraph">
                {recipe.tags[0]}
              </div>
            )}
          </div>

          {/* Macros - 3 Columns */}
          <div className="grid grid-cols-3 gap-2 mb-4 text-center">
            <div>
              <div className="text-xs font-paragraph text-foreground/60">Уураг</div>
              <div className="text-sm font-heading font-bold text-foreground">{recipe.protein}г</div>
            </div>
            <div>
              <div className="text-xs font-paragraph text-foreground/60">Нүүрс ус</div>
              <div className="text-sm font-heading font-bold text-foreground">{recipe.carbs}г</div>
            </div>
            <div>
              <div className="text-xs font-paragraph text-foreground/60">Өөх тос</div>
              <div className="text-sm font-heading font-bold text-foreground">{recipe.fat}г</div>
            </div>
          </div>

          {/* View Details Button - Large rounded */}
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onCardClick();
            }}
            className="w-full bg-soft-light-green text-foreground hover:bg-soft-light-green/80 rounded-full font-paragraph font-bold h-11 mt-auto"
          >
            Жор харах
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// CMS Recipe Card Component
function CMSRecipeCard({ recipe, onCardClick }: { recipe: HealthyRecipesandSnacks; onCardClick: () => void }) {
  const calories = recipe.caloriesPerServing || 0;
  const macros = generateMacros(calories);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onClick={onCardClick}
      className="cursor-pointer group"
    >
      <div className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-lg transition-shadow h-full flex flex-col">
        {/* Image Container - Hidden */}

        {/* Content Container */}
        <div className="p-5 flex flex-col flex-1">
          {/* Header: Title + Calorie Chip */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="text-lg font-heading font-bold text-foreground flex-1 line-clamp-2">
              {recipe.recipeName}
            </h3>
            {/* Calorie Chip - Right aligned */}
            {recipe.caloriesPerServing && (
              <div className="bg-pink-100 text-pink-600 rounded-full px-3 py-1 text-xs font-bold whitespace-nowrap">
                {recipe.caloriesPerServing} ккал
              </div>
            )}
          </div>

          {/* Description */}
          {recipe.description && (
            <p className="text-foreground/60 font-paragraph text-xs line-clamp-2 mb-3">
              {recipe.description}
            </p>
          )}

          {/* Time + Tag Row */}
          <div className="flex items-center justify-between gap-2 mb-4">
            {/* Time Info - Show actual prep + cook time */}
            {(recipe.prepTime || recipe.cookTime) ? (
              <div className="flex items-center gap-1 text-foreground/70">
                <Clock className="w-4 h-4 text-foreground/70" />
                <span className="font-paragraph text-xs">
                  {recipe.prepTime && recipe.cookTime 
                    ? `${recipe.prepTime + recipe.cookTime} мин`
                    : recipe.prepTime 
                    ? `${recipe.prepTime} мин`
                    : `${recipe.cookTime} мин`
                  }
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-foreground/70">
                <Clock className="w-4 h-4 text-foreground/70" />
                <span className="font-paragraph text-xs">
                  {(() => {
                    const times = estimateCookingTimes(recipe.recipeName || '', recipe.ingredients || '');
                    return `${times.prepTime + times.cookTime} мин`;
                  })()}
                </span>
              </div>
            )}
            
            {/* Tag - Thin red border */}
            <div className="border border-destructive text-destructive rounded-full px-3 py-1 text-xs font-paragraph">
              {getMealTypeTag(recipe.recipeName || '', recipe.ingredients || '')}
            </div>
          </div>

          {/* Macros - 3 Columns */}
          <div className="grid grid-cols-3 gap-2 mb-4 text-center">
            <div>
              <div className="text-xs font-paragraph text-foreground/60">Уураг</div>
              <div className="text-sm font-heading font-bold text-foreground">{macros.protein}г</div>
            </div>
            <div>
              <div className="text-xs font-paragraph text-foreground/60">Нүүрс ус</div>
              <div className="text-sm font-heading font-bold text-foreground">{macros.carbs}г</div>
            </div>
            <div>
              <div className="text-xs font-paragraph text-foreground/60">Өөх тос</div>
              <div className="text-sm font-heading font-bold text-foreground">{macros.fat}г</div>
            </div>
          </div>

          {/* View Details Button - Large rounded */}
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onCardClick();
            }}
            className="w-full bg-soft-light-green text-foreground hover:bg-soft-light-green/80 rounded-full font-paragraph font-bold h-11 mt-auto"
          >
            Жор харах
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export default function RecipesPage() {
  const [ingredientInput, setIngredientInput] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<ParsedRecipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cmsRecipes, setCmsRecipes] = useState<HealthyRecipesandSnacks[]>([]);
  const [loadingCms, setLoadingCms] = useState(true);
  const [activeTab, setActiveTab] = useState<'browse' | 'generate'>('browse');
  const [filterIngredients, setFilterIngredients] = useState<string[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<ParsedRecipe | HealthyRecipesandSnacks | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [regeneratingImages, setRegeneratingImages] = useState(false);
  const [generatingMissingImages, setGeneratingMissingImages] = useState(false);
  const [improvingInstructions, setImprovingInstructions] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Load recipes from CMS on component mount
  useEffect(() => {
    const loadRecipes = async () => {
      try {
        setLoadingCms(true);
        const { items } = await BaseCrudService.getAll<HealthyRecipesandSnacks>('healthyrecipes');
        setCmsRecipes(items || []);
        
        // Update the image for 'Тахианы Цээж Махтай Салат' if it doesn't have one
        const chickenSaladRecipe = items?.find(r => r.recipeName === 'Тахианы Цээж Махтай Салат');
        if (chickenSaladRecipe && !chickenSaladRecipe.dishImage) {
          try {
            await fetch('/api/update-recipe-image', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                recipeName: 'Тахианы Цээж Махтай Салат',
                imageUrl: 'https://static.wixstatic.com/media/906313_57f20b273ddf4c1db8fb23de0bc60050~mv2.png?originWidth=768&originHeight=384'
              })
            });
            // Reload recipes to show the updated image
            const { items: updatedItems } = await BaseCrudService.getAll<HealthyRecipesandSnacks>('healthyrecipes');
            setCmsRecipes(updatedItems || []);
          } catch (err) {
            console.error('Failed to update recipe image:', err);
          }
        }
      } catch (err) {
        console.error('Failed to load recipes:', err);
      } finally {
        setLoadingCms(false);
      }
    };

    loadRecipes();
  }, []);

  // Filter CMS recipes based on selected ingredients
  const filteredCmsRecipes = cmsRecipes.filter(recipe => {
    // Check ingredient filter match
    if (filterIngredients.length === 0) {
      return true;
    }
    
    const recipeIngredients = recipe.ingredients?.toLowerCase() || '';
    const matchesIngredients = filterIngredients.every(ingredient =>
      recipeIngredients.includes(ingredient.toLowerCase())
    );
    
    return matchesIngredients;
  });

  const handleAddIngredient = () => {
    if (!ingredientInput.trim()) return;

    const ingredient = ingredientInput.replace(/^#/, '').trim();
    const corrected = correctIngredient(ingredient);

    if (!selectedIngredients.includes(corrected)) {
      setSelectedIngredients([...selectedIngredients, corrected]);
    }

    setIngredientInput('');
  };

  const handleRemoveIngredient = (ingredient: string) => {
    setSelectedIngredients(selectedIngredients.filter(i => i !== ingredient));
  };

  const handleAddFilterIngredient = () => {
    if (!ingredientInput.trim()) return;

    const ingredient = ingredientInput.replace(/^#/, '').trim();
    const corrected = correctIngredient(ingredient);

    if (!filterIngredients.includes(corrected)) {
      setFilterIngredients([...filterIngredients, corrected]);
    }

    setIngredientInput('');
  };

  const handleRemoveFilterIngredient = (ingredient: string) => {
    setFilterIngredients(filterIngredients.filter(i => i !== ingredient));
  };

  const handleKeyPressFilter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddFilterIngredient();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddIngredient();
    }
  };

  const handleGenerateRecipes = async () => {
    if (selectedIngredients.length === 0) {
      setError('Дор хаяж нэг орц оруулна уу');
      return;
    }

    setLoading(true);
    setError('');
    setRecipes([]);

    try {
      const response = await fetch('/api/generate-recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: selectedIngredients }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Жор үүсгэхэд алдаа гарлаа');
      }

      const data = await response.json();
      const parsedRecipes = parseRecipesText(data.recipes);
      
      // Generate images for recipes with image prompts
      if (parsedRecipes.length > 0 && parsedRecipes.some(r => r.imagePrompt)) {
        try {
          const recipesWithPrompts = parsedRecipes
            .filter(r => r.imagePrompt)
            .map(r => ({ recipeName: r.name, imagePrompt: r.imagePrompt! }));
          
          const imageResponse = await fetch('/api/generate-recipe-images-ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ recipes: recipesWithPrompts }),
          });
          
          if (imageResponse.ok) {
            const imageData = await imageResponse.json();
            // Assign generated images to recipes
            parsedRecipes.forEach(recipe => {
              if (imageData.images[recipe.name]) {
                recipe.image = imageData.images[recipe.name];
              }
            });
          }
        } catch (err) {
          console.error('Failed to generate images:', err);
          // Continue without images if generation fails
        }
      }
      
      setRecipes(parsedRecipes);

      if (parsedRecipes.length === 0) {
        setError('Жор үүсгэхэд алдаа гарлаа. Дахин оролдоорой.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Уучлаарай, алдаа гарлаа');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateAllImages = async () => {
    if (cmsRecipes.length === 0) {
      setError('Жор байхгүй байна');
      return;
    }

    setRegeneratingImages(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/regenerate-all-recipe-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Зургийг дахин үүсгэхэд алдаа гарлаа');
      }

      const data = await response.json();
      
      // Reload recipes to show updated images
      const { items } = await BaseCrudService.getAll<HealthyRecipesandSnacks>('healthyrecipes');
      setCmsRecipes(items || []);
      
      // Show success message
      setSuccessMessage(data.message || `DONE – All ${cmsRecipes.length} recipe images updated`);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Уучлаарай, алдаа гарлаа');
    } finally {
      setRegeneratingImages(false);
    }
  };

  const handleGenerateMissingImages = async () => {
    // Count recipes without images
    const recipesWithoutImages = cmsRecipes.filter(recipe => !recipe.dishImage);
    
    if (recipesWithoutImages.length === 0) {
      setError('Бүх жорууд аль хэдийн зургийг агуулж байна');
      return;
    }

    setGeneratingMissingImages(true);
    setError('');

    try {
      const response = await fetch('/api/generate-missing-recipe-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Зургийг үүсгэхэд алдаа гарлаа');
      }

      const data = await response.json();
      
      // Reload recipes to show updated images
      const { items } = await BaseCrudService.getAll<HealthyRecipesandSnacks>('healthyrecipes');
      setCmsRecipes(items || []);
      
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Уучлаарай, алдаа гарлаа');
    } finally {
      setGeneratingMissingImages(false);
    }
  };

  const handleImproveRecipeInstructions = async () => {
    if (cmsRecipes.length === 0) {
      setError('Жор байхгүй байна');
      return;
    }

    setImprovingInstructions(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/improve-recipe-instructions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Жорын заавар сайжруулахад алдаа гарлаа');
      }

      const data = await response.json();
      
      // Reload recipes to show updated instructions
      const { items } = await BaseCrudService.getAll<HealthyRecipesandSnacks>('healthyrecipes');
      setCmsRecipes(items || []);
      
      // Show success message
      setSuccessMessage(data.message || `${data.updatedCount} жорын заавар сайжруулагдлаа`);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Уучлаарай, алдаа гарлаа');
    } finally {
      setImprovingInstructions(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Image
                src="https://static.wixstatic.com/media/906313_8df107e7784a4c98a21ac2e4b4b2d311~mv2.png"
                alt="NegOne mascot"
                width={72}
                height={86}
                className="w-16 md:w-20 h-auto object-contain"
              />
              <h1 className="text-4xl md:text-5xl font-heading text-foreground">
                Эрүүл жорууд ба зууш
              </h1>
            </div>
            <p className="text-lg text-foreground/80 font-paragraph max-w-3xl mx-auto">
              Таны байгаа орцуу ашиглан AI-ээр үүсгэсэн эрүүл жорууд эсвэл сонгосон жорууд
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-4 mb-8 justify-center flex-wrap">
            <Button
              onClick={() => setActiveTab('browse')}
              variant={activeTab === 'browse' ? 'default' : 'outline'}
              className={`rounded-xl font-paragraph ${
                activeTab === 'browse'
                  ? 'bg-primary text-primary-foreground'
                  : 'border-primary/20'
              }`}
            >
              <Utensils className="w-4 h-4 mr-2" />
              Жорууд сонгох ({cmsRecipes.length})
            </Button>
            <Button
              onClick={() => setActiveTab('generate')}
              variant={activeTab === 'generate' ? 'default' : 'outline'}
              className={`rounded-xl font-paragraph ${
                activeTab === 'generate'
                  ? 'bg-primary text-primary-foreground'
                  : 'border-primary/20'
              }`}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI-ээр үүсгэх
            </Button>
          </div>

          {/* Browse Recipes Tab */}
          {activeTab === 'browse' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Search and Filter Section */}
              <div className="space-y-4">
                {/* Ingredient Filter Card */}
                <Card className="bg-white/70 backdrop-blur-sm border-primary/20 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-heading text-foreground">
                      <Sparkles className="w-5 h-5 text-primary" />
                      Орц оруулах
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Орц оруулах (жишээ: #өндөг, #сүү, #авокадо... г.м)"
                        value={ingredientInput}
                        onChange={(e) => setIngredientInput(e.target.value)}
                        onKeyPress={handleKeyPressFilter}
                        className="rounded-xl border-primary/20 font-paragraph"
                      />
                      <Button
                        onClick={handleAddFilterIngredient}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-paragraph"
                      >
                        Нэмэх
                      </Button>
                    </div>

                    {/* Selected Filter Ingredients */}
                    {filterIngredients.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-paragraph text-foreground/70">
                          Сонгосон орцуу ({filterIngredients.length}):
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {filterIngredients.map((ingredient) => (
                            <Badge
                              key={ingredient}
                              variant="secondary"
                              className="bg-primary/20 text-primary border-primary/30 font-paragraph px-3 py-1.5"
                            >
                              #{ingredient}
                              <button
                                onClick={() => handleRemoveFilterIngredient(ingredient)}
                                className="ml-2 hover:opacity-70"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Loading State */}
              {loadingCms && (
                <div className="text-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                  <p className="text-foreground/60 font-paragraph">Жорууд ачаалж байна...</p>
                </div>
              )}

              {/* Error Alert */}
              {error && (
                <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="font-paragraph text-destructive">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Success Alert */}
              {successMessage && (
                <Alert className="bg-primary/10 border-primary/30">
                  <AlertCircle className="h-4 w-4 text-primary" />
                  <AlertDescription className="font-paragraph text-primary font-bold">
                    {successMessage}
                  </AlertDescription>
                </Alert>
              )}

              {/* Recipes Grid */}
              {!loadingCms && filteredCmsRecipes.length > 0 && (
                <div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {filteredCmsRecipes.map((recipe) => (
                      <CMSRecipeCard
                        key={recipe._id}
                        recipe={recipe}
                        onCardClick={() => {
                          setSelectedRecipe(recipe);
                          setIsModalOpen(true);
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* No Results State */}
              {!loadingCms && filteredCmsRecipes.length === 0 && cmsRecipes.length > 0 && (
                <div className="text-center py-12">
                  <Utensils className="w-16 h-16 text-foreground/30 mx-auto mb-4" />
                  <h3 className="text-xl font-heading text-foreground mb-2">
                    Жор олдсонгүй
                  </h3>
                  <p className="text-foreground/60 font-paragraph">
                    Өөр хайлтын нэр оруулаад үзнэ үү
                  </p>
                </div>
              )}

              {/* Empty State */}
              {!loadingCms && cmsRecipes.length === 0 && (
                <div className="text-center py-12">
                  <Utensils className="w-16 h-16 text-foreground/30 mx-auto mb-4" />
                  <h3 className="text-xl font-heading text-foreground mb-2">
                    Жор байхгүй байна
                  </h3>
                  <p className="text-foreground/60 font-paragraph">
                    Одоогоор жор нэмэгдээгүй байна. AI-ээр үүсгэхийг оролдоно уу.
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Generate Recipes Tab */}
          {activeTab === 'generate' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Input Section */}
              <Card className="bg-white/70 backdrop-blur-sm border-primary/20 shadow-lg mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-heading text-foreground">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Орцууд оруулах
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Орц оруулах (жишээ: өндөг, сүү, авокадо)..."
                      value={ingredientInput}
                      onChange={(e) => setIngredientInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="rounded-xl border-primary/20 font-paragraph"
                    />
                    <Button
                      onClick={handleAddIngredient}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-paragraph"
                    >
                      Нэмэх
                    </Button>
                  </div>

                  {/* Selected Ingredients */}
                  {selectedIngredients.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedIngredients.map((ingredient) => (
                        <Badge
                          key={ingredient}
                          variant="secondary"
                          className="bg-primary/20 text-primary border-primary/30 font-paragraph px-3 py-1.5"
                        >
                          #{ingredient}
                          <button
                            onClick={() => handleRemoveIngredient(ingredient)}
                            className="ml-2 hover:opacity-70"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Error Alert */}
                  {error && (
                    <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="font-paragraph text-destructive">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Generate Button */}
                  <Button
                    onClick={handleGenerateRecipes}
                    disabled={selectedIngredients.length === 0 || loading}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-paragraph h-11"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Жор үүсгэж байна...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Жор үүсгэх
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Recipes Display */}
              {recipes.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-heading text-foreground mb-2">
                      {recipes.length} жор үүсгэгдлээ
                    </h2>
                    <p className="text-foreground/60 font-paragraph">
                      Таны орцууд ашиглан үүсгэсэн эрүүл жорууд
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {recipes.map((recipe, index) => (
                      <RecipeCard
                        key={index}
                        recipe={recipe}
                        onCardClick={() => {
                          setSelectedRecipe(recipe);
                          setIsModalOpen(true);
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Empty State */}
              {!loading && recipes.length === 0 && selectedIngredients.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-12"
                >
                  <Utensils className="w-16 h-16 text-foreground/30 mx-auto mb-4" />
                  <h3 className="text-xl font-heading text-foreground mb-2">
                    Жор үүсгэхийн тулд орцуу оруулна уу
                  </h3>
                  <p className="text-foreground/60 font-paragraph">
                    Таны байгаа орцуу оруулаад AI-ээр үүсгэсэн жорууд авна уу
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Recipe Modal */}
      <RecipeModal
        recipe={selectedRecipe}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRecipe(null);
        }}
      />
    </div>
  );
}
