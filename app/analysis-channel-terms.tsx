
import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform } from "react-native";
import { colors } from "@/styles/commonStyles";
import { useRouter, useLocalSearchParams } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";

export default function AnalysisChannelTermsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const duration = params.duration as string;
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  console.log('AnalysisChannelTermsScreen: Duration:', duration);

  const currencies = [
    { code: 'USD', symbol: '$', rate: 1 },
    { code: 'EUR', symbol: '€', rate: 0.92 },
    { code: 'GBP', symbol: '£', rate: 0.79 },
    { code: 'AED', symbol: 'د.إ', rate: 3.67 },
    { code: 'SAR', symbol: 'ر.س', rate: 3.75 },
  ];

  const basePrice = 55;
  const currentCurrency = currencies.find(c => c.code === selectedCurrency) || currencies[0];
  const convertedPrice = Math.round(basePrice * currentCurrency.rate);
  const priceDisplay = `${currentCurrency.symbol}${convertedPrice}`;

  const handleContinue = () => {
    console.log('User accepted Analysis channel terms, navigating to registration');
    router.push(`/registration?channel=analysis&duration=monthly&price=${priceDisplay}`);
  };

  const pdfInfoEn = 'Upon purchasing the service, a PDF file containing the joining links for the channels (Analysis Channel, Discussion Channel, and Information Channel) will be downloaded. Please access the links provided in the file, and we will accept your joining request.';
  const pdfInfoAr = 'عند شراء الخدمة، سيتم تحميل ملف PDF يحتوي على روابط الانضمام للقنوات (قناة التحليل وقناة النقاش والمعلومات). يرجى الدخول إلى الروابط المرفقة في الملف، وسنقوم بقبول طلب الانضمام الخاص بك.';
  
  const accessInfoEn = 'The file can be accessed immediately after the request, or by logging in with the email you used during purchase.';
  const accessInfoAr = 'يمكن الوصول إلى الملف بعد الطلب مباشرة، أو من خلال تسجيل الدخول بالبريد الإلكتروني الذي استخدمته عند الشراء.';
  
  const noteHeaderEn = 'Note:';
  const noteHeaderAr = 'ملاحظة:';
  
  const noteTextEn = 'In accordance with our policy and to protect all intellectual property rights, please attach a copy of your personal ID or passport, and pay using a bank card with the same name. The provided data will be verified before accepting the invitation to the Telegram group.';
  const noteTextAr = 'وفقاً لسياستنا وحرصاً على حماية جميع الحقوق الفكرية، نرجو منكم إرفاق نسخة من صورة الهوية أو جواز السفر الشخصي، بالإضافة إلى الدفع باستخدام بطاقة بنكية تحمل نفس الاسم. سيتم التحقق من البيانات المقدمة قبل قبول الدعوة في مجموعة تلقرام.';
  
  const policyHeaderEn = 'Channel Joining Policy:';
  const policyHeaderAr = 'سياسة الانضمام للقنوات:';

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <IconSymbol 
            ios_icon_name="chart.bar.fill" 
            android_material_icon_name="bar-chart" 
            size={48} 
            color={colors.primary} 
          />
          <Text style={styles.title}>Analysis Channel</Text>
          <Text style={styles.titleAr}>قناة التحليل</Text>
        </View>

        <View style={styles.priceSection}>
          <Text style={styles.priceLabel}>Subscription Price</Text>
          <Text style={styles.priceLabelAr}>سعر الاشتراك</Text>
          <Text style={styles.price}>{priceDisplay}</Text>
          <Text style={styles.durationLabel}>Monthly Subscription Only</Text>
          <Text style={styles.durationLabelAr}>اشتراك شهري فقط</Text>
          
          <View style={styles.currencySelector}>
            <Text style={styles.currencyLabel}>Currency:</Text>
            <Text style={styles.currencyLabelAr}>العملة:</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.currencyScroll}
            >
              {currencies.map((currency) => {
                const isSelected = selectedCurrency === currency.code;
                return (
                  <TouchableOpacity
                    key={currency.code}
                    style={[
                      styles.currencyButton,
                      isSelected && styles.currencyButtonSelected,
                    ]}
                    onPress={() => {
                      console.log('User selected currency:', currency.code);
                      setSelectedCurrency(currency.code);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.currencyButtonText,
                      isSelected && styles.currencyButtonTextSelected,
                    ]}>
                      {currency.code}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoText}>{pdfInfoEn}</Text>
          <Text style={styles.infoTextAr}>{pdfInfoAr}</Text>
          
          <Text style={[styles.infoText, styles.marginTop]}>{accessInfoEn}</Text>
          <Text style={styles.infoTextAr}>{accessInfoAr}</Text>
          
          <View style={styles.noteBox}>
            <Text style={styles.noteHeader}>{noteHeaderEn}</Text>
            <Text style={styles.noteHeaderAr}>{noteHeaderAr}</Text>
            <Text style={styles.noteText}>{noteTextEn}</Text>
            <Text style={styles.noteTextAr}>{noteTextAr}</Text>
          </View>
        </View>

        <View style={styles.policySection}>
          <Text style={styles.policyHeader}>{policyHeaderEn}</Text>
          <Text style={styles.policyHeaderAr}>{policyHeaderAr}</Text>

          <View style={styles.termItem}>
            <Text style={styles.termNumber}>1. أسلوب التحليل:</Text>
            <Text style={styles.termText}>
              يتم تقديم التحليل وفقًا لوضوح اتجاه السوق فقط، أي عند وجود رؤية فنية واضحة.
            </Text>
          </View>

          <View style={styles.termItem}>
            <Text style={styles.termNumber}>2. القناة لتحليل أرقام الذهب</Text>
            <Text style={styles.termText}>
              القناة مخصصة لتحليل أرقام الذهب فقط.
            </Text>
          </View>

          <View style={styles.termItem}>
            <Text style={styles.termNumber}>3. محتوى القناة:</Text>
            <Text style={styles.termText}>
              القناة مخصصة لعرض أرقام التحليل الفني فقط، وليست قناة توصيات بيع أو شراء.
            </Text>
          </View>

          <View style={styles.termItem}>
            <Text style={styles.termNumber}>4. القناة:</Text>
            <Text style={styles.termText}>
              مخصصة فقط للأشخاص من لدية خبرة بأساسيات التحليل الفني والقادرين على قراءة المستويات والتصرف بناءً عليها.
            </Text>
          </View>

          <View style={styles.termItem}>
            <Text style={styles.termNumber}>5. سياسة الدفع:</Text>
            <Text style={styles.termText}>
              المبلغ المدفوع غير مسترد تحت أي ظرف بعد الاشتراك.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>Continue to Registration</Text>
          <Text style={styles.continueButtonTextAr}>متابعة إلى التسجيل</Text>
          <IconSymbol 
            ios_icon_name="arrow.right" 
            android_material_icon_name="arrow-forward" 
            size={20} 
            color="#1A1A2E" 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? 72 : 24,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 12,
    marginBottom: 4,
  },
  titleAr: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  priceSection: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: colors.card,
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  priceLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  priceLabelAr: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  price: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  durationLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  durationLabelAr: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  currencySelector: {
    marginTop: 8,
  },
  currencyLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  currencyLabelAr: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  currencyScroll: {
    flexDirection: 'row',
  },
  currencyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  currencyButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  currencyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  currencyButtonTextSelected: {
    color: '#1A1A2E',
  },
  infoSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  infoText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 4,
  },
  infoTextAr: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 12,
    textAlign: 'right',
  },
  marginTop: {
    marginTop: 12,
  },
  noteBox: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 16,
  },
  noteHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  noteHeaderAr: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'right',
  },
  noteText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 4,
  },
  noteTextAr: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 22,
    textAlign: 'right',
  },
  policySection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  policyHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  policyHeaderAr: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'right',
  },
  termItem: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  termNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
    textAlign: 'right',
  },
  termText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
    textAlign: 'right',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  continueButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 12,
  },
  continueButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginRight: 4,
  },
  continueButtonTextAr: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginRight: 8,
  },
});
