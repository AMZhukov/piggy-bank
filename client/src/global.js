import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  *,
  *::after,
  *::before {
    box-sizing: border-box;
  }

  body {
    align-items: center;
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    height: 100vh;
    margin: 0;
    padding: 0;
    font-family: BlinkMacSystemFont, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    transition: all 0.25s linear;
    input {
      color: ${({ theme }) => theme.text};
      background-color: ${({ theme }) => theme.inputBackgroundColor};
      border: 1px solid ${({ theme }) => theme.borderColor};
      ::placeholder {
        color: ${({ theme }) => theme.placeholderColor};
        border-color: ${({ theme }) => theme.borderColor};
      }
    }
  }
  
  footer {
    position: absolute;
    bottom: 5%;
    left: 50%;
    transform: translateX(-50%);
  }
  
  small {
    display: block;
  }
  
  button {
    display: block;
  }
  
  a {
    color: ${({ theme }) => theme.text};
  }
`;
