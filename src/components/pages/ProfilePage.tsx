import { useState, useEffect } from 'react';
import { useMember } from '@/integrations';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { User, Target, Activity, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  height?: number;
  weight?: number;
  fitnessGoal?: 'weight-loss' | 'weight-maintenance' | 'muscle-gain';
  exerciseDays?: number;
  exerciseMinutes?: number;
  focusAreas?: string[];
  bodyShape?: 'rectangle' | 'triangle' | 'inverted-triangle' | 'hourglass' | 'pear' | 'apple';
  bmi?: number;
  bmiCategory?: string;
  dailyCalories?: number;
  dailyWater?: number;
}

const bodyShapeOptions = [
  { value: 'rectangle', label: 'Rectangle (Тэгш өнцөгт)' },
  { value: 'triangle', label: 'Triangle (Гурвалжин)' },
  { value: 'inverted-triangle', label: 'Inverted Triangle (Урвуу гурвалжин)' },
  { value: 'hourglass', label: 'Hourglass (Элсний цаг)' },
  { value: 'pear', label: 'Pear (Лийр)' },
  { value: 'apple', label: 'Apple (Алим)' },
];

const focusAreaOptions = [
  { id: 'arms', label: 'Гар' },
  { id: 'shoulders', label: 'Мөр' },
  { id: 'back', label: 'Нуруу' },
  { id: 'abs', label: 'Хэвлий' },
  { id: 'glutes', label: 'Өгзөг' },
  { id: 'legs', label: 'Гуя' },
];

const fitnessGoalOptions = [
  { value: 'weight-loss', label: 'Жин хасах' },
  { value: 'weight-maintenance', label: 'Жин барих' },
  { value: 'muscle-gain', label: 'Булчин нэмэх' },
];

