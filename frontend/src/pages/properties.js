import React, {  Component } from 'react';
import './css/properties.css';
import _sample from '../assets/json/sample.json';

import Pagination from '../components/pagination';

class Properties extends Component {
    constructor() {
        super();
        this.state = {
            zipCode: '',
            city: '',
            state: '',
            neighborhood: '',
            properties: [],
            two_bed_or_less: {
                percentile25th:'',
                percentile50th:'',
                percentile75th:'',
                properties: []
            },
            three_bed_or_more: {
                percentile25th:'',
                percentile50th:'',
                percentile75th:'',
                properties: []
            },
            postsPerPage: 20,
            numOfProperties: 0,
            currentPropertyPage: 1,
            currentProperties: []
        }
        
        this.goToPage = this.goToPage.bind(this);
        this.updateRows = this.updateRows.bind(this);
        this.numberWithCommas = this.numberWithCommas.bind(this);
        this.goToPropertyPage = this.goToPropertyPage.bind(this);
        this.propertyPaginate = this.propertyPaginate.bind(this);

        this.state.numOfProperties = _sample.results.length;
        const first = _sample.results[0];
        this.state.city = first.city;
        this.state.state = first.state
        this.state.zipCode = first.zipCode;

        this.state.two_bed_or_less.percentile25th = parseFloat(_sample.two_bed.percentile25th).toFixed(2);
        this.state.two_bed_or_less.percentile50th = parseFloat(_sample.two_bed.percentile50th).toFixed(2);
        this.state.two_bed_or_less.percentile75th = parseFloat(_sample.two_bed.percentile75th).toFixed(2);
        this.state.two_bed_or_less.properties = _sample.two_bed.properties;

        this.state.three_bed_or_more.percentile25th = parseFloat(_sample.three_bed.percentile25th).toFixed(2);
        this.state.three_bed_or_more.percentile50th = parseFloat(_sample.three_bed.percentile50th).toFixed(2);
        this.state.three_bed_or_more.percentile75th = parseFloat(_sample.three_bed.percentile75th).toFixed(2);
        this.state.three_bed_or_more.properties = _sample.three_bed.properties;

        this.state.properties = _sample.results.map( ( property, idx ) => {
            return <tr className='property' id='property' key={idx}>
                        <td id='address'>{property.street}</td>
                        <td id='status'>{property.status}</td>
                        <td id='url-link'><a href={property.url}>link</a></td>
                        <td id='beds'>{property.beds}</td>
                        <td id='baths'>{property.baths}</td>
                        <td id='square-footage'>{`${property.sqft.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} sqft`}</td>
                        <td id='price'>{property.priceStr}</td>
                        <td id='ratio' className='ratio'>{`${property.percentile50th}%`}</td>
                    </tr>
        });

        // Pagnation for page
        let indexOfLastProperty = this.state.currentPropertyPage * this.state.postsPerPage;
        let indexOfFirstProperty = indexOfLastProperty - this.state.postsPerPage;
        this.state.currentProperties = this.state.properties.slice(indexOfFirstProperty, indexOfLastProperty);
        console.log(indexOfFirstProperty,indexOfLastProperty,this.state.properties.length);


    }

    componentDidMount() {
        this.updateRows();
    }

