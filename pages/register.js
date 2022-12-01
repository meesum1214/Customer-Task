import Link from "next/link"
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, database, storage } from "../firebase/initFirebase";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ref, set } from "firebase/database";
import { getCustomers, getUsers, getWorkers } from "../firebase/FirebaseFunctions";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { Image, SimpleGrid, Text } from "@mantine/core";
import { ref as ref_storage, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export default () => {

    const [allUsers, setAllUsers] = useState([])
    const [allWorkers, setAllWorkers] = useState([])
    const [allCustomers, setAllCustomers] = useState([])

    const [percent, setPercent] = useState(0)

    const [totalPhone, setTotalPhone] = useState([{ phone: '' }])

    useEffect(() => {
        getUsers(setAllUsers)
        getWorkers(setAllWorkers)
        getCustomers(setAllCustomers)
    }, [])


    const router = useRouter()
    const [Loading, setLoading] = useState(false);
    const [fName, setFName] = useState('')
    const [lName, setLName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [companyName, setCompanyName] = useState('')
    const [companyAddress, setCompanyAddress] = useState('')
    const [companyWebsite, setCompanyWebsite] = useState('')
    const [companyLogo, setCompanyLogo] = useState([])

    const onRegister = () => {

        setLoading(true)

        if (!email || !password || !fName || !lName || !companyName || !companyAddress || !companyWebsite || companyLogo.length === 0) {
            alert('please enter all feilds!')
            return
        } else {
            totalPhone.map((phone) => {
                if (phone.phone === '') {
                    alert('please enter phone Number!')
                    return
                }
            })
        }

        // console.log('totalPhone: ', totalPhone)


        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                localStorage.setItem('peretz-customer-auth-token', user.accessToken)
                localStorage.setItem('peretz-customer-user-id', user.uid)

                if (!allUsers) {

                    const metadata = {
                        contentType: 'image/jpeg'
                    };

                    const storageRef = ref_storage(storage, 'taskimages/' + companyLogo[0].name);
                    const uploadTask = uploadBytesResumable(storageRef, companyLogo[0], metadata);

                    uploadTask.on('state_changed',
                        (snapshot) => {
                            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                            // console.log('Upload is ' + progress + '% done');
                            switch (snapshot.state) {
                                case 'paused':
                                    // console.log('Upload is paused');
                                    setPercent(progress)
                                    break;
                                case 'running':
                                    // console.log('Upload is running');
                                    setPercent(progress)
                                    break;
                            }
                        },
                        (error) => {
                            switch (error.code) {
                                case 'storage/unauthorized':
                                    // User doesn't have permission to access the object
                                    console.log('User doesn\'t have permission to access the object');
                                    break;
                                case 'storage/canceled':
                                    // User canceled the upload
                                    console.log('User canceled the upload');
                                    break;

                                // ...

                                case 'storage/unknown':
                                    // Unknown error occurred, inspect error.serverResponse
                                    console.log('Unknown error occurred, inspect error.serverResponse');
                                    break;
                            }
                        },
                        () => {
                            // Upload completed successfully, now we can get the download URL
                            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                                // console.log('File available at', downloadURL);
                                // setUrl(downloadURL)
                                return downloadURL
                            }).then((url) => {
                                set(ref(database, 'allUsers/'), [
                                    {
                                        fName: fName,
                                        lName: lName,
                                        email: email,
                                        password: password,
                                        id: user.uid,
                                        role: 'customer',
                                        phone: totalPhone,
                                        companyName: companyName,
                                        companyAddress: companyAddress,
                                        companyWebsite: companyWebsite,
                                        companyLogo: url,
                                    }
                                ]).then(() => {
                                    set(ref(database, 'roles/customer'), [{
                                        id: user.uid,
                                        name: fName + ' ' + lName
                                    }])
                                    router.push('/')
                                    setLoading(false)
                                }).catch((error) => {
                                    alert(error)
                                    setLoading(false)
                                })
                            })
                        },
                    );

                }
                else {
                    const metadata = {
                        contentType: 'image/jpeg'
                    };

                    const storageRef = ref_storage(storage, 'taskimages/' + companyLogo[0].name);
                    const uploadTask = uploadBytesResumable(storageRef, companyLogo[0], metadata);

                    uploadTask.on('state_changed',
                        (snapshot) => {
                            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                            // console.log('Upload is ' + progress + '% done');
                            switch (snapshot.state) {
                                case 'paused':
                                    // console.log('Upload is paused');
                                    setPercent(progress)
                                    break;
                                case 'running':
                                    // console.log('Upload is running');
                                    setPercent(progress)
                                    break;
                            }
                        },
                        (error) => {
                            switch (error.code) {
                                case 'storage/unauthorized':
                                    // User doesn't have permission to access the object
                                    console.log('User doesn\'t have permission to access the object');
                                    break;
                                case 'storage/canceled':
                                    // User canceled the upload
                                    console.log('User canceled the upload');
                                    break;

                                // ...

                                case 'storage/unknown':
                                    // Unknown error occurred, inspect error.serverResponse
                                    console.log('Unknown error occurred, inspect error.serverResponse');
                                    break;
                            }
                        },
                        () => {
                            // Upload completed successfully, now we can get the download URL
                            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                                // console.log('File available at', downloadURL);
                                return downloadURL
                            }).then((url) => {
                                set(ref(database, 'allUsers/'), [
                                    ...allUsers,
                                    {
                                        fName: fName,
                                        lName: lName,
                                        email: email,
                                        password: password,
                                        id: user.uid,
                                        role: 'customer',
                                        phone: totalPhone,
                                        companyName: companyName,
                                        companyAddress: companyAddress,
                                        companyWebsite: companyWebsite,
                                        companyLogo: url,
                                    }
                                ]).then(() => {
                                    if (!allCustomers) {
                                        set(ref(database, 'roles/customers'), [{
                                            id: user.uid,
                                            name: fName + ' ' + lName
                                        }])
                                    } else {
                                        set(ref(database, 'roles/customers'), [
                                            ...allCustomers,
                                            {
                                                id: user.uid,
                                                name: fName + ' ' + lName
                                            }
                                        ])
                                    }
                                    router.push('/')
                                    setLoading(false)
                                }).catch((error) => {
                                    alert(error)
                                    setLoading(false)
                                })
                            })
                        },
                    );


                }
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log('Error Message: ', errorMessage)
                alert(errorMessage)
                setLoading(false)
            });
    }

    const previews = companyLogo.map((file, index) => {
        const imageUrl = URL.createObjectURL(file);
        return (
            <Image
                key={index}
                src={imageUrl}
                imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
            />
        );
    });


    return (
        <div>

            {/* Loading Wheel */}
            <div className={`z-10 double-up fixed w-screen h-screen ${Loading ? 'flex' : 'hidden'} justify-center items-center bg-[#ffffff3b]`} style={{ display: !Loading && "none" }}></div>

            <div className="z-0 flex flex-col items-center justify-center h-[170vh]">
                <div className="text-white text-5xl font-bold flex justify-center mb-10">Customer Panel</div>
                <div className="w-full max-w-md">
                    <div className="flex justify-between items-center w-full px-12 h-[60px] bg-[#242731] rounded-sm rounded-b-none">
                        <div className="text-xl text-white font-bold text-center">
                            Register
                        </div>
                    </div>
                    <div className="bg-[#16181D] shadow-md rounded-sm px-12 pt-6 pb-8 mb-4">
                        <div className="mb-4 flex justify-between items-center">
                            <div className="mr-2">
                                <label className="block text-white text-sm font-bold mb-2" htmlFor="username">
                                    First Name
                                </label>

                                <input
                                    className="shadow appearance-none rounded-sm w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-[#242731] border border-gray-500"
                                    id="fname"
                                    type="text"
                                    placeholder="Enter First Name"
                                    value={fName}
                                    onChange={(e) => setFName(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-white text-sm font-bold mb-2" htmlFor="username">
                                    Last Name
                                </label>

                                <input
                                    className="shadow appearance-none rounded-sm w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-[#242731] border border-gray-500"
                                    id="lname"
                                    type="text"
                                    placeholder="Enter Last Name"
                                    value={lName}
                                    onChange={(e) => setLName(e.target.value)}
                                />
                            </div>
                        </div>

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
                                onChange={(e) => setEmail(e.currentTarget.value)}
                            />

                        </div>

                        <div className="mb-4">
                            <label className="block text-white text-sm font-bold mb-2" htmlFor="password">
                                Password
                            </label>
                            <input
                                className="shadow appearance-none border border-gray-500  rounded-sm w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-[#242731]"
                                id="password"
                                type="password"
                                placeholder="******************"
                                value={password}
                                onChange={(e) => setPassword(e.currentTarget.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') { onRegister() }
                                }}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-white text-sm font-bold mb-2" htmlFor="company-name">
                                Company Name
                            </label>

                            <input
                                className="shadow appearance-none rounded-sm w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-[#242731] border border-gray-500"
                                id="comapanay-name"
                                type="text"
                                placeholder="Enter Company Name"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-white text-sm font-bold mb-2" htmlFor="company-address">
                                Company Address
                            </label>

                            <input
                                className="shadow appearance-none rounded-sm w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-[#242731] border border-gray-500"
                                id="comapanay-address"
                                type="text"
                                placeholder="Enter Comapany Address"
                                value={companyAddress}
                                onChange={(e) => setCompanyAddress(e.target.value)}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-white text-sm font-bold mb-2" htmlFor="company-website">
                                Company Website
                            </label>

                            <input
                                className="shadow appearance-none rounded-sm w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-[#242731] border border-gray-500"
                                id="comapanay-website"
                                type="text"
                                placeholder="Enter Comapany website"
                                value={companyWebsite}
                                onChange={(e) => setCompanyWebsite(e.target.value)}
                            />
                        </div>

                        <div className="mb-4">
                            <Dropzone accept={IMAGE_MIME_TYPE} onDrop={setCompanyLogo}
                                sx={(theme) => ({
                                    width: '100%',
                                    height: 40,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    border: 0,
                                    backgroundColor: 'gray'
                                })}
                            >
                                <Text align="center" className="text-gray-900">Add Logo</Text>
                            </Dropzone>
                            <SimpleGrid
                                cols={4}
                                breakpoints={[{ maxWidth: 'sm', cols: 1 }]}
                                mt={previews.length > 0 ? 'sm' : 0}
                            >
                                {previews}
                            </SimpleGrid>
                        </div>

                        {
                            totalPhone?.map((item, index) => (
                                <div key={index} className="mb-4">
                                    <PhoneInput
                                        country={'pk'}
                                        inputStyle={{ width: '100%', height: '35px', backgroundColor: '#242731', color: 'white', borderRadius: '2px', border: '1px solid #4a5568', paddingLeft: '50px' }}
                                        buttonStyle={{ backgroundColor: '#242731', borderRadius: '2px', border: '1px solid #4a5568' }}
                                        value={item.phone}
                                        onChange={(phone) => {
                                            let temp = [...totalPhone]
                                            temp[index].phone = phone
                                            setTotalPhone(temp)
                                        }}
                                    />
                                </div>
                            ))
                        }
                        <div className={`mb-4 flex ${totalPhone.length === 1 ? 'justify-end' : 'justify-between'}`}>
                            <button
                                onClick={() => {
                                    let temp = [...totalPhone]
                                    temp.pop()
                                    setTotalPhone(temp)
                                }}
                                className={`${totalPhone.length === 1 ? 'hidden' : 'block'} w-28 h-[35px] bg-[#2DAA46] hover:bg-[#1c722d] transition-all text-white font-bold py-2 px-4 rounded-sm focus:outline-none focus:shadow-outline self-end`} type="button">
                                Delete One
                            </button>

                            <button
                                onClick={() => {
                                    setTotalPhone([...totalPhone, { phone: '' }])
                                }}
                                className="w-28 h-[35px] bg-[#2DAA46] hover:bg-[#1c722d] transition-all text-white font-bold py-2 px-4 rounded-sm focus:outline-none focus:shadow-outline self-end" type="button">
                                Add More
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <button onClick={onRegister} className="bg-[#2DAA46] hover:bg-[#1c722d] transition-all text-white font-bold py-2 px-4 rounded-sm focus:outline-none focus:shadow-outline" type="button">
                                Register
                            </button>
                            <div className="align-baseline font-bold text-sm text-white hover:text-white flex">
                                Already have an account? &nbsp;
                                <Link href="/login">
                                    <div className="text-[#2DAA46] hover:text-[#36d155] transition-all">Login</div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}