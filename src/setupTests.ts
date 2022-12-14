// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect";

// there is a bug in react 18 that throws an error when using act
// https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html
//@ts-ignore
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
