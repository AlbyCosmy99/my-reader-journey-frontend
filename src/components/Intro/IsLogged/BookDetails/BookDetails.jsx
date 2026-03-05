import {Container, Row, Col} from 'react-bootstrap';
import {useParams} from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import './BookDetails.css';
import BookDetailsData from './BookDetailsData/BookDetailsData';
import {useEffect, useState} from 'react';
import Spinner from 'react-bootstrap/Spinner';
import consts from '../../../../consts';

export default function BookDetails() {
  const {id} = useParams();
  const [book, setBook] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${consts.getBackendUrl()}/api/users/books/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${localStorage.getItem('jwt')}`,
      },
    })
      .then(res => res.json())
      .then(res => {
        setBook(res['book'][0]);
        setLoading(false);
      });
  }, [id]);

  return loading ? (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{minHeight: '100vh'}}
    >
      <Spinner
        animation="border"
        role="status"
        style={{width: '8rem', height: '8rem', color: 'orange'}}
      >
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  ) : (
    <Container style={{marginTop: '1rem', marginBottom: '1rem'}}>
      <Row>
        <Col lg={4} sm={12}>
          <Card
            className="book-data-container"
            style={{
              backgroundColor: '#CEB289',
              display: 'flex',
              flexDirection: 'row',
              gap: '1rem',
              alignItems: 'center',
            }}
          >
            <Card.Img
              variant="top"
              className="book-detail-image"
              src={book.imageUrl}
              alt='book cover'
              style={{borderRadius: '5px'}}
            />
            <div
              style={{
                flex: 1,
                marginRight: '1rem',
              }}
              className="book-details-main-data-mobile"
            >
              <h2 className="book-title-main-data-mobile">{book.title}</h2>
              <h3>{book.author}</h3>
            </div>
          </Card>
        </Col>
        <Col lg={8} sm={12}>
          <BookDetailsData book={book} />
        </Col>
      </Row>
    </Container>
  );
}
