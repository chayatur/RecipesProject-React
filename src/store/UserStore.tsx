import { makeAutoObservable } from "mobx";
import { User } from "../components/Object"; 

class UserStore {
    user: User | null;

    constructor() {
        this.user = null;
        makeAutoObservable(this);
    }

    setUser(user: User) {
        this.user = user;
    }
}

export default new UserStore();
