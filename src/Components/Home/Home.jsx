import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  // Data for the cards
  const cards = [
    {
      title: 'Profile',
      description: 'View and update your profile details.',
      link: '/dashboard/profile', // Updated link
    },
    {
      title: 'Add GST',
      description: 'Manage GST tax rates and configurations.',
      link: '/dashboard/add-gst', // Updated link
    },
    {
      title: 'Commission',
      description: 'Add or update commission rates for transactions.',
      link: '/dashboard/commission', // Updated link
    },
    {
      title: 'Gold Rates',
      description: 'Check the latest gold rates and trends.',
      link: '/dashboard/gold-rated', // Updated link
    },
  ];

  return (
    <div className="home-container">
      <h1>Home Page</h1>
      <div className="cards-container">
        {cards.map((card, index) => (
          <div className="card" key={index}>
            <h2>{card.title}</h2>
            <p>{card.description}</p>
            <Link to={card.link} className="card-link">
              Visit {card.title}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;