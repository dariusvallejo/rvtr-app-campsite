import { Name } from './name.model';

/**
 * Represents the _Profile_ model
 *
 * ```yaml
 * id: string;
 * email: string;
 * name: Name;
 * phone: string;
 * ```
 */
export interface Profile {
  id: number;
  accountId?:number;
  email: string;
  name: Name;
  phone: string;
  age: "Adult" | "Child";
  image: string;
}
