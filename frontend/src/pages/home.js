import React from 'react';
import Carousel from '../components/carousel';

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

            </main>
        )
    }
}

export default HomePage;