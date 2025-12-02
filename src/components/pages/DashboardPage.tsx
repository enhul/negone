import { useState, useEffect } from 'react';
import { useMember } from '@/integrations';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Target, Droplets, Activity, TrendingUp, Plus, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface DailyEntry {
  date: string;
  exerciseCompleted: boolean;
  waterIntake: number;
  mentalNote: string;
  weight: number;
}

interface UserProfile {
  height?: number;
  weight?: number;
  fitnessGoal?: string;
  dailyCalories?: number;
  dailyWater?: number;
  bmi?: number;
  bmiCategory?: string;
  exerciseDays?: number;
}

export default function DashboardPage() {
  const { member } = useMember();
  const [profile, setProfile] = useState<UserProfile>({});
  const [dailyEntries, setDailyEntries] = useState<DailyEntry[]>([]);
  const [currentWeek, setCurrentWeek] = useState<Date[]>([]);
  const [selectedDay, setSelectedDay] = useState<DailyEntry | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);


  useEffect(() => {
    if (!member?.loginEmail) return;
    
    // Load profile data
    const savedProfile = localStorage.getItem(`profile_${member.loginEmail}`);
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch (error) {
        console.error('Error parsing saved profile:', error);
      }
    }

    // Load daily entries
    const savedEntries = localStorage.getItem(`dailyEntries_${member.loginEmail}`);
    if (savedEntries) {
      try {
        setDailyEntries(JSON.parse(savedEntries));
      } catch (error) {
        console.error('Error parsing saved entries:', error);
      }
    }

    // Generate current week dates
    const today = new Date();
    const week = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      week.push(date);
    }
    setCurrentWeek(week);
  }, [member?.loginEmail]);

  const getTodayEntry = () => {
    const today = new Date().toISOString().split('T')[0];
    return dailyEntries.find(entry => entry.date === today);
  };

  const getWeeklyProgress = () => {
    const weekEntries = currentWeek.map(date => {
      const dateStr = date.toISOString().split('T')[0];
      return dailyEntries.find(entry => entry.date === dateStr);
    });

    const exerciseCount = weekEntries.filter(entry => entry?.exerciseCompleted).length;
    const avgWater = weekEntries.reduce((sum, entry) => sum + (entry?.waterIntake || 0), 0) / 7;
    const targetExerciseDays = profile.exerciseDays || 7;

    return { exerciseCount, avgWater, targetExerciseDays };
  };

  const getWeightData = () => {
    return dailyEntries
      .filter(entry => entry.weight > 0)
      .slice(-30) // Last 30 entries
      .map(entry => ({
        date: new Date(entry.date).toLocaleDateString('mn-MN', { month: 'short', day: 'numeric' }),
        weight: entry.weight,
        fullDate: entry.date
      }));
  };

  const getCompactStatsData = () => {
    const weekEntries = currentWeek.map(date => {
      const dateStr = date.toISOString().split('T')[0];
      return dailyEntries.find(entry => entry.date === dateStr);
    });

    return currentWeek.map((date, index) => {
      const entry = weekEntries[index];
      return {
        day: date.toLocaleDateString('mn-MN', { weekday: 'short' }),
        exercise: entry?.exerciseCompleted ? 1 : 0,
        water: entry?.waterIntake ? Math.min(100, (entry.waterIntake / (profile.dailyWater || 2000)) * 100) : 0,
        notes: entry?.mentalNote ? 1 : 0
      };
    });
  };

  const handleDayClick = (fullDate: string) => {
    const entry = dailyEntries.find(e => e.date === fullDate);
    if (entry) {
      setSelectedDay(entry);
      setSelectedDate(fullDate);
    }
  };

  const todayEntry = getTodayEntry();
  const { exerciseCount, avgWater, targetExerciseDays } = getWeeklyProgress();
  const weightData = getWeightData();
  const compactStatsData = getCompactStatsData();

  if (!profile.height || !profile.weight) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-heading text-foreground mb-6">
              Хяналтын самбар
            </h1>
            <p className="text-lg text-foreground/80 font-paragraph mb-8">
              Хяналтын самбарыг ашиглахын тулд эхлээд профайлаа бөглөнө үү
            </p>
            <Link to="/profile">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-[20px] px-8 py-3 text-lg font-paragraph">
                Профайл бөглөх
              </Button>
            </Link>
          </motion.div>
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
              Хяналтын самбар
            </h1>
            <p className="text-lg text-foreground/80 font-paragraph">
              Сайн байна уу, {member?.profile?.nickname || member?.contact?.firstName}! Өнөөдрийн ахиц дэвшлээ харцгаая
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-white/70 backdrop-blur-sm border-primary/20 shadow-lg">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-heading text-primary mb-1">
                  {profile.bmi?.toFixed(1)}
                </div>
                <div className="text-sm font-paragraph text-foreground/80">BMI</div>
                <div className="text-xs font-paragraph text-foreground/60">
                  {profile.bmiCategory}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-secondary/20 shadow-lg">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-heading text-secondary mb-1">
                  {profile.dailyCalories}
                </div>
                <div className="text-sm font-paragraph text-foreground/80">Өдрийн калори</div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-soft-light-green/30 shadow-lg">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-heading text-soft-light-green mb-1">
                  {profile.dailyWater}мл
                </div>
                <div className="text-sm font-paragraph text-foreground/80">Өдрийн ус</div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-primary/20 shadow-lg">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-heading text-primary mb-1">
                  {exerciseCount}/{targetExerciseDays}
                </div>
                <div className="text-sm font-paragraph text-foreground/80">Долоо хоногийн дасгал</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Today's Progress */}
            <div className="lg:col-span-2 space-y-6">
              {/* Today's Status */}
              <Card className="bg-white/70 backdrop-blur-sm border-primary/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl font-heading text-foreground">
                    <Calendar className="w-6 h-6 text-primary" />
                    Өнөөдрийн байдал
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-secondary" />
                      <span className="font-paragraph text-foreground">Дасгал</span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-paragraph ${
                      todayEntry?.exerciseCompleted 
                        ? 'bg-soft-light-green/20 text-soft-light-green' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {todayEntry?.exerciseCompleted ? 'Хийсэн' : 'Хийгээгүй'}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Droplets className="w-5 h-5 text-blue-500" />
                      <span className="font-paragraph text-foreground">Усны хэрэглээ</span>
                    </div>
                    <div className="text-sm font-paragraph text-foreground">
                      {todayEntry?.waterIntake || 0}мл / {profile.dailyWater}мл
                    </div>
                  </div>

                  {todayEntry?.mentalNote && (
                    <div className="bg-primary/10 rounded-xl p-4">
                      <h4 className="font-paragraph font-medium text-foreground mb-2">Өнөөдрийн тэмдэглэл:</h4>
                      <p className="font-paragraph text-foreground/80 text-sm">{todayEntry.mentalNote}</p>
                    </div>
                  )}

                  <Link to="/progress">
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-[20px] py-2 font-paragraph">
                      <Plus className="w-4 h-4 mr-2" />
                      Өнөөдрийн мэдээлэл оруулах
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Compact Statistics Chart */}
              <Card className="bg-white/70 backdrop-blur-sm border-soft-light-green/30 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl font-heading text-foreground">
                    <TrendingUp className="w-5 h-5 text-soft-light-green" />
                    Долоо хоногийн статистик
                  </CardTitle>
                  <p className="text-sm font-paragraph text-foreground/60 mt-2">Гүйцэтгэлийн хэмжээ</p>
                </CardHeader>
                <CardContent>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={compactStatsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#FCE4EC" vertical={false} />
                        <XAxis 
                          dataKey="day" 
                          stroke="#424242"
                          fontSize={11}
                          tick={{ fill: '#666' }}
                        />
                        <YAxis 
                          stroke="#424242"
                          fontSize={11}
                          domain={[0, 100]}
                          hide={true}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid #FCE4EC',
                            borderRadius: '8px',
                            fontSize: '12px',
                            padding: '8px'
                          }}
                          formatter={(value: number) => {
                            if (value === 1) return 'Хийсэн';
                            if (value === 0) return 'Хийгээгүй';
                            return `${Math.round(value)}%`;
                          }}
                        />
                        <Bar 
                          dataKey="exercise" 
                          fill="#dfb8e9" 
                          radius={[4, 4, 0, 0]}
                          name="Дасгал"
                          maxBarSize={20}
                        />
                        <Bar 
                          dataKey="water" 
                          fill="#60a5fa" 
                          radius={[4, 4, 0, 0]}
                          name="Ус"
                          maxBarSize={20}
                        />
                        <Bar 
                          dataKey="notes" 
                          fill="#f592ab" 
                          radius={[4, 4, 0, 0]}
                          name="Тэмдэглэл"
                          maxBarSize={20}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Legend */}
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <div className="grid grid-cols-3 gap-2 text-xs font-paragraph text-foreground/60">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm bg-soft-light-green"></div>
                        <span>Дасгал</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm bg-blue-400"></div>
                        <span>Ус</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm bg-secondary"></div>
                        <span>Тэмдэглэл</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {weightData.length > 0 && (
                <Card className="bg-white/70 backdrop-blur-sm border-secondary/20 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl font-heading text-foreground">
                      <TrendingUp className="w-6 h-6 text-secondary" />
                      Жингийн өөрчлөлт
                    </CardTitle>
                    <p className="text-sm font-paragraph text-foreground/60 mt-2">Өдрийн цэг дээр дарж дэлгэрэнгүй мэдээлэл үзээрэй</p>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={weightData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#FCE4EC" />
                          <XAxis 
                            dataKey="date" 
                            stroke="#424242"
                            fontSize={12}
                          />
                          <YAxis 
                            stroke="#424242"
                            fontSize={12}
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              border: '1px solid #FCE4EC',
                              borderRadius: '12px',
                              fontSize: '14px'
                            }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="weight" 
                            stroke="#E1BEE7" 
                            strokeWidth={3}
                            dot={{ 
                              fill: '#E1BEE7', 
                              strokeWidth: 2, 
                              r: 5, 
                              cursor: 'pointer',
                              onClick: (_e: any, payload: any) => {
                                if (payload && payload.payload && payload.payload.fullDate) {
                                  handleDayClick(payload.payload.fullDate);
                                }
                              }
                            }}
                            activeDot={{ r: 7, fill: '#FCE4EC' }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Weekly Calendar */}
            <div>
              <Card className="bg-white/70 backdrop-blur-sm border-soft-light-green/30 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl font-heading text-foreground">
                    <Calendar className="w-5 h-5 text-soft-light-green" />
                    7 хоногийн календарь
                  </CardTitle>
                  <p className="text-sm font-paragraph text-foreground/60 mt-2">Өдрийг дарж дэлгэрэнгүй үзээрэй</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {currentWeek.map((date, index) => {
                      const dateStr = date.toISOString().split('T')[0];
                      const entry = dailyEntries.find(e => e.date === dateStr);
                      const isToday = dateStr === new Date().toISOString().split('T')[0];
                      
                      return (
                        <button
                          key={index}
                          onClick={() => handleDayClick(dateStr)}
                          className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all hover:shadow-md ${
                            isToday 
                              ? 'bg-primary/20 border-primary/30' 
                              : 'bg-white/50 border-gray-200 hover:border-primary/30'
                          }`}
                        >
                          <div className="text-left">
                            <div className="font-paragraph font-medium text-foreground">
                              {date.toLocaleDateString('mn-MN', { weekday: 'short' })}
                            </div>
                            <div className="text-sm font-paragraph text-foreground/60">
                              {date.getDate()}/{date.getMonth() + 1}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <div className={`w-3 h-3 rounded-full ${
                              entry?.exerciseCompleted ? 'bg-soft-light-green' : 'bg-gray-300'
                            }`} title="Дасгал" />
                            <div className={`w-3 h-3 rounded-full ${
                              entry?.waterIntake && entry.waterIntake >= (profile.dailyWater || 0) * 0.8 
                                ? 'bg-blue-500' : 'bg-gray-300'
                            }`} title="Ус" />
                            <div className={`w-3 h-3 rounded-full ${
                              entry?.mentalNote ? 'bg-secondary' : 'bg-gray-300'
                            }`} title="Тэмдэглэл" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-xs font-paragraph text-foreground/60 space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-soft-light-green"></div>
                        <span>Дасгал хийсэн</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span>Ус хангалттай</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-secondary"></div>
                        <span>Тэмдэглэл бичсэн</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-white/70 backdrop-blur-sm border-primary/20 shadow-lg mt-6">
                <CardHeader>
                  <CardTitle className="text-xl font-heading text-foreground">
                    Хурдан үйлдлүүд
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link to="/recipes">
                    <Button variant="outline" className="w-full justify-start rounded-[20px] border-secondary/30 hover:bg-secondary/10 font-paragraph">
                      🥗 Эрүүл жорууд үзэх
                    </Button>
                  </Link>
                  <Link to="/progress">
                    <Button variant="outline" className="w-full justify-start rounded-[20px] border-primary/30 hover:bg-primary/10 font-paragraph">
                      📊 Ахиц дэвшил оруулах
                    </Button>
                  </Link>
                  <Link to="/profile">
                    <Button variant="outline" className="w-full justify-start rounded-[20px] border-soft-light-green/30 hover:bg-soft-light-green/10 font-paragraph">
                      ⚙️ Профайл засах
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Day Details Modal */}
          <Dialog open={!!selectedDay} onOpenChange={(open) => {
            if (!open) {
              setSelectedDay(null);
              setSelectedDate(null);
            }
          }}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl font-heading text-foreground">
                  {selectedDate && new Date(selectedDate).toLocaleDateString('mn-MN', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </DialogTitle>
              </DialogHeader>
              
              {selectedDay && (
                <div className="space-y-4">
                  {/* Exercise Status */}
                  <div className="bg-soft-light-green/10 rounded-xl p-4 border border-soft-light-green/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-5 h-5 text-soft-light-green" />
                      <h3 className="font-heading text-foreground">Дасгал</h3>
                    </div>
                    <p className={`font-paragraph text-sm ${
                      selectedDay.exerciseCompleted 
                        ? 'text-soft-light-green font-medium' 
                        : 'text-foreground/60'
                    }`}>
                      {selectedDay.exerciseCompleted ? '✓ Хийсэн' : '✗ Хийгээгүй'}
                    </p>
                  </div>

                  {/* Water Intake */}
                  <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Droplets className="w-5 h-5 text-blue-500" />
                      <h3 className="font-heading text-foreground">Усны хэрэглээ</h3>
                    </div>
                    <div className="space-y-2">
                      <p className="font-heading text-lg text-blue-500">
                        {selectedDay.waterIntake}мл
                      </p>
                      <Progress 
                        value={Math.min(100, (selectedDay.waterIntake / (profile.dailyWater || 2000)) * 100)} 
                        className="h-2"
                      />
                      <p className="font-paragraph text-xs text-foreground/60">
                        Зорилго: {profile.dailyWater || 2000}мл
                      </p>
                    </div>
                  </div>

                  {/* Weight */}
                  {selectedDay.weight > 0 && (
                    <div className="bg-secondary/10 rounded-xl p-4 border border-secondary/20">
                      <h3 className="font-heading text-foreground mb-2">Жин</h3>
                      <p className="font-heading text-lg text-secondary">
                        {selectedDay.weight}кг
                      </p>
                    </div>
                  )}

                  {/* Mental Note */}
                  {selectedDay.mentalNote && (
                    <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-5 h-5 text-primary" />
                        <h3 className="font-heading text-foreground">Сэтгэлзүйн тэмдэглэл</h3>
                      </div>
                      <p className="font-paragraph text-sm text-foreground/80">
                        {selectedDay.mentalNote}
                      </p>
                    </div>
                  )}

                  {!selectedDay.mentalNote && !selectedDay.weight && selectedDay.waterIntake === 0 && !selectedDay.exerciseCompleted && (
                    <div className="text-center py-6">
                      <p className="font-paragraph text-foreground/60">
                        Энэ өдрийн мэдээлэл бүртгэгдээгүй байна
                      </p>
                    </div>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>
    </div>
  );
}
