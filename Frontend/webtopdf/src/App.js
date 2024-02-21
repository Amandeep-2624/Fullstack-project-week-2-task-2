import React, { useState } from 'react';
import axios from 'axios';
import "./App.css";

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');

  const handleUrlChange = (event) => {
    setUrl(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:4000/convert', { url }, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(blob);
      setPdfUrl(pdfUrl);
      setLoading(false);
    } catch (error) {
      setError('An error occurred while converting the webpage to PDF.');
      setLoading(false);
    }
  };

  return (
    <div className='TopConatiner'>
        <navbar className="NavBar">
          <h1 className="title">Web to PDF Converter</h1>
        </navbar>
        <div className="container">
          <form onSubmit={handleSubmit} className='FormContainer'>
              {/* <label htmlFor="url" className="label" >Enter URL:</label><br /> */}
              <input type="text" id="url" name="url" value={url} onChange={handleUrlChange} className="input" placeholder='Enter the URL of the Website'/><br /><br />
              <button type="submit" disabled={loading} className="button">Convert to PDF</button>
              {error && <p  className="error">{error}</p>}
              {pdfUrl && <a href={pdfUrl} download="webpage.pdf" className="download">Download PDF</a>}
              {loading && <div className="spinner"></div>}
          </form>
    </div>
    </div>
    
  );
}

export default App;
