import React, {  Component } from 'react';
import './css/pricing_card.css';

class PricingCard extends Component {
   constructor() {
      super();
   }

   render() {
      return (
         <div id='pricing-card-container'>
            <h1 class="text-center">Pick the best plan for you</h1>

            <div class="pricing-box-container">
               <div class="pricing-box text-center">
                  <h5>Free</h5>
                  <p class="price"><sup>$</sup>0<sub>/mo</sub></p>
                  <ul class="features-list">
                     <li><strong>1</strong> Project</li>
                     <li><strong>5</strong> Team Members</li>
                     <li><strong>50</strong> Personal Projects</li>
                     <li><strong>5,000</strong> Messages</li>
                  </ul>
                  <button class="btn-primary">Get Started</button>
               </div>

               <div class="pricing-box pricing-box-bg-image text-center">
                  <h5>Premium</h5>
                  <p class="price"><sup>$</sup>39<sub>/mo</sub></p>
                  <ul class="features-list">
                     <li><strong>5</strong> Project</li>
                     <li><strong>20</strong> Team Members</li>
                     <li><strong>100</strong> Personal Projects</li>
                     <li><strong>15,000</strong> Messages</li>
                  </ul>
                  <button class="btn-primary">Get Started</button>
               </div>

               <div class="pricing-box text-center">
                  <h5>Platinum</h5>
                  <p class="price"><sup>$</sup>89<sub>/mo</sub></p>
                  <ul class="features-list">
                     <li><strong>25</strong> Project</li>
                     <li><strong>50</strong> Team Members</li>
                     <li><strong>500</strong> Personal Projects</li>
                     <li><strong>50,000</strong> Messages</li>
                  </ul>
                  <button class="btn-primary">Get Started</button>
               </div>
            </div>
         </div>
         
         // <div id='pricing-card-container' >
         //    <div className='pricing-card-content'>
         //       <h2>Basic</h2>
         //       <h4>Free</h4>
         //       <span>3,000 monthly visitors</span>
         //       <ul>
         //             <li>Limited Reports</li>
         //             <li>Unlimited projects</li>
         //             <li>Data storage for 1 year</li>
         //       </ul>
         //       <button>
         //             Start Now
         //       </button>
         //    </div>
         //    <div className='pricing-card-content'>
         //       <h2>Pro</h2>
         //       <h4>$19 / month</h4>
         //       <span>10,000 monthly visitors</span>
         //       <ul>
         //             <li>Unlimited Reports</li>
         //             <li>15-days free trial</li>
         //             <li>Data storage for 3 year</li>
         //       </ul>
         //       <button>
         //             Try it
         //       </button>
         //    </div>
         // </div>
      );
   }
}
export default PricingCard;