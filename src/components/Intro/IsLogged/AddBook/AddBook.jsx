import {useEffect, useState} from 'react';
import {
  Card,
  Form,
  Button,
  Container,
  Row,
  Col,
  Spinner,
} from 'react-bootstrap';
import './AddBook.css';
import consts from '../../../../consts';
import defaultCover from '../../../../assets/defaultCover.jpg';
import {useParams} from 'react-router-dom';

// Utility: get local datetime string (YYYY-MM-DDTHH:MM:SS)
const getNowDatetimeLocal = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60000);
  return local.toISOString().slice(0, 19);
};

// Utility: take YYYY-MM-DD and append current local time
const addCurrentTime = dateStr => {
  const [year, month, day] = dateStr.split('-');
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

const toLocalDatetime = value => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 19);
};

export default function AddBook() {
  const {id: editBookId} = useParams();
  const isEditMode = Boolean(editBookId);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [language, setLanguage] = useState('');
  const [publishingHouse, setPublishingHouse] = useState('');
  const [pages, setPages] = useState(0);
  const [price, setPrice] = useState('');
  const [isbn, setIsbn] = useState('');
  const [publicationDate, setPublicationDate] = useState('');
  const [read, setRead] = useState(true);
  const [toRead, setToRead] = useState(false);
  const [reading, setReading] = useState(false);
  const [rating, setRating] = useState(null);
  const [favorite, setFavorite] = useState(false);
  const [loaned, setLoaned] = useState(false);
  const [borrowed, setBorrowed] = useState(false);
  const [readingStartDate, setReadingStartDate] = useState('');
  const [readingEndDate, setReadingEndDate] = useState(getNowDatetimeLocal());
  const [dateAdded, setDateAdded] = useState(getNowDatetimeLocal());
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isEditMode) return;

    setLoading(true);
    fetch(`${consts.getBackendUrl()}/api/users/books/${editBookId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${localStorage.getItem('jwt')}`,
      },
    })
      .then(res => res.json())
      .then(res => {
        const existingBook = res?.book?.[0];
        if (!existingBook) {
          setLoading(false);
          window.history.back();
          return;
        }

        setTitle(existingBook.title || '');
        setAuthor(existingBook.author || '');
        setGenre(existingBook.genre || '');
        setLanguage(existingBook.language || '');
        setPublishingHouse(existingBook.publishing_house || '');
        setPages(existingBook.pages ?? '');
        setPrice(existingBook.price || '');
        setIsbn(existingBook.isbn || '');
        setPublicationDate(toLocalDatetime(existingBook.publicationDate));
        setRead(Boolean(existingBook.read));
        setToRead(Boolean(existingBook.toRead));
        setReading(Boolean(existingBook.reading));
        setRating(existingBook.rating ?? null);
        setFavorite(Boolean(existingBook.favorite));
        setLoaned(Boolean(existingBook.loaned));
        setBorrowed(Boolean(existingBook.borrowed));
        setReadingStartDate(toLocalDatetime(existingBook.startReadingDate));
        setReadingEndDate(toLocalDatetime(existingBook.endReadingDate));
        setDateAdded(toLocalDatetime(existingBook.dateAdded));
        setDescription(existingBook.description || '');
        setNotes(existingBook.notes || '');
        setImageUrl(existingBook.imageUrl || '');
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [editBookId, isEditMode]);

  function addBook(event) {
    event.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('jwt');
    if (!token) {
      setLoading(false);
      return;
    }

    const book = {
      title,
      author,
      genre,
      language,
      publishing_house: publishingHouse,
      pages,
      price,
      isbn,
      publicationDate,
      read,
      toRead,
      reading,
      favorite,
      loaned,
      borrowed,
      startReadingDate: readingStartDate,
      endReadingDate: readingEndDate,
      dateAdded,
      description,
      notes,
      imageUrl: imageUrl || defaultCover,
      rating,
    };

    const requestUrl = isEditMode
      ? `${consts.getBackendUrl()}/api/users/books/${editBookId}`
      : `${consts.getBackendUrl()}/api/users/books`;
    const requestMethod = isEditMode ? 'PUT' : 'POST';

    fetch(requestUrl, {
      method: requestMethod,
      body: JSON.stringify(book),
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) {
          return res
            .json()
            .catch(() => ({}))
            .then(body =>
              Promise.reject(
                new Error(body.error || body.message || 'Unable to save book.'),
              ),
            );
        }
        return res.json().catch(() => ({}));
      })
      .then(() => {
        setLoading(false);
        window.history.back();
      })
      .catch(() => setLoading(false));
  }

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100">
        <Spinner
          animation="border"
          role="status"
          style={{width: '6rem', height: '6rem', color: '#f2cd3a'}}
        >
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Container className="py-4 my-5 mt-4">
      <Card
        className="shadow-lg border-0 rounded-4"
        style={{backgroundColor: '#fdf8f2'}}
      >
        <Card.Header
          className="text-center rounded-top-4 add-book-header"
          style={{
            background: 'linear-gradient(90deg, #7f4f24, #d4a373)',
            color: 'white',
            fontWeight: 'bold',
          }}
        >
          Add a New Book
        </Card.Header>

        <Card.Body
          className="px-4 py-3 add-book-body"
          style={{maxHeight: '65vh', overflowY: 'auto'}}
        >
          <Form onSubmit={addBook}>
            <Row className="g-3">
              {[
                {
                  label: 'Title*',
                  val: title,
                  setter: setTitle,
                  type: 'text',
                  required: true,
                },
                {label: 'Author', val: author, setter: setAuthor},
                {label: 'Genre', val: genre, setter: setGenre},
                {label: 'Language', val: language, setter: setLanguage},
                {label: 'Image URL', val: imageUrl, setter: setImageUrl},
                {
                  label: 'Publishing House',
                  val: publishingHouse,
                  setter: setPublishingHouse,
                },
                {
                  label: 'Pages',
                  val: pages,
                  setter: setPages,
                  type: 'number',
                },
                {label: 'Price', val: price, setter: setPrice},
                {label: 'ISBN', val: isbn, setter: setIsbn},
                {
                  label: 'Publication Date',
                  val: publicationDate,
                  setter: setPublicationDate,
                  type: 'date',
                },
              ].map((field, i) => (
                <Col md={6} key={i}>
                  <Form.Group>
                    <Form.Label className="text-dark">{field.label}</Form.Label>
                    <Form.Control
                      type={field.type || 'text'}
                      value={field.val}
                      onChange={e => field.setter(e.target.value)}
                      required={field.required}
                      className="bg-light"
                    />
                  </Form.Group>
                </Col>
              ))}

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="text-dark">Rating</Form.Label>
                  <div>
                    {[...Array(10)].map((_, index) => (
                      <Form.Check
                        inline
                        key={index}
                        label={index + 1}
                        type="radio"
                        name="rating"
                        value={index + 1}
                        checked={rating === index + 1}
                        onChange={e => setRating(Number(e.target.value))}
                      />
                    ))}
                  </div>
                </Form.Group>
              </Col>

              {[
                {label: 'Read', val: read, setter: setRead},
                {label: 'To Read', val: toRead, setter: setToRead},
                {label: 'Reading', val: reading, setter: setReading},
                {label: 'Favorite', val: favorite, setter: setFavorite},
                {label: 'Loaned', val: loaned, setter: setLoaned},
                {label: 'Borrowed', val: borrowed, setter: setBorrowed},
              ].map((toggle, i) => (
                <Col md={2} key={i}>
                  <Form.Check
                    type="checkbox"
                    label={toggle.label}
                    checked={toggle.val}
                    onChange={e => toggle.setter(e.target.checked)}
                    className="text-dark"
                  />
                </Col>
              ))}

              {[
                {
                  label: 'Reading Start Date',
                  val: readingStartDate,
                  setter: setReadingStartDate,
                },
                {
                  label: 'Reading End Date',
                  val: readingEndDate,
                  setter: setReadingEndDate,
                },
                {label: 'Date Added', val: dateAdded, setter: setDateAdded},
              ].map((dateField, i) => (
                <Col md={4} key={i}>
                  <Form.Group>
                    <Form.Label className="text-dark">
                      {dateField.label}
                    </Form.Label>
                    <Form.Control
                      type="date"
                      value={dateField.val ? dateField.val.split('T')[0] : ''}
                      onChange={e =>
                        dateField.setter(addCurrentTime(e.target.value))
                      }
                    />
                  </Form.Group>
                </Col>
              ))}

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="text-dark">Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="text-dark">Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-4">
              <Col>
                <Button
                  variant="outline-secondary"
                  className="w-100 py-2 shadow-sm"
                  onClick={() => window.history.back()}
                >
                  Back
                </Button>
              </Col>
              <Col>
                <Button
                  type="submit"
                  className="w-100 py-2 shadow-sm animated-confirm-button"
                  style={{
                    background: 'linear-gradient(90deg, #f2cd3a, #d4a373)',
                    border: 'none',
                    color: '#000',
                    fontWeight: 'bold',
                  }}
                >
                  Add Book
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
