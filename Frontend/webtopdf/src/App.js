import React, { useState } from 'react';
import axios from 'axios';
import "./App.css";
import {toast } from 'react-toastify';

function App() {

  // defining variables for state management
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');

  const handleUrlChange = (event) => {
    setUrl(event.target.value);
  };
  
  // handling the submit button
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    // getting response from the server into the frontend
    try {
      const response = await axios.post('http://localhost:4000/convert', { url }, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(blob);
      setPdfUrl(pdfUrl);
      setLoading(false);
      toast.success("PDF converted succesfully");
    } 

    // if invalid url is given error is shown
    catch (error) {
      toast.error('An error occurred while converting the webpage to PDF.');
      setLoading(false);
    }
  };

  return (
    <div className='TopConatiner'>
        {/* Nabar code */}
        <navbar className="NavBar">
          <h1 className="title">Web to PDF Converter</h1>
        </navbar>
        <div className="container">
          <form onSubmit={handleSubmit} className='FormContainer'>
              {/* <label htmlFor="url" className="label" >Enter URL:</label><br /> */}

              <input type="text" id="url" name="url" value={url} onChange={handleUrlChange} className="input" placeholder='Enter the URL of the Website'/><br /><br />
              <button type="submit" disabled={loading} className="button">Convert to PDF</button>
              {error && <p  className="error">{error}</p>}
              {pdfUrl && !loading && <a href={pdfUrl} download="webpage.pdf" className="download">Download PDF</a>}
              {loading && <div className="spinner"></div>}
          </form>
    </div>
    </div>
    
  );
}

export default App;
