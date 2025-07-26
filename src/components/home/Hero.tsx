import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with Happy African Images */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70 z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Happy African professionals"
          className="w-full h-full object-cover blur-sm"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 text-center text-white px-4 max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Connect with <span className="text-club66-gold">Millions</span> of
          <br />
          <span className="text-club66-purple">African Professionals</span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
          Club66 Global is a company that offers a diverse range of services and platforms through our unique all-in-one astonishing product called ZENIKA. Our Zenika Card enables our clients to access discounts and special privileges on purchases of goods and services across our network of partners. Our service basket includes a Job Centre, Payday Loans, an Online Store with low hosting fees, a Free Online Library, and our most passionate "Ô Secours" services. Our mission is to provide valuable resources and opportunities for our clients. Through our TikTok campaign, "What saving lives really means to me," we're gathering feedback and stories to improve our services and better serve our community. With exciting initiatives and benefits, Club66 Global aims to make a positive impact and support the growth and well-being of our clients worldwide.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            onClick={() => navigate('/register')}
            className="bg-club66-gold hover:bg-club66-gold/90 text-black font-semibold px-8 py-4 text-lg"
          >
            Join Club66 Global Today
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            onClick={() => navigate('/cards')}
            className="border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg"
          >
            Explore Plans
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-club66-gold mb-2">2M+</div>
            <div className="text-sm md:text-base opacity-80">Active Clients</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-club66-gold mb-2">15+</div>
            <div className="text-sm md:text-base opacity-80">African Countries</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-club66-gold mb-2">500+</div>
            <div className="text-sm md:text-base opacity-80">Partner Merchants</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-club66-gold mb-2">50%</div>
            <div className="text-sm md:text-base opacity-80">Max Discounts</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
