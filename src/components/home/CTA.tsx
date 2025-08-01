
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface CMSPage {
  id: string;
  title: string;
  slug: string;c
  content: string;
  meta_description?: string;
  meta_keywords?: string;
  status: string;
  page_type: string;
  is_featured?: boolean;
}

interface CTAProps {
  cmsContent?: CMSPage;
}

const CTA = ({ cmsContent }: CTAProps) => {
  return (
    <section className="py-16 bg-gradient-to-br from-club66-purple to-club66-darkpurple text-white">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Join Elverra Global?</h2>
          <p className="text-lg mb-8 opacity-90">
            Become a Client today and unlock a world of exclusive benefits, discounts, and opportunities.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" variant="secondary" className="bg-elverra-gold hover:bg-elverra-gold/90 text-gray-900">
              <Link to="/register">Sign Up Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
          
          <div className="mt-10 pt-8 border-t border-white/20">
            <p className="font-medium">Available in</p>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <div className="bg-white/10 px-4 py-2 rounded-md">
                <span className="font-medium text-lg">Mali</span>
                <span className="text-xs ml-2 bg-green-500 text-white px-2 py-0.5 rounded-full">Active</span>
              </div>
              <div className="bg-white/5 px-4 py-2 rounded-md opacity-60">
                <span className="font-medium text-lg">Nigeria</span>
                <span className="text-xs ml-2 bg-gray-500 text-white px-2 py-0.5 rounded-full">Coming Soon</span>
              </div>
              <div className="bg-white/5 px-4 py-2 rounded-md opacity-60">
                <span className="font-medium text-lg">Ghana</span>
                <span className="text-xs ml-2 bg-gray-500 text-white px-2 py-0.5 rounded-full">Coming Soon</span>
              </div>
              <div className="bg-white/5 px-4 py-2 rounded-md opacity-60">
                <span className="font-medium text-lg">Senegal</span>
                <span className="text-xs ml-2 bg-gray-500 text-white px-2 py-0.5 rounded-full">Coming Soon</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
