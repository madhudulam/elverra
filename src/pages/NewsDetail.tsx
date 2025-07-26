import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import PremiumBanner from '@/components/layout/PremiumBanner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ArrowLeft, Share2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchArticle();
    }
  }, [id]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      
      // First try to get from CMS pages
      const { data: cmsData, error: cmsError } = await supabase
        .from('cms_pages')
        .select('*')
        .eq('id', id)
        .eq('page_type', 'news')
        .eq('status', 'published')
        .single();

      if (cmsData) {
        setArticle({
          ...cmsData,
          author: 'Admin Team', // Default author
          category: 'News', // Default category
          image: cmsData.featured_image_url || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
        });
        
        // Increment view count
        await supabase
          .from('cms_pages')
          .update({ view_count: (cmsData.view_count || 0) + 1 })
          .eq('id', id);
      } else {
        // Fallback to static news if not found in CMS
        const staticNews = getStaticNews();
        const staticArticle = staticNews.find(news => news.id.toString() === id);
        if (staticArticle) {
          setArticle(staticArticle);
        } else {
          throw new Error('Article not found');
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Article not found",
        variant: "destructive",
      });
      navigate('/about/news');
    } finally {
      setLoading(false);
    }
  };

  const getStaticNews = () => [
    {
      id: 1,
      title: "Club66 Global Expands to Three New Countries",
      content: `
        <p>We're excited to announce a major milestone in Club66 Global's expansion journey. Our membership benefits and services are now available in three new African countries: Burkina Faso, Niger, and Guinea.</p>
        
        <h3>What This Means for Our Members</h3>
        <p>This expansion represents our commitment to bringing financial inclusion and community benefits to more African communities. Members in these new countries will have access to:</p>
        <ul>
          <li>Ô Secours emergency assistance services</li>
          <li>Discount networks with local merchants</li>
          <li>Financial services and micro-lending opportunities</li>
          <li>Community support programs</li>
        </ul>
        
        <h3>Local Partnerships</h3>
        <p>We've established partnerships with local businesses and service providers in each country to ensure our members receive the best possible benefits. Our team has been working closely with local communities to understand their specific needs and tailor our services accordingly.</p>
        
        <h3>What's Next</h3>
        <p>This expansion is just the beginning. We have plans to enter additional markets across West and Central Africa in the coming months, always with the goal of supporting local communities and providing valuable services to our members.</p>
      `,
      created_at: "2024-03-15T00:00:00Z",
      author: "Admin Team",
      category: "Expansion",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
    },
    {
      id: 2,
      title: "New Partnership with West African Development Bank",
      content: `
        <p>Club66 Global is proud to announce a strategic partnership with the West African Development Bank (WADB) that will significantly enhance our financial services and micro-lending opportunities for members across the region.</p>
        
        <h3>Partnership Benefits</h3>
        <p>This collaboration will enable us to offer:</p>
        <ul>
          <li>Enhanced micro-lending programs with better terms</li>
          <li>Financial literacy training programs</li>
          <li>Business development support for entrepreneurs</li>
          <li>Improved payment systems and digital wallet services</li>
        </ul>
        
        <h3>Supporting Local Entrepreneurs</h3>
        <p>Through this partnership, we'll be able to provide targeted support for small business owners and entrepreneurs in our member communities. The WADB's expertise in regional development, combined with our community-focused approach, creates opportunities for sustainable economic growth.</p>
        
        <h3>Digital Innovation</h3>
        <p>The partnership also includes joint initiatives to develop digital financial solutions tailored to the needs of African communities. We're working on mobile payment systems and digital banking services that will make financial services more accessible to our members.</p>
      `,
      created_at: "2024-03-10T00:00:00Z",
      author: "Partnership Team",
      category: "Partnership",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
    },
    {
      id: 3,
      title: "Digital Card Launch: Instant Access to Benefits",
      content: `
        <p>We're thrilled to introduce our new digital membership cards, featuring cutting-edge QR code technology that provides instant verification and seamless access to all Club66 Global benefits.</p>
        
        <h3>Key Features</h3>
        <p>Our digital cards include:</p>
        <ul>
          <li>QR code for instant merchant verification</li>
          <li>Real-time benefit tracking</li>
          <li>Secure digital wallet integration</li>
          <li>Offline access capabilities</li>
          <li>Multi-language support</li>
        </ul>
        
        <h3>How It Works</h3>
        <p>Members can access their digital card through our mobile app or web portal. The QR code can be scanned by participating merchants to instantly verify membership status and apply relevant discounts or benefits.</p>
        
        <h3>Enhanced Security</h3>
        <p>The digital cards feature advanced security measures including:</p>
        <ul>
          <li>Encrypted QR codes that change periodically</li>
          <li>Biometric authentication options</li>
          <li>Real-time fraud detection</li>
          <li>Instant card suspension capabilities</li>
        </ul>
        
        <h3>Environmental Impact</h3>
        <p>By moving to digital cards, we're also reducing our environmental footprint. This initiative aligns with our commitment to sustainability and responsible business practices.</p>
      `,
      created_at: "2024-03-05T00:00:00Z",
      author: "Technology Team",
      category: "Innovation",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
    }
  ];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.meta_description || article.content.substring(0, 200) + '...',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Article link copied to clipboard",
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">Loading article...</div>
        </div>
      </Layout>
    );
  }

  if (!article) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
            <Button onClick={() => navigate('/about/news')}>
              Back to News
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PremiumBanner
        title={article.title}
        description={article.meta_description || `Published on ${new Date(article.created_at).toLocaleDateString()}`}
        backgroundImage={article.image}
        showBackButton
        backUrl="/about/news"
      />

      <div className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-lg">
              <CardContent className="p-8">
                {/* Article Header */}
                <div className="mb-8">
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <Badge className="bg-purple-100 text-purple-800">
                      {article.category || 'News'}
                    </Badge>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(article.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="h-4 w-4 mr-1" />
                      {article.author}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/about/news')}
                      className="flex items-center gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to News
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleShare}
                      className="flex items-center gap-2"
                    >
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>

                {/* Article Image */}
                {article.image && (
                  <div className="mb-8 rounded-lg overflow-hidden">
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className="w-full h-64 md:h-96 object-cover"
                    />
                  </div>
                )}

                {/* Article Content */}
                <div className="prose prose-lg max-w-none">
                  <div 
                    dangerouslySetInnerHTML={{ 
                      __html: article.content.replace(/\n/g, '<br>') 
                    }} 
                  />
                </div>

                {/* Article Footer */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Views: {article.view_count || 0}
                    </div>
                    <div className="flex items-center gap-4">
                      <Button 
                        variant="outline" 
                        onClick={() => navigate('/about/news')}
                      >
                        More News
                      </Button>
                      <Button onClick={handleShare}>
                        Share Article
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NewsDetail;