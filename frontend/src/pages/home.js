import React from 'react';
import Carousel from '../components/carousel';
import PricingCard from '../components/pricing_card';

class HomePage extends React.Component {
    render() {
        return (
            <main>
                <header className='header' id='home'>
                    <div className='overlay'></div>

                    <Carousel />
                </header>

                <section className='section' id='about'>


                </section>

                <section className='section' id='pricing'>
                    
                    <PricingCard />
                </section>

            </main>
        )
    }
}

export default HomePage;