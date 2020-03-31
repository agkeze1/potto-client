import { plainToClass } from "class-transformer";
import { Base64 } from "js-base64";
import { User } from "../models/User.model";

const key = "_166@atten_dance";
class AuthenticationService {
  /**
   * Checks if the user is logged in
   */
  IsAuthenticated(): Boolean {
    return localStorage.getItem(key) ? true : false;
  }

  /**
   * Saves user object and token to localStorage
   * @param user user object to save
   * @param token generated token from server
   */
  Login(user: any, token: string): boolean {
    if (user && token) {
      // convert to string
      const objJson = JSON.stringify({ user, token });
      //encrypt json string
      const encrypted = Base64.encode(objJson);
      // write data
      localStorage.setItem(key, encrypted);
      return true;
    }
    return false;
  }

  Logout(): boolean {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
      return true;
    }
    return false;
  }

  GetUser(): User {
    // get encrypted data
    const encrypted = localStorage.getItem(key);
    // decrypt data
    const rawString = Base64.decode(encrypted || "");
    if (rawString) {
      const { user } = JSON.parse(rawString);
      const _user = plainToClass(User, user);
      return _user;
    }
    return new User();
  }

  GetToken(): string {
    // get encrypted data
    const encrypted = localStorage.getItem(key);
    // decrypt data
    const rawString = Base64.decode(encrypted || "");
    if (rawString) {
      const { token } = JSON.parse(rawString);
      return token;
    }
    return "";
  }
}
export const authService = new AuthenticationService();