export default function ProfilePage() {
  const { member } = useMember();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!member?.loginEmail) return;
    
    // Load existing profile data if available
    const savedProfile = localStorage.getItem(`profile_${member.loginEmail}`);
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch (error) {
        console.error('Error parsing saved profile:', error);
      }
    }
  }, [member?.loginEmail]);

  const calculateBMI = (height: number, weight: number) => {
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return 'Дутуу жинтэй';
    if (bmi < 25) return 'Хэвийн жинтэй';
    if (bmi < 30) return 'Илүү жинтэй';
    return 'Таргалалттай';
  };

  const calculateDailyCalories = (weight: number, height: number, goal: string) => {
    // Basic BMR calculation for women
    const bmr = 655 + (9.6 * weight) + (1.8 * height) - (4.7 * 25); // assuming average age of 25
    let calories = bmr * 1.5; // moderate activity level
    
    if (goal === 'weight-loss') calories -= 300;
    if (goal === 'muscle-gain') calories += 200;
    
    return Math.round(calories);
  };

  const calculateDailyWater = (weight: number) => {
    return Math.round(weight * 35); // 35ml per kg
  };

  const handleSave = async () => {
    if (!profile.height || !profile.weight || !profile.fitnessGoal || !profile.bodyShape) {
      toast({
        title: 'Алдаа',
        description: 'Бүх шаардлагатай талбаруудыг бөглөнө үү',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    
    try {
      // Calculate BMI and other metrics
      const bmi = calculateBMI(profile.height, profile.weight);
      const bmiCategory = getBMICategory(bmi);
      const dailyCalories = calculateDailyCalories(profile.weight, profile.height, profile.fitnessGoal);
      const dailyWater = calculateDailyWater(profile.weight);

      const updatedProfile = {
        ...profile,
        bmi: Math.round(bmi * 10) / 10,
        bmiCategory,
        dailyCalories,
        dailyWater,
      };

      // Save to localStorage
      localStorage.setItem(`profile_${member?.loginEmail}`, JSON.stringify(updatedProfile));
      setProfile(updatedProfile);

      toast({
        title: 'Амжилттай хадгалагдлаа',
        description: 'Таны профайл мэдээлэл шинэчлэгдлээ',
      });
    } catch (error) {
      toast({
        title: 'Алдаа гарлаа',
        description: 'Профайл хадгалахад алдаа гарлаа',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFocusAreaChange = (areaId: string, checked: boolean) => {
    const currentAreas = profile.focusAreas || [];
    if (checked) {
      setProfile({ ...profile, focusAreas: [...currentAreas, areaId] });
    } else {
      setProfile({ ...profile, focusAreas: currentAreas.filter(id => id !== areaId) });
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-heading text-foreground mb-4">
              Хувийн профайл
            </h1>
            <p className="text-lg text-foreground/80 font-paragraph">
              Сайн байна уу, {member?.profile?.nickname || member?.contact?.firstName || 'Хэрэглэгч'}!
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Profile Setup */}
            <Card className="bg-white/70 backdrop-blur-sm border-primary/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl font-heading text-foreground">
                  <User className="w-6 h-6 text-primary" />
                  Биеийн мэдээлэл
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="height" className="font-paragraph text-foreground">Өндөр (см)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={profile.height || ''}
                      onChange={(e) => setProfile({ ...profile, height: Number(e.target.value) })}
                      className="mt-1 rounded-xl border-primary/20"
                      placeholder="160"
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight" className="font-paragraph text-foreground">Жин (кг)</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={profile.weight || ''}
                      onChange={(e) => setProfile({ ...profile, weight: Number(e.target.value) })}
                      className="mt-1 rounded-xl border-primary/20"
                      placeholder="55"
                    />
                  </div>
                </div>

                <div>
                  <Label className="font-paragraph text-foreground">Биеийн галбир</Label>
                  <Select value={profile.bodyShape} onValueChange={(value) => setProfile({ ...profile, bodyShape: value as any })}>
                    <SelectTrigger className="mt-1 rounded-xl border-primary/20">
                      <SelectValue placeholder="Биеийн галбираа сонгоно уу" />
                    </SelectTrigger>
                    <SelectContent>
                      {bodyShapeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="font-paragraph text-foreground">Фитнесийн зорилго</Label>
                  <Select value={profile.fitnessGoal} onValueChange={(value) => setProfile({ ...profile, fitnessGoal: value as any })}>
                    <SelectTrigger className="mt-1 rounded-xl border-primary/20">
                      <SelectValue placeholder="Зорилгоо сонгоно уу" />
                    </SelectTrigger>
                    <SelectContent>
                      {fitnessGoalOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Exercise Preferences */}
            <Card className="bg-white/70 backdrop-blur-sm border-secondary/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl font-heading text-foreground">
                  <Activity className="w-6 h-6 text-secondary" />
                  Дасгалын тохиргоо
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="exerciseDays" className="font-paragraph text-foreground">Долоо хоногт хэдэн өдөр</Label>
                    <Input
                      id="exerciseDays"
                      type="number"
                      min="1"
                      max="7"
                      value={profile.exerciseDays || ''}
                      onChange={(e) => setProfile({ ...profile, exerciseDays: Number(e.target.value) })}
                      className="mt-1 rounded-xl border-secondary/20"
                      placeholder="3"
                    />
                  </div>
                  <div>
                    <Label htmlFor="exerciseMinutes" className="font-paragraph text-foreground">Өдөрт дунджаар хэр их хугацаа (минут)</Label>
                    <Input
                      id="exerciseMinutes"
                      type="number"
                      value={profile.exerciseMinutes || ''}
                      onChange={(e) => setProfile({ ...profile, exerciseMinutes: Number(e.target.value) })}
                      className="mt-1 rounded-xl border-secondary/20"
                      placeholder="30"
                    />
                  </div>
                </div>

                <div>
                  <Label className="font-paragraph text-foreground mb-3 block">Төвлөрөх биеийн хэсгүүд</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {focusAreaOptions.map((area) => (
                      <div key={area.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={area.id}
                          checked={profile.focusAreas?.includes(area.id) || false}
                          onCheckedChange={(checked) => handleFocusAreaChange(area.id, checked as boolean)}
                          className="border-secondary/30"
                        />
                        <Label htmlFor={area.id} className="font-paragraph text-sm text-foreground">
                          {area.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Calculations */}
          {profile.height && profile.weight && profile.fitnessGoal && (
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-gradient-to-br from-soft-light-green/10 to-primary/10 border-soft-light-green/30 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl font-heading text-foreground">
                    <Target className="w-6 h-6 text-soft-light-green" />
                    AI тооцоолол
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-heading text-primary mb-2">
                        {profile.bmi || calculateBMI(profile.height, profile.weight).toFixed(1)}
                      </div>
                      <div className="text-sm font-paragraph text-foreground/80">BMI</div>
                      <div className="text-xs font-paragraph text-foreground/60 mt-1">
                        {profile.bmiCategory || getBMICategory(calculateBMI(profile.height, profile.weight))}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-heading text-secondary mb-2">
                        {profile.dailyCalories || calculateDailyCalories(profile.weight, profile.height, profile.fitnessGoal)}
                      </div>
                      <div className="text-sm font-paragraph text-foreground/80">Өдрийн калори</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-heading text-soft-light-green mb-2">
                        {profile.dailyWater || calculateDailyWater(profile.weight)}мл
                      </div>
                      <div className="text-sm font-paragraph text-foreground/80">Өдрийн ус</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-heading text-primary mb-2">
                        {profile.exerciseDays || 0}×{profile.exerciseMinutes || 0}
                      </div>
                      <div className="text-sm font-paragraph text-foreground/80">Долоо хоногийн дасгал</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Save Button */}
          <div className="mt-8 text-center">
            <Button
              onClick={handleSave}
              disabled={loading}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-[20px] px-12 py-3 text-lg font-paragraph"
            >
              {loading ? 'Хадгалж байна...' : 'Профайл хадгалах'}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}