import React from 'react';
import './css/carousel.css'

class Carousel extends React.Component {
    render() {
        return (
               <div id='header-carousel' className='carousel slide carousel-fade'>
                  <div className='container'>
                     <div className='carousel-inner'>
                           <div className='carousel-item active'>
                              <div className='carousel-caption d-none d-md-block'>
                                 <h1 className='carousel-title'>We Make<br/> Creative Design</h1>
                                 <button className='btn btn-primary btn-rounded'>Learn More</button>
                              </div>
                           </div>
                           <div class="carousel-item">
                                 <div class="carousel-caption d-none d-md-block">
                                    <h1 class="carousel-title">We Make <br/> Responsive Design</h1>
                                    <button class="btn btn-primary btn-rounded">Learn More</button>
                                 </div>
                           </div>
                           <div class="carousel-item">
                                 <div class="carousel-caption d-none d-md-block">
                                    <h1 class="carousel-title">We Make <br/> Simple Design</h1>
                                    <button class="btn btn-primary btn-rounded">Learn More</button>
                                 </div>
                           </div>
                     </div>
                  </div>
               </div>
        )
    }
}

export default Carousel;