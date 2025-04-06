import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Test, TestResult } from '../types';

interface TestContextType {
  tests: Test[];
  results: TestResult[];
  addTest: (test: Test) => void;
  updateTest: (test: Test) => void;
  deleteTest: (id: string) => void;
  getTest: (id: string) => Test | undefined;
  saveResult: (result: TestResult) => void;
  getResults: (testId: string) => TestResult[];
}

const TestContext = createContext<TestContextType | undefined>(undefined);

const LOCAL_STORAGE_TESTS_KEY = 'checkmate_tests';
const LOCAL_STORAGE_RESULTS_KEY = 'checkmate_results';

export const TestProvider = ({ children }: { children: ReactNode }) => {
  const [tests, setTests] = useState<Test[]>([]);
  const [results, setResults] = useState<TestResult[]>([]);

  // Load tests from localStorage on mount
  useEffect(() => {
    const storedTests = localStorage.getItem(LOCAL_STORAGE_TESTS_KEY);
    if (storedTests) {
      try {
        setTests(JSON.parse(storedTests));
      } catch (error) {
        console.error('Failed to parse stored tests:', error);
      }
    }

    const storedResults = localStorage.getItem(LOCAL_STORAGE_RESULTS_KEY);
    if (storedResults) {
      try {
        setResults(JSON.parse(storedResults));
      } catch (error) {
        console.error('Failed to parse stored results:', error);
      }
    }
  }, []);

  // Save tests to localStorage when they change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_TESTS_KEY, JSON.stringify(tests));
  }, [tests]);

  // Save results to localStorage when they change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_RESULTS_KEY, JSON.stringify(results));
  }, [results]);

  const addTest = (test: Test) => {
    setTests([...tests, test]);
  };

  const updateTest = (updatedTest: Test) => {
    setTests(tests.map(test => test.id === updatedTest.id ? updatedTest : test));
  };

  const deleteTest = (id: string) => {
    setTests(tests.filter(test => test.id !== id));
  };

  const getTest = (id: string) => {
    return tests.find(test => test.id === id);
  };

  const saveResult = (result: TestResult) => {
    setResults([...results, result]);
  };

  const getResults = (testId: string) => {
    return results.filter(result => result.testId === testId);
  };

  return (
    <TestContext.Provider value={{
      tests,
      results,
      addTest,
      updateTest,
      deleteTest,
      getTest,
      saveResult,
      getResults
    }}>
      {children}
    </TestContext.Provider>
  );
};

export const useTests = () => {
  const context = useContext(TestContext);
  if (context === undefined) {
    throw new Error('useTests must be used within a TestProvider');
  }
  return context;
}; 