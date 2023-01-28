import { v4 } from 'uuid';

export const uuidv4To12 = (): string => {
  let uuid12 = v4().split('-').slice(1).toString().replaceAll(',','');
  return uuid12;
}
