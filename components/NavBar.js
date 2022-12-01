import { HoverCard, SimpleGrid, Text, Image, Modal } from "@mantine/core";
import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import { auth, storage } from "../firebase/initFirebase";
import { FaUserAlt } from "react-icons/fa";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { getUserData, uploadProfileImage } from "../firebase/FirebaseFunctions";
import { signOut } from "firebase/auth";
import { ref as ref_storage, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export default ({ setLoading }) => {

    const [opened, setOpened] = useState(false)

    const [userData, setUserData] = useState('')
    const [file, setFile] = useState([])

    const [percent, setPercent] = useState(0)

    const previews = file.map((file, index) => {
        const imageUrl = URL.createObjectURL(file);
        return (
            <Image
                key={index}
                src={imageUrl}
                imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
            />
        );
    });

    useEffect(() => {
        getUserData(localStorage.getItem('peretz-customer-user-id'), setUserData)
    }, [])


    const router = useRouter()

    const onLogout = () => {
        signOut(auth);
        localStorage.removeItem('peretz-customer-auth-token')
        localStorage.removeItem('peretz-customer-user-id')
        router.push('/login')
    }

    const uploadImage = () => {
        if(file.length === 0) {
            alert('Please select an image')
            return
        }

        setLoading(true)

        const metadata = {
            contentType: 'image/jpeg'
        };

        const storageRef = ref_storage(storage, 'taskimages/' + file[0].name);
        const uploadTask = uploadBytesResumable(storageRef, file[0], metadata);

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
                    uploadProfileImage(userData.id, url)
                    setOpened(false)
                    setLoading(false)
                })
            },
        );
    }

    return (
        // Create navbar with tailwinf css according to app styling
        <nav className="flex items-center justify-between flex-wrap bg-gray-800 p-6">
            <div className="flex items-center flex-shrink-0 text-white mr-6">
                <span className="font-semibold text-xl tracking-tight cursor-pointer" onClick={() => router.push('/')}>Task Management System</span>
                <span className="text-gray-600 text-sm font-semibold ml-2">(Customer)</span>
            </div>

            <HoverCard shadow="md" radius={"lg"} position={"bottom-end"} width={300}>
                <HoverCard.Target>
                    <div className="flex items-center">
                        <FaUserAlt size={17} className="text-white cursor-pointer" />
                        <div className="text-white text-lg font-semibold ml-2">Profile</div>
                    </div>
                </HoverCard.Target>
                <HoverCard.Dropdown>
                    <div className="w-full flex flex-col items-center">
                        {
                            userData.profileImage ?
                                <Image
                                    src={userData.profileImage}
                                    alt="Picture of Profile Owner"
                                    width={200}
                                    height={200}
                                    radius="lg"
                                />
                                :
                                <Image
                                    src='/profile.png'
                                    alt="Picture of Profile Owner"
                                    width={200}
                                    height={200}
                                    radius="lg"
                                />
                        }
                        <div className="mt-2 text-lg font-semibold">{userData.fName} {userData.lName}</div>
                        <div className="flex items-center mt-2">
                            <div
                                className="text-sm h-10 flex justify-center items-center px-4 py-2 leading-none border rounded bg-gray-800 text-white hover:border hover:border-black hover:text-black hover:bg-white ml-1 cursor-pointer transition-all"
                                onClick={() => setOpened(true)}
                            >Add Image</div>

                            <div
                                className="text-sm h-10 flex justify-center items-center px-4 py-2 leading-none border rounded bg-gray-800 text-white hover:border hover:border-black hover:text-black hover:bg-white ml-1 cursor-pointer transition-all"
                                onClick={onLogout}
                            >Logout</div>
                        </div>
                    </div>
                </HoverCard.Dropdown>
            </HoverCard>


            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                withCloseButton={false}
                centered
            >
                <div className="w-full flex flex-col items-center">
                    <div className="flex">
                        <Dropzone accept={IMAGE_MIME_TYPE} onDrop={setFile}
                            sx={(theme) => ({
                                width: 100,
                                height: 40,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                border: 0,
                                backgroundColor: 'gray'
                            })}
                        >
                            <Text align="center" className="text-gray-900">Add Image</Text>
                        </Dropzone>

                        <div
                            className="text-sm h-10 flex justify-center items-center px-4 py-2 leading-none border rounded bg-gray-800 text-white hover:border-black hover:border hover:text-black hover:bg-white ml-1 cursor-pointer transition-all"
                            onClick={uploadImage}
                        >Upload</div>
                    </div>

                    <SimpleGrid
                        cols={4}
                        breakpoints={[{ maxWidth: 'sm', cols: 1 }]}
                        mt={previews.length > 0 ? 'sm' : 0}
                    >
                        {previews}
                    </SimpleGrid>
                </div>
            </Modal>
        </nav>
    )
}