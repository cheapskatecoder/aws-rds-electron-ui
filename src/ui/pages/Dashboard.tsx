import { Link } from "react-router";

const DashboardPage = () => {
  // Fake dashboard items for demo
  const dashboardItems = [
    { id: 1, name: 'Project Alpha' },
    { id: 2, name: 'Project Beta' },
    { id: 3, name: 'Project Gamma' },
  ];

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <div className="dashboard-items">
        {dashboardItems.map(item => (
          <div key={item.id} className="dashboard-item">
            <h3>{item.name}</h3>
            <Link to="/chat">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;