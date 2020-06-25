import { plainToClass } from "class-transformer";
import { Base64 } from "js-base64";
import { Teacher } from "../models/teacher.model";

const key = "_167@atten_ottop";
class TeacherAuthenticationService {
    /**
     * Checks if the teacher is logged in
     */
    IsAuthenticated(): Boolean {
        return localStorage.getItem(key) ? true : false;
    }

    /**
     * Saves user object and token to localStorage
     * @param teacher user object to save
     * @param token generated token from server
     */
    Login(teacher: any, token: string): boolean {
        if (teacher && token) {
            // convert to string
            const objJson = JSON.stringify({ teacher, token });
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

    GetTeacher(): Teacher {
        // get encrypted data
        const encrypted = localStorage.getItem(key);
        // decrypt data
        const rawString = Base64.decode(encrypted || "");
        if (rawString) {
            const { teacher } = JSON.parse(rawString);
            const _teacher = plainToClass(Teacher, teacher);
            return _teacher;
        }
        return new Teacher();
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
export const teacherAuthService = new TeacherAuthenticationService();
