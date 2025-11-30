import { useState, useEffect } from 'react';
import { useMember } from '@/integrations';
import { BaseCrudService } from '@/integrations';
import { HealthyRecipesandSnacks } from '@/entities';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Image } from '@/components/ui/image';
import { Search, Utensils, ExternalLink, Filter, X, Sparkles, Loader } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UserProfile {
  dailyCalories?: number;
  fitnessGoal?: string;
}

interface GeneratedRecipe {
  name: string;
  type: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  totalCalories: number;
  caloriesPerServing: number;
  servings: number;
}

export default function RecipesPage() {
  const { member } = useMember();
  const [recipes, setRecipes] = useState<HealthyRecipesandSnacks[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<HealthyRecipesandSnacks[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [calorieFilter, setCalorieFilter] = useState<string>('all');
  const [profile, setProfile] = useState<UserProfile>({});
  const [ingredientInput, setIngredientInput] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [filterMode, setFilterMode] = useState<'search' | 'ingredients'>('search');
  const [generatedRecipes, setGeneratedRecipes] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!member?.loginEmail) return;
    
    // Load user profile
    const savedProfile = localStorage.getItem(`profile_${member.loginEmail}`);
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch (error) {
        console.error('Error parsing saved profile:', error);
      }
    }

    // Fetch recipes
    const fetchRecipes = async () => {
      try {
        const { items } = await BaseCrudService.getAll<HealthyRecipesandSnacks>('healthyrecipes');
        setRecipes(items);
        setFilteredRecipes(items);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [member?.loginEmail]);

  useEffect(() => {
    let filtered = recipes;

    // Ingredient filter (hashtag mode)
    if (filterMode === 'ingredients' && selectedIngredients.length > 0) {
      filtered = filtered.filter(recipe => {
        if (!recipe.ingredients) return false;
        const recipeIngredientsLower = recipe.ingredients.toLowerCase();
        return selectedIngredients.some(ingredient =>
          recipeIngredientsLower.includes(ingredient.toLowerCase())
        );
      });
    }
    // Search filter
    else if (filterMode === 'search' && searchTerm) {
      filtered = filtered.filter(recipe =>
        recipe.recipeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.ingredients?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Calorie filter
    if (calorieFilter !== 'all') {
      const userCalories = profile.dailyCalories || 2000;
      const mealCalories = userCalories / 3; // Assuming 3 meals per day

      filtered = filtered.filter(recipe => {
        const recipeCalories = recipe.caloriesPerServing || 0;
        
        switch (calorieFilter) {
          case 'low':
            return recipeCalories <= mealCalories * 0.7; // Low calorie: 70% of meal calories
          case 'medium':
            return recipeCalories > mealCalories * 0.7 && recipeCalories <= mealCalories * 1.2;
          case 'high':
            return recipeCalories > mealCalories * 1.2;
          default:
            return true;
        }
      });
    }

    setFilteredRecipes(filtered);
  }, [searchTerm, calorieFilter, recipes, profile, selectedIngredients, filterMode]);

  const getCalorieBadgeColor = (calories: number) => {
    if (!profile.dailyCalories) return 'bg-gray-100 text-gray-700';
    
    const mealCalories = profile.dailyCalories / 3;
    
    if (calories <= mealCalories * 0.7) {
      return 'bg-soft-light-green/20 text-soft-light-green border-soft-light-green/30';
    } else if (calories <= mealCalories * 1.2) {
      return 'bg-secondary/20 text-secondary border-secondary/30';
    } else {
      return 'bg-primary/20 text-primary border-primary/30';
    }
  };

  const getCalorieLabel = (calories: number) => {
    if (!profile.dailyCalories) return 'Калори';
    
    const mealCalories = profile.dailyCalories / 3;
    
    if (calories <= mealCalories * 0.7) {
      return 'Бага калори';
    } else if (calories <= mealCalories * 1.2) {
      return 'Дунд калори';
    } else {
      return 'Өндөр калори';
    }
  };

  const handleAddIngredient = () => {
    if (ingredientInput.trim()) {
      const ingredient = ingredientInput.trim().replace(/^#+/, '').trim();
      if (ingredient && !selectedIngredients.includes(ingredient)) {
        setSelectedIngredients([...selectedIngredients, ingredient]);
        setIngredientInput('');
        setFilterMode('ingredients');
      }
    }
  };

  const handleRemoveIngredient = (ingredient: string) => {
    setSelectedIngredients(selectedIngredients.filter(i => i !== ingredient));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddIngredient();
    }
  };

  const handleGenerateRecipes = async () => {
    if (selectedIngredients.length === 0) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredients: selectedIngredients,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Recipe generation error:', error);
        setGeneratedRecipes('Уучлаарай, жор үүсгэхэд алдаа гарлаа. Дахин оролдоорой.');
        return;
      }

      const data = await response.json();
      setGeneratedRecipes(data.recipes || '');
    } catch (error) {
      console.error('Error generating recipes:', error);
      setGeneratedRecipes('Уучлаарай, сүлжээний алдаа гарлаа. Дахин оролдоорой.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-heading text-foreground mb-4">
              Эрүүл жорууд
            </h1>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="bg-white/50 backdrop-blur-sm shadow-lg animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-xl"></div>
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-16 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-heading text-foreground mb-4">
              Эрүүл жорууд ба зууш
            </h1>
            <p className="text-lg text-foreground/80 font-paragraph max-w-3xl mx-auto">
              Таны калорийн хэрэгцээнд тохирсон эрүүл, амттай жорууд
            </p>
            {profile.dailyCalories && (
              <p className="text-sm text-foreground/60 font-paragraph mt-2">
                Таны өдрийн калорийн хэрэгцээ: {profile.dailyCalories} калори
              </p>
            )}
          </div>

          {/* Filters */}
          <Card className="bg-white/70 backdrop-blur-sm border-primary/20 shadow-lg mb-8">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Filter Mode Tabs */}
                <div className="flex gap-2 mb-4">
                  <Button
                    variant={filterMode === 'search' ? 'default' : 'outline'}
                    onClick={() => {
                      setFilterMode('search');
                      setSelectedIngredients([]);
                    }}
                    className="rounded-xl font-paragraph"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Хайх
                  </Button>
                  <Button
                    variant={filterMode === 'ingredients' ? 'default' : 'outline'}
                    onClick={() => {
                      setFilterMode('ingredients');
                      setSearchTerm('');
                    }}
                    className="rounded-xl font-paragraph"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    AI жор үүсгэх
                  </Button>
                </div>

                {/* Search Mode */}
                {filterMode === 'search' && (
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground/40" />
                        <Input
                          placeholder="Жор хайх..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 rounded-xl border-primary/20 font-paragraph"
                        />
                      </div>
                    </div>
                    <div className="md:w-48">
                      <Select value={calorieFilter} onValueChange={setCalorieFilter}>
                        <SelectTrigger className="rounded-xl border-primary/20">
                          <Filter className="w-4 h-4 mr-2" />
                          <SelectValue placeholder="Калори шүүх" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Бүх жор</SelectItem>
                          <SelectItem value="low">Бага калори</SelectItem>
                          <SelectItem value="medium">Дунд калори</SelectItem>
                          <SelectItem value="high">Өндөр калори</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* Ingredients Mode */}
                {filterMode === 'ingredients' && (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Input
                          placeholder="Орцуу нэмэх (жишээ: #Алим #овьёос)..."
                          value={ingredientInput}
                          onChange={(e) => setIngredientInput(e.target.value)}
                          onKeyDown={handleKeyDown}
                          className="pl-4 rounded-xl border-primary/20 font-paragraph"
                        />
                      </div>
                      <Button
                        onClick={handleAddIngredient}
                        className="rounded-xl font-paragraph bg-primary hover:bg-primary/90"
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
                            className="bg-secondary/20 text-secondary border-secondary/30 font-paragraph pl-3 pr-1 py-1"
                          >
                            #{ingredient}
                            <button
                              onClick={() => handleRemoveIngredient(ingredient)}
                              className="ml-2 hover:text-secondary/70"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Generate Button */}
                    {selectedIngredients.length > 0 && (
                      <Button
                        onClick={handleGenerateRecipes}
                        disabled={isGenerating}
                        className="w-full bg-soft-light-green hover:bg-soft-light-green/90 text-foreground rounded-xl font-paragraph"
                      >
                        {isGenerating ? (
                          <>
                            <Loader className="w-4 h-4 mr-2 animate-spin" />
                            Жор үүсгэж байна...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            3 жор үүсгэх
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Generated Recipes Section */}
          {generatedRecipes && (
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-gradient-to-br from-soft-light-green/10 to-secondary/10 border-soft-light-green/30 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl font-heading text-foreground">
                    <Sparkles className="w-6 h-6 text-soft-light-green" />
                    AI-ээр үүсгэсэн жорууд
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {generatedRecipes.split('---').filter(recipe => recipe.trim()).map((recipe, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="bg-white/60 rounded-xl p-6 border border-soft-light-green/20"
                      >
                        <div className="prose prose-sm max-w-none font-paragraph text-foreground/90 whitespace-pre-wrap text-sm leading-relaxed">
                          {recipe.trim()}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <Button
                    onClick={() => setGeneratedRecipes('')}
                    variant="outline"
                    className="w-full mt-6 rounded-xl font-paragraph border-soft-light-green/30 text-foreground hover:bg-soft-light-green/10"
                  >
                    Үүсгэсэн жорыг цэвэрлэх
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Recipes Grid */}
          {filteredRecipes.length === 0 ? (
            <div className="text-center py-12">
              <Utensils className="w-16 h-16 text-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-heading text-foreground mb-2">
                Жор олдсонгүй
              </h3>
              <p className="text-foreground/60 font-paragraph">
                Хайлтын нөхцөлийг өөрчилж дахин оролдоно уу
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipes.map((recipe, index) => (
                <motion.div
                  key={recipe._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <Card className="bg-white/70 backdrop-blur-sm border-primary/10 shadow-lg overflow-hidden h-full">
                    {recipe.dishImage && (
                      <div className="h-48 overflow-hidden">
                        <Image
                          src={recipe.dishImage}
                          alt={recipe.recipeName || 'Хоолны зураг'}
                          width={400}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-xl font-heading text-foreground line-clamp-2">
                          {recipe.recipeName}
                        </CardTitle>
                        {recipe.caloriesPerServing && (
                          <Badge 
                            variant="outline" 
                            className={`${getCalorieBadgeColor(recipe.caloriesPerServing)} shrink-0 font-paragraph`}
                          >
                            {recipe.caloriesPerServing} кал
                          </Badge>
                        )}
                      </div>
                      {recipe.caloriesPerServing && profile.dailyCalories && (
                        <div className="text-xs font-paragraph text-foreground/60">
                          {getCalorieLabel(recipe.caloriesPerServing)}
                        </div>
                      )}
                    </CardHeader>

                    <CardContent className="pt-0 flex flex-col h-full">
                      {recipe.description && (
                        <p className="text-foreground/80 font-paragraph text-sm mb-4 line-clamp-3">
                          {recipe.description}
                        </p>
                      )}

                      {recipe.ingredients && (
                        <div className="mb-4">
                          <h4 className="font-paragraph font-medium text-foreground mb-2 text-sm">Орц:</h4>
                          <p className="text-foreground/70 font-paragraph text-xs line-clamp-3">
                            {recipe.ingredients}
                          </p>
                        </div>
                      )}

                      <div className="mt-auto space-y-3">
                        {recipe.instructions && (
                          <div>
                            <h4 className="font-paragraph font-medium text-foreground mb-2 text-sm">Хийх арга:</h4>
                            <p className="text-foreground/70 font-paragraph text-xs line-clamp-4">
                              {recipe.instructions}
                            </p>
                          </div>
                        )}

                        {recipe.videoLink && (
                          <Button
                            asChild
                            variant="outline"
                            className="w-full border-secondary/30 text-secondary hover:bg-secondary/10 rounded-[20px] font-paragraph"
                          >
                            <a 
                              href={recipe.videoLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-2"
                            >
                              <ExternalLink className="w-4 h-4" />
                              Видео үзэх
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Recommendation Section */}
          {profile.dailyCalories && (
            <motion.div
              className="mt-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="bg-gradient-to-br from-soft-light-green/10 to-primary/10 border-soft-light-green/30 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl font-heading text-foreground">
                    <Utensils className="w-6 h-6 text-soft-light-green" />
                    AI зөвлөмж
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-heading text-primary mb-2">
                        {Math.round((profile.dailyCalories || 0) / 3)}
                      </div>
                      <div className="text-sm font-paragraph text-foreground/80">Хоол тутмын калори</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-heading text-secondary mb-2">
                        {filteredRecipes.filter(r => r.caloriesPerServing && r.caloriesPerServing <= (profile.dailyCalories || 0) / 3 * 0.7).length}
                      </div>
                      <div className="text-sm font-paragraph text-foreground/80">Бага калоритай жор</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-heading text-soft-light-green mb-2">
                        {profile.fitnessGoal === 'weight-loss' ? 'Жин хасах' : 
                         profile.fitnessGoal === 'muscle-gain' ? 'Булчин нэмэх' : 'Жин барих'}
                      </div>
                      <div className="text-sm font-paragraph text-foreground/80">Таны зорилго</div>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-white/50 rounded-xl">
                    <p className="text-foreground/80 font-paragraph text-sm text-center">
                      💡 <strong>Зөвлөгөө:</strong> {
                        profile.fitnessGoal === 'weight-loss' 
                          ? 'Жин хасахын тулд бага калоритай жорууд сонгоно уу'
                          : profile.fitnessGoal === 'muscle-gain'
                          ? 'Булчин нэмэхийн тулд уураг ихтэй жорууд сонгоно уу'
                          : 'Жин барихын тулд тэнцвэртэй хооллолт барина уу'
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}