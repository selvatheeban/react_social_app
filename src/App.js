import Nav from './Nav';
import Header from './Header';
import Home from './Home';
import NewPost from './NewPost';
import About from './About';
import Missing from './Missing';
import Footer from './Footer';
import EditPost from './EditPost';
import { useState,useEffect } from 'react';
import {format} from 'date-fns';
import { Route, Routes, useNavigate } from 'react-router-dom';
import PostPage from './PostPage';
import api from './api/posts';

function App() {

  const [posts,setPosts] = useState([]);
  const [search,setSearch] = useState('');
  const [searchResult , setSearchResult] = useState([]);
  const [postTitle,setPostTitle] = useState('');
  const [postBody,setPostBody] = useState('');
  const [editedTitle,setEditedTitle] = useState('')
  const [editedBody,setEditedBody] = useState('')
  const navigate = useNavigate();

  useEffect(() => {
   const fetchPost = async()=>{
     try{
     const rsp = await api.get('/posts');
     setPosts(rsp.data);
    }
    catch (err){
      if(err.response){
        console.log(err.response.data)
      }else {
        console.log(`Error : ${err.message}`)
      }
    }
   }
   fetchPost();
   
  },[])
  
  useEffect(() => {
    const filterResult = posts.filter((post)=>{ 
          ((post.body).toLowerCase()).includes(search.toLowerCase()) || 
          ((post.title).toLowerCase()).includes(postTitle.toLowerCase())     
    });
     setSearchResult(filterResult.reverse());
  },[posts,search])

  const handelSubmit = async(e) =>{
    e.preventDefault();
    const id = posts.length ? posts[posts.length-1].id + 1: 1;
    const datetime = format(new Date(), 'MMMM dd, yyyy pp')
    const newPost = {id , title : postTitle , datetime, body : postBody}
    try{
        const rsp = await api.post("/posts",newPost);
        const allPosts = [...posts, rsp.data];
        setPosts(allPosts);
        setPostTitle('')
        setPostBody('')  
        navigate("/")  
    }
    catch (err){
     console.log(`Error : ${err.message}`)
    }
   
  }
  const handleDelete = async(id) => {
    console.log("delete")
    try{
        await api.delete(`/posts/${id}`);
        const updatedPost = posts.filter(e => e.id !== id);
        setPosts(updatedPost)
        navigate("/")  
    }catch(err){
        console.log(`Error : ${err.message}`)
    }
   
  }
  const handleEdit = async(id)=>{
    try{
    const datetime = format(new Date(), 'MMMM dd, yyyy pp')
    const editedPost = {id , title : editedTitle , datetime, body : editedBody}
    const rsp = await api.put(`/posts/${id}`,editedPost);
    setPosts(posts.map(e => e.id === id ? {...rsp.data} : posts ));
    setEditedTitle('');
    setEditedBody('');  
    navigate("/") ;
    }
    catch (err){}
  }
  return (
    <div>
    <Header
      title ={"Social Post"}/>
    <Nav     
    />
    <Routes>
      <Route path="/" element={<Home posts={posts}/>}/>

      <Route path="post">
       <Route index element={ <NewPost 
        handleSubmit ={handelSubmit}
        postTitle = {postTitle}
        setPostTitle = {setPostTitle}
        postBody = {postBody}
        setPostBody = {setPostBody}/>} />
        <Route path='edit/:id' element = { <EditPost 
          posts={posts} 
          handleEdit = {handleEdit}
          editedBody = {editedBody} 
          setEditedBody = {setEditedBody}
          editedTitle={editedTitle}
          setEditedTitle={setEditedTitle}
          />}
          />       
        <Route path=":id" element= { <PostPage posts = {posts} handleDelete = {handleDelete}/>} />
      </Route>
      <Route path='about' element={<About/>} />
      <Route path='*' element={ <Missing/>} />     
    </Routes>   
    <Footer/>
    </div>
  );
}

export default App;
