import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Utensils, Sparkles, X, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ParsedRecipe {
  name: string;
  type: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  totalCalories: number;
  caloriesPerServing: number;
  servings: number;
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

function parseRecipesText(text: string): ParsedRecipe[] {
  const recipes: ParsedRecipe[] = [];
  const recipeBlocks = text.split('---').filter(block => block.trim());

  for (const block of recipeBlocks) {
    const lines = block.trim().split('\n').filter(line => line.trim());
    if (lines.length === 0) continue;

    let recipe: Partial<ParsedRecipe> = {
      ingredients: [],
      instructions: [],
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
      } else if (trimmed.startsWith('Орцуу:')) {
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
      recipes.push({
        name: recipe.name || 'Үл мэдэгдэх жор',
        type: recipe.type || 'Үл мэдэгдэх',
        description: recipe.description || '',
        ingredients: recipe.ingredients,
        instructions: recipe.instructions || [],
        totalCalories: recipe.totalCalories || 0,
        caloriesPerServing: recipe.caloriesPerServing || 0,
        servings: recipe.servings || 1,
      });
    }
  }

  return recipes;
}

export default function RecipesPage() {
  const [ingredientInput, setIngredientInput] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<ParsedRecipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
            <h1 className="text-4xl md:text-5xl font-heading text-foreground mb-4">
              Эрүүл жорууд ба зууш
            </h1>
            <p className="text-lg text-foreground/80 font-paragraph max-w-3xl mx-auto">
              Таны байгаа орцуу ашиглан AI-ээр үүсгэсэн эрүүл жорууд
            </p>
          </div>

          {/* Input Section */}
          <Card className="bg-white/70 backdrop-blur-sm border-primary/20 shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-heading text-foreground">
                <Sparkles className="w-5 h-5 text-primary" />
                Орцуу оруулах
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
                  Таны орцуу ашиглан үүсгэсэн эрүүл жорууд
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map((recipe, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="bg-white/70 backdrop-blur-sm border-primary/10 shadow-lg overflow-hidden h-full flex flex-col">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <CardTitle className="text-xl font-heading text-foreground line-clamp-2">
                            {recipe.name}
                          </CardTitle>
                          <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30 shrink-0 font-paragraph text-xs">
                            {recipe.type}
                          </Badge>
                        </div>
                        {recipe.description && (
                          <p className="text-foreground/80 font-paragraph text-sm">
                            {recipe.description}
                          </p>
                        )}
                      </CardHeader>

                      <CardContent className="pt-0 flex flex-col flex-1 space-y-4">
                        {/* Calories */}
                        {recipe.caloriesPerServing > 0 && (
                          <div className="bg-primary/10 rounded-lg p-3">
                            <p className="text-sm font-paragraph text-foreground/80">
                              <span className="font-medium text-primary">{recipe.caloriesPerServing}</span> калори / хэсэг
                            </p>
                            <p className="text-xs font-paragraph text-foreground/60">
                              Нийт: {recipe.totalCalories} калори ({recipe.servings} хэсэг)
                            </p>
                          </div>
                        )}

                        {/* Ingredients */}
                        <div>
                          <h4 className="font-paragraph font-medium text-foreground mb-2 text-sm">Орцуу:</h4>
                          <ul className="space-y-1">
                            {recipe.ingredients.map((ingredient, i) => (
                              <li key={i} className="text-foreground/70 font-paragraph text-sm flex items-start">
                                <span className="mr-2">•</span>
                                <span>{ingredient}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Instructions */}
                        {recipe.instructions.length > 0 && (
                          <div>
                            <h4 className="font-paragraph font-medium text-foreground mb-2 text-sm">Хийх арга:</h4>
                            <ol className="space-y-2">
                              {recipe.instructions.map((instruction, i) => (
                                <li key={i} className="text-foreground/70 font-paragraph text-sm flex gap-2">
                                  <span className="font-medium text-primary shrink-0">{i + 1}.</span>
                                  <span>{instruction}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
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
      </div>
    </div>
  );
}