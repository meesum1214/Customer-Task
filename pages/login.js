import Link from "next/link"
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/initFirebase";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";


export default () => {

    useEffect(() => {
        if (localStorage.getItem('peretz-customer-auth-token')) {
            router.push('/')
        }
    }, [])


    const router = useRouter()
    const [Loading, setLoading] = useState(false);
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onLogin = () => {
        setLoading(true)

        if (!email || !password) {
            alert('please enter both feilds!')
            setLoading(false)
            return
        }

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                localStorage.setItem('peretz-customer-auth-token', user.accessToken)
                localStorage.setItem('peretz-customer-user-id', user.uid)
                router.push('/')
                setLoading(false)
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // console.log('Error Message: ', errorMessage)
                alert(errorMessage)
                setLoading(false)
                // ..
            });
    }

    return (
        <div>
            {/* Loading Wheel */}
            <div className={`double-up fixed w-screen h-screen ${Loading ? 'flex' : 'hidden'} justify-center items-center bg-[#ffffff3b]`}></div>

            {/* Create login form with tailwind css */}
            <div className="flex flex-col items-center justify-center h-screen">
                <div className="text-white text-5xl font-bold flex justify-center mb-10">Customer Panel</div>
                <div className="w-full max-w-md">
                    <div className="flex justify-between items-center w-full px-12 h-[60px] bg-[#242731] rounded-sm rounded-b-none">
                        <div className="text-xl text-white font-bold text-center">
                            Login
                        </div>
                    </div>
                    <div className="bg-[#16181D] shadow-md rounded-sm px-12 pt-6 pb-8 mb-4">
                        <div className="mb-4">
                            <label className="block text-white text-sm font-bold mb-2" htmlFor="username">
                                Email
                            </label>

                            <input
                                className="shadow appearance-none rounded-sm w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-[#242731] border border-gray-500"
                                id="username"
                                type="email"
                                placeholder="Enter Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                        </div>
                        <div className="mb-6">
                            <label className="block text-white text-sm font-bold mb-2" htmlFor="password">
                                Password
                            </label>
                            <input
                                className="shadow appearance-none border border-gray-500  rounded-sm w-full py-2 px-3 text-gray-300 mb-3 leading-tight focus:outline-none focus:shadow-outline bg-[#242731]"
                                id="password"
                                type="password"
                                placeholder="******************"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') { onLogin() }
                                }}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <button
                                className="bg-[#2DAA46] hover:bg-[#1c722d] transition-all text-white font-bold py-2 px-4 rounded-sm focus:outline-none focus:shadow-outline"
                                type="button"
                                onClick={onLogin}
                            >
                                Login
                            </button>
                            <a className="inline-block align-baseline font-bold text-sm text-[#2DAA46] hover:text-[#36d155] transition-all" href="#">
                                Forgot Password?
                            </a>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="text-gray-500 text-xs">
                            &copy;2022 Naqvi. All rights reserved.
                        </div>
                        <div className="text-gray-500 text-xs flex">
                            Dont have an account?&nbsp;
                            <Link href="/register">
                                <div className="text-[#2DAA46] hover:text-[#36d155] transition-all">
                                    Sign Up
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}