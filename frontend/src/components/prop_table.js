import React, {  Component } from 'react';
import './css/prop_table.css';

export class PropTable extends Component {
   constructor(properties) {
      super();

      this.state = {
         properties: []
      }
      console.log(properties.properties);
      this.state.properties = properties.properties.map( ( property, idx ) => {
         return <tr className='property' id='property' key={idx}>
                     <td id='address'>
                        <p className='street-address middle-text'>
                           {property.street}
                        </p>
                        <p className='url-link small-text'>
                           <a href={property.url}>{property.url}</a>
                        </p>
                     </td>
                     <td id='status'>{property.status}</td>
                     <td id='beds'>{property.beds}</td>
                     <td id='baths'>{property.baths}</td>
                     <td id='square-footage'>{`${property.sqft.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} sqft`}</td>
                     <td id='price'>{property.priceStr}</td>
                     <td id='ratio' className='ratio'>{`${property.percentile50th}%`}</td>
                 </tr>
     });


   }

   
   numberWithCommas(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g,',');
   }

   render() {
      return (
         <div id='prop-table-container'>
            <table id='prop-table'>
               <thead id='property-list-header'>
                  <tr>
                     <th>Address</th>
                     <th>Status</th>
                     <th>Beds</th>
                     <th>Baths</th>
                     <th>Square Footage</th>
                     <th>Price</th>
                     <th className='tooltip'>
                        Rent to Price Ratio
                        <div className="bottom">
                              <p>Ratio is initial set to 50th percentile. Can be set to 25th or 75th</p>
                              {/* <ul>
                                    <li>Aliquam ac odio ut est</li>
                                    <li>Cras porttitor orci</li>
                              </ul> */}
                              <i></i>
                        </div>
                     </th>
                  </tr>
               </thead>
               <tbody>
                  {this.state.properties}
               </tbody>
            </table>
         </div>
      );
   }
}