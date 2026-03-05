import './BooksList.css';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {useCallback, useEffect, useState} from 'react';
import consts from '../../../../consts';
import {Col, Container, Dropdown, Row, Spinner} from 'react-bootstrap';
import AddNewBookButton from '../../../Buttons/AddNewBookButton/AddNewBookButton';
import MiniBookCard from '../../../Cards/MiniBookCard';

export default function BooksList() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState(localStorage.getItem('sortBy'));

  const [searchParams] = useSearchParams();
  const message = searchParams.get('message');
  const sectionTitle = searchParams.get('sectionTitle');

  const sortMapping = {
    title: 'Title (A–Z)',
    author: 'Author (A–Z)',
    genre: 'Genre (A–Z)',
    language: 'Language (A–Z)',
    pages: 'Number of Pages',
    rating: 'Highest Rating',
    endReadingDate: 'Finished On',
    publicationYear: 'Publication Year',
    publicationDate: 'Publication Year',
    dateAdded: 'Recently Added to Library',
  };

  const fetchBooks = useCallback(() => {
    setLoading(true);
    fetch(
      `${consts.getBackendUrl()}/api/users/books?filter=${message}&sortBy=${localStorage.getItem(
        'sortBy',
      )}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${localStorage.getItem('jwt')}`,
        },
      },
    )
      .then(res => res.json())
      .then(res => {
        setBooks(res.books);
        setLoading(false);
      });
  }, [message]);

  useEffect(() => {
    if (!message && !sectionTitle) {
      navigate('/home');
      return;
    }
    fetchBooks();
  }, [fetchBooks, message, navigate, sectionTitle]);

  function handleSelect(selection) {
    localStorage.setItem('sortBy', selection);
    let storageSortBy = localStorage.getItem('sortBy');
    setSortBy(
      storageSortBy[0] === '-' ? storageSortBy.slice(1) : storageSortBy,
    );
    fetchBooks();
  }

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
    <div className="books-list-container">
      <div
        className="add-new-book-btn"
        onClick={() => navigate('/home/add-book')}
      >
        <AddNewBookButton />
      </div>
      <div className="card-books-container">
        <div
          className="card"
          style={{maxHeight: '65vh', backgroundColor: '#9A7872'}}
        >
          <div
            className="card-header"
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 1,
              backgroundColor: '#9A7872',
              textAlign: 'center',
              color: '#2D2019',
            }}
          >
            <Container>
              <Row>
                <Col
                  className="d-flex justify-content-center align-items-center section-title"
                  sm={12}
                  md={6}
                >
                  <b>{sectionTitle}</b>
                </Col>
                {books.length > 0 ? (
                  <Col
                    className="d-flex justify-content-center align-items-center"
                    sm={12}
                    md={6}
                  >
                    <Dropdown>
                      <Dropdown.Toggle id="dropdown-basic order-by-text">
                        Order by:{' '}
                        {
                          sortMapping[
                            sortBy[0] === '-' ? sortBy.slice(1) : sortBy
                          ]
                        }
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item
                          eventKey="title"
                          onClick={() => handleSelect('title')}
                        >
                          {sortMapping['title']}
                        </Dropdown.Item>
                        <Dropdown.Item
                          eventKey="author"
                          onClick={() => handleSelect('author')}
                        >
                          {sortMapping['author']}
                        </Dropdown.Item>
                        <Dropdown.Item
                          eventKey="genre"
                          onClick={() => handleSelect('genre')}
                        >
                          {sortMapping['genre']}
                        </Dropdown.Item>
                        <Dropdown.Item
                          eventKey="language"
                          onClick={() => handleSelect('language')}
                        >
                          {sortMapping['language']}
                        </Dropdown.Item>
                        <Dropdown.Item
                          eventKey="pages"
                          onClick={() => handleSelect('-pages')}
                        >
                          {sortMapping['pages']}
                        </Dropdown.Item>
                        <Dropdown.Item
                          eventKey="rating"
                          onClick={() => handleSelect('rating')}
                        >
                          {sortMapping['rating']}
                        </Dropdown.Item>
                        <Dropdown.Item
                          eventKey="endReadingDate"
                          onClick={() => handleSelect('-endReadingDate')}
                        >
                          {sortMapping['endReadingDate']}
                        </Dropdown.Item>
                        <Dropdown.Item
                          eventKey="publicationYear"
                          onClick={() => handleSelect('-publicationYear')}
                        >
                          {sortMapping['publicationYear']}
                        </Dropdown.Item>
                        <Dropdown.Item
                          eventKey="dateAdded"
                          onClick={() => handleSelect('-dateAdded')}
                        >
                          {sortMapping['dateAdded']}
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Col>
                ) : (
                  ''
                )}
              </Row>
            </Container>
          </div>
          <div
            className="card-body"
            style={{backgroundColor: '#D3AD79', overflowY: 'scroll'}}
          >
            {books.length > 0 ? (
              books.map(book => (
                <MiniBookCard
                  book={book}
                  fetchBooks={fetchBooks}
                  books={books}
                  setBooks={setBooks}
                />
              ))
            ) : (
              <div
                className="d-flex justify-content-center align-items-center"
                style={{height: '100%'}}
              >
                <div
                  className="card"
                  style={{
                    width: '18rem',
                    color: '#733c0f',
                    backgroundColor: '#D3AD79',
                    textAlign: 'center',
                  }}
                >
                  <div className="card-body">
                    <h5 className="card-title">No books available.</h5>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
