import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { BaseCrudService } from '@/integrations';
import { TeamMembers } from '@/entities';
import { Image } from '@/components/ui/image';
import UpdateTeamMember from '@/components/UpdateTeamMember';

export default function AboutPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMembers[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const { items } = await BaseCrudService.getAll<TeamMembers>('teammembers');
        // Filter out specific team members
        const excludedNames = ['Ариунзаяа Батбаяр', 'Уранчимэг Дорж', 'Нарантуяа Ганбаатар', 'Энхтуул Цэрэндорж'];
        const filteredMembers = items.filter(member => !excludedNames.includes(member.name || ''));
        
        // Hardcode specific name and role changes
        const updatedMembers = filteredMembers.map(member => {
          if (member.name === 'Эрдэнэболд Энхцэцэг') {
            return { ...member, name: 'Эрдэнэболд Эрхцэцэг', photo: 'https://static.wixstatic.com/media/906313_82e38ca0d15e480eb59f848ebfb5afb7~mv2.jpeg' };
          }
          if (member.name === 'Энхбаясгалан Энххүслэн') {
            return { ...member, name: 'Мөнхбаясгалан Энххүслэн', role: 'Судалгаа хариуцагч, хөгжүүлэгч' };
          }
          return member;
        });
        
        setTeamMembers(updatedMembers);
      } catch (error) {
        console.error('Error fetching team members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <UpdateTeamMember />
      {/* Header */}
      <motion.section 
        className="py-20 px-8 max-w-[100rem] mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-heading text-foreground mb-6">
            NegOne-ийн тухай
          </h1>
          <p className="text-xl text-foreground/80 font-paragraph max-w-4xl mx-auto">
            Охид, эмэгтэйчүүдийн эрүүл мэнд, сэтгэлзүй, өөрийгөө хайрлахад зориулсан цогц платформ
          </p>
        </div>
      </motion.section>

      {/* Name Meaning Section */}
      <motion.section 
        className="py-16 px-8 bg-gradient-to-br from-primary/5 to-secondary/5"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="max-w-[100rem] mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-heading text-foreground mb-8">
                NegOne нэрний утга
              </h2>
              <div className="space-y-6">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-primary/10">
                  <h3 className="text-2xl font-heading text-primary mb-4">Нэгэн бүхэл</h3>
                  <p className="text-foreground/80 font-paragraph">
                    <strong>Neg = 1 (монгол)</strong> + <strong>One = 1 (англи)</strong> = Нэг зорилго тэмүүлэл, нэг зүрх сэтгэл, нэг хамт олон, нэгэн бүхэл байх гэсэн утгатай.
                  </p>
                </div>
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-secondary/10">
                  <h3 className="text-2xl font-heading text-secondary mb-4">Ногоон өнгийн утга</h3>
                  <p className="text-foreground/80 font-paragraph">
                    "Нэгон" дуудлага нь "Ногоон" гэсэнтэй өнгөтнй төстэй дуудагдаж, сонсогдох бөгөөд энэ нь тайвшрал, эерэг сэтгэлзүй, байгалийн өнгийг агуулна.
                  </p>
                </div>
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-soft-light-green/30">
                  <h3 className="text-2xl font-heading text-soft-light-green mb-4">Манай эрхэм зорилго</h3>
                  <p className="text-foreground/80 font-paragraph">
                    Охид, эмэгтэйчүүдийн эрүүл мэнд, сэтгэлзүй, өөрийгөө хайрлах боломжийг нэг платформд нэгтгэж, AI технологийн тусламжтайгаар хувийн зөвлөгөө өгөх.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <motion.div 
                className="w-80 h-80 bg-gradient-to-br from-primary/20 via-secondary/20 to-soft-light-green/20 rounded-full flex items-center justify-center shadow-2xl"
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="text-center">
                  <h3 className="text-6xl font-heading text-foreground mb-4">NegOne</h3>
                  <p className="text-2xl font-paragraph text-foreground/70">Нэгон</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Mission Section */}
      <motion.section 
        className="py-16 px-8 max-w-[100rem] mx-auto"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-heading text-foreground mb-6">
            Манай эрхэм зорилго
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <motion.div 
            className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-primary/10 text-center"
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💪</span>
            </div>
            <h3 className="text-xl font-heading text-foreground mb-3">Фитнес</h3>
            <p className="text-foreground/80 font-paragraph text-sm">
              Хувийн биеийн галбирт тохирсон дасгалын зөвлөгөө
            </p>
          </motion.div>

          <motion.div 
            className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-secondary/10 text-center"
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🧠</span>
            </div>
            <h3 className="text-xl font-heading text-foreground mb-3">Сэтгэлзүй</h3>
            <p className="text-foreground/80 font-paragraph text-sm">
              Сэтгэлзүйн эрүүл мэндийг дэмжих арга зам
            </p>
          </motion.div>

          <motion.div 
            className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-soft-light-green/30 text-center"
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="w-16 h-16 bg-soft-light-green/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💚</span>
            </div>
            <h3 className="text-xl font-heading text-foreground mb-3">Өөрийгөө хайрлах</h3>
            <p className="text-foreground/80 font-paragraph text-sm">
              Өөртөө итгэх итгэл, өөрийгөө хайрлах
            </p>
          </motion.div>

          <motion.div 
            className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-primary/20 text-center"
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🥗</span>
            </div>
            <h3 className="text-xl font-heading text-foreground mb-3">Эрүүл хооллолт</h3>
            <p className="text-foreground/80 font-paragraph text-sm">
              Калорийн хэрэгцээнд тохирсон хоолны жор
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section 
        className="py-16 px-8 bg-gradient-to-br from-secondary/5 to-primary/5"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="max-w-[100rem] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-heading text-foreground mb-6">
              Манай баг
            </h2>
            <p className="text-lg text-foreground/80 font-paragraph max-w-3xl mx-auto">
              NegOne-ийг бүтээсэн эмэгтэйчүүдийн эрүүл мэндэд тусламж үзүүлэхэд зориулагдсан мэргэжлийн баг
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg animate-pulse">
                  <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-16 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div 
                  key={member._id}
                  className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-primary/10 text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  {member.photo && (
                    <div className="w-32 h-32 mx-auto mb-4 overflow-hidden rounded-full border-4 border-primary/20">
                      <Image 
                        src={member.photo} 
                        alt={member.name || 'Багийн гишүүн'}
                        width={128}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <h3 className="text-2xl font-heading text-foreground mb-2">
                    {member.name}
                  </h3>
                  <p className="text-primary font-paragraph font-medium mb-3">
                    {member.role}
                  </p>
                  {member.school && (
                    <p className="text-foreground/70 font-paragraph text-sm">
                      <strong></strong> {member.school}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.section>
    </div>
  );
}