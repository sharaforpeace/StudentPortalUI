import { gender } from './gender.model';
import { address } from './address.model';

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  mobile: number;
  profileImageUrl: string;
  genderId: string;
  gender: gender;
  address: address;
}
