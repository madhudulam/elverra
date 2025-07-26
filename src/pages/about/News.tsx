
import Layout from '@/components/layout/Layout';
import PremiumBanner from '@/components/layout/PremiumBanner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const News = () => {
  const navigate = useNavigate();
  const [newsArticles, setNewsArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('cms_pages')
        .select('*')
        .eq('page_type', 'news')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const cmsNews = data?.map(page => ({
        id: page.id,
        title: page.title,
        excerpt: page.meta_description || page.content.substring(0, 200) + '...',
        date: page.created_at.split('T')[0],
        author: 'Admin Team',
        category: 'News',
        image: page.featured_image_url || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
      })) || [];

      // If no CMS news, show static news
      if (cmsNews.length === 0) {
        setNewsArticles(getStaticNews());
      } else {
        setNewsArticles(cmsNews);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      setNewsArticles(getStaticNews());
    } finally {
      setLoading(false);
    }
  };

  const getStaticNews = () => [
    {
      id: 1,
      title: "Club66 Global Expands to Three New Countries",
      excerpt: "We're excited to announce our expansion into Burkina Faso, Niger, and Guinea, bringing our membership benefits to even more African communities.",
      date: "2024-03-15",
      author: "Admin Team",
      category: "Expansion",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 2,
      title: "New Partnership with West African Development Bank",
      excerpt: "Strategic partnership enables enhanced financial services and micro-lending opportunities for our members across the region.",
      date: "2024-03-10",
      author: "Partnership Team",
      category: "Partnership",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 3,
      title: "Digital Card Launch: Instant Access to Benefits",
      excerpt: "Introducing our new digital membership cards with QR code technology for instant verification and seamless benefit access.",
      date: "2024-03-05",
      author: "Technology Team",
      category: "Innovation",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    }
  ];

  const handleReadMore = (articleId: string | number) => {
    navigate(`/news/${articleId}`);
  };

  return (
    <Layout>
      <PremiumBanner
        title="Latest News"
        description="Stay updated with the latest developments, partnerships, and announcements from Club66 Global."
        backgroundImage="https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
        showBackButton
        backUrl="/about"
      />

      <div className="py-16 bg-gradient-to-br from-purple-50 to-purple-100">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="text-center py-8">Loading news articles...</div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {newsArticles.map((article) => (
                <Card key={article.id} className="hover:shadow-lg transition-shadow">
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-purple-100 text-purple-800">
                        {article.category}
                      </Badge>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(article.date).toLocaleDateString()}
                      </div>
                    </div>
                    <CardTitle className="text-xl">{article.title}</CardTitle>
                    <CardDescription>{article.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-600">
                        <User className="h-4 w-4 mr-1" />
                        {article.author}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleReadMore(article.id)}
                      >
                        Read More
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default News;
