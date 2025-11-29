import { BaseCrudService } from '@/integrations';
import { TeamMembers } from '@/entities';

export async function updateTeamMemberInfo() {
  try {
    // Fetch all team members to find the ones we need to update
    const { items } = await BaseCrudService.getAll<TeamMembers>('teammembers');
    
    // Update Содгэрэл Биндэръяа
    const member1 = items.find(member => member.name === 'Содгэрэл Биндэръяа');
    if (member1) {
      await BaseCrudService.update<TeamMembers>('teammembers', {
        _id: member1._id,
        role: 'дизайнер, хөгжүүлэгч',
        school: 'Индра Кибер сургуулийн 11-2 ангийн сурагч'
      });
      console.log('Содгэрэл Биндэръяа updated successfully');
    }
    
    // Update Энхбаясгалан Энххүслэн
    const member2 = items.find(member => member.name === 'Энхбаясгалан Энххүслэн');
    if (member2) {
      await BaseCrudService.update<TeamMembers>('teammembers', {
        _id: member2._id,
        role: 'дизайнер, хөгжүүлэгч',
        school: 'БЗД-ийн 21 дүгээр сургуулийн 11В ангийн сурагч'
      });
      console.log('Энхбаясгалан Энххүслэн updated successfully');
    }
    
    return true;
  } catch (error) {
    console.error('Error updating team members:', error);
    throw error;
  }
}
