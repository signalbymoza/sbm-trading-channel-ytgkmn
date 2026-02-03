
# إعداد Stripe للدفع الإلكتروني / Stripe Payment Setup

## نظرة عامة / Overview

تم دمج Stripe في التطبيق لتمكين الدفع الإلكتروني الآمن للاشتراكات. يدعم التطبيق:
- الدفع بالبطاقة الائتمانية (Card Payment)
- Apple Pay (iOS فقط)
- Google Pay (Android فقط)

Stripe has been integrated into the app to enable secure electronic payments for subscriptions. The app supports:
- Credit Card Payment
- Apple Pay (iOS only)
- Google Pay (Android only)

---

## الخطوات المطلوبة / Required Steps

### 1. إنشاء حساب Stripe / Create Stripe Account

1. انتقل إلى [https://stripe.com](https://stripe.com)
2. قم بإنشاء حساب جديد أو تسجيل الدخول
3. احصل على مفاتيح API من لوحة التحكم

Go to [https://stripe.com](https://stripe.com), create an account, and get your API keys from the dashboard.

---

### 2. الحصول على مفاتيح Stripe / Get Stripe Keys

من لوحة تحكم Stripe، احصل على:
- **Publishable Key** (مفتاح قابل للنشر): `pk_test_...` أو `pk_live_...`
- **Secret Key** (مفتاح سري): `sk_test_...` أو `sk_live_...`
- **Webhook Secret** (سر الـ Webhook): `whsec_...`

From Stripe Dashboard, get:
- **Publishable Key**: `pk_test_...` or `pk_live_...`
- **Secret Key**: `sk_test_...` or `sk_live_...`
- **Webhook Secret**: `whsec_...`

---

### 3. تحديث app.json

افتح ملف `app.json` وقم بتحديث `stripePublishableKey`:

```json
{
  "expo": {
    "extra": {
      "stripePublishableKey": "pk_test_YOUR_ACTUAL_KEY_HERE"
    }
  }
}
```

⚠️ **مهم**: استبدل `pk_test_YOUR_STRIPE_PUBLISHABLE_KEY_HERE` بمفتاحك الفعلي من Stripe.

---

### 4. إعداد متغيرات البيئة للـ Backend / Backend Environment Variables

أضف المتغيرات التالية إلى بيئة الـ Backend:

```bash
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
```

Add these environment variables to your backend:
- `STRIPE_SECRET_KEY`: Your secret key
- `STRIPE_PUBLISHABLE_KEY`: Your publishable key
- `STRIPE_WEBHOOK_SECRET`: Your webhook secret

---

### 5. إعداد Webhooks في Stripe / Setup Webhooks

1. في لوحة تحكم Stripe، انتقل إلى **Developers** > **Webhooks**
2. أضف endpoint جديد: `https://YOUR_BACKEND_URL/api/stripe/webhook`
3. اختر الأحداث التالية:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `checkout.session.completed`
4. احفظ الـ **Signing Secret** واستخدمه كـ `STRIPE_WEBHOOK_SECRET`

In Stripe Dashboard:
1. Go to **Developers** > **Webhooks**
2. Add endpoint: `https://YOUR_BACKEND_URL/api/stripe/webhook`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `checkout.session.completed`
4. Save the **Signing Secret** as `STRIPE_WEBHOOK_SECRET`

---

### 6. إعداد Apple Pay (iOS فقط) / Apple Pay Setup (iOS Only)

1. في لوحة تحكم Stripe، انتقل إلى **Settings** > **Payment Methods** > **Apple Pay**
2. قم بتسجيل Merchant ID الخاص بك
3. قم بتحديث `app.json`:

```json
{
  "expo": {
    "plugins": [
      [
        "@stripe/stripe-react-native",
        {
          "merchantIdentifier": "merchant.com.sbmtradingchannel",
          "enableGooglePay": true
        }
      ]
    ]
  }
}
```

4. في Apple Developer Console:
   - أنشئ Merchant ID جديد
   - قم بربطه بـ Stripe

For Apple Pay:
1. Register your Merchant ID in Stripe Dashboard
2. Update `app.json` with your merchant identifier
3. Create Merchant ID in Apple Developer Console
4. Link it to Stripe

---

### 7. إعداد Google Pay (Android فقط) / Google Pay Setup (Android Only)

1. في لوحة تحكم Stripe، انتقل إلى **Settings** > **Payment Methods** > **Google Pay**
2. قم بتفعيل Google Pay
3. تأكد من أن `enableGooglePay: true` في `app.json`

For Google Pay:
1. Enable Google Pay in Stripe Dashboard
2. Ensure `enableGooglePay: true` in `app.json`

---

### 8. اختبار الدفع / Test Payments

استخدم بطاقات الاختبار التالية في وضع الاختبار:

Use these test cards in test mode:

| البطاقة / Card | الرقم / Number | النتيجة / Result |
|---|---|---|
| Visa | 4242 4242 4242 4242 | نجح / Success |
| Visa (فشل) | 4000 0000 0000 0002 | فشل / Declined |
| Mastercard | 5555 5555 5555 4444 | نجح / Success |

- **CVV**: أي 3 أرقام / Any 3 digits
- **تاريخ الانتهاء**: أي تاريخ مستقبلي / Any future date
- **الرمز البريدي**: أي رمز / Any postal code

---

## كيفية عمل الدفع / How Payment Works

### تدفق الدفع / Payment Flow

1. **المستخدم يختار الاشتراك**: يختار القناة والمدة
2. **التسجيل**: يملأ النموذج ويرفع الهوية
3. **شاشة الدفع**: يتم توجيهه إلى `/payment`
4. **اختيار طريقة الدفع**:
   - بطاقة ائتمانية
   - Apple Pay (iOS)
   - Google Pay (Android)
5. **معالجة الدفع**: يتم إنشاء Payment Intent في Stripe
6. **التأكيد**: عند النجاح، يتم تحديث حالة الاشتراك

User Flow:
1. User selects subscription (channel + duration)
2. Fills registration form and uploads ID
3. Redirected to `/payment` screen
4. Chooses payment method (Card/Apple Pay/Google Pay)
5. Payment is processed via Stripe
6. On success, subscription status is updated

---

## الملفات المتأثرة / Affected Files

### Frontend
- `app/payment.tsx` - شاشة الدفع الرئيسية / Main payment screen
- `app/registration.tsx` - تم تحديثه للتوجيه إلى الدفع / Updated to redirect to payment
- `app/duration-selection.tsx` - تم تحديثه لتمرير السعر / Updated to pass price
- `app.json` - إعدادات Stripe / Stripe configuration

### Backend (تم إنشاؤها تلقائياً)
- `/api/stripe/create-payment-intent` - إنشاء Payment Intent
- `/api/stripe/create-checkout-session` - إنشاء Checkout Session
- `/api/stripe/webhook` - معالجة أحداث Stripe
- `/api/payments/:id` - الحصول على تفاصيل الدفع
- `/api/payments/subscription/:subscriptionId` - الحصول على دفعات الاشتراك

Backend (Auto-generated):
- Payment Intent creation endpoint
- Checkout Session creation endpoint
- Webhook handler
- Payment details endpoints

---

## الأمان / Security

✅ **تم تنفيذه**:
- تشفير البيانات عبر HTTPS
- التحقق من توقيع Webhook
- عدم تخزين معلومات البطاقة في قاعدة البيانات
- استخدام Payment Intent لتأمين المعاملات

✅ **Implemented**:
- HTTPS encryption
- Webhook signature verification
- No card data stored in database
- Payment Intent for secure transactions

---

## الدعم / Support

للمساعدة:
- وثائق Stripe: [https://stripe.com/docs](https://stripe.com/docs)
- وثائق Expo Stripe: [https://docs.expo.dev/versions/latest/sdk/stripe/](https://docs.expo.dev/versions/latest/sdk/stripe/)

For help:
- Stripe Docs: [https://stripe.com/docs](https://stripe.com/docs)
- Expo Stripe Docs: [https://docs.expo.dev/versions/latest/sdk/stripe/](https://docs.expo.dev/versions/latest/sdk/stripe/)

---

## ملاحظات مهمة / Important Notes

⚠️ **قبل النشر في الإنتاج**:
1. استبدل مفاتيح الاختبار بمفاتيح الإنتاج
2. قم بتفعيل حسابك في Stripe
3. اختبر جميع طرق الدفع
4. تأكد من إعداد Webhooks بشكل صحيح

⚠️ **Before Production**:
1. Replace test keys with live keys
2. Activate your Stripe account
3. Test all payment methods
4. Ensure webhooks are properly configured

---

## الخطوات التالية / Next Steps

1. ✅ تثبيت `@stripe/stripe-react-native` - تم
2. ✅ إنشاء شاشة الدفع - تم
3. ✅ إعداد Backend endpoints - تم
4. ⏳ إضافة مفاتيح Stripe إلى `app.json`
5. ⏳ إعداد Webhooks في Stripe Dashboard
6. ⏳ اختبار الدفع

Next Steps:
1. ✅ Install Stripe SDK - Done
2. ✅ Create payment screen - Done
3. ✅ Setup backend endpoints - Done
4. ⏳ Add Stripe keys to `app.json`
5. ⏳ Setup webhooks in Stripe Dashboard
6. ⏳ Test payments
