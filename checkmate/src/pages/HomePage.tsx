import { Link } from 'react-router-dom';
import { useTests } from '../context/TestContext';
import TestCard from '../components/TestCard';

const HomePage = () => {
  const { tests } = useTests();
  
  // Get the 3 most recent tests
  const recentTests = [...tests]
    .sort((a, b) => b.lastModified - a.lastModified)
    .slice(0, 3);

  return (
    <div className="container">
      <section className="hero">
        <h1>Welcome to CheckMate</h1>
        <p>
          Create and take tests with ease. Track your progress and improve your knowledge.
        </p>
        <div className="cta-buttons">
          <Link to="/create">
            <button>Create a Test</button>
          </Link>
          <Link to="/tests">
            <button>Browse Tests</button>
          </Link>
        </div>
      </section>

      {recentTests.length > 0 && (
        <section>
          <h2>Recent Tests</h2>
          <div className="cards-grid">
            {recentTests.map(test => (
              <TestCard key={test.id} test={test} />
            ))}
          </div>
          {tests.length > 3 && (
            <div style={{ textAlign: 'center', margin: '2rem 0' }}>
              <Link to="/tests">
                <button>View All Tests</button>
              </Link>
            </div>
          )}
        </section>
      )}

      {tests.length === 0 && (
        <div className="card" style={{ textAlign: 'center', margin: '3rem auto', maxWidth: '600px' }}>
          <h2>Get Started</h2>
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

export default HomePage; 