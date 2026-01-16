
import AuthModal from "../../components/auth/AuthModal.jsx";

export default function Login(){
    return(
        <AuthModal onClose={() => window.history.back()} />
    )
}