import React, {  Component } from 'react';
import './css/properties.css';
import _sample from '../assets/json/sample.json';

import Pagination from '../components/pagination';
import { PropTable } from '../components/prop_table';

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

        this.state.properties = _sample.results.filter( property => /[0-9]+/.test(property.street) );
        this.state.numOfProperties = this.state.properties.length;

        // Pagnation for page
        let indexOfLastProperty = this.state.currentPropertyPage * this.state.postsPerPage;
        let indexOfFirstProperty = indexOfLastProperty - this.state.postsPerPage;
        this.state.currentProperties = this.state.properties.slice(indexOfFirstProperty, indexOfLastProperty);
        console.log(indexOfFirstProperty,indexOfLastProperty,this.state.properties.length);


    }

    componentDidMount() {
        this.updateRows();
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

    numberWithCommas(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g,',');
    }
    

    goToPage(dec,currentPage,totalPages) {
        return ( dec == 0 && (currentPage < totalPages)) || ( dec == 1 && (currentPage > 1));
    }

    propertyPaginate(pageNumber)
    {
        let indexOfLastProperty = pageNumber * this.state.postsPerPage;
        let indexOfFirstProperty = indexOfLastProperty - this.state.postsPerPage;
        this.setState({ 
            currentPropertyPage: pageNumber,
            currentProperties: this.state.properties.slice(indexOfFirstProperty, indexOfLastProperty)
        });
        console.log(pageNumber,indexOfFirstProperty,indexOfLastProperty,this.state.currentProperties);
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
                            <span className='percentile-text'>
                                {this.numberWithCommas(this.state.two_bed_or_less.percentile25th)}
                            </span>
                        </p>
                        <p className='percentile'><span className='percentile-span'>50%</span>
                            <span className='percentile-text'>
                                {this.numberWithCommas(this.state.two_bed_or_less.percentile50th)}
                            </span>
                        </p>
                        <p className='percentile'><span className='percentile-span'>75%</span>
                            <span className='percentile-text'>
                                {this.numberWithCommas(this.state.two_bed_or_less.percentile75th)}
                            </span>
                        </p>
                    </div>
                    <div id='three-bed-comp' className='comp'>
                        <h3 id="comp-heading">3 Beds or More Comp</h3>
                        <p className='percentile'><span className='percentile-span'>25%</span>
                            <span className='percentile-text'>
                                {this.numberWithCommas(this.state.three_bed_or_more.percentile25th)}
                            </span>
                        </p>
                        <p className='percentile'><span className='percentile-span'>50%</span>
                            <span className='percentile-text'>
                                {this.numberWithCommas(this.state.three_bed_or_more.percentile50th)}
                            </span>
                        </p>
                        
                        <p className='percentile'><span className='percentile-span'>75%</span>
                            <span className='percentile-text'>
                                {this.numberWithCommas(this.state.three_bed_or_more.percentile75th)}
                            </span>
                        </p>
                        
                    </div>
                </div>
                <PropTable 
                    properties={this.state.currentProperties}/>

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