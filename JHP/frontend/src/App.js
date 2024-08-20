import React, { useState } from 'react';
import { Spinner } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:10000/api/query", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query_text: query }),
      });

      if (res.ok) {
        const data = await res.json();
        setResponse(data["message"]);
        setImages(data["images"]);  // Set images from the response
      } else {
        console.error('Failed to fetch:', res.statusText);
      }
    } catch (error) {
      console.error('Error during fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Justice Hope Park AI</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="form-group">
          <label htmlFor="query" className="h5">Enter your query:</label>
          <textarea
            id="query"
            className="form-control"
            rows="5"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type your query here..."
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3" disabled={loading}>
          {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Submit'}
        </button>
      </form>
      {response && (
        <div className="alert alert-success mt-4" role="alert">
          <h5 className="alert-heading">Response:</h5>
          <ReactMarkdown>{response}</ReactMarkdown>
        </div>
      )}
      {images.length > 0 && (
        <div className="row mt-4">
          {images.map((image, index) => (
            <div key={index} className="col-md-4 mb-4">
              <img src={`data:image/jpeg;base64,${image}`} alt={`Generated ${index + 1}`} className="img-fluid" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;