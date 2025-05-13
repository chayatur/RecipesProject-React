import { createContext, ReactElement, useState } from "react";
import { User } from "../components/Objects";

type UserContextType = {
  myUser: User | null;         
  setMyUser: (myUser: User) => void;
}

export const userContext = createContext<UserContextType>({
  myUser: null,
  setMyUser: (_: User) => {}
});

const UserContext = ({ children }: { children: ReactElement }) => {
  const [user, setUser] = useState<User | null>(null);

  const setMyUser = (user: User) => {
    setUser(user);
  };

  return (
    <userContext.Provider value={{ myUser: user, setMyUser }}>
      {children}
    </userContext.Provider>
  );
};

export default UserContext;

