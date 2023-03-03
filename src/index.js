import { initializeApp } from 'firebase/app'
import { 
    getFirestore,collection,getDocs,
    addDoc,deleteDoc,doc,onSnapshot,
    query,where,orderBy,serverTimestamp,
    getDoc,updateDoc
       } from 'firebase/firestore'
import { getAuth,createUserWithEmailAndPassword,signOut,
         signInWithEmailAndPassword,onAuthStateChanged,
       } from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyBeDdpk6-ZFYzHHGeGG3hpdjzSxBsB4keY",
    authDomain: "fir-9-dev-53528.firebaseapp.com",
    projectId: "fir-9-dev-53528",
    storageBucket: "fir-9-dev-53528.appspot.com",
    messagingSenderId: "1069119032694",
    appId: "1:1069119032694:web:b1e2d473adeac1db7ffe57"
  };

  //init firebase app
  initializeApp(firebaseConfig);

  //init services
  const db = getFirestore()
  const auth = getAuth()

  //collection ref
 const colRef = collection(db, 'books')


/* 
//queries(arranged acc. to the title in descending order)
const q = query(colRef,where("author","==","Collen Hover"),orderBy('title','desc'));
*/


//queries(arranged acc. to Time Stamp)
const q = query(colRef,orderBy('createdAt'));


 //real time collection data(using queries)
 const unsubCol = onSnapshot(q,(snapshot) => {
    let books =[];
    snapshot.docs.forEach((doc) => {
     books.push({ ...doc.data(), id: doc.id })
    })
    console.log(books);
})

/*
 //real time collection data
onSnapshot(colRef,(snapshot) => {
    let books =[];
    snapshot.docs.forEach((doc) => {
     books.push({ ...doc.data(), id: doc.id })
    })
    console.log(books);
})
*/

/*
  //get collection data(not in real-time)
  getDocs(colRef)
  .then((snapshot) => {
  //'snapshot' is the QuerySnapshot object that contains the result of the query executed by getDocs().
   let books =[];
   snapshot.docs.forEach((doc) => {
    books.push({ ...doc.data(), id: doc.id })
   })
   console.log(books);
  })
  .catch(err => {
    console.log(err.message);
  })
*/


// adding docs
const addBookForm = document.querySelector('.add')
addBookForm.addEventListener('submit', (e) => {
  e.preventDefault()
//e.preventDefault(), prevents the default behavior of the form submission,which would be to refresh the page. This allows the event listener to handle the form submission in JavaScript code instead of relying on the default behavior of the browser.
addDoc(colRef,{  
    title: addBookForm.title.value,
    author: addBookForm.author.value,
    createdAt: serverTimestamp()
})
.then(() => {
    addBookForm.reset();
})
})

// deleting docs
const deleteBookForm = document.querySelector('.delete')
deleteBookForm.addEventListener('submit', (e) => {
  e.preventDefault()
  
const docRef =  doc(db, 'books', deleteBookForm.id.value);

deleteDoc(docRef)
.then(() => {
deleteBookForm.reset();
})
})


//get a single document
const docRef = doc(db, 'books','d21mNq0F4kB4zvyWx5kJ');

//setting real-time listener
const unsubDoc = onSnapshot(docRef,(doc) => {
    console.log(doc.data(),doc.id);
})

/*
getDoc(docRef)
.then((doc) => {
    console.log(doc.data(),doc.id);
})
*/


//updating a document
const updateForm = document.querySelector('.update');
updateForm.addEventListener('submit',(e) =>{
    e.preventDefault()
    const docRef =  doc(db, 'books', updateForm.id.value);
updateDoc(docRef,{
    title:'updated title'
})
.then(() =>{
    updateForm.reset();
})
})


// signing users up
const signupForm = document.querySelector('.signup')
signupForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const email = signupForm.email.value
  const password = signupForm.password.value

  createUserWithEmailAndPassword(auth, email, password)
    .then(cred => {
    //the then block is executed with a cred parameter, which contains information about the newly created user, including the user property which contains the user's unique ID and other properties.
      console.log('user created:', cred.user)
      signupForm.reset()
    })
    .catch(err => {
      console.log(err.message)
    })
})



// logging in and out

const logoutButton = document.querySelector('.logout')
logoutButton.addEventListener('click', () => {
  signOut(auth)
    .then(() => {
     // console.log('user signed out')
    })
    .catch(err => {
      console.log(err.message)
    })
})

const loginForm = document.querySelector('.login')
loginForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const email = loginForm.email.value
  const password = loginForm.password.value

  signInWithEmailAndPassword(auth, email, password)
    .then(cred => {
    //  console.log('user logged in:', cred.user)
      loginForm.reset()
    })
    .catch(err => {
      console.log(err.message)
    })
})


//subscribing to auth changes
//here we monitor the changes at real time 

const unsubAuth = onAuthStateChanged(auth,() =>{
  console.log('user status changed',user);
})


// unsubscribing from changes (auth & db)
const unsubButton = document.querySelector('.unsub')
unsubButton.addEventListener('click', () => {
  console.log('unsubscribing')
  unsubCol()
  unsubDoc()
  unsubAuth()
})
