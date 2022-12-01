import { database } from "./initFirebase";
import { ref, onValue, set, remove } from "firebase/database";

export const getBoards = ({ setBoards, setLoading }) => {
    const dbRef = ref(database, `accessUser/${localStorage.getItem('peretz-customer-user-id')}/`);

    try {
        onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
            // console.log('alotted boards: ', data)
            setBoards(data)
            setLoading(false)
        });
    }
    catch (err) {
        console.log(err)
        setBoards([])
        setLoading(false)
    }
}

export const uploadProfileImage = (id, image) => {
    const dbRef = ref(database, `allUsers/`);

    try {
        onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
            // console.log('allUsers', data)
            data.map((item) => {
                if (item.id === id) {
                    let index = data.indexOf(item)
                    // data[index].profileImage = image
                    set(ref(database, `allUsers/${index}/profileImage`), image)
                }
            })
        });
    }
    catch (err) {
        console.log(err)
        alert(err)
    }
}

export const getWorkers = (setAllWorkers) => {
    const dbRef = ref(database, `roles/workers`);

    try {
        onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
            // console.log('workers', data)
            setAllWorkers(data)
        });
    }
    catch (err) {
        console.log(err)
        setAllWorkers([])
    }
}

export const getCustomers = (setAllCustomers) => {
    const dbRef = ref(database, `roles/customers`);

    try {
        onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
            // console.log('customers', data)
            setAllCustomers(data)
        });
    }
    catch (err) {
        console.log(err)
        setAllCustomers([])
    }
}

export const getUsers = (setAllUsers) => {
    const dbRef = ref(database, `allUsers/`);

    try {
        onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
            // console.log('users', data)
            setAllUsers(data)
        });
    }
    catch (err) {
        console.log(err)
        setAllUsers([])
    }
}

export const accessRights = (id, router) => {
    const dbRef = ref(database, `allUsers/`);

    try {
        onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
            // console.log('allUsers', data)
            // setAllUsers(data)
            data.map((item) => {
                if (item.id === id) {
                    if (item.role !== 'customer') {
                        alert('you dont have access rights')
                        localStorage.removeItem('peretz-customer-user-id')
                        localStorage.removeItem('peretz-customer-auth-token')
                        router.push('/login')
                    }
                }
            })
        });
    }
    catch (err) {
        console.log(err)
        alert(err)
    }
}

export const getUserData = (id, setUserData) => {
    const dbRef = ref(database, `allUsers/`);

    try {
        onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
            // console.log('allUsers', data)
            data.map((item) => {
                if (item.id === id) {
                    setUserData(item)
                    // console.log('userData: ', item)
                }
            })
        });
    }
    catch (err) {
        console.log(err)
        alert(err)
    }
}

export const getBoardsData = (boardName, setBoardsData) => {
    // console.log('boardName: ', boardName)
    const boardData = ref(database, `${boardName}/`);
    onValue(boardData, (snapshot) => {
        let data = snapshot.val();
        // console.log('board data ======', data)
        // data.tasks.map((item) => {
        //     item.tasks
        // })
        data?.columnOrder?.map((item, b) => {
            // console.log(a.columns[item])
            data.columns[item].taskIds?.includes("no tasks") ? data.columns[item].taskIds = [] : data.columns[item].taskIds
        })
        setBoardsData(data)
    })
}