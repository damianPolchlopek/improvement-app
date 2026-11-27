// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Pełny przebieg (kilkanaście plików naraz) potrafi spowolnić renderowanie ponad domyślną
// 1 s, przez co findBy… / waitFor losowo nie doczekiwały się elementów. 5 s nie wydłuża
// testów, które przechodzą – czekają tylko tyle, ile trzeba.
configure({ asyncUtilTimeout: 5000 });
