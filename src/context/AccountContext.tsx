import React, { createContext, useContext, useEffect, useState } from 'react';
import accountService from '../services/AccountService';
import { User } from '../models/account';

interface AccountContextType {
  user: User | null;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const AccountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(accountService.getCurrentUser());

  useEffect(() => {
    const subscription = accountService.user$.subscribe((newUser) => {
      setUser(newUser); // user$ এর প্রতিটি আপডেটে React স্টেট আপডেট হবে
    });
    return () => subscription.unsubscribe(); // ক্লিনআপ
  }, []);

  return <AccountContext.Provider value={{ user }}>{children}</AccountContext.Provider>;
};

export const useAccount = () => {
  const context = useContext(AccountContext);
  if (!context) throw new Error('useAccount must be used within an AccountProvider');
  return context;
};