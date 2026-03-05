import {useState} from 'react';
import {Card, Form, Button, Container} from 'react-bootstrap';
import consts from '../../../consts';
import {Link} from 'react-router-dom';
import './Register.css';

export default function Register() {
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [passwordsEqual, setPasswordsEqual] = useState(true);
  const [allFieldsMessage, setAllFieldsMessage] = useState(false);

  function register(event) {
    event.preventDefault();

    if (!email || !name || !surname || !password1 || !password2) {
      setAllFieldsMessage(true);
      return;
    }

    if (password1.length < 8) {
      setIsValidPassword(false);
      return;
    }

    setIsValidPassword(true);
    if (password1 === password2) {
      setPasswordsEqual(true);
      fetch(`${consts.getBackendUrl()}/api/users/register`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          name,
          surname,
          email,
          password: password1,
        }),
      })
        .then(res => res.json())
        .then(res => {
          if (res.jwt) {
            localStorage.setItem('jwt', res.jwt);
            localStorage.setItem('sortBy', 'title');
            window.location.reload();
          }
        });
    } else {
      setPasswordsEqual(false);
    }
  }

  return (
    <Container className="d-flex align-items-center justify-content-center responsive-container">
      <div className="w-100" style={{maxWidth: '400px'}}>
        <Card className="card-custom">
          <Card.Body>
            <h2
              className="text-center mb-4"
              style={{color: '#f2881d', fontSize: '24px'}}
            >
              Create Your Account
            </h2>
            <Form onSubmit={register}>
              <Form.Group>
                <Form.Label style={{color: '#FF7F00'}}>Name</Form.Label>
                <Form.Control
                  className="mb-2"
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label style={{color: '#FF7F00'}}>Surname</Form.Label>
                <Form.Control
                  className="mb-2"
                  type="text"
                  required
                  value={surname}
                  onChange={e => setSurname(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label style={{color: '#FF7F00'}}>Email</Form.Label>
                <Form.Control
                  className="mb-2"
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label style={{color: '#FF7F00'}}>Password</Form.Label>
                <Form.Control
                  className="mb-2"
                  type="password"
                  required
                  value={password1}
                  onChange={e => setPassword1(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label style={{color: '#FF7F00'}}>
                  Repeat Password
                </Form.Label>
                <Form.Control
                  className="mb-3"
                  type="password"
                  required
                  value={password2}
                  onChange={e => setPassword2(e.target.value)}
                />
              </Form.Group>

              {allFieldsMessage && (
                <p className="error-message text-danger">
                  All fields are required.
                </p>
              )}
              {!passwordsEqual && (
                <p className="error-message text-danger">
                  Passwords do not match.
                </p>
              )}
              {!isValidPassword && passwordsEqual && (
                <p className="error-message text-danger">
                  Password must be at least 8 characters.
                </p>
              )}

              <Button type="submit" className="w-100 mb-3 styled-btn">
                Register
              </Button>
            </Form>

            <div className="text-center" style={{color: '#f2881d'}}>
              Already registered?{' '}
              <Link to="/login" className="styled-link">
                Login
              </Link>
            </div>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}
