import { useState, useEffect } from 'react';
import { useMember } from '@/integrations';
import { BaseCrudService } from '@/integrations';
import { CuratedExercises } from '@/entities';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Calendar, Droplets, Activity, Weight, MessageSquare, ExternalLink, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DailyEntry {
  date: string;
  exerciseCompleted: boolean;
  waterIntake: number;
  waterCompleted: boolean;
  mentalNote: string;
  weight: number;
}

interface UserProfile {
  height?: number;
  weight?: number;
  fitnessGoal?: string;
  focusAreas?: string[];
  bodyShape?: string;
  exerciseDays?: number;
  exerciseMinutes?: number;
  dailyWater?: number;
}

export default function ProgressPage() {
  const { member } = useMember();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile>({});
  const [dailyEntries, setDailyEntries] = useState<DailyEntry[]>([]);
  const [todayEntry, setTodayEntry] = useState<DailyEntry>({
    date: new Date().toISOString().split('T')[0],
    exerciseCompleted: false,
    waterIntake: 0,
    waterCompleted: false,
    mentalNote: '',
    weight: 0,
  });
  const [exercises, setExercises] = useState<CuratedExercises[]>([]);
  const [recommendedExercises, setRecommendedExercises] = useState<CuratedExercises[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load profile data
    const savedProfile = localStorage.getItem(`profile_${member?.loginEmail}`);
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }

    // Load daily entries
    const savedEntries = localStorage.getItem(`dailyEntries_${member?.loginEmail}`);
    if (savedEntries) {
      const entries = JSON.parse(savedEntries);
      setDailyEntries(entries);
      
      // Check if today's entry exists
      const today = new Date().toISOString().split('T')[0];
      const existingEntry = entries.find((entry: DailyEntry) => entry.date === today);
      if (existingEntry) {
        setTodayEntry(existingEntry);
      }
    }

    // Fetch exercises
    const fetchExercises = async () => {
      try {
        const { items } = await BaseCrudService.getAll<CuratedExercises>('curatedexercises');
        setExercises(items);
      } catch (error) {
        console.error('Error fetching exercises:', error);
      }
    };

    fetchExercises();
  }, [member]);

  useEffect(() => {
    // Filter recommended exercises based on user profile
    if (exercises.length > 0 && profile.bodyShape && profile.focusAreas && profile.fitnessGoal) {
      const filtered = exercises.filter(exercise => {
        const matchesBodyShape = exercise.suitableBodyShapes?.toLowerCase().includes(profile.bodyShape?.toLowerCase() || '');
        const matchesFocusAreas = profile.focusAreas?.some(area => 
          exercise.focusBodyAreas?.toLowerCase().includes(area.toLowerCase())
        );
        const matchesGoal = exercise.fitnessGoal?.toLowerCase().includes(profile.fitnessGoal?.toLowerCase() || '');
        
        return matchesBodyShape || matchesFocusAreas || matchesGoal;
      });
      
      setRecommendedExercises(filtered.slice(0, 6)); // Show top 6 recommendations
    }
  }, [exercises, profile]);

  const handleWaterChange = (value: number[]) => {
    const newAmount = value[0];
    
    // Check if water goal is reached
    const waterCompleted = newAmount >= (profile.dailyWater || 2000);
    
    setTodayEntry({ ...todayEntry, waterIntake: newAmount, waterCompleted });
  };

  const handleSave = async () => {
    setLoading(true);
    
    try {
      // Update or add today's entry
      const updatedEntries = dailyEntries.filter(entry => entry.date !== todayEntry.date);
      updatedEntries.push(todayEntry);
      
      // Save to localStorage
      localStorage.setItem(`dailyEntries_${member?.loginEmail}`, JSON.stringify(updatedEntries));
      setDailyEntries(updatedEntries);

      toast({
        title: 'Хадгалагдсан',
      });
    } catch (error) {
      toast({
        title: 'Алдаа гарлаа',
        description: 'Мэдээлэл хадгалахад алдаа гарлаа',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const waterProgress = profile.dailyWater ? (todayEntry.waterIntake / profile.dailyWater) * 100 : 0;
  
  // Check if all progress fields are filled (without water requirement)
  const allFieldsFilled = 
    todayEntry.exerciseCompleted && 
    todayEntry.weight > 0 && 
    todayEntry.mentalNote.trim().length > 0;

  // Calculate weekly workout progress
  const getWeeklyWorkoutProgress = () => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
    
    const weekEntries = dailyEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= weekStart && entryDate <= today && entry.exerciseCompleted;
    });
    
    return {
      completed: weekEntries.length,
      target: profile.exerciseDays || 0,
    };
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-heading text-foreground mb-4">
              Ахиц дэвшил бүртгэх
            </h1>
            <p className="text-lg text-foreground/80 font-paragraph">
              Өнөөдрийн дасгал, усны хэрэглээ, сэтгэлзүйн байдлыг бүртгээрэй
            </p>
          </div>

          {/* Congratulatory Message */}
          {allFieldsFilled && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
              className="mb-8"
            >
              <Card className="bg-gradient-to-r from-soft-light-green/20 to-secondary/20 border-soft-light-green/50 shadow-lg overflow-hidden">
                <CardContent className="p-8 text-center">
                  <div className="text-5xl mb-4">🎉</div>
                  <h2 className="text-3xl font-heading text-foreground mb-2">Сайн байна!</h2>
                  <p className="text-lg font-paragraph text-foreground/80 mb-4">
                    Өнөөдрийн бүх зорилгоо биелүүлсэн байна! 💪
                  </p>
                  <p className="text-sm font-paragraph text-foreground/60">
                    Дасгал ✓ | Ус ✓ | Жин ✓ | Тэмдэглэл ✓
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Daily Progress Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Exercise Tracking */}
              <Card className="bg-white/70 backdrop-blur-sm border-primary/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl font-heading text-foreground">
                    <Activity className="w-6 h-6 text-primary" />
                    Дасгалын мэдээлэл
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="exercise-completed" className="font-paragraph text-foreground">
                      Өнөөдөр дасгал хийсэн үү?
                    </Label>
                    <Switch
                      id="exercise-completed"
                      checked={todayEntry.exerciseCompleted}
                      onCheckedChange={(checked) => setTodayEntry({ ...todayEntry, exerciseCompleted: checked })}
                    />
                  </div>
                  
                  {todayEntry.exerciseCompleted && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-soft-light-green/10 rounded-xl p-4"
                    >
                      <p className="text-soft-light-green font-paragraph text-sm text-center">
                        🎉 Сайн байна! Өнөөдөрийн дасгалыг хийж чадлаа!
                      </p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>

              {/* Weekly Workout Progress */}
              <Card className="bg-white/70 backdrop-blur-sm border-secondary/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl font-heading text-foreground">
                    <Activity className="w-6 h-6 text-secondary" />
                    Долоо хоногийн дасгал
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile.exerciseDays && profile.exerciseDays > 0 ? (
                    <>
                      <div className="text-center">
                        <div className="text-3xl font-heading text-secondary mb-1">
                          {getWeeklyWorkoutProgress().completed}/{getWeeklyWorkoutProgress().target}
                        </div>
                        <div className="text-sm font-paragraph text-foreground/60">
                          Энэ долоо хоногт хийсэн дасгал
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Progress 
                          value={(getWeeklyWorkoutProgress().completed / getWeeklyWorkoutProgress().target) * 100} 
                          className="h-3"
                        />
                        <div className="text-xs font-paragraph text-foreground/60 text-center">
                          {Math.round((getWeeklyWorkoutProgress().completed / getWeeklyWorkoutProgress().target) * 100)}% хүрсэн
                        </div>
                      </div>

                      {getWeeklyWorkoutProgress().completed === getWeeklyWorkoutProgress().target && getWeeklyWorkoutProgress().target > 0 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-secondary/10 rounded-xl p-3 text-center"
                        >
                          <p className="text-secondary font-paragraph text-sm">
                            ✓ Энэ долоо хоногийн дасгалын зорилго биелүүлсэн!
                          </p>
                        </motion.div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-foreground/60 font-paragraph text-sm mb-4">
                        Долоо хоногт хэдэн өдөр дасгал хийх гэж төлөвлөж байгаагаа профайлдаа оруулна уу
                      </p>
                      <Button
                        asChild
                        variant="outline"
                        className="border-secondary/30 text-secondary hover:bg-secondary/10 rounded-[20px] font-paragraph"
                      >
                        <a href="/profile">Профайл бөглөх</a>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Weight Tracking */}
              <Card className="bg-white/70 backdrop-blur-sm border-soft-light-green/30 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl font-heading text-foreground">
                    <Weight className="w-6 h-6 text-soft-light-green" />
                    Жингийн хэмжилт
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="weight" className="font-paragraph text-foreground">Өнөөдрийн жин (кг)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      value={todayEntry.weight || ''}
                      onChange={(e) => setTodayEntry({ ...todayEntry, weight: Number(e.target.value) })}
                      className="mt-1 rounded-xl border-soft-light-green/30"
                      placeholder="Жинээ оруулна уу"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Mental Note */}
              <Card className="bg-white/70 backdrop-blur-sm border-primary/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl font-heading text-foreground">
                    <MessageSquare className="w-6 h-6 text-primary" />
                    Сэтгэлзүйн тэмдэглэл
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="mental-note" className="font-paragraph text-foreground">
                      Өнөөдрийн мэдрэмж, бодол (140 тэмдэгт)
                    </Label>
                    <Textarea
                      id="mental-note"
                      value={todayEntry.mentalNote}
                      onChange={(e) => setTodayEntry({ ...todayEntry, mentalNote: e.target.value.slice(0, 140) })}
                      className="mt-1 rounded-xl border-primary/20 resize-none"
                      rows={3}
                      placeholder="Өнөөдөр ямар мэдрэмжтэй байсан, юу бодож байсан талаар бичээрэй..."
                    />
                    <div className="text-right text-xs font-paragraph text-foreground/60 mt-1">
                      {todayEntry.mentalNote.length}/140
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Save Button */}
              <div className="text-center">
                <Button
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-[20px] px-12 py-3 text-lg font-paragraph"
                >
                  {loading ? 'Хадгалж байна...' : 'Өнөөдрийн мэдээлэл хадгалах'}
                </Button>
              </div>
            </div>

            {/* Recommended Exercises */}
            <div>
              <Card className="bg-white/70 backdrop-blur-sm border-secondary/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl font-heading text-foreground">
                    <Play className="w-5 h-5 text-secondary" />
                    Танд зориулсан дасгал
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!profile.bodyShape || !profile.focusAreas ? (
                    <div className="text-center py-6">
                      <p className="text-foreground/60 font-paragraph text-sm mb-4">
                        Дасгалын зөвлөмж авахын тулд профайлаа бөглөнө үү
                      </p>
                      <Button
                        asChild
                        variant="outline"
                        className="border-primary/30 text-primary hover:bg-primary/10 rounded-[20px] font-paragraph"
                      >
                        <a href="/profile">Профайл бөглөх</a>
                      </Button>
                    </div>
                  ) : recommendedExercises.length === 0 ? (
                    <div className="text-center py-6">
                      <Activity className="w-12 h-12 text-foreground/30 mx-auto mb-3" />
                      <p className="text-foreground/60 font-paragraph text-sm">
                        Танд тохирох дасгал олдсонгүй
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recommendedExercises.map((exercise, index) => (
                        <motion.div
                          key={exercise._id}
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          viewport={{ once: true }}
                          className="bg-white/50 rounded-xl p-4 border border-secondary/10"
                        >
                          <h4 className="font-heading text-foreground mb-2 text-sm">
                            {exercise.exerciseName}
                          </h4>
                          
                          <div className="flex flex-wrap gap-1 mb-3">
                            {exercise.difficultyLevel && (
                              <Badge 
                                variant="outline" 
                                className="text-xs bg-primary/10 text-primary border-primary/20 font-paragraph"
                              >
                                {exercise.difficultyLevel}
                              </Badge>
                            )}
                            {exercise.durationMinutes && (
                              <Badge 
                                variant="outline" 
                                className="text-xs bg-secondary/10 text-secondary border-secondary/20 font-paragraph"
                              >
                                {exercise.durationMinutes} мин
                              </Badge>
                            )}
                          </div>
                          
                          {exercise.description && (
                            <p className="text-foreground/70 font-paragraph text-xs mb-3 line-clamp-2">
                              {exercise.description}
                            </p>
                          )}
                          
                          {exercise.youtubeLink && (
                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="w-full border-soft-light-green/30 text-soft-light-green hover:bg-soft-light-green/10 rounded-[20px] font-paragraph"
                            >
                              <a 
                                href={exercise.youtubeLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-2"
                              >
                                <ExternalLink className="w-3 h-3" />
                                Видео үзэх
                              </a>
                            </Button>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="bg-white/70 backdrop-blur-sm border-primary/20 shadow-lg mt-6">
                <CardHeader>
                  <CardTitle className="text-lg font-heading text-foreground">
                    Энэ сарын статистик
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-paragraph text-foreground/80 text-sm">Дасгал хийсэн өдөр</span>
                      <span className="font-heading text-primary">
                        {dailyEntries.filter(entry => {
                          const entryDate = new Date(entry.date);
                          const now = new Date();
                          return entryDate.getMonth() === now.getMonth() && 
                                 entryDate.getFullYear() === now.getFullYear() &&
                                 entry.exerciseCompleted;
                        }).length}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="font-paragraph text-foreground/80 text-sm">Дундаж усны хэрэглээ</span>
                      <span className="font-heading text-blue-500">
                        {Math.round(
                          dailyEntries
                            .filter(entry => {
                              const entryDate = new Date(entry.date);
                              const now = new Date();
                              return entryDate.getMonth() === now.getMonth() && 
                                     entryDate.getFullYear() === now.getFullYear();
                            })
                            .reduce((sum, entry) => sum + entry.waterIntake, 0) / 
                          Math.max(1, dailyEntries.filter(entry => {
                            const entryDate = new Date(entry.date);
                            const now = new Date();
                            return entryDate.getMonth() === now.getMonth() && 
                                   entryDate.getFullYear() === now.getFullYear();
                          }).length)
                        )}мл
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="font-paragraph text-foreground/80 text-sm">Тэмдэглэл бичсэн</span>
                      <span className="font-heading text-secondary">
                        {dailyEntries.filter(entry => {
                          const entryDate = new Date(entry.date);
                          const now = new Date();
                          return entryDate.getMonth() === now.getMonth() && 
                                 entryDate.getFullYear() === now.getFullYear() &&
                                 entry.mentalNote.length > 0;
                        }).length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
