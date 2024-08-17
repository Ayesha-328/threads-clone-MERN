import SignupCard from "../components/Signup"
import LoginCard from "../components/loginCard"
import authScreenAtom from "../atoms/authAtom"
import { useRecoilValue, useSetRecoilState } from "recoil"

function AuthPage() {
    const authScreenState = useRecoilValue(authScreenAtom);

  return (
    <>{
        authScreenState ==="login"?
        <LoginCard />
         :
         <SignupCard />

    }
    </>
  )
}

export default AuthPage