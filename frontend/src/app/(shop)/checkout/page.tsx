'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCartStore } from '@/lib/cart-store';
import { useCheckoutStore } from '@/lib/checkout-store';
import { useAuthStore } from '@/lib/auth-store';
import { CheckoutProgress } from '@/components/shop/CheckoutProgress';
import { OrderSummary } from '@/components/shop/OrderSummary';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { CreditCard, Building2, MapPin } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api-client';
import { Address } from '@/types';

const shippingSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi girin'),
  phone: z.string().regex(/^05\d{9}$/, 'Telefon numarası 05XXXXXXXXX formatında olmalıdır'),
  firstName: z.string().min(2, 'Adınız en az 2 karakter olmalıdır'),
  lastName: z.string().min(2, 'Soyadınız en az 2 karakter olmalıdır'),
  address: z.string().min(10, 'Adres en az 10 karakter olmalıdır'),
  city: z.string().min(2, 'Şehir adı gereklidir'),
  postalCode: z.string().min(5, 'Posta kodu 5 haneli olmalıdır'),
});

const paymentSchema = z.object({
  paymentMethod: z.enum(['credit_card', 'bank_transfer']),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: 'Kullanım koşullarını kabul etmelisiniz',
  }),
});

type ShippingFormData = z.infer<typeof shippingSchema>;
type PaymentFormData = z.infer<typeof paymentSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [saveAddress, setSaveAddress] = useState(false);
  
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  
  const {
    email,
    phone,
    shippingAddress,
    paymentMethod,
    setContactInfo,
    setShippingAddress,
    setPaymentMethod,
    clearCheckout,
  } = useCheckoutStore();

  // Fetch saved addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!isAuthenticated) return;
      
      try {
        const response = await api.addresses.getAll() as any;
        const addresses = response.addresses || [];
        setSavedAddresses(addresses);
        
        // Auto-select default address
        const defaultAddress = addresses.find((addr: Address) => addr.isDefault);
        if (defaultAddress && !useNewAddress) {
          setSelectedAddressId(defaultAddress._id!);
        }
      } catch (error) {
        console.error('Fetch addresses error:', error);
      }
    };

    fetchAddresses();
  }, [isAuthenticated, useNewAddress]);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items, router]);

  // Shipping form
  const shippingForm = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      email: email || user?.email || '',
      phone: phone || '',
      firstName: shippingAddress.firstName || '',
      lastName: shippingAddress.lastName || '',
      address: shippingAddress.address || '',
      city: shippingAddress.city || '',
      postalCode: shippingAddress.postalCode || '',
    },
  });

  // Payment form
  const paymentForm = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentMethod: (paymentMethod as 'credit_card' | 'bank_transfer' | undefined) || undefined,
      termsAccepted: false,
    },
  });

  const handleShippingSubmit = async (data: ShippingFormData) => {
    try {
      let addressToUse;
      
      if (selectedAddressId && !useNewAddress) {
        // Use saved address
        const savedAddr = savedAddresses.find(a => a._id === selectedAddressId);
        if (savedAddr) {
          addressToUse = {
            firstName: savedAddr.fullName.split(' ')[0] || savedAddr.fullName,
            lastName: savedAddr.fullName.split(' ').slice(1).join(' ') || '',
            address: savedAddr.address,
            city: savedAddr.city,
            postalCode: '',
            country: 'TR',
          };
          setContactInfo(data.email || user?.email || '', savedAddr.phone);
        }
      } else {
        // Use manual entry
        addressToUse = {
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          city: data.city,
          postalCode: data.postalCode,
          country: 'TR',
        };
        setContactInfo(data.email, data.phone);
        
        // Save address if checkbox is checked
        if (saveAddress && isAuthenticated) {
          try {
            await api.addresses.create({
              title: 'Sipariş Adresi',
              fullName: `${data.firstName} ${data.lastName}`,
              phone: data.phone,
              city: data.city,
              district: '', // Not collected in checkout  
              address: data.address,
              isDefault: false,
            });
            toast.success('Adres kaydedildi');
          } catch (error) {
            console.error('Save address error:', error);
            // Don't block checkout if address save fails
          }
        }
      }
      
      if (addressToUse) {
        setShippingAddress(addressToUse);
        setCurrentStep(2);
        window.scrollTo(0, 0);
      }
    } catch (error) {
      toast.error('Bir hata oluştu');
    }
  };

  const handlePaymentSubmit = async (data: PaymentFormData) => {
    setPaymentMethod(data.paymentMethod);
    setIsSubmitting(true);

    try {
      // Calculate total
      const total = useCartStore.getState().getTotal();
      const shipping = total >= 5000 ? 0 : 150;
      const grandTotal = total + shipping;

      // Create order
      const orderData = {
        items: items.map((item) => ({
          product: item.product._id,
          productName: item.product.name,
          productImage: item.product.images?.[0] || '',
          variantId: item.variant?._id,
          variantName: item.variant?.name,
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: item.price * item.quantity,
        })),
        shippingAddress: {
          fullName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
          phone: phone,
          address: shippingAddress.address,
          city: shippingAddress.city,
          district: shippingAddress.postalCode, // Using postalCode as district for now
        },
        contactInfo: {
          email,
          phone,
        },
        paymentMethod: data.paymentMethod,
        subtotal: total,
        shippingCost: shipping,
        totalAmount: grandTotal,
      };

      const response = await api.orders.create(orderData) as any;
      
      // Clear cart and checkout
      clearCart();
      clearCheckout();

      // Redirect to success page
      router.push(`/checkout/success/${response.orderNumber}`);
      
      toast.success('Siparişiniz başarıyla oluşturuldu!');
    } catch (error: any) {
      console.error('Order creation failed:', error);
      toast.error(error.message || 'Sipariş oluşturulurken bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = ['Teslimat Bilgileri', 'Ödeme', 'Onay'];

  if (items.length === 0) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Progress */}
        <div className="mb-8">
          <CheckoutProgress currentStep={currentStep} steps={steps} />
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* Forms */}
          <div>
            {/* Step 1: Shipping */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Teslimat Bilgileri</CardTitle>
                  <CardDescription>
                    Siparişinizin teslim edileceği adres bilgilerini girin
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={shippingForm.handleSubmit(handleShippingSubmit)} className="space-y-6">
                    {/* Saved Addresses */}
                    {isAuthenticated && savedAddresses.length > 0 && (
                      <div className="space-y-4">
                        <Label className="text-base font-semibold">Kayıtlı Adreslerim</Label>
                        <RadioGroup
                          value={selectedAddressId || ''}
                          onValueChange={(value) => {
                            setSelectedAddressId(value);
                            setUseNewAddress(false);
                          }}
                          disabled={useNewAddress}
                        >
                          {savedAddresses.map((addr) => (
                            <div
                              key={addr._id}
                              className={`flex items-start space-x-3 border p-4 rounded-lg cursor-pointer transition-colors ${
                                selectedAddressId === addr._id && !useNewAddress
                                  ? 'border-primary bg-primary/5'
                                  : 'hover:bg-muted/50'
                              }`}
                            >
                              <RadioGroupItem value={addr._id!} id={addr._id!} />
                              <Label
                                htmlFor={addr._id}
                                className="flex-1 cursor-pointer"
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold">{addr.title}</span>
                                  {addr.isDefault && (
                                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                                      Varsayılan
                                    </span>
                                  )}
                                </div>
                                <div className="text-sm text-muted-foreground space-y-0.5">
                                  <p>{addr.fullName} - {addr.phone}</p>
                                  <p>{addr.address}, {addr.city}</p>
                                </div>
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>

                        <div className="flex items-center space-x-2 pt-2">
                          <Checkbox
                            id="useNewAddress"
                            checked={useNewAddress}
                            onCheckedChange={(checked) => {
                              setUseNewAddress(checked as boolean);
                              if (checked) {
                                setSelectedAddressId(null);
                              }
                            }}
                          />
                          <Label htmlFor="useNewAddress" className="text-sm cursor-pointer font-medium">
                            <MapPin className="inline h-4 w-4 mr-1" />
                            Farklı adres kullan
                          </Label>
                        </div>

                        <div className="border-t pt-4" />
                      </div>
                    )}

                    {/* Manual Address Entry - Show if no saved addresses OR useNewAddress is true */}
                    {(!isAuthenticated || savedAddresses.length === 0 || useNewAddress) && (
                      <>
                        {/* Contact Info */}
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                        <Label htmlFor="email">E-posta *</Label>
                        <Input
                          id="email"
                          type="email"
                          {...shippingForm.register('email')}
                        />
                        {shippingForm.formState.errors.email && (
                          <p className="text-sm text-destructive">
                            {shippingForm.formState.errors.email.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefon *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="05XXXXXXXXX"
                          {...shippingForm.register('phone')}
                        />
                        {shippingForm.formState.errors.phone && (
                          <p className="text-sm text-destructive">
                            {shippingForm.formState.errors.phone.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Name */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Ad *</Label>
                        <Input
                          id="firstName"
                          {...shippingForm.register('firstName')}
                        />
                        {shippingForm.formState.errors.firstName && (
                          <p className="text-sm text-destructive">
                            {shippingForm.formState.errors.firstName.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lastName">Soyad *</Label>
                        <Input
                          id="lastName"
                          {...shippingForm.register('lastName')}
                        />
                        {shippingForm.formState.errors.lastName && (
                          <p className="text-sm text-destructive">
                            {shippingForm.formState.errors.lastName.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-2">
                      <Label htmlFor="address">Adres *</Label>
                      <Input
                        id="address"
                        {...shippingForm.register('address')}
                        placeholder="Mahalle, Sokak, No, Daire"
                      />
                      {shippingForm.formState.errors.address && (
                        <p className="text-sm text-destructive">
                          {shippingForm.formState.errors.address.message}
                        </p>
                      )}
                    </div>

                    {/* City & Postal */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="city">Şehir *</Label>
                        <Input
                          id="city"
                          {...shippingForm.register('city')}
                        />
                        {shippingForm.formState.errors.city && (
                          <p className="text-sm text-destructive">
                            {shippingForm.formState.errors.city.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Posta Kodu *</Label>
                        <Input
                          id="postalCode"
                          {...shippingForm.register('postalCode')}
                          placeholder="34000"
                        />
                        {shippingForm.formState.errors.postalCode && (
                          <p className="text-sm text-destructive">
                            {shippingForm.formState.errors.postalCode.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Save Address Checkbox - Only show if authenticated and using new address */}
                    {isAuthenticated && (!savedAddresses.length || useNewAddress) && (
                      <div className="flex items-center space-x-2 pt-2 border-t">
                        <Checkbox
                          id="saveAddress"
                          checked={saveAddress}
                          onCheckedChange={(checked) => setSaveAddress(checked as boolean)}
                        />
                        <Label htmlFor="saveAddress" className="text-sm cursor-pointer">
                          Bu adresi kaydet
                        </Label>
                      </div>
                    )}
                  </>
                )}

                    <div className="flex justify-between pt-4">
                      <Button type="button" variant="outline" asChild>
                        <Link href="/cart">Sepete Dön</Link>
                      </Button>
                      <Button type="submit">Devam Et</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Payment */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Ödeme Yöntemi</CardTitle>
                  <CardDescription>
                    Ödeme yönteminizi seçin
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={paymentForm.handleSubmit(handlePaymentSubmit)} className="space-y-6">
                    <RadioGroup
                      value={paymentForm.watch('paymentMethod')}
                      onValueChange={(value) => paymentForm.setValue('paymentMethod', value as 'credit_card' | 'bank_transfer')}
                    >
                      <div className="flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50">
                        <RadioGroupItem value="credit_card" id="credit_card" />
                        <Label htmlFor="credit_card" className="flex items-center gap-3 cursor-pointer flex-1">
                          <CreditCard className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <div className="font-medium">Kredi Kartı</div>
                            <div className="text-sm text-muted-foreground">
                              Güvenli ödeme ile hemen teslim alın
                            </div>
                          </div>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50">
                        <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                        <Label htmlFor="bank_transfer" className="flex items-center gap-3 cursor-pointer flex-1">
                          <Building2 className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <div className="font-medium">Havale / EFT</div>
                            <div className="text-sm text-muted-foreground">
                              Banka hesabımıza havale yaparak ödeme
                            </div>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                    {paymentForm.formState.errors.paymentMethod && (
                      <p className="text-sm text-destructive">
                        {paymentForm.formState.errors.paymentMethod.message}
                      </p>
                    )}

                    {/* Terms */}
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={paymentForm.watch('termsAccepted')}
                        onCheckedChange={(checked) =>
                          paymentForm.setValue('termsAccepted', checked as boolean)
                        }
                      />
                      <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                        <Link href="/terms" className="text-primary hover:underline">
                          Kullanım koşullarını
                        </Link>
                        {' ve '}
                        <Link href="/privacy" className="text-primary hover:underline">
                          gizlilik politikasını
                        </Link>
                        {' '}
                        okudum, kabul ediyorum.
                      </Label>
                    </div>
                    {paymentForm.formState.errors.termsAccepted && (
                      <p className="text-sm text-destructive">
                        {paymentForm.formState.errors.termsAccepted.message}
                      </p>
                    )}

                    <div className="flex justify-between pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentStep(1)}
                      >
                        Geri
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'İşleniyor...' : 'Siparişi Tamamla'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <aside>
            <OrderSummary />
          </aside>
        </div>
      </div>
    </div>
  );
}
