import { JwtPayload } from 'jwt-decode';

export interface CustomJwtPayload extends JwtPayload {
  role: string | string[]; // role can be a string or an array of strings
}