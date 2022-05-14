import './index.css'
import vector from './images/Vector.svg';
import image1 from './images/image1.png'
import stroke from './images/Stroke.png'
import shared from './images/shared.png'
import provate from './images/provate.png'
import axios from "axios"
import {useEffect, useState, useRef} from 'react'
import ReactPaginate from 'react-paginate';


export const InitialState = ()=> {
    const inputRef = useRef()
    const loader =  useRef()
    const loop = useRef()
    const [line, setLine] = useState()
    const [name, setName] = useState()
    const [followers, setFollowers]= useState()
    const [following, setFollowing] = useState()  
    const [login, setLogin] = useState(null)
    const [html, setHtml] = useState()
    const [status,setStatus] = useState(null)
    const [lengthOf, setLengthOf] = useState()
    const [items, setItems] = useState([])
    
       
    async function getUsersRepos1(public_repos) { 
        loader.current.style.visibility = "visible"
        const user = inputRef.current.value
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
        }
                   

    async function getUser() {
         loader.current.style.visibility = "visible"
        const user = inputRef.current.value
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
      }
       
    async function handleUser(){
        const data = await getUser()
        console.log(data)
        if(data) {
            const {avatar_url, login, name,html_url, followers, following, public_repos}= data
            handleRepos(public_repos)
            setLine(avatar_url)
            setName(name)
            setLogin(login)
            setHtml(html_url)
            setFollowers(followers)
            setFollowing(following)
            setStatus(null)
            } else if(!data){
            const notfound = "User not found"
            setStatus(notfound)
            setLine(null)
            setName(null)
            setLogin(null)
            setItems(null)
            setLengthOf(null)
        }
    }

async function handleRepos(public_repos){
    const array2= await getUsersRepos1(public_repos)
    const lengthOfArray = array2.length
    setItems(array2)
    setLengthOf(lengthOfArray)
    }

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
                <div className="emp1"><b>X</b></div>
                <div className="info">Repository list is empty</div>
            </div>)
    } else {
        return null
    }
}

const UserInfo = ({line, name, html, login})=>{
    if(login){
    return(
        <div>
            <img className = "avatar" src = {line} alt = "avatar"></img>
            <div className = "name"><b>{name}</b></div>
            <a className = "login" href  ={html} target="_blank" rel = "noreferrer">{login}</a>
            <div className = "followers"><img src = {shared} alt ="followers"/>{followers} followers<img src = {provate} alt ="followings"/> {following} following</div>
        </div>
    )}
      }

 const Loop = ({login, status})=> {
     if(!login&&!status){
     return( 
        <div className  = "loop" ref = {loop}>
            <img src={image1} width='64.17px' height = '64.17px' alt="image1"/>
            <img src={stroke} width='37px' height = '37px' alt="image2"/>
            <div className="info start">Start with searching <br></br>a GitHub user</div>
        </div> )} 
}

const Main = () =>{
        return(
        <div className = "container">
            <div className = "header">
                <img src={vector} className="App-logo" alt="logo"/>
                <div className='field'>
                    <img src={image1} width='14px' height = '14px' alt="image1"/>
                    <input type = "search" placeholder ="Enter GitHub username" ref ={inputRef} onKeyPress ={handleEnter}></input> 
                </div>
            </div>
            <div className = "main">
                <Loop login = {login} status = {status}/>
                <div className = "loader" ref = {loader}></div>
                <UserInfo line= {line} name = {name} html = {html} login = {login} /*status = {status}*//>
                <div className ="pages">
                    <PaginatedItems items = {items} itemsPerPage= {4}/> 
                </div>
            </div>   
                <UserNot status= {status}/>
                <UserRep lengthOf={lengthOf}/>  
            </div>
    )
}

function handleEnter(e) {
       if(e.key ==="Enter") {
       handleUser()
    }
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
                <span className = "repositories">Repositories ({lengthOf})</span>)
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
   return (<Main/>)
}
