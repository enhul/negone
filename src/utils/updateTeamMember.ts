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
        school: 'Төгсдэлгэрэх бүрэн дунд сургууль 10A анги'
      });
      console.log('Сансарбаяр Хулан updated successfully');
    }
    
    return true;
  } catch (error) {
    console.error('Error updating team members:', error);
    throw error;
  }
}
