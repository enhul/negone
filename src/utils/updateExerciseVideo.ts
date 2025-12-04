import { BaseCrudService } from '@/integrations';
import { CuratedExercises } from '@/entities';

export async function updateExerciseVideo() {
  try {
    // Fetch all exercises to find the ones we need to update
    const { items } = await BaseCrudService.getAll<CuratedExercises>('curatedexercises');
    
    // Update first exercise: 'Эхлэгчдэд зориулсан биеийн бүх хэсгийн дасгал'
    const exercise1 = items.find(ex => ex.exerciseName === 'Эхлэгчдэд зориулсан биеийн бүх хэсгийн дасгал');
    if (exercise1) {
      await BaseCrudService.update<CuratedExercises>('curatedexercises', {
        _id: exercise1._id,
        youtubeLink: 'https://www.youtube.com/watch?v=UItWltVZZmE'
      });
      console.log('Exercise 1 video link updated successfully');
    }
    
    // Update second exercise: 'Өгзөг ба гуяны дасгал (Сувдан галбирт)'
    const exercise2 = items.find(ex => ex.exerciseName === 'Өгзөг ба гуяны дасгал (Сувдан галбирт)');
    if (exercise2) {
      await BaseCrudService.update<CuratedExercises>('curatedexercises', {
        _id: exercise2._id,
        youtubeLink: 'https://www.youtube.com/watch?v=zamg97lkoAI'
      });
      console.log('Exercise 2 video link updated successfully');
    }
    
    // Update third exercise: 'Хэвлийн булчингийн дасгал'
    const exercise3 = items.find(ex => ex.exerciseName === 'Хэвлийн булчингийн дасгал');
    if (exercise3) {
      await BaseCrudService.update<CuratedExercises>('curatedexercises', {
        _id: exercise3._id,
        youtubeLink: 'https://www.youtube.com/watch?v=K3GLIs6yNp4'
      });
      console.log('Exercise 3 video link updated successfully');
    }
    
    return true;
  } catch (error) {
    console.error('Error updating exercise video:', error);
    throw error;
  }
}
