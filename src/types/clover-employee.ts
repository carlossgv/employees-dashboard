export type CloverEmployee = {
  id: string;
  name: string;
  nickname?: string;
  customId?: string;
  email?: string;
  inviteSent?: boolean;
  claimedTime?: number;
  deletedTime?: number;
  pin?: string;
  unhashedPin?: string;
  role?: 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
  roles?: {
    id: string;
    isOwner?: boolean;
  }[];
  shifts?: {
    id: string;
  }[];
  payments?: {
    id: string;
  }[];
  orders?: {
    id: string;
  }[];
  employeeCards?: {
    id: string;
  }[];
  merchant?: {
    id: string;
  };
};
