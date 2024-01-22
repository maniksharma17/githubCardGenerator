import { useState, useRef } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import './App.css'
import {filetoDataURL} from 'image-conversion'

function App() {

  const [ data, setData ] = useState({})
  const [avatarBase64, setAvatarBase64] = useState('');
  const card = useRef(); 



  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InputBox setData={setData} setAvatarBase64={setAvatarBase64}></InputBox>}></Route>
        <Route path="/card" element={<CardRenderer data={data} card={card} avatarBase64={avatarBase64}></CardRenderer>}></Route>
      </Routes>

    <div style={{marginTop:"20px"}}>
      <a href='https://www.linkedin.com/in/manik-sharma-2712a2275/' className='maniksharma'><i className='fa fa-linkedin'></i><p>Manik Sharma</p></a>
      <a href='https://github.com/maniksharma17' className='maniksharma'><i className='fa fa-github'></i><p>maniksharma17</p></a>
      <a href='https://twitter.com/manik_twt' className='maniksharma'><i className='fa fa-twitter'></i><p>manik_twt</p></a>
    </div>
    </BrowserRouter>
    
    
  )
}


function InputBox({setData, setAvatarBase64}){

  const navigate = useNavigate()

  const [ username, setUsername ] = useState("")
  

  return <div className='inputBox'>
    <h3>Get GitHub Card</h3>
    <label>Username</label>
    <input type='text' onChange={(e)=>{
      setUsername(e.target.value)
    }}></input>
    <button onClick={async ()=>{
      fetch(`https://api.github.com/users/${username}`)
      .then(async (fetchCall) => {
        const data = await fetchCall.json()
        if (data.message){
          alert("Not found")
          return
        }
        setData(data)

        // Convert the avatar image to Base64
        const avatarResponse = await fetch(data.avatar_url);
        const avatarBlob = await avatarResponse.blob();
        console.log(avatarBlob)
        
        const base64Image = await filetoDataURL(avatarBlob, 1);

        setAvatarBase64(base64Image);
        navigate("/card")
      })
      
    }}>Get</button>
  </div>
}

function CardRenderer({data, card, avatarBase64}){

  const navigate = useNavigate()
  console.log(avatarBase64)

  return <>

  <button className='backBtn' onClick={()=>{
    navigate("/")
  }}>Make Github Card</button>

  <button className='darkMode' onClick={()=>{
    document.getElementById("colorBg").style.backgroundColor = "#2dba4e"
    document.getElementById("card").style.backgroundColor = "#2b3137"
    document.getElementById("name").style.color = "white"
    document.getElementById("id").style.color = "white"
    document.getElementById("gitIcon").style.color = "white"
    document.querySelectorAll(".infoHead").forEach((item)=>{
      item.style.color = "white"
    })
    document.querySelectorAll(".infoData").forEach((item)=>{
      item.style.color = "white"
    })
  }}>Dark Mode</button>

<button className='lightMode' onClick={()=>{
    document.getElementById("colorBg").style.backgroundColor = "#2dba4e"
    document.getElementById("card").style.backgroundColor = "white"
    document.getElementById("name").style.color = "black"
    document.getElementById("id").style.color = "black"
    document.getElementById("gitIcon").style.color = "black"
    document.querySelectorAll(".infoHead").forEach((item)=>{
      item.style.color = "black"
    })
    document.querySelectorAll(".infoData").forEach((item)=>{
      item.style.color = "black"
    })
  }}>Light Mode</button>

  <div className='card' id='card' ref={card}>
    <div className='pfp'>
      <div id="colorBg" style={{zIndex:"0"}}></div>
      <div id='image' style={{backgroundImage: `url(${avatarBase64})` , height: "150px", width: "150px", backgroundSize: "cover", zIndex: "1", borderRadius:"50%", border:"1px solid black"}}></div>
    </div>
    <div className='username'>
      <h3 id='name'>{data.name}</h3>
      <p id='id'><i class="fa fa-github" id='gitIcon' style={{color:"black"}} aria-hidden="true"></i> {data.login}</p>
    </div>
    <div className='info'>

      <div className='infoItem'>
        <div className='infoHead'>Followers</div>
        <div className='infoData'>{data.followers}</div>
      </div>

      <div className='infoItem'>
        <div className='infoHead'>Following</div>
        <div className='infoData'>{data.following}</div>
      </div>

      <div className='infoItem'>
        <div className='infoHead'>Repositories</div>
        <div className='infoData'>{data.public_repos}</div>
      </div>

    </div>
  </div>

  <CardDownloader card={card}></CardDownloader>
  </>
}

function CardDownloader({card}){
  const downloadAsImage = () => {
    
    html2canvas(card.current, {scale: 20}).then((canvas) => {
      // Convert canvas to JPEG Blob
      canvas.toBlob((blob) => {
        // Save the Blob as a file using FileSaver.js
      
       
        saveAs(blob, 'github_card.jpg');
      }, 'image/png');
    })
  }

  
  


  return (
    <div>
      {/* Your React component content */}
      <button id='downloadBtn' onClick={downloadAsImage}>Download</button>
    </div>
  )
}


export default App
