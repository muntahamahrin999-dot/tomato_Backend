export interface User {
  userName: string;
  userFirstName?: string;
  userLastName?: string;
  email: string;
  phoneNumber?: string;
  enabled?: boolean;
  roles?: string[];
  dateCreated?: string;
  lastUpdated?: string;
}
