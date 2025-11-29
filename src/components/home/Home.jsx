import React from 'react'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <>
        <div className="container text-center " style={{paddingTop:'70px'}}>
            <h1 style={{fontFamily:'var(--font-heading)' , color:'#79bfdc', fontSize:"50px" , fontWeight:"800"}}>Welcome to Dern Support</h1>
            <p className="lead" style={{opacity:"50%" , color:"white"}}>Reliable IT support and computer repair services for individuals and businesses.</p>
            <Link to="/Register" className="btn btn-primary btn-lg m-3">Get Started</Link>
        </div>
    </>
  )
}

export default Home