import { useEffect, useState } from 'react';
import { Link } from 'react-router';

interface Project {
  id: number;
  name: string;
  description: string;
}

const Chat = () => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    const fetchProject = async () => {
      try {
        // Using JSONPlaceholder as a demo API
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/1`);
        const data = await response.json();
        
        // Transform the data
        setProject({
          id: 1,
          name: `Project ${data.title.slice(0, 10)}`,
          description: data.body,
        });
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, []);

  if (loading) return <div>Loading...</div>;
  
  return (
    <div className="project-detail">
      <Link to="/dashboard">Back to Dashboard</Link>
      {project ? (
        <>
          <h1>Project Details: {project.name}</h1>
          <p>{project.description}</p>
        </>
      ) : (
        <p>Project not found</p>
      )}
    </div>
  );
}

export default Chat;