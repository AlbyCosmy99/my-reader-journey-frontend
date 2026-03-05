import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import App from './App';
import Login from './components/Intro/Login/Login';
import Home from './components/Intro/IsLogged/Home/Home';
import PasswordForgotten from './components/Intro/PasswordForgotten/PasswordForgotten';
import Register from './components/Intro/Register/Register';
import UserOptions from './components/Intro/IsLogged/UserOptions/UserOptions';
import AddBook from './components/Intro/IsLogged/AddBook/AddBook';
import BooksList from './components/Intro/IsLogged/BooksList/BooksList';
import BookDetails from './components/Intro/IsLogged/BookDetails/BookDetails';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/forgotPassword',
        element: <PasswordForgotten />,
      },
      {
        path: '/register',
        element: <Register />,
      },
      {
        path: '/home',
        element: <Home />,
        children: [
          {
            path: '',
            element: <UserOptions />,
          },
          {
            path: 'add-book',
            element: <AddBook />,
          },
          {
            path: 'add-book/:id',
            element: <AddBook />,
          },
          {
            path: 'books-list',
            element: <BooksList />,
          },
          {
            path: 'book/:id/edit',
            element: <AddBook />,
          },
          {
            path: 'book/:id',
            element: <BookDetails />,
          },
        ],
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);

reportWebVitals();
