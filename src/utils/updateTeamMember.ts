import { BaseCrudService } from '@/integrations';
import { TeamMembers } from '@/entities';

export async function updateTeamMemberInfo() {
  try {
    // Fetch all team members to find the one we need to update
    const { items } = await BaseCrudService.getAll<TeamMembers>('teammembers');
    
    // Find Тунамал-Эрдэнэ Алтантуяа
    const memberToUpdate = items.find(member => member.name === 'Тунамал-Эрдэнэ Алтантуяа');
    
    if (memberToUpdate) {
      // Update the member with new role and school information
      await BaseCrudService.update<TeamMembers>('teammembers', {
        _id: memberToUpdate._id,
        role: 'багийн ахлагч, хөгжүүлэгч',
        school: 'Нийслэлийн Ерөнхий Боловсролын 40 дүгээр сургуулийн 11Г ангийн сурагч'
      });
      
      console.log('Team member updated successfully');
      return true;
    } else {
      console.log('Team member not found');
      return false;
    }
  } catch (error) {
    console.error('Error updating team member:', error);
    throw error;
  }
}
