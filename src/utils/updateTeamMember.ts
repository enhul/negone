import { BaseCrudService } from '@/integrations';
import { TeamMembers } from '@/entities';

export async function updateTeamMemberInfo() {
  try {
    // Fetch all team members to find the ones we need to update
    const { items } = await BaseCrudService.getAll<TeamMembers>('teammembers');
    
    // Update Сансарбаяр Хулан
    const member1 = items.find(member => member.name === 'Сансарбаяр Хулан');
    if (member1) {
      await BaseCrudService.update<TeamMembers>('teammembers', {
        _id: member1._id,
        school: 'Төгсдэлгэрэх бүрэн дунд сургууль 10A анги',
        photo: 'https://static.wixstatic.com/media/906313_3410ef614ab14aa5a9308c86e89588aa~mv2.jpeg'
      });
      console.log('Сансарбаяр Хулан updated successfully');
    }
    
    // Update Содгэрэл Биндэръяа
    const member2 = items.find(member => member.name === 'Содгэрэл Биндэръяа');
    if (member2) {
      await BaseCrudService.update<TeamMembers>('teammembers', {
        _id: member2._id,
        photo: 'https://static.wixstatic.com/media/906313_9a4ae187f717434ca3f38a2f530d446b~mv2.jpg'
      });
      console.log('Содгэрэл Биндэръяа updated successfully');
    }
    
    // Update Амардалай Содбилэг
    const member3 = items.find(member => member.name === 'Амардалай Содбилэг');
    if (member3) {
      await BaseCrudService.update<TeamMembers>('teammembers', {
        _id: member3._id,
        photo: 'https://static.wixstatic.com/media/906313_ff46ce20609f4ae4a20579c4f935fb40~mv2.jpg'
      });
      console.log('Амардалай Содбилэг updated successfully');
    }
    
    // Update Тунамал-Эрдэнэ Алтантуяа
    const member4 = items.find(member => member.name === 'Тунамал-Эрдэнэ Алтантуяа');
    if (member4) {
      await BaseCrudService.update<TeamMembers>('teammembers', {
        _id: member4._id,
        photo: 'https://static.wixstatic.com/media/906313_fc57e8ca92014cdfaede60f9ab5c7cee~mv2.jpg'
      });
      console.log('Тунамал-Эрдэнэ Алтантуяа updated successfully');
    }
    
    // Update Эрдэнэболд Эрхцэцэг
    const member5 = items.find(member => member.name === 'Эрдэнэболд Эрхцэцэг');
    if (member5) {
      await BaseCrudService.update<TeamMembers>('teammembers', {
        _id: member5._id,
        photo: 'https://static.wixstatic.com/media/906313_4c5c60b0b7b84192be9eb117a9365807~mv2.jpg'
      });
      console.log('Эрдэнэболд Эрхцэцэг updated successfully');
    }
    
    return true;
  } catch (error) {
    console.error('Error updating team members:', error);
    throw error;
  }
}
