import { Link } from 'react-router-dom';
import { useTests } from '../context/TestContext';
import TestCard from '../components/TestCard';

const TestsPage = () => {
  const { tests } = useTests();
  
  // Sort tests by last modified date (newest first)
  const sortedTests = [...tests].sort((a, b) => b.lastModified - a.lastModified);

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>My Tests</h1>
        <Link to="/create">
          <button>Create New Test</button>
        </Link>
      </div>

      {sortedTests.length > 0 ? (
        <div className="cards-grid">
          {sortedTests.map(test => (
            <TestCard key={test.id} test={test} />
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', margin: '3rem auto', maxWidth: '600px' }}>
          <h2>No Tests Found</h2>
          <p style={{ margin: '1rem 0' }}>
            You haven't created any tests yet. Create your first test to get started.
          </p>
          <Link to="/create">
            <button>Create Your First Test</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default TestsPage; 