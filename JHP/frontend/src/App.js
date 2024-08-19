import React, { useState } from 'react';
import { Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5001/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query_text: query }),
      });

      if (res.ok) {
        const data = await res.json();
        setResponse(data.response);
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
      <h1 className="text-center mb-4">Beautiful Query Interface</h1>
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
      {loading && (
        <div className="text-center mb-4">
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      )}
      {response && (
        <div className="alert alert-success mt-4" role="alert">
          <h5 className="alert-heading">Response:</h5>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}

export default App;