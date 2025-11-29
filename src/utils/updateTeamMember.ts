import { BaseCrudService } from '@/integrations';
import { TeamMembers } from '@/entities';

export async function updateTeamMemberInfo() {
  try {
    // Fetch all team members to find the ones we need to update
    const { items } = await BaseCrudService.getAll<TeamMembers>('teammembers');
    
    // Update Цэвээнсүрэн Мишээл
    const member1 = items.find(member => member.name === 'Цэвээнсүрэн Мишээл');
    if (member1) {
      await BaseCrudService.update<TeamMembers>('teammembers', {
        _id: member1._id,
        role: 'төслийн санаа боловсруулагч, хөгжүүлэгч',
        school: 'Олула ТомЁ сургуулийн 12А ангийн сурагч'
      });
      console.log('Цэвээнсүрэн Мишээл updated successfully');
    }
    
    // Update Амардалай Содбилэг
    const member2 = items.find(member => member.name === 'Амардалай Содбилэг');
    if (member2) {
      await BaseCrudService.update<TeamMembers>('teammembers', {
        _id: member2._id,
        role: 'Судалгаа хариуцсан мэргэжилтэн, хөгжүүлэгч',
        school: 'Хо-Ши-Мин-ийн нэрэмжит 14 дүгээр сургуулийн 11А ангийн сурагч'
      });
      console.log('Амардалай Содбилэг updated successfully');
    }
    
    return true;
  } catch (error) {
    console.error('Error updating team members:', error);
    throw error;
  }
}
