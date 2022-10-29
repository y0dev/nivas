import React from 'react';
import './css/home.css';
import PricingCard from '../components/pricing_card';
// https://nicepage.com/html-templates/preview/we-help-businesses-increase-efficiency-55597?device=desktop
class HomePage extends React.Component {
    render() {
        return (
            <main>
                <section className='section' id='heading'>
                    <div className='container'>
                        <div id='info'>
                            <h1 className='title'>Search <br/>& Analyze</h1>
                            <p className='large-text'>Properties</p>
                            <button>See More</button>
                        </div>
                        <div id='image'></div>
                    </div>
                </section>

                <section className='section' id='about'>
                    <div className='container'>
                        <div className='row' id='top-row'>
                            <div id='info'>
                                <h1 className='title'>1</h1>
                                <p className='large-text'>Properties</p>
                            </div>
                            <div id='image'></div>
                        </div>

                        <div className='row' id='bottom-row'>
                            <div id='info'>
                                <h1 className='title'>2</h1>
                                <p className='large-text'>Properties</p>
                            </div>
                            <div id='image'></div>
                        </div>
                    </div>
                </section>

                <section className='section' id='pricing'>
                    
                    <PricingCard />
                </section>

            </main>
        )
    }
}

export default HomePage;