
import React from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform, Image, ImageSourcePropType, Linking } from "react-native";
import { colors } from "@/styles/commonStyles";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function resolveImageSource(source: string | number | ImageSourcePropType | undefined): ImageSourcePropType {
  if (!source) return { uri: '' };
  if (typeof source === 'string') return { uri: source };
  return source as ImageSourcePropType;
}

interface Broker {
  id: string;
  name: string;
  nameAr: string;
  image: any;
  features: string[];
  registrationLink: string;
}

export default function BrokersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  console.log('BrokersScreen: Rendering approved brokers page');

  const brokers: Broker[] = [
    {
      id: 'xtb',
      name: 'XTB',
      nameAr: 'بروكر XTB',
      image: require('@/assets/images/916e7763-260b-4aae-886a-58b3874de21e.png'),
      features: [
        'سهولة الإيداع والسحب',
        'مرخص من مركز دبي المالي',
        'مُرخص من سلطة دبي للخدمات المالية',
        'خاصية حساب ال pips تلقائيًا للاهداف ووقف الخسارة',
        'يدعم فقط MT4',
      ],
      registrationLink: 'https://www.xtb.com/ar/live-account?utm_source=IB&utm_campaign=IB_8908814_CFDraking',
    },
    {
      id: 'axi',
      name: 'AXI',
      nameAr: 'بروكر AXI',
      image: require('@/assets/images/34726173-0604-4a32-bc04-611309f4fef5.png'),
      features: [
        'فروق أسعار منخفضة (Low Spreads)',
        'منصات تداول قوية ومتطورة',
        'أنواع حسابات مرنة / حساب تجريبي',
        'نظام مرخّص وموثوق',
        'يوجد لديهم مكتب في دبي',
        'مرونة الرافعة المالية',
      ],
      registrationLink: 'https://www.axi.com/int/live-account?promocode=4735171',
    },
    {
      id: 'exness',
      name: 'Exness',
      nameAr: 'بروكر Exness',
      image: require('@/assets/images/194b815c-cdd2-4a3e-b6b9-519b53a83cfb.png'),
      features: [
        'فروق أسعار منخفضة وتنافسية (Low Spreads)',
        'تنفيذ سريع وموثوق للصفقات',
        'منصات تداول قوية ومتعددة',
        'أنواع حسابات متنوعة تناسب جميع المستويات',
        'حساب تجريبي (Demo)',
        'دعم وخدمة عملاء متعددة اللغات',
        'تداول(Swap-Free) بالحسابات الإسلامية',
        'تنوع الأدوات المالية للتداول',
        'سحب وإيداع سريع ومرن',
        'رافعة مالية مرنة وقد تصل إلى مستويات عالية',
        'مرخّص ومنظم من عدة هيئات عالمية',
      ],
      registrationLink: 'https://www.exness.com/?utm_source=partners&ex_ol=1',
    },
  ];

  const handleBackPress = () => {
    console.log('User tapped back button on brokers page');
    router.back();
  };

  const handleRegisterWithBroker = async (broker: Broker) => {
    console.log('User tapped register button for broker:', broker.name);
    try {
      const supported = await Linking.canOpenURL(broker.registrationLink);
      if (supported) {
        await Linking.openURL(broker.registrationLink);
      } else {
        console.error('Cannot open URL:', broker.registrationLink);
      }
    } catch (error) {
      console.error('Error opening broker registration link:', error);
    }
  };

  const handleAlreadyRegistered = (brokerId: string, brokerName: string) => {
    console.log('User tapped already registered button for broker:', brokerName);
    router.push(`/broker-registration?brokerId=${brokerId}&brokerName=${brokerName}`);
  };

  const topPaddingTop = Platform.OS === 'android' ? Math.max(insets.top, 48) : insets.top;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPaddingTop }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBackPress}
          activeOpacity={0.7}
        >
          <IconSymbol 
            ios_icon_name="chevron.left" 
            android_material_icon_name="arrow-back" 
            size={24} 
            color={colors.text} 
          />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Approved Brokers</Text>
          <Text style={styles.headerTitleAr}>البروكرات المعتمدة</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Introduction */}
        <View style={styles.introSection}>
          <Text style={styles.introTitle}>البروكرات المعتمدة لدى القناة</Text>
          <Text style={styles.introText}>
            نقدم لكم قائمة بأفضل البروكرات المعتمدة والموثوقة للتداول. جميع البروكرات المدرجة مرخصة ومنظمة من هيئات عالمية.
          </Text>
        </View>

        {/* Brokers List */}
        {brokers.map((broker, index) => (
          <View key={index} style={styles.brokerCard}>
            {/* Broker Header */}
            <View style={styles.brokerHeader}>
              <Image 
                source={resolveImageSource(broker.image)} 
                style={styles.brokerImage}
                resizeMode="cover"
              />
              <View style={styles.brokerNameContainer}>
                <Text style={styles.brokerName}>{broker.name}</Text>
                <Text style={styles.brokerNameAr}>{broker.nameAr}</Text>
              </View>
            </View>

            {/* Features Title */}
            <View style={styles.featuresTitleContainer}>
              <IconSymbol 
                ios_icon_name="star.fill" 
                android_material_icon_name="star" 
                size={20} 
                color={colors.highlight} 
              />
              <Text style={styles.featuresTitle}>المميزات</Text>
            </View>

            {/* Features List */}
            <View style={styles.featuresList}>
              {broker.features.map((feature, featureIndex) => (
                <View key={featureIndex} style={styles.featureItem}>
                  <IconSymbol 
                    ios_icon_name="checkmark.circle.fill" 
                    android_material_icon_name="check-circle" 
                    size={18} 
                    color={colors.highlight} 
                  />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtonsContainer}>
              {/* Register with Broker Button */}
              <TouchableOpacity 
                style={styles.registerButton}
                onPress={() => handleRegisterWithBroker(broker)}
                activeOpacity={0.8}
              >
                <IconSymbol 
                  ios_icon_name="link" 
                  android_material_icon_name="open-in-new" 
                  size={20} 
                  color={colors.text} 
                />
                <Text style={styles.registerButtonText}>التسجيل في البروكر</Text>
              </TouchableOpacity>

              {/* Already Registered Button */}
              <TouchableOpacity 
                style={styles.alreadyRegisteredButton}
                onPress={() => handleAlreadyRegistered(broker.id, broker.name)}
                activeOpacity={0.8}
              >
                <IconSymbol 
                  ios_icon_name="checkmark.circle" 
                  android_material_icon_name="check-circle" 
                  size={20} 
                  color={colors.highlight} 
                />
                <Text style={styles.alreadyRegisteredButtonText}>تم التسجيل</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Footer Note */}
        <View style={styles.footerNote}>
          <IconSymbol 
            ios_icon_name="info.circle" 
            android_material_icon_name="info" 
            size={20} 
            color={colors.textSecondary} 
          />
          <Text style={styles.footerNoteText}>
            جميع البروكرات المذكورة أعلاه مرخصة ومنظمة من هيئات عالمية موثوقة. يرجى التأكد من قراءة الشروط والأحكام قبل التسجيل.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  headerTitleAr: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 2,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  introSection: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    alignItems: 'center',
  },
  introTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  introText: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  brokerCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  brokerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  brokerImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  brokerNameContainer: {
    flex: 1,
    marginLeft: 16,
    alignItems: 'flex-end',
  },
  brokerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  brokerNameAr: {
    fontSize: 18,
    color: colors.textSecondary,
    marginTop: 4,
  },
  featuresTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'flex-end',
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginRight: 8,
  },
  featuresList: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 15,
    color: colors.text,
    marginLeft: 12,
    flex: 1,
    textAlign: 'right',
    lineHeight: 22,
  },
  actionButtonsContainer: {
    gap: 12,
  },
  registerButton: {
    backgroundColor: colors.highlight,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginRight: 8,
  },
  alreadyRegisteredButton: {
    backgroundColor: colors.accent,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.highlight,
  },
  alreadyRegisteredButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.highlight,
    marginRight: 8,
  },
  footerNote: {
    flexDirection: 'row',
    backgroundColor: colors.accent,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 24,
    marginBottom: 20,
  },
  footerNoteText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
    textAlign: 'right',
  },
});
