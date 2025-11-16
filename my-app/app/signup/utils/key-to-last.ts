import { SignupData } from "@/app/types/signup";

export default function inspectAllInformation(userDetails: SignupData) {
    if (userDetails.username.length > 0 && userDetails.email.length > 0 && userDetails.password.length > 0) {
        return true;
    }
    return false;
}