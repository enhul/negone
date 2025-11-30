import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Utensils, Sparkles, X, Loader2, AlertCircle, Flame } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Image } from '@/components/ui/image';
import { BaseCrudService } from '@/integrations';
import { HealthyRecipesandSnacks } from '@/entities';

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
  const [cmsRecipes, setCmsRecipes] = useState<HealthyRecipesandSnacks[]>([]);
  const [loadingCms, setLoadingCms] = useState(true);
  const [activeTab, setActiveTab] = useState<'browse' | 'generate'>('browse');
  const [searchQuery, setSearchQuery] = useState('');

  // Load recipes from CMS on component mount
  useEffect(() => {
    const loadRecipes = async () => {
      try {
        setLoadingCms(true);
        const { items } = await BaseCrudService.getAll<HealthyRecipesandSnacks>('healthyrecipes');
        setCmsRecipes(items || []);
      } catch (err) {
        console.error('Failed to load recipes:', err);
      } finally {
        setLoadingCms(false);
      }
    };

    loadRecipes();
  }, []);

  // Filter CMS recipes based on search query
  const filteredCmsRecipes = cmsRecipes.filter(recipe =>
    recipe.recipeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              Таны байгаа орцуу ашиглан AI-ээр үүсгэсэн эрүүл жорууд эсвэл сонгосон жорууд
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-4 mb-8 justify-center">
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
              {/* Search Section */}
              <Card className="bg-white/70 backdrop-blur-sm border-primary/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-heading text-foreground">
                    <Utensils className="w-5 h-5 text-primary" />
                    Жорууд хайх
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    placeholder="Жорын нэр эсвэл тайлбараар хайх..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="rounded-xl border-primary/20 font-paragraph"
                  />
                </CardContent>
              </Card>

              {/* Loading State */}
              {loadingCms && (
                <div className="text-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                  <p className="text-foreground/60 font-paragraph">Жорууд ачаалж байна...</p>
                </div>
              )}

              {/* Recipes Grid */}
              {!loadingCms && filteredCmsRecipes.length > 0 && (
                <div>
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-heading text-foreground mb-2">
                      {filteredCmsRecipes.length} жор олдлоо
                    </h2>
                    <p className="text-foreground/60 font-paragraph">
                      Эрүүл амтат хоол идэхийн тулд сонгоно уу
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCmsRecipes.map((recipe, index) => (
                      <motion.div
                        key={recipe._id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                      >
                        <Card className="bg-white/70 backdrop-blur-sm border-primary/10 shadow-lg overflow-hidden h-full flex flex-col">
                          {/* Recipe Image */}
                          {recipe.dishImage && (
                            <div className="w-full h-48 overflow-hidden bg-foreground/5">
                              <Image
                                src={recipe.dishImage}
                                alt={recipe.recipeName || 'Recipe dish'}
                                width={400}
                                height={192}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}

                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <CardTitle className="text-xl font-heading text-foreground line-clamp-2">
                                {recipe.recipeName}
                              </CardTitle>
                            </div>
                            {recipe.description && (
                              <p className="text-foreground/80 font-paragraph text-sm line-clamp-2">
                                {recipe.description}
                              </p>
                            )}
                          </CardHeader>

                          <CardContent className="pt-0 flex flex-col flex-1 space-y-4">
                            {/* Calories */}
                            {recipe.caloriesPerServing && (
                              <div className="bg-primary/10 rounded-lg p-3 flex items-center gap-2">
                                <Flame className="w-4 h-4 text-primary" />
                                <div>
                                  <p className="text-sm font-paragraph text-foreground/80">
                                    <span className="font-medium text-primary">{recipe.caloriesPerServing}</span> калори
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Ingredients */}
                            {recipe.ingredients && (
                              <div>
                                <h4 className="font-paragraph font-medium text-foreground mb-2 text-sm">Орцуу:</h4>
                                <p className="text-foreground/70 font-paragraph text-sm line-clamp-3">
                                  {recipe.ingredients}
                                </p>
                              </div>
                            )}

                            {/* Instructions */}
                            {recipe.instructions && (
                              <div>
                                <h4 className="font-paragraph font-medium text-foreground mb-2 text-sm">Хийх арга:</h4>
                                <p className="text-foreground/70 font-paragraph text-sm line-clamp-3">
                                  {recipe.instructions}
                                </p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
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
          )}
        </motion.div>
      </div>
    </div>
  );
}