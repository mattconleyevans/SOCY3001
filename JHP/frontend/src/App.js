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
  const [showArchive, setShowArchive] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const queryData = {
      query_text: query,
      timestamp: new Date().toISOString(),
      // You can add more metadata here if needed, such as userID or sessionID
    };

    try {
      const res = await fetch("https://socy3001.onrender.com/api/query"/*"http://localhost:5001/api/query"*/, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(queryData),
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

  const handleArchiveClick = () => {
    setShowArchive(true);
  };

  const handleCloseArchive = () => {
    setShowArchive(false);
  };

  return (
      <>
        {/* Background image and overlay */}
        <div className="background-image"></div>
        <div className="background-overlay"></div>

        <Container fluid className="p-4 content">
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
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/>
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
              <img src={selectedImage} alt="Selected" className="img-fluid rounded mb-3"/>
              {selectedCaption && <p className="text-center">{selectedCaption}</p>}
            </Modal.Body>
          </Modal>

          {showAbout && (
              <div className="about-modal">
                <span className="close-btn" onClick={handleCloseAbout}>×</span>
                <p>This tool has been created as part of a research project in the School of Sociology at the Australian
                  National University studying how AI can be used to understand and engage
                  with place.<br/><br/>
                  The AI has been trained to take on the character of Justice Robert Hope Park, also known as Watson
                  Woodlands, a 19-hectare woodland area on the edge of Canberra. The AI has been trained to respond to
                  queries in first person from the park's perspective.<br/><br/>
                  The AI has access to a corpus of information about the park, including 3000 photographs, news
                  coverage,
                  government documents, satellite images, weather data, visitor reviews, and citizen science
                  observations. It uses this corpus of information to personify the park and attempt to interpret its
                  experiences and desires in response to queries. It will also present 6 images relevant to each query
                  from its image database.<br/><br/>
                  Some of the topics you could ask the park about might include:<br/><br/>
                  <ul>
                    <li>Development and biodiversity offsets</li>
                    <li>The ecosystem of the park</li>
                    <li>How humans engage with the park</li>
                  </ul>
                  <br/>
                  Created by Matthew Conley-Evans (matthew.conley-evans@anu.edu.au)
                </p>
              </div>
          )}

          {showArchive && (
              <div className="about-modal">
                <span className="close-btn" onClick={handleCloseArchive}>×</span>
                <h5>Government documents</h5>
                <ul>
                  <li><a
                      href="https://jhp-ai-socy3001.s3.ap-southeast-2.amazonaws.com/Documents/BoxGumGrassyWoodlandNationalRecoveryPlan.pdf"
                      target="_blank"
                      rel="noopener noreferrer">2011 Box Gum Grassy Woodland National Recovery Plan</a></li>
                  <li><a
                      href="https://jhp-ai-socy3001.s3.ap-southeast-2.amazonaws.com/Documents/EnvironmentalOffsets.pdf"
                      target="_blank"
                      rel="noopener noreferrer">2017 Woodland Quality and Extent Mapping - ACT Government Environmental
                    Offsets</a></li>
                  <li><a
                      href="https://jhp-ai-socy3001.s3.ap-southeast-2.amazonaws.com/Documents/NatureConservationAct.pdf"
                      target="_blank"
                      rel="noopener noreferrer">ACT Nature Conservation Act 2014</a></li>
                  <li><a
                      href="https://jhp-ai-socy3001.s3.ap-southeast-2.amazonaws.com/Documents/OperationalManagementPlan.pdf"
                      target="_blank"
                      rel="noopener noreferrer">Justice Robert Hope Park Operational Management Plan 2018-2021</a></li>
                  <li><a
                      href="https://jhp-ai-socy3001.s3.ap-southeast-2.amazonaws.com/Documents/ReserveManagementPlan.pdf"
                      target="_blank"
                      rel="noopener noreferrer">Canberra Nature Park Reserve Management Plan 2021</a></li>
                  <li><a href="https://jhp-ai-socy3001.s3.ap-southeast-2.amazonaws.com/Documents/StateOfEnvironment.pdf"
                         target="_blank"
                         rel="noopener noreferrer">ACT State of the Environment 2019</a></li>
                  <li><a
                      href="https://jhp-ai-socy3001.s3.ap-southeast-2.amazonaws.com/Documents/WoodlandConservationStrategy.pdf"
                      target="_blank"
                      rel="noopener noreferrer">ACT Native Woodland Conservation Strategy</a></li>
                  <li><a
                      href="https://jhp-ai-socy3001.s3.ap-southeast-2.amazonaws.com/Documents/WoodlandConservationStrategyBoxGumGrassyWoodland.pdf"
                      target="_blank"
                      rel="noopener noreferrer">Box Gum Grassy Woodland Action Plan</a></li>
                  <li><a href="https://www.parks.act.gov.au/find-a-park/canberra-nature-park/justice-robert-hope-park"
                         target="_blank"
                         rel="noopener noreferrer">Parks ACT - Justice Robert Hope Park</a></li>
                  <li><a
                      href="https://www.environment.act.gov.au/ACT-parks-conservation/environmental-offsets/individual-projects/justice-robert-hope-park-offset-area"
                      target="_blank"
                      rel="noopener noreferrer">Environment ACT - Justice Robert Hope Park Offset Area</a></li>
                </ul>
                <br/>
                <h5>Community engagement</h5>
                <ul>
                  <li><a href="https://jhp-ai-socy3001.s3.ap-southeast-2.amazonaws.com/Documents/DAComment.pdf"
                         target="_blank" rel="noopener noreferrer">ACT
                    Conservation Council Comments on 2015 Watson Development Application</a></li>
                  <li><a
                      href="https://jhp-ai-socy3001.s3.ap-southeast-2.amazonaws.com/Documents/WatsonWoodlandsWorkingGroup.pdf"
                      target="_blank"
                      rel="noopener noreferrer">History of JHP and the Watson Woodlands Working Group</a></li>
                  <li><a
                      href="https://greens.org.au/act/news/act-greens-act-protect-act-endangered-woodlands-development-0"
                      target="_blank"
                      rel="noopener noreferrer">ACT Greens, 2020 - Protecting Endangered Woodlands From Development</a>
                  </li>
                </ul>
                <br/>
                <h5>Media coverage</h5>
                <ul>
                  <li><a href="https://citynews.com.au/2014/volunteers-feel-duped-land-greed"
                         target="_blank"
                         rel="noopener noreferrer">City News, 2014 - Volunteers feel duped by land 'greed'</a></li>
                  <li><a
                      href="https://www.northcanberra.org.au/watson-community-association-celebrates-10th-anniversary-of-justice-robert-hope-park/"
                      target="_blank"
                      rel="noopener noreferrer">North Canberra Community Council, 2012 - 10th anniversary of Justice
                    Robert Hope Park</a></li>
                  <li><a
                      href="https://www.canberratimes.com.au/story/6047219/woodlands-defenders-welcome-inadequate-nature-reserve-in-watson/"
                      target="_blank"
                      rel="noopener noreferrer">Canberra Times, 2018 - Woodlands defenders welcome 'inadequate' nature
                    reserve in Watson</a></li>
                  <li><a href="https://www.abc.net.au/listen/programs/backgroundbriefing/5312944"
                         target="_blank"
                         rel="noopener noreferrer">ABC Background Briefing, 2014 - The trouble with offsets</a></li>
                </ul>
              </div>
          )}

          <span className="about-link" onClick={handleAboutClick}>About</span>
          <span className="about-link" onClick={handleArchiveClick} style={{right: '150px'}}>Document Archive</span>

        </Container>
        <div className="footer-banner">
          Your queries may be anonymously logged for research purposes. AI can make mistakes, please do not rely on
          information given.
        </div>
        </>
        );
        }

        export default App;