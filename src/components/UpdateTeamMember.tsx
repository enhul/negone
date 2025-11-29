import { useEffect } from 'react';
import { updateTeamMemberInfo } from '@/utils/updateTeamMember';

export default function UpdateTeamMember() {
  useEffect(() => {
    updateTeamMemberInfo();
  }, []);

  return null;
}