    numberWithCommas(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g,',');
    }
    updateRows() {
        const properties = document.getElementsByClassName('property');
        
        // Update the properties that fit criteria
        for (let idx = 0; idx < properties.length; idx++) {
            const element = properties[idx];
            const ratio = element.querySelector('#ratio');
            const percentage = Number(ratio.textContent.replace('%',''));
            // Add class list to make 
            if ( percentage >= 0.50 && percentage < 0.75)
            {
                element.classList.add('above-50');
            }
            else if ( percentage >= 0.75 )
            {
                element.classList.add('above-75');
            }

            // Clean up status
            const status = element.querySelector('#status');
            status.textContent = status.textContent !== '' ? 'For Sale': ''
           
        }
    }

    goToPage(dec,currentPage,totalPages) {
        return ( dec == 0 && (currentPage < totalPages)) || ( dec == 1 && (currentPage > 1));
    }

    propertyPaginate(pageNumber)
    {
        let indexOfLastNote = pageNumber * this.state.postsPerPage;
        let indexOfFirstNote = indexOfLastNote - this.state.postsPerPage;
        this.setState({ 
            currentPropertyPage: pageNumber,
            currentProperties: this.state.properties.slice(indexOfFirstNote, indexOfLastNote)
        });

        this.updateRows();
    }

    goToPropertyPage(dec,totalPages) {
        if (dec === 1) 
        {
            if (this.goToPage(dec,this.state.currentPropertyPage,totalPages)) 
            {
                const pageNumber = this.state.currentPropertyPage - 1;
                this.propertyPaginate(pageNumber);
            }
        }
        else 
        {
            if (this.goToPage(dec,this.state.currentPropertyPage,totalPages)) 
            {
                const pageNumber = this.state.currentPropertyPage + 1;
                this.propertyPaginate(pageNumber);
            }
        }
    }

    render() {
        return (
            <div className='app-body' id='properties-container'>
            
                <div id='properties-header'>
                    <div id='searchInfo'>
                        <h2 id="properties-heading">Properties</h2>
                        <p className='zip-code'>{this.state.zipCode}</p>
                        <p className='city-state'>{`${this.state.city}, ${this.state.state}`}</p>
                    </div>
                    <div id='two-bed-comp' className='comp'>
                        <h3 id="comp-heading">2 Beds or Less Comp</h3>
                        <p className='percentile'><span className='percentile-span'>25%</span>
                            <div className='percentile-text'>
                                {this.numberWithCommas(this.state.two_bed_or_less.percentile25th)}
                            </div>
                        </p>
                        <p className='percentile'><span className='percentile-span'>50%</span>
                            <div className='percentile-text'>
                                {this.numberWithCommas(this.state.two_bed_or_less.percentile50th)}
                            </div>
                        </p>
                        <p className='percentile'><span className='percentile-span'>75%</span>
                            <div className='percentile-text'>
                                {this.numberWithCommas(this.state.two_bed_or_less.percentile75th)}
                            </div>
                        </p>
                    </div>
                    <div id='three-bed-comp' className='comp'>
                        <h3 id="comp-heading">3 Beds or More Comp</h3>
                        <p className='percentile'><span className='percentile-span'>25%</span>
                            <div className='percentile-text'>
                                {this.numberWithCommas(this.state.three_bed_or_more.percentile25th)}
                            </div>
                        </p>
                        <p className='percentile'><span className='percentile-span'>50%</span>
                            <div className='percentile-text'>
                                {this.numberWithCommas(this.state.three_bed_or_more.percentile50th)}
                            </div>
                        </p>
                        <p className='percentile'><span className='percentile-span'>75%</span>
                            <div className='percentile-text'>
                                {this.numberWithCommas(this.state.three_bed_or_more.percentile75th)}
                            </div>
                        </p>
                    </div>
                </div>
                <table id='property-list'>
                    <thead id='property-list-header'>
                        <tr>
                            <th>Address</th>
                            <th>Status</th>
                            <th>Link</th>
                            <th>Beds</th>
                            <th>Baths</th>
                            <th>Square Footage</th>
                            <th>Price</th>
                            <th className='tooltip'>
                                Rent to Price Ratio
                                <div class="bottom">
                                    {/* <h3>Ratio</h3> */}
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
                        {this.state.currentProperties}
                    </tbody>
                </table>

                <div id='article-paginate'>
                    <Pagination 
                        postsPerPage={this.state.postsPerPage}
                        totalPosts={this.state.numOfProperties}
                        paginate={this.propertyPaginate}
                        goToPage={this.goToPropertyPage}
                        active={this.state.currentPropertyPage}/>
                </div>
            </div>
        )
    }
}


export default Properties;