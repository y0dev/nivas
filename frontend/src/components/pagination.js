import React from 'react';
import './css/pagination.css';
import backArrow from '../assets/images/arrow_left.png'
import nextArrow from '../assets/images/arrow_right.png'


const Pagination = ({ postsPerPage, totalPosts, paginate, goToPage, active }) => {
  const pageNumbers = [];
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  for (let i = 1; i <= totalPages; i++) {
   pageNumbers.push(i);
  }


  return (
    <nav className='pagination-nav'>
      <div className="pagination:number arrow">
         <button onClick={() => goToPage(1,totalPages)}><img src='../images/arrow_left.png' alt='back-arrow'/></button>
      </div>
      <div className='pagination'>
        {pageNumbers.map(number => (
         <button key={number} className={`pagination:number ${(number == active) ? 'active':''}`} onClick={() => paginate(number)}>
            {number}
         </button>
        ))}
      </div>
      <div className="pagination:number arrow">
         <button onClick={() => goToPage(0,totalPages)}><img src='../images/arrow_right.png' alt='back-forward'/></button>
      </div>
    </nav>
  );
};

export default Pagination;