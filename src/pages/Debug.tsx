import Layout from '@/components/layout/Layout';
import DatabaseTest from '@/components/debug/DatabaseTest';

const Debug = () => {
  return (
    <Layout>
      <div className="py-16 bg-gradient-to-br from-purple-50 to-purple-100 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-8">Database Debug Page</h1>
            <DatabaseTest />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Debug;
