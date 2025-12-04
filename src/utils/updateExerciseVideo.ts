import { BaseCrudService } from '@/integrations';
import { CuratedExercises } from '@/entities';

export async function updateExerciseVideo() {
  try {
    // Fetch all exercises to find the one we need to update
    const { items } = await BaseCrudService.getAll<CuratedExercises>('curatedexercises');
    
    // Find the exercise titled 'Эхлэгчдэд зориулсан биеийн бүх хэсгийн дасгал'
    const exercise = items.find(ex => ex.exerciseName === 'Эхлэгчдэд зориулсан биеийн бүх хэсгийн дасгал');
    
    if (exercise) {
      await BaseCrudService.update<CuratedExercises>('curatedexercises', {
        _id: exercise._id,
        youtubeLink: 'https://www.youtube.com/watch?v=UItWltVZZmE'
      });
      console.log('Exercise video link updated successfully');
    } else {
      console.log('Exercise not found');
    }
    
    return true;
  } catch (error) {
    console.error('Error updating exercise video:', error);
    throw error;
  }
}
