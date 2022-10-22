import React, {  Component } from 'react';
import './css/properties.css';
import _sample from '../assets/json/sample.json';

class Properties extends Component {
    constructor() {
        super();
        this.state = {
            zipCode: '',
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
            }
        }
        
        // this.goToPage = this.goToPage.bind(this);
        // this.goToArticlePage = this.goToArticlePage.bind(this);
        // this.goToNotePage = this.goToNotePage.bind(this);

        this.state.properties = _sample.results.map( ( property, idx ) => {
            return <tr key={idx}>
                        <td>{property.address}</td>
                        <td>{property.status}</td>
                        <td>{property.beds}</td>
                        <td>{property.baths}</td>
                        <td>{`${property.sqft.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} sqft`}</td>
                        <td>{property.priceStr}</td>
                        <td>{`${property.percentile50th}%`}</td>
                    </tr>
        });

    }

    componentDidMount() {

    }
    
    // goToArticlePage(dec,totalPages) {
        
    // }

    render() {
        return (
            <div className='app-body' id='properties-container'>
            
                <div className='properties-header'>
                    <h2 className="properties-heading">Properties</h2>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Address</th>
                            <th>Status</th>
                            <th>Beds</th>
                            <th>Baths</th>
                            <th>Square Footage</th>
                            <th>Price</th>
                            <th>Rent to Price Ratio</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.properties}
                    </tbody>
                </table>
            </div>
        )
    }
}


export default Properties;