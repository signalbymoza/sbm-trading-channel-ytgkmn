
import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Platform } from "react-native";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import { useTheme } from "@/contexts/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Modal from "@/components/ui/Modal";
import { apiCall } from "@/utils/api";

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  created_at: string;
  channel_type?: string;
}

export default function ReviewsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddReview, setShowAddReview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewChannel, setNewReviewChannel] = useState('');
  
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    titleAr: string;
    message: string;
    messageAr: string;
    onConfirm?: () => void;
  }>({
    type: 'info',
    title: '',
    titleAr: '',
    message: '',
    messageAr: '',
  });

  console.log('ReviewsScreen: Rendering reviews page');

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    console.log('Loading reviews from backend');
    setLoading(true);
    try {
      const data = await apiCall<Review[]>('/api/reviews');
      console.log('Reviews loaded successfully:', data.length, 'reviews');
      setReviews(data);
    } catch (error) {
      console.error('Error loading reviews:', error);
      showModal(
        'error',
        'Error',
        'خطأ',
        'Failed to load reviews. Please try again.',
        'فشل تحميل التقييمات. يرجى المحاولة مرة أخرى.'
      );
    } finally {
      setLoading(false);
    }
  };

  const showModal = (
    type: 'success' | 'error' | 'warning' | 'info',
    title: string,
    titleAr: string,
    message: string,
    messageAr: string,
    onConfirm?: () => void
  ) => {
    setModalConfig({ type, title, titleAr, message, messageAr, onConfirm });
    setModalVisible(true);
  };

  const handleSubmitReview = async () => {
    console.log('User submitting review');
    
    const trimmedName = newReviewName.trim();
    const trimmedComment = newReviewComment.trim();
    
    if (!trimmedName) {
      showModal(
        'warning',
        'Name Required',
        'الاسم مطلوب',
        'Please enter your name',
        'يرجى إدخال اسمك'
      );
      return;
    }

    if (!trimmedComment) {
      showModal(
        'warning',
        'Comment Required',
        'التعليق مطلوب',
        'Please enter your review',
        'يرجى إدخال تقييمك'
      );
      return;
    }

    setSubmitting(true);
    try {
      const reviewData = {
        name: trimmedName,
        rating: newReviewRating,
        comment: trimmedComment,
        channel_type: newReviewChannel || null,
      };
      
      console.log('Submitting review:', reviewData);
      
      await apiCall('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      console.log('Review submitted successfully');
      
      setNewReviewName('');
      setNewReviewRating(5);
      setNewReviewComment('');
      setNewReviewChannel('');
      setShowAddReview(false);
      
      showModal(
        'success',
        'Thank You!',
        'شكراً لك!',
        'Your review has been submitted and will be published after approval.',
        'تم إرسال تقييمك وسيتم نشره بعد الموافقة عليه.',
        () => loadReviews()
      );
    } catch (error) {
      console.error('Error submitting review:', error);
      showModal(
        'error',
        'Error',
        'خطأ',
        'Failed to submit review. Please try again.',
        'فشل إرسال التقييم. يرجى المحاولة مرة أخرى.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const monthEn = date.toLocaleDateString('en-US', { month: 'short' });
    const day = date.getDate();
    const year = date.getFullYear();
    return `${monthEn} ${day}, ${year}`;
  };

  const getChannelName = (channelType?: string) => {
    if (!channelType) return '';
    const channelNames: Record<string, { en: string; ar: string }> = {
      gold: { en: 'Gold Channel', ar: 'قناة الذهب' },
      forex: { en: 'Forex Channel', ar: 'قناة الفوركس' },
      analysis: { en: 'Analysis Channel', ar: 'قناة التحليل' },
      education: { en: 'Education', ar: 'التعليم' },
    };
    return channelNames[channelType] || { en: channelType, ar: channelType };
  };

  const renderStars = (rating: number, size: number = 20) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <IconSymbol
          key={i}
          ios_icon_name={i <= rating ? "star.fill" : "star"}
          android_material_icon_name={i <= rating ? "star" : "star-border"}
          size={size}
          color={i <= rating ? "#FFD700" : colors.border}
        />
      );
    }
    return stars;
  };

  const topPaddingTop = Platform.OS === 'android' ? Math.max(insets.top, 48) : insets.top;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingTop: topPaddingTop,
      paddingHorizontal: 16,
      paddingBottom: 16,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      flexDirection: 'row',
      alignItems: 'center',
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
      paddingBottom: 40,
    },
    headerSection: {
      padding: 24,
      paddingTop: 24,
      alignItems: 'center',
    },
    headerIcon: {
      marginBottom: 16,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
      textAlign: 'center',
    },
    titleAr: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 12,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 15,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
      marginBottom: 4,
    },
    subtitleAr: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
      marginBottom: 20,
    },
    addReviewButton: {
      backgroundColor: colors.highlight,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 12,
      marginTop: 8,
    },
    addReviewButtonText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginRight: 8,
    },
    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 60,
    },
    loadingText: {
      fontSize: 16,
      color: colors.textSecondary,
      marginTop: 12,
    },
    reviewsSection: {
      paddingHorizontal: 24,
    },
    reviewCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    reviewHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    reviewerInfo: {
      flex: 1,
    },
    reviewerName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
    },
    reviewDate: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    starsContainer: {
      flexDirection: 'row',
      gap: 4,
    },
    reviewComment: {
      fontSize: 15,
      color: colors.text,
      lineHeight: 22,
      marginBottom: 12,
    },
    reviewChannel: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.accent,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      alignSelf: 'flex-start',
    },
    reviewChannelText: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.text,
      marginLeft: 6,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: 60,
      paddingHorizontal: 24,
    },
    emptyStateText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 16,
      marginBottom: 4,
    },
    emptyStateTextAr: {
      fontSize: 15,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    addReviewSection: {
      paddingHorizontal: 24,
      paddingVertical: 24,
    },
    addReviewTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
    },
    addReviewTitleAr: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 20,
    },
    inputGroup: {
      marginBottom: 20,
    },
    label: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    input: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      color: colors.text,
    },
    textArea: {
      minHeight: 120,
      textAlignVertical: 'top',
    },
    ratingSelector: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 8,
    },
    ratingButton: {
      padding: 8,
    },
    channelSelector: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginTop: 8,
    },
    channelOption: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: colors.border,
      backgroundColor: colors.card,
    },
    channelOptionSelected: {
      borderColor: colors.highlight,
      backgroundColor: colors.accent,
    },
    channelOptionText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
    },
    channelOptionTextSelected: {
      color: colors.highlight,
    },
    submitButtonContainer: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 8,
    },
    submitButton: {
      flex: 1,
      backgroundColor: colors.highlight,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    submitButtonDisabled: {
      opacity: 0.5,
    },
    submitButtonText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    cancelButton: {
      flex: 1,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cancelButtonText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
    },
  });

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => {
            console.log('User tapped back button on reviews page');
            router.back();
          }}
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
          <Text style={styles.headerTitle}>Reviews</Text>
          <Text style={styles.headerTitleAr}>التقييمات</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.headerIcon}>
            <IconSymbol 
              ios_icon_name="star.fill" 
              android_material_icon_name="star" 
              size={48} 
              color="#FFD700" 
            />
          </View>
          <Text style={styles.title}>Client Reviews</Text>
          <Text style={styles.titleAr}>تقييمات العملاء</Text>
          <Text style={styles.subtitle}>
            Read what our clients have to say about their experience
          </Text>
          <Text style={styles.subtitleAr}>
            اقرأ ما يقوله عملاؤنا عن تجربتهم
          </Text>
          <TouchableOpacity 
            style={styles.addReviewButton}
            onPress={() => {
              console.log('User tapped Add Review button');
              setShowAddReview(true);
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.addReviewButtonText}>Write a Review</Text>
            <IconSymbol 
              ios_icon_name="plus" 
              android_material_icon_name="add" 
              size={20} 
              color="#FFFFFF" 
            />
          </TouchableOpacity>
        </View>

        {/* Add Review Form */}
        {showAddReview && (
          <View style={styles.addReviewSection}>
            <Text style={styles.addReviewTitle}>Write Your Review</Text>
            <Text style={styles.addReviewTitleAr}>اكتب تقييمك</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Your Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor={colors.textSecondary}
                value={newReviewName}
                onChangeText={setNewReviewName}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Rating</Text>
              <View style={styles.ratingSelector}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    style={styles.ratingButton}
                    onPress={() => {
                      console.log('User selected rating:', star);
                      setNewReviewRating(star);
                    }}
                    activeOpacity={0.7}
                  >
                    <IconSymbol
                      ios_icon_name={star <= newReviewRating ? "star.fill" : "star"}
                      android_material_icon_name={star <= newReviewRating ? "star" : "star-border"}
                      size={32}
                      color={star <= newReviewRating ? "#FFD700" : colors.border}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Channel (Optional)</Text>
              <View style={styles.channelSelector}>
                {['gold', 'forex', 'analysis', 'education'].map((channel) => {
                  const isSelected = newReviewChannel === channel;
                  const channelName = getChannelName(channel);
                  return (
                    <TouchableOpacity
                      key={channel}
                      style={[
                        styles.channelOption,
                        isSelected && styles.channelOptionSelected,
                      ]}
                      onPress={() => {
                        console.log('User selected channel:', channel);
                        setNewReviewChannel(isSelected ? '' : channel);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.channelOptionText,
                        isSelected && styles.channelOptionTextSelected,
                      ]}>
                        {channelName.en}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Your Review</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Share your experience with us..."
                placeholderTextColor={colors.textSecondary}
                value={newReviewComment}
                onChangeText={setNewReviewComment}
                multiline
                numberOfLines={5}
              />
            </View>

            <View style={styles.submitButtonContainer}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => {
                  console.log('User cancelled review');
                  setShowAddReview(false);
                  setNewReviewName('');
                  setNewReviewRating(5);
                  setNewReviewComment('');
                  setNewReviewChannel('');
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.submitButton,
                  submitting && styles.submitButtonDisabled,
                ]}
                onPress={handleSubmitReview}
                disabled={submitting}
                activeOpacity={0.8}
              >
                {submitting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.submitButtonText}>Submit Review</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Reviews List */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.highlight} />
            <Text style={styles.loadingText}>Loading reviews...</Text>
          </View>
        ) : reviews.length === 0 ? (
          <View style={styles.emptyState}>
            <IconSymbol 
              ios_icon_name="star" 
              android_material_icon_name="star-border" 
              size={64} 
              color={colors.border} 
            />
            <Text style={styles.emptyStateText}>
              No reviews yet. Be the first to share your experience!
            </Text>
            <Text style={styles.emptyStateTextAr}>
              لا توجد تقييمات بعد. كن أول من يشارك تجربته!
            </Text>
          </View>
        ) : (
          <View style={styles.reviewsSection}>
            {reviews.map((review) => {
              const channelName = getChannelName(review.channel_type);
              const dateDisplay = formatDate(review.created_at);
              
              return (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewerInfo}>
                      <Text style={styles.reviewerName}>{review.name}</Text>
                      <Text style={styles.reviewDate}>{dateDisplay}</Text>
                    </View>
                    <View style={styles.starsContainer}>
                      {renderStars(review.rating)}
                    </View>
                  </View>
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                  {review.channel_type && (
                    <View style={styles.reviewChannel}>
                      <IconSymbol 
                        ios_icon_name="tag.fill" 
                        android_material_icon_name="local-offer" 
                        size={16} 
                        color={colors.text} 
                      />
                      <Text style={styles.reviewChannelText}>{channelName.en}</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      <Modal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        type={modalConfig.type}
        title={modalConfig.title}
        titleAr={modalConfig.titleAr}
        message={modalConfig.message}
        messageAr={modalConfig.messageAr}
        onConfirm={modalConfig.onConfirm}
      />
    </View>
  );
}
