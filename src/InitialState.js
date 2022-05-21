import './index.css'
import vector from './images/Vector.svg';
import image1 from './images/image1.png'
import shared from './images/shared.png'
import provate from './images/provate.png'
import axios from "axios"
import {useEffect, useState, useRef, useCallback} from 'react'
import ReactPaginate from 'react-paginate';


export const InitialState = ()=> {
    const inputRef = useRef()
    const loader =  useRef()
    const loop = useRef()
    const [user, setUser] = useState('')
    const [avatar, setAvatar] = useState()
    const [name, setName] = useState()
    const [followers, setFollowers]= useState()
    const [following, setFollowing] = useState()  
    const [login, setLogin] = useState(null)
    const [html, setHtml] = useState()
    const [status,setStatus] = useState(null)
    const [lengthOf, setLengthOf] = useState()
    const [items, setItems] = useState([])
    const [pressed, setPressed]=useState(false)
    
    function handleEnter(e) {
        if (e.key === "Enter") {
           const user = inputRef.current.value
           const pressed1 = true
           setUser(user)
           setPressed(pressed1)
           console.log(user, typeof user)}
        }


    const  fetchUser = useCallback(async ()=> {
        let response = await axios.get(`https://api.github.com/users/${user}`, {
        headers: {
        "Accept": "application/vnd.github.com.v3+json"
        }           
        }).catch(function(error) {
            if(error.response){
                console.log(error.response)
                console.log(error.response.status)
                console.log(error.response.headers)
              }
           })
           if(response){
        const data = await response.data
        console.log(data)
        return data}
      },[user])

      const  fetchUserRepos = useCallback(async(public_repos) =>{ 
        const array5=[]
        let i=0
        while(i<Math.ceil(public_repos/100)){
             i=i+1
        let response = await axios.get(`https://api.github.com/users/${user}/repos?per_page=100&page=${i}`, {
             headers: {
             "Accept": "application/vnd.github.com.v3+json"
            }             
        })
            console.log(...response.data)
            array5.push(...response.data)
        } 
            console.log(array5)
            return array5
        },[user])
      
      const /*async function*/ getUserRepos = useCallback(async (user, public_repos)=>{ 
        loader.current.style.visibility = "visible"
        const array2= await fetchUserRepos(public_repos)
        if(array2){
            loader.current.style.visibility = "hidden"
            }
        const lengthOfArray = array2.length
        setItems(array2)

        setLengthOf(lengthOfArray)
        },[fetchUserRepos])
           
        const getUser = useCallback((async(user)=>{
        loader.current.style.visibility = "visible"
        const data = await fetchUser(user)
        console.log(data)
        if(data) {
            const {avatar_url, login, name,html_url, followers, following, public_repos}= data
            getUserRepos(user,public_repos)
            setAvatar(avatar_url)
            setName(name)
            setLogin(login)
            setHtml(html_url)
            setFollowers(followers)
            setFollowing(following)
            setStatus(null)
            } else if(!data){
            const notfound = "User not found"
            setStatus(notfound)
            setAvatar(null)
            setName(null)
            setLogin(null)
            setItems(null)
            setLengthOf(null)
            loader.current.style.visibility = "hidden"
        }
    }),[fetchUser, getUserRepos])

    useEffect(() => {
        if(user||pressed){
            getUser(user)
            }
        },[user, pressed ,getUser])  

    
    const UserNot = ({status, login})=>{
        if(status&&!login) {
        return(
        <div className='not'>
            <div className = "head"></div>
            <div className = "cont">
            <div className = "shoulders"></div></div>
            <div className = "info"> User not found</div>
            </div>)
        } else  if (login){
            return null
        }
    }

    const UserRep= ({lengthOf})=>{
        if (lengthOf===0) {
            return(
                <div className="empty">
                    <div className="emp1">
                        <div className = "x1"></div>
                        <div className = "x2"></div>
                    </div>
                    <div className="info empt1">Repository list is empty</div>
                </div>)
        } else {
            return null
        }
    }

    const UserInfo = ({avatar, name, html, login})=>{
        if(login){
        return(
            <div>
                <img className = "avatar" src = {avatar} alt = "avatar"></img>
                <div className = "name">{name}</div>
                <a className = "login" href  ={html} target="_blank" rel = "noreferrer">{login}</a>
                <div className = "followers"><img src = {shared} alt ="followers" className = "followers img1"/><div className = "followers1">{followers} followers</div><img src = {provate} alt ="followings" className = "followers img2"/> <div className = "followers2">{following} following</div></div>
            </div>
        )}
        }

    const Loop = ({login, status})=> {
        if(!login&&!status){
        return( 
            <div className  = "loop" ref = {loop}>
                <img src={image1} width='64.17px' height = '64.17px' alt="image1"/>
                <div className="info start">Start with searching <br></br>a GitHub user</div>
            </div> )} 
    }

    const Items = ({currentItems})=>{
        return (
            <div className = "wrapper-items">
                {currentItems&&currentItems.map((item,i)=>
                <div key = {i} className ="items">
                    <a href = {item.html_url} className = "nameRepo" target="_blank" rel = "noreferrer"><h3>{item.name}</h3></a>
                    <div  className = "description">{item.description}</div>
                    </div>)}
            </div>
        )
    }
            
const PaginatedItems= ({items,itemsPerPage})=>{
    const [currentItems, setCurrentItems] = useState(null)
    const [pageCount, setPageCount] = useState(0)
    const [itemOffset, setItemOffset] = useState(0)
    const [paginate,setPaginate] = useState()
    
    useEffect(()=>{
        let endOffset = itemOffset + itemsPerPage
        if(items&&items.length!==0) {
        if(endOffset>lengthOf){
            endOffset=lengthOf
        }
        let newPaginate = `${itemOffset+1} - ${endOffset} from ${lengthOf}`
        if((itemOffset+1)===lengthOf){
            newPaginate = `${itemOffset+1} from ${lengthOf}`
        }
        setCurrentItems(items.slice(itemOffset,endOffset))
        setPageCount(Math.ceil(items.length/itemsPerPage))
        setPaginate(newPaginate)}
       },[itemOffset, itemsPerPage, items])
  
    const Repositories =({items})=>{
        if(items&&items.length!==0){
            return(
                <div className = "repositories">Repositories ({lengthOf})</div>)
         }else {
             return null
            }
}

const handlePageClick =(event) =>{
    const newOffset = event.selected*itemsPerPage%items.length
    console.log(`User requested page number ${event.selected} which is offset ${newOffset}`)
    setItemOffset(newOffset)
    }
return(
<div>
    <Repositories items = {items}/>
    <Items currentItems = {currentItems}/>
    <div className = "wrapper">
        <span className = "paginate">{paginate}</span>
        <ReactPaginate 
        nextLabel=" >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        marginPagesDisplayed={2}
        pageCount={pageCount}
        previousLabel="< "
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakLabel="..."
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination"
        activeClassName="active"
        renderOnZeroPageCount={null}/>
    </div>
        </div>
   )}
 
    return(
        <div className = "container"> 
            <div className = "header">
                <img src={vector} className="github-logo" alt="logo"/>
                <div className='field'>
                    <img src={image1} width='14px' height = '14px' alt="image1"/>
                    <input type = "text" placeholder ="Enter GitHub username" ref ={inputRef} onKeyPress ={handleEnter}></input> 
                </div>
            </div>
            <Loop login = {login} status = {status}/>
            <UserNot login={login} status= {status}/>
            <div className = "main">  
                <div className="userInfo">
                    <UserInfo avatar= {avatar} name = {name} html = {html} login = {login} />
                </div>
                <div className ="pages">
                    <PaginatedItems items = {items} itemsPerPage= {4}/> 
                </div>
            </div>  
            <div className = "loader" ref = {loader}></div>
            <UserRep lengthOf={lengthOf}/>
        </div>
    )
}
 