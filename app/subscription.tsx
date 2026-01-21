
import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform } from "react-native";
import { colors } from "@/styles/commonStyles";
import { useRouter, useLocalSearchParams } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";

export default function SubscriptionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const channelType = params.channel as string;

  const [selectedDuration, setSelectedDuration] = useState<string>('');

  console.log('SubscriptionScreen: Channel type:', channelType);

  const channelInfo = {
    gold: {
      name: 'Gold Channel',
      color: '#D4AF37',
      icon: 'star',
    },
    forex: {
      name: 'Forex Channel',
      color: '#2A3F5F',
      icon: 'show-chart',
    },
    analysis: {
      name: 'Analysis Channel',
      color: '#4CAF50',
      icon: 'bar-chart',
    },
  };

  const currentChannel = channelInfo[channelType as keyof typeof channelInfo] || channelInfo.gold;

  const subscriptionOptions = [
    {
      id: 'monthly',
      title: 'Monthly',
      duration: '1 Month',
      price: '$99',
      description: 'Perfect for trying out our service',
    },
    {
      id: 'three_months',
      title: 'Three Months',
      duration: '3 Months',
      price: '$249',
      description: 'Best value - Save 15%',
      badge: 'POPULAR',
    },
    {
      id: 'annual',
      title: 'Annual',
      duration: '12 Months',
      price: '$899',
      description: 'Maximum savings - Save 25%',
      badge: 'BEST VALUE',
    },
  ];

  const handleContinue = () => {
    if (!selectedDuration) {
      console.log('No subscription duration selected');
      return;
    }
    console.log('User selected duration:', selectedDuration, 'for channel:', channelType);
    router.push(`/registration?channel=${channelType}&duration=${selectedDuration}`);
  };

  const isSelected = (id: string) => selectedDuration === id;

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Channel Header */}
        <View style={[styles.channelHeader, { backgroundColor: currentChannel.color }]}>
          <IconSymbol 
            ios_icon_name={currentChannel.icon} 
            android_material_icon_name={currentChannel.icon} 
            size={48} 
            color="#FFFFFF" 
          />
          <Text style={styles.channelName}>{currentChannel.name}</Text>
          <Text style={styles.channelSubtitle}>Choose your subscription plan</Text>
        </View>

        {/* Subscription Options */}
        <View style={styles.optionsSection}>
          {subscriptionOptions.map((option, index) => {
            const selected = isSelected(option.id);
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionCard,
                  selected && styles.optionCardSelected,
                ]}
                onPress={() => {
                  console.log('User tapped subscription option:', option.id);
                  setSelectedDuration(option.id);
                }}
                activeOpacity={0.7}
              >
                {option.badge && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{option.badge}</Text>
                  </View>
                )}
                <View style={styles.optionHeader}>
                  <View style={styles.optionTitleContainer}>
                    <Text style={[styles.optionTitle, selected && styles.optionTitleSelected]}>
                      {option.title}
                    </Text>
                    <Text style={[styles.optionDuration, selected && styles.optionDurationSelected]}>
                      {option.duration}
                    </Text>
                  </View>
                  <Text style={[styles.optionPrice, selected && styles.optionPriceSelected]}>
                    {option.price}
                  </Text>
                </View>
                <Text style={[styles.optionDescription, selected && styles.optionDescriptionSelected]}>
                  {option.description}
                </Text>
                <View style={[styles.radioButton, selected && styles.radioButtonSelected]}>
                  {selected && <View style={styles.radioButtonInner} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>What&apos;s Included:</Text>
          <View style={styles.featureItem}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill" 
              android_material_icon_name="check-circle" 
              size={24} 
              color={colors.success} 
            />
            <Text style={styles.featureText}>Daily trading signals</Text>
          </View>
          <View style={styles.featureItem}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill" 
              android_material_icon_name="check-circle" 
              size={24} 
              color={colors.success} 
            />
            <Text style={styles.featureText}>Expert market analysis</Text>
          </View>
          <View style={styles.featureItem}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill" 
              android_material_icon_name="check-circle" 
              size={24} 
              color={colors.success} 
            />
            <Text style={styles.featureText}>24/7 Telegram support</Text>
          </View>
          <View style={styles.featureItem}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill" 
              android_material_icon_name="check-circle" 
              size={24} 
              color={colors.success} 
            />
            <Text style={styles.featureText}>Risk management guidance</Text>
          </View>
          <View style={styles.featureItem}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill" 
              android_material_icon_name="check-circle" 
              size={24} 
              color={colors.success} 
            />
            <Text style={styles.featureText}>Weekly performance reports</Text>
          </View>
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedDuration && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!selectedDuration}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>Continue to Registration</Text>
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
  channelHeader: {
    padding: 32,
    alignItems: 'center',
    marginTop: Platform.OS === 'android' ? 0 : 0,
  },
  channelName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 12,
  },
  channelSubtitle: {
    fontSize: 15,
    color: '#FFFFFF',
    marginTop: 4,
    opacity: 0.9,
  },
  optionsSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  optionCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.border,
    position: 'relative',
  },
  optionCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.accent,
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: 16,
    backgroundColor: colors.highlight,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  optionTitleContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  optionTitleSelected: {
    color: colors.primary,
  },
  optionDuration: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  optionDurationSelected: {
    color: colors.text,
  },
  optionPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  optionPriceSelected: {
    color: colors.primary,
  },
  optionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  optionDescriptionSelected: {
    color: colors.text,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  radioButtonSelected: {
    borderColor: colors.primary,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  featuresSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 15,
    color: colors.text,
    marginLeft: 12,
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
  continueButtonDisabled: {
    backgroundColor: colors.border,
    opacity: 0.5,
  },
  continueButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginRight: 8,
  },
});
