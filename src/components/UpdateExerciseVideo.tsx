import { useEffect } from 'react';
import { updateExerciseVideo } from '@/utils/updateExerciseVideo';

export default function UpdateExerciseVideo() {
  useEffect(() => {
    updateExerciseVideo();
  }, []);

  return null;
}
