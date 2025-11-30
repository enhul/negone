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
  const [filterIngredients, setFilterIngredients] = useState<string[]>([]);

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
                imageUrl: 'https://static.wixstatic.com/media/906313_20853d4fbdb54172a14103f1d4be5dc8~mv2.png?originWidth=384&originHeight=256'
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
              {/* Search and Filter Section */}
              <div className="space-y-4">
                {/* Ingredient Filter Card */}
                <Card className="bg-white/70 backdrop-blur-sm border-primary/20 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-heading text-foreground">
                      <Sparkles className="w-5 h-5 text-primary" />
                      Орцуугаар сүүлжүүлэх
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Орц оруулах (жишээ: #өндөг, #сүү)..."
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
                          <div className="w-full h-48 overflow-hidden bg-foreground/5">
                            <Image
                              src={recipe.dishImage || getFallbackImage(recipe.recipeName, recipe.ingredients)}
                              alt={recipe.recipeName || 'Recipe dish'}
                              width={400}
                              height={192}
                              className="w-full h-full object-cover"
                            />
                          </div>

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
