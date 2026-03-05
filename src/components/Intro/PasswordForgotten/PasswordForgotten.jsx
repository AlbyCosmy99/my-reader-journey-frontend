import {useState} from 'react';
import {Card, Form, Button, Container} from 'react-bootstrap';
import consts from '../../../consts';
import {useNavigate} from 'react-router-dom';
import './PasswordForgotten.css'; // 👈 Make sure to import the styles

export default function PasswordForgotten() {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [requestError, setRequestError] = useState('');
  const [code, setCode] = useState('');
  const [insertedCode, setInsertedCode] = useState('');
  const [incorrectCode, setIncorrectCode] = useState(false);
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [passwordsEqual, setPasswordsEqual] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);
  const navigate = useNavigate();

  async function sendEmail(event) {
    event.preventDefault();
    setRequestError('');
    setIncorrectCode(false);
    setCode('');
    setEmailSent(false);
    setIsSendingEmail(true);

    try {
      const res = await fetch(
        `${consts.getBackendUrl()}/api/users/mails/send-verification`,
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({email}),
        }
      );

      const body = await res.json().catch(() => ({}));

      if (!res.ok || !body.code) {
        throw new Error(body.error || 'Failed to send verification email.');
      }

      setCode(Number(body.code));
      setEmailSent(true);
    } catch (error) {
      console.error('send-verification failed:', error);
      setRequestError(
        'Could not send reset email. Please try again in a few minutes.'
      );
    } finally {
      setIsSendingEmail(false);
    }
  }

  function handleResendMail(event) {
    event.preventDefault();
    setEmailSent(false);
    setRequestError('');
    setIsSendingEmail(false);
    setIncorrectCode(false);
    setIsChangePassword(false);
    setCode('');
    setInsertedCode('');
    setPassword1('');
    setPassword2('');
  }

  function startChangePassword(event) {
    event.preventDefault();
    if (code !== 0 && insertedCode !== 0 && code === Number(insertedCode)) {
      setIsChangePassword(true);
    } else {
      setIsChangePassword(false);
      setIncorrectCode(true);
    }
  }

  function changePassword(event) {
    event.preventDefault();
    if (password1 === password2) {
      setPasswordsEqual(true);
      if (password1.length < 8) {
        setIsValidPassword(false);
        return;
      }
      setIsValidPassword(true);
      fetch(`${consts.getBackendUrl()}/api/users/change-password`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password: password1}),
      })
        .then(res => res.json())
        .then(() => navigate('/login'));
    } else {
      setPasswordsEqual(false);
    }
  }

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{minHeight: '100vh'}}
    >
      <div className="w-100" style={{maxWidth: '400px'}}>
        <Card className="card-custom">
          <Card.Body>
            {isChangePassword ? (
              <>
                <Form.Group>
                  <Form.Label style={{color: '#FF7F00'}}>
                    New Password
                  </Form.Label>
                  <Form.Control
                    className="mb-3"
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
                <Button
                  className="w-100 mb-3 styled-btn"
                  onClick={changePassword}
                >
                  Set New Password
                </Button>
                {!passwordsEqual && (
                  <p className="error-message text-danger">
                    Passwords are not equal!
                  </p>
                )}
                {!isValidPassword && passwordsEqual && (
                  <p className="error-message text-danger">
                    Password must be at least 8 characters long.
                  </p>
                )}
                <Button
                  className="w-100 mt-2 styled-btn"
                  onClick={handleResendMail}
                >
                  Use Different Email
                </Button>
              </>
            ) : emailSent ? (
              <>
                <Form.Group>
                  <Form.Label style={{color: '#FF7F00'}}>
                    Verification Code
                  </Form.Label>
                  <Form.Control
                    className="mb-3"
                    type="text"
                    required
                    value={insertedCode}
                    onChange={e => setInsertedCode(e.target.value)}
                  />
                </Form.Group>
                <p className="text-info small">
                  Check your email for the verification code.
                </p>
                <Button
                  className="w-100 mb-3 styled-btn"
                  onClick={startChangePassword}
                >
                  Verify Code
                </Button>
                {incorrectCode && (
                  <p className="error-message text-danger">Incorrect code.</p>
                )}
                <Button
                  className="w-100 mt-2 styled-btn"
                  onClick={handleResendMail}
                >
                  Change Email
                </Button>
              </>
            ) : (
              <>
                <h2
                  className="text-center mb-4"
                  style={{color: '#f2881d', fontSize: '25px'}}
                >
                  Enter your email to reset your password
                </h2>
                <Form onSubmit={sendEmail}>
                  <Form.Group>
                    <Form.Label style={{color: '#FF7F00'}}>Email</Form.Label>
                    <Form.Control
                      className="mb-3"
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </Form.Group>
                  <Button
                    className="w-100 mb-3 styled-btn"
                    type="submit"
                    disabled={isSendingEmail}
                  >
                    {isSendingEmail ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                  {requestError && (
                    <p className="error-message text-danger">{requestError}</p>
                  )}
                  <Button
                    className="w-100 styled-btn"
                    onClick={() => navigate('/login')}
                  >
                    Back to Login
                  </Button>
                </Form>
              </>
            )}
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}
