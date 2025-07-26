
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

interface ExchangeRate {
  [key: string]: number;
}

const CurrencyConverter = () => {
  const [amount, setAmount] = useState<string>("1000");
  const [fromCurrency, setFromCurrency] = useState<string>("XOF");
  const [toCurrency, setToCurrency] = useState<string>("USD");
  const [convertedAmount, setConvertedAmount] = useState<string>("");
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate>({
    // Default rates (static for demo purposes)
    XOF: 1,
    USD: 0.0016,
    EUR: 0.0015,
    GBP: 0.0013,
    NGN: 2.45,
    GHS: 0.022,
    ZAR: 0.030,
    KES: 0.25,
  });

  useEffect(() => {
    convertCurrency();
  }, [amount, fromCurrency, toCurrency, exchangeRates]);

  const convertCurrency = () => {
    if (!amount || isNaN(parseFloat(amount))) {
      setConvertedAmount("");
      return;
    }

    const numericAmount = parseFloat(amount);
    const fromRate = exchangeRates[fromCurrency] || 1;
    const toRate = exchangeRates[toCurrency] || 1;
    
    // Convert to base currency (XOF), then to target currency
    const valueInXOF = numericAmount / fromRate;
    const result = valueInXOF * toRate;
    
    setConvertedAmount(result.toFixed(2));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const currencies = [
    { code: "XOF", name: "CFA Franc (XOF)" },
    { code: "USD", name: "US Dollar (USD)" },
    { code: "EUR", name: "Euro (EUR)" },
    { code: "GBP", name: "British Pound (GBP)" },
    { code: "NGN", name: "Nigerian Naira (NGN)" },
    { code: "GHS", name: "Ghanaian Cedi (GHS)" },
    { code: "ZAR", name: "South African Rand (ZAR)" },
    { code: "KES", name: "Kenyan Shilling (KES)" },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Currency Converter</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={handleAmountChange}
              placeholder="Enter amount"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fromCurrency">From</Label>
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="toCurrency">To</Label>
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
            <div>
              <p className="text-sm text-gray-500">Converted Amount</p>
              <p className="text-xl font-medium">{convertedAmount ? `${convertedAmount} ${toCurrency}` : "-"}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400" />
          </div>
          
          <div className="text-xs text-gray-500 text-center">
            Exchange rates are for demonstration purposes only.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrencyConverter;
