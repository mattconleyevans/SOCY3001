import React, { useState } from 'react';
import { Spinner, Button, Container, Row, Col, Form, Alert, Modal } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedCaption, setSelectedCaption] = useState('');
  const [showAbout, setShowAbout] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("https://socy3001.onrender.com/api/query", /*"http://localhost:10000/api/query",*/ {
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
        const length = Object.keys(data["images"]).length;
        console.log(length);
      } else {
        console.error('Failed to fetch:', res.statusText);
      }
    } catch (error) {
      console.error('Error during fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (imageUrl, caption) => {
    setSelectedImage(imageUrl);
    setSelectedCaption(caption);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedImage('');
    setSelectedCaption('');
  };

  const handleAboutClick = () => {
    setShowAbout(true);
  };

  const handleCloseAbout = () => {
    setShowAbout(false);
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
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={`Generated ${index + 1}`}
                  onClick={() => handleImageClick(image.url, image.caption)}
                />
              ))}
            </div>
          )}
        </Col>
      </Row>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Body>
          <img src={selectedImage} alt="Selected" className="img-fluid rounded mb-3" />
          {selectedCaption && <p className="text-center">{selectedCaption}</p>}
        </Modal.Body>
      </Modal>

      {showAbout && (
        <div className="about-modal">
          <span className="close-btn" onClick={handleCloseAbout}>×</span>
          <p>To add.</p>
        </div>
      )}
      <span className="about-link" onClick={handleAboutClick}>About</span>
    </Container>
  );
}

export default App;