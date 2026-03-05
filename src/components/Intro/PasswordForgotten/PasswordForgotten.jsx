import {useState} from 'react';
import {Card, Form, Button, Container} from 'react-bootstrap';
import consts from '../../../consts';
import {useNavigate} from 'react-router-dom';
import './PasswordForgotten.css';

export default function PasswordForgotten() {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [requestError, setRequestError] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [passwordsEqual, setPasswordsEqual] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [changePasswordError, setChangePasswordError] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const navigate = useNavigate();

  async function sendEmail(event) {
    event.preventDefault();
    setRequestError('');
    setVerificationError('');
    setIsChangePassword(false);
    setResetToken('');
    setIsSendingEmail(true);
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setRequestError('Valid email is required.');
      setIsSendingEmail(false);
      return;
    }

    try {
      const res = await fetch(
        `${consts.getBackendUrl()}/api/users/password-reset/request`,
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({email: normalizedEmail}),
        },
      );

      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          body.details ? `${body.error} ${body.details}` : body.error,
        );
      }

      setEmail(normalizedEmail);
      setEmailSent(true);
      setVerificationCode('');
    } catch (error) {
      console.error('password-reset/request failed:', error);
      setRequestError(
        error?.message ||
          'Could not send reset email. Please try again in a few minutes.',
      );
    } finally {
      setIsSendingEmail(false);
    }
  }

  function handleResendMail(event) {
    event.preventDefault();
    setEmailSent(false);
    setRequestError('');
    setVerificationError('');
    setIsSendingEmail(false);
    setIsVerifyingCode(false);
    setIsChangePassword(false);
    setResetToken('');
    setVerificationCode('');
    setPassword1('');
    setPassword2('');
    setPasswordsEqual(true);
    setIsValidPassword(true);
    setChangePasswordError('');
  }

  async function startChangePassword(event) {
    event.preventDefault();
    setVerificationError('');
    setIsVerifyingCode(true);

    try {
      const res = await fetch(
        `${consts.getBackendUrl()}/api/users/password-reset/verify`,
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            code: verificationCode.trim(),
          }),
        },
      );

      const body = await res.json().catch(() => ({}));

      if (!res.ok || !body.resetToken) {
        throw new Error(body.error || 'Invalid or expired verification code.');
      }

      setResetToken(body.resetToken);
      setIsChangePassword(true);
    } catch (error) {
      setIsChangePassword(false);
      setVerificationError(
        error?.message || 'Invalid or expired verification code.',
      );
    } finally {
      setIsVerifyingCode(false);
    }
  }

  async function changePassword(event) {
    event.preventDefault();
    setChangePasswordError('');

    if (password1 !== password2) {
      setPasswordsEqual(false);
      return;
    }

    setPasswordsEqual(true);

    if (password1.length < 8) {
      setIsValidPassword(false);
      return;
    }

    setIsValidPassword(true);
    setIsChangingPassword(true);

    try {
      const res = await fetch(
        `${consts.getBackendUrl()}/api/users/password-reset/confirm`,
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            resetToken,
            password: password1,
          }),
        },
      );

      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          body.message || body.error || 'Unable to change password.',
        );
      }

      navigate('/login');
    } catch (error) {
      const message = error?.message || '';
      setChangePasswordError(
        message || 'Unable to change password. Please try again.',
      );
    } finally {
      setIsChangingPassword(false);
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
                  disabled={isChangingPassword}
                >
                  {isChangingPassword ? 'Updating...' : 'Set New Password'}
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
                {changePasswordError && (
                  <p className="error-message text-danger">
                    {changePasswordError}
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
                    value={verificationCode}
                    onChange={e => setVerificationCode(e.target.value)}
                  />
                </Form.Group>
                <p className="text-info small">
                  Check your email for the verification code.
                </p>
                <Button
                  className="w-100 mb-3 styled-btn"
                  onClick={startChangePassword}
                  disabled={isVerifyingCode}
                >
                  {isVerifyingCode ? 'Verifying...' : 'Verify Code'}
                </Button>
                {verificationError && (
                  <p className="error-message text-danger">
                    {verificationError}
                  </p>
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
                    {isSendingEmail ? 'Sending...' : 'Send Reset Code'}
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
