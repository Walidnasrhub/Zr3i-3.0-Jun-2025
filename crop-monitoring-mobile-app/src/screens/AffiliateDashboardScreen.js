import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Clipboard,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const AffiliateDashboardScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  const [affiliateData, setAffiliateData] = useState(null);
  const [stats, setStats] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [payouts, setPayouts] = useState([]);

  // Mock affiliate ID - in real app, this would come from authentication
  const affiliateId = 1;

  useEffect(() => {
    fetchAffiliateData();
  }, []);

  const fetchAffiliateData = async () => {
    try {
      setLoading(true);
      
      // Mock data for demonstration
      setAffiliateData({
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        referral_code: 'JD2024',
        status: 'active'
      });

      setStats({
        total_referrals: 45,
        converted_referrals: 23,
        conversion_rate: 51.1,
        total_commission_earned: 2340,
        pending_commission: 450,
        approved_commission: 890,
        paid_commission: 1000
      });

      setReferrals([
        {
          id: 1,
          referred_at: '2024-06-01',
          referred_user_id: 101,
          commission_status: 'approved',
          commission_amount: 20,
          converted_at: '2024-06-02'
        },
        {
          id: 2,
          referred_at: '2024-06-03',
          referred_user_id: 102,
          commission_status: 'pending',
          commission_amount: 20,
          converted_at: null
        }
      ]);

      setPayouts([
        {
          id: 1,
          created_at: '2024-05-31',
          payout_period_start: '2024-05-01',
          payout_period_end: '2024-05-31',
          total_commission: 500,
          referral_count: 25,
          payout_status: 'completed',
          payout_method: 'bank_transfer'
        }
      ]);

    } catch (error) {
      Alert.alert(t('affiliate.error'), t('affiliate.loadError'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAffiliateData();
  };

  const generateReferralLink = () => {
    if (affiliateData) {
      return `https://zr3i.com/register?ref=${affiliateData.referral_code}`;
    }
    return '';
  };

  const copyReferralLink = () => {
    const link = generateReferralLink();
    Clipboard.setString(link);
    Alert.alert(t('affiliate.success'), t('affiliate.linkCopied'));
  };

  // Mock chart data
  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      data: [12, 19, 15, 25, 22, 30]
    }]
  };

  const commissionData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      data: [240, 380, 300, 500, 440, 600]
    }]
  };

  const chartConfig = {
    backgroundColor: theme.colors.surface,
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(102, 126, 234, ${opacity})`,
    labelColor: (opacity = 1) => theme.colors.text,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: theme.colors.primary
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContainer: {
      padding: theme.spacing.md,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    header: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    welcomeText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
    },
    statusBadge: {
      alignSelf: 'flex-start',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: 20,
      backgroundColor: theme.colors.success,
    },
    statusText: {
      color: 'white',
      fontSize: 12,
      fontWeight: '600',
      textTransform: 'uppercase',
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    statCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      flex: 1,
      minWidth: '45%',
      alignItems: 'center',
    },
    statIcon: {
      marginBottom: theme.spacing.sm,
    },
    statLabel: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: theme.spacing.xs,
    },
    statValue: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
      textAlign: 'center',
    },
    referralSection: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    referralLinkContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
    },
    referralLinkText: {
      flex: 1,
      fontSize: 14,
      color: theme.colors.text,
      marginRight: theme.spacing.sm,
    },
    copyButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.sm,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    copyButtonText: {
      color: 'white',
      fontSize: 12,
      fontWeight: '600',
    },
    referralCode: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    tabContainer: {
      flexDirection: 'row',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.xs,
      marginBottom: theme.spacing.lg,
    },
    tabButton: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      alignItems: 'center',
      borderRadius: theme.borderRadius.md,
    },
    activeTab: {
      backgroundColor: theme.colors.primary,
    },
    tabText: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.textSecondary,
    },
    activeTabText: {
      color: 'white',
    },
    tabContent: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
    },
    chartContainer: {
      marginBottom: theme.spacing.lg,
    },
    chartTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      textAlign: 'center',
    },
    commissionBreakdown: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.lg,
    },
    commissionCard: {
      flex: 1,
      alignItems: 'center',
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      marginHorizontal: theme.spacing.xs,
    },
    pendingCard: {
      backgroundColor: '#fef5e7',
    },
    approvedCard: {
      backgroundColor: '#c6f6d5',
    },
    paidCard: {
      backgroundColor: '#bee3f8',
    },
    commissionLabel: {
      fontSize: 12,
      fontWeight: '500',
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
      textTransform: 'uppercase',
    },
    commissionValue: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    tableContainer: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.md,
      overflow: 'hidden',
    },
    tableRow: {
      flexDirection: 'row',
      padding: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    tableHeader: {
      backgroundColor: theme.colors.surface,
    },
    tableCell: {
      flex: 1,
      fontSize: 14,
    },
    tableHeaderText: {
      fontWeight: '600',
      color: theme.colors.text,
    },
    tableCellText: {
      color: theme.colors.textSecondary,
    },
    statusBadgeSmall: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: 12,
      alignSelf: 'flex-start',
    },
    statusTextSmall: {
      fontSize: 10,
      fontWeight: '600',
      textTransform: 'uppercase',
    },
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ color: theme.colors.text, marginTop: theme.spacing.md }}>
          {t('affiliate.loadingDashboard')}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('affiliate.dashboard')}</Text>
          <Text style={styles.welcomeText}>
            {t('affiliate.welcomeBack', { 
              name: `${affiliateData?.first_name} ${affiliateData?.last_name}` 
            })}
          </Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{affiliateData?.status}</Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="people" size={24} color={theme.colors.primary} style={styles.statIcon} />
            <Text style={styles.statLabel}>{t('affiliate.totalReferrals')}</Text>
            <Text style={styles.statValue}>{stats?.total_referrals || 0}</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="checkmark-circle" size={24} color={theme.colors.success} style={styles.statIcon} />
            <Text style={styles.statLabel}>{t('affiliate.convertedReferrals')}</Text>
            <Text style={styles.statValue}>{stats?.converted_referrals || 0}</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="trending-up" size={24} color={theme.colors.warning} style={styles.statIcon} />
            <Text style={styles.statLabel}>{t('affiliate.conversionRate')}</Text>
            <Text style={styles.statValue}>{stats?.conversion_rate || 0}%</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="cash" size={24} color={theme.colors.primary} style={styles.statIcon} />
            <Text style={styles.statLabel}>{t('affiliate.totalEarnings')}</Text>
            <Text style={styles.statValue}>${stats?.total_commission_earned || 0}</Text>
          </View>
        </View>

        {/* Referral Link Section */}
        <View style={styles.referralSection}>
          <Text style={styles.sectionTitle}>{t('affiliate.yourReferralLink')}</Text>
          <View style={styles.referralLinkContainer}>
            <Text style={styles.referralLinkText} numberOfLines={1}>
              {generateReferralLink()}
            </Text>
            <TouchableOpacity style={styles.copyButton} onPress={copyReferralLink}>
              <Text style={styles.copyButtonText}>{t('affiliate.copy')}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.referralCode}>
            {t('affiliate.referralCode')}: {affiliateData?.referral_code}
          </Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'overview' && styles.activeTab]}
            onPress={() => setActiveTab('overview')}
          >
            <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
              {t('affiliate.overview')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'referrals' && styles.activeTab]}
            onPress={() => setActiveTab('referrals')}
          >
            <Text style={[styles.tabText, activeTab === 'referrals' && styles.activeTabText]}>
              {t('affiliate.referrals')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'payouts' && styles.activeTab]}
            onPress={() => setActiveTab('payouts')}
          >
            <Text style={[styles.tabText, activeTab === 'payouts' && styles.activeTabText]}>
              {t('affiliate.payouts')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === 'overview' && (
            <>
              {/* Charts */}
              <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>{t('affiliate.monthlyReferrals')}</Text>
                <BarChart
                  data={monthlyData}
                  width={screenWidth - 60}
                  height={220}
                  chartConfig={chartConfig}
                  style={{ borderRadius: 16 }}
                />
              </View>

              <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>{t('affiliate.monthlyCommissions')}</Text>
                <LineChart
                  data={commissionData}
                  width={screenWidth - 60}
                  height={220}
                  chartConfig={chartConfig}
                  style={{ borderRadius: 16 }}
                />
              </View>

              {/* Commission Breakdown */}
              <Text style={styles.sectionTitle}>{t('affiliate.commissionBreakdown')}</Text>
              <View style={styles.commissionBreakdown}>
                <View style={[styles.commissionCard, styles.pendingCard]}>
                  <Text style={styles.commissionLabel}>{t('affiliate.pending')}</Text>
                  <Text style={styles.commissionValue}>${stats?.pending_commission || 0}</Text>
                </View>
                
                <View style={[styles.commissionCard, styles.approvedCard]}>
                  <Text style={styles.commissionLabel}>{t('affiliate.approved')}</Text>
                  <Text style={styles.commissionValue}>${stats?.approved_commission || 0}</Text>
                </View>
                
                <View style={[styles.commissionCard, styles.paidCard]}>
                  <Text style={styles.commissionLabel}>{t('affiliate.paid')}</Text>
                  <Text style={styles.commissionValue}>${stats?.paid_commission || 0}</Text>
                </View>
              </View>
            </>
          )}

          {activeTab === 'referrals' && (
            <>
              <Text style={styles.sectionTitle}>{t('affiliate.recentReferrals')}</Text>
              <View style={styles.tableContainer}>
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={[styles.tableCell, styles.tableHeaderText]}>{t('affiliate.date')}</Text>
                  <Text style={[styles.tableCell, styles.tableHeaderText]}>{t('affiliate.user')}</Text>
                  <Text style={[styles.tableCell, styles.tableHeaderText]}>{t('affiliate.status')}</Text>
                  <Text style={[styles.tableCell, styles.tableHeaderText]}>{t('affiliate.commission')}</Text>
                </View>
                
                {referrals.map((referral) => (
                  <View key={referral.id} style={styles.tableRow}>
                    <Text style={[styles.tableCell, styles.tableCellText]}>
                      {new Date(referral.referred_at).toLocaleDateString()}
                    </Text>
                    <Text style={[styles.tableCell, styles.tableCellText]}>
                      User #{referral.referred_user_id}
                    </Text>
                    <View style={styles.tableCell}>
                      <View style={[
                        styles.statusBadgeSmall,
                        { backgroundColor: referral.commission_status === 'approved' ? '#c6f6d5' : '#fef5e7' }
                      ]}>
                        <Text style={[
                          styles.statusTextSmall,
                          { color: referral.commission_status === 'approved' ? '#2f855a' : '#d69e2e' }
                        ]}>
                          {referral.commission_status}
                        </Text>
                      </View>
                    </View>
                    <Text style={[styles.tableCell, styles.tableCellText]}>
                      ${referral.commission_amount || 0}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {activeTab === 'payouts' && (
            <>
              <Text style={styles.sectionTitle}>{t('affiliate.payoutHistory')}</Text>
              <View style={styles.tableContainer}>
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={[styles.tableCell, styles.tableHeaderText]}>{t('affiliate.date')}</Text>
                  <Text style={[styles.tableCell, styles.tableHeaderText]}>{t('affiliate.amount')}</Text>
                  <Text style={[styles.tableCell, styles.tableHeaderText]}>{t('affiliate.status')}</Text>
                  <Text style={[styles.tableCell, styles.tableHeaderText]}>{t('affiliate.method')}</Text>
                </View>
                
                {payouts.map((payout) => (
                  <View key={payout.id} style={styles.tableRow}>
                    <Text style={[styles.tableCell, styles.tableCellText]}>
                      {new Date(payout.created_at).toLocaleDateString()}
                    </Text>
                    <Text style={[styles.tableCell, styles.tableCellText]}>
                      ${payout.total_commission}
                    </Text>
                    <View style={styles.tableCell}>
                      <View style={[
                        styles.statusBadgeSmall,
                        { backgroundColor: '#bee3f8' }
                      ]}>
                        <Text style={[styles.statusTextSmall, { color: '#2b6cb0' }]}>
                          {payout.payout_status}
                        </Text>
                      </View>
                    </View>
                    <Text style={[styles.tableCell, styles.tableCellText]}>
                      {payout.payout_method}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default AffiliateDashboardScreen;

