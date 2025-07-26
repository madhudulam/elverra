import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const productSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(1, 'Price must be greater than 0'),
  category: z.string().min(1, 'Please select a category'),
  condition: z.enum(['new', 'used', 'refurbished']),
  location: z.string().optional(),
  contact_phone: z.string().optional(),
  contact_email: z.string().email().optional().or(z.literal('')),
});

type ProductFormData = z.infer<typeof productSchema>;

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  condition: string;
  location?: string;
  contact_phone?: string;
  contact_email?: string;
  images: string[];
  is_active: boolean;
  is_sold: boolean;
  posting_fee_paid: boolean;
  posting_fee_amount: number;
  views: number;
  created_at: string;
}

interface Category {
  id: string;
  name: string;
  description?: string;
}

interface ProductPostingFormProps {
  product?: Product | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const ProductPostingForm = ({ product, onSuccess, onCancel }: ProductPostingFormProps) => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: product?.title || '',
      description: product?.description || '',
      price: product?.price || 0,
      category: product?.category || '',
      condition: product?.condition as 'new' | 'used' | 'refurbished' || 'new',
      location: product?.location || '',
      contact_phone: product?.contact_phone || '',
      contact_email: product?.contact_email || '',
    },
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    if (!user) {
      toast.error('Please login to post a product');
      return;
    }

    setLoading(true);

    try {
      if (product) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update({
            title: data.title,
            description: data.description,
            price: data.price,
            category: data.category,
            condition: data.condition,
            location: data.location || null,
            contact_phone: data.contact_phone || null,
            contact_email: data.contact_email || null,
          })
          .eq('id', product.id)
          .eq('user_id', user.id);

        if (error) throw error;
        onSuccess();
      } else {
        // Create new product
        const { data: newProduct, error: insertError } = await supabase
          .from('products')
          .insert({
            user_id: user.id,
            title: data.title,
            description: data.description,
            price: data.price,
            category: data.category,
            condition: data.condition,
            location: data.location || null,
            contact_phone: data.contact_phone || null,
            contact_email: data.contact_email || null,
            posting_fee_paid: false,
            posting_fee_amount: 500,
            is_active: false, // Will be activated after payment
          })
          .select()
          .single();

        if (insertError) throw insertError;

        // Handle payment for posting fee
        await handlePostingFeePayment(newProduct.id);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handlePostingFeePayment = async (productId: string) => {
    setProcessingPayment(true);
    
    try {
      // In a real implementation, you would integrate with a payment gateway
      // For now, we'll simulate payment processing
      
      // Create payment record
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert({
          user_id: user!.id,
          payment_type: 'product_posting',
          payment_method: 'mobile_money', // Default method
          amount: 500,
          status: 'pending',
        })
        .select()
        .single();

      if (paymentError) throw paymentError;

      // Update product with payment ID
      const { error: updateError } = await supabase
        .from('products')
        .update({
          posting_fee_payment_id: payment.id,
        })
        .eq('id', productId);

      if (updateError) throw updateError;

      // For demo purposes, we'll automatically mark payment as completed
      // In production, this would be handled by payment webhook
      setTimeout(async () => {
        try {
          await supabase
            .from('payments')
            .update({ status: 'completed' })
            .eq('id', payment.id);

          await supabase
            .from('products')
            .update({ 
              posting_fee_paid: true,
              is_active: true 
            })
            .eq('id', productId);

          toast.success('Payment processed and product is now live!');
          onSuccess();
        } catch (error) {
          console.error('Error processing payment:', error);
          toast.error('Payment processing failed');
        }
      }, 2000);

      toast.success('Product created! Processing payment...');
      
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Failed to process payment');
    } finally {
      setProcessingPayment(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Title *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (CFA) *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your product in detail..."
                  className="min-h-24"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="condition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Condition *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="used">Used</SelectItem>
                    <SelectItem value="refurbished">Refurbished</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="City, area, or region" {...field} />
              </FormControl>
              <FormDescription>
                Help buyers know where the item is located
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="contact_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Phone</FormLabel>
                <FormControl>
                  <Input placeholder="+223 XX XX XX XX" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contact_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="your@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {!product && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Posting Fee
              </CardTitle>
              <CardDescription>
                A one-time posting fee of 500 CFA is required to list your product.
                This helps maintain quality listings on our platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">500 CFA</div>
              <p className="text-sm text-gray-600 mt-1">
                Payment will be processed after submitting the form
              </p>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading || processingPayment}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading || processingPayment}
            className="flex-1"
          >
            {loading || processingPayment ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {processingPayment ? 'Processing Payment...' : 'Saving...'}
              </>
            ) : (
              product ? 'Update Product' : 'Post Product & Pay'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductPostingForm;