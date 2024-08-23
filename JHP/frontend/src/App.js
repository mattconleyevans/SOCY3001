/*import React, { useState } from 'react';
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
      const res = await fetch("https://socy3001.onrender.com/api/query", {
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
        <div className="image-container mt-4">
          {images.map((imageUrl, index) => (
            <img key={index} src={imageUrl} alt={`Generated ${index + 1}`} className="img-fluid" />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;*/

import React, { useState } from 'react';
import { Spinner, Button, Container, Row, Col, Form, Alert } from 'react-bootstrap';
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
      const res = await fetch("https://socy3001.onrender.com/api/query", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query_text: query }),
      });

      if (res.ok) {
        const data = await res.json();
        setResponse(data["message"]);
        setImages(data["images"]);
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
    <Container fluid className="p-4 bg-light">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <div className="text-center mb-4">
            <h1 className="display-4">Justice Hope Park AI</h1>
            <p className="lead">Explore the park through AI insights.</p>
          </div>
          <Form onSubmit={handleSubmit} className="mb-4 shadow p-3 rounded bg-white">
            <Form.Group controlId="query">
              <Form.Label className="h5">Enter your query:</Form.Label>
              <Form.Control
                as="textarea"
                rows="5"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type your query here..."
                required
              />
            </Form.Group>
            <Button
              type="submit"
              variant="primary"
              className="w-100 mt-3"
              disabled={loading}
            >
              {loading ? (
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
              ) : (
                'Submit'
              )}
            </Button>
          </Form>
          {response && (
            <Alert variant="success" className="mt-4">
              <h5 className="alert-heading">Response:</h5>
              <ReactMarkdown>{response}</ReactMarkdown>
            </Alert>
          )}
          {images.length > 0 && (
            <div className="image-gallery mt-4">
              {images.map((imageUrl, index) => (
                <img
                  key={index}
                  src={imageUrl}
                  alt={`Generated ${index + 1}`}
                  className="img-fluid rounded shadow-sm"
                />
              ))}
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default App;