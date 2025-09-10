import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const StatusCard = ({ status, amount, style, colors }) => {
  // Color Psychology System
  const getStatusColors = (status) => {
    switch (status) {
      case 'Pending':
        return {
          backgroundColor: '#FF8C42', // Orange - urgency without alarm
          text: '#FFFFFF',
          shadow: '#FF8C42',
          description: 'Action Required'
        };
      case 'Spent':
        return {
          backgroundColor: '#4CAF50', // Green - completion & success
          text: '#FFFFFF',
          shadow: '#4CAF50',
          description: 'Completed'
        };
      case 'Available':
        return {
          backgroundColor: '#2196F3', // Blue - trustworthy & stable
          text: '#FFFFFF',
          shadow: '#2196F3',
          description: 'Ready to Use'
        };
      case 'Outstanding':
        return {
          backgroundColor: '#F44336', // Red - high alert & urgency
          text: '#FFFFFF',
          shadow: '#F44336',
          description: 'Needs Attention'
        };
      default:
        return {
          backgroundColor: '#9E9E9E', // Gray fallback
          text: '#FFFFFF',
          shadow: '#9E9E9E',
          description: 'Unknown'
        };
    }
  };

  const statusColors = getStatusColors(status);

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.card, { backgroundColor: statusColors.backgroundColor }]}>
        <View style={styles.content}>
          <Text style={[styles.statusText, { color: statusColors.text }]}>
            {status}
          </Text>
          <Text style={[styles.amountText, { color: statusColors.text }]}>
            Rs. {Number(amount || 0).toLocaleString()}
          </Text>
          <Text style={[styles.descriptionText, { color: statusColors.text }]}>
            {statusColors.description}
          </Text>
        </View>
        <View style={[styles.shadowOverlay, { backgroundColor: statusColors.shadow }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '48%',
    marginBottom: 12,
    borderRadius: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    minHeight: 100,
    position: 'relative',
    overflow: 'hidden',
  },
  content: {
    zIndex: 2,
    position: 'relative',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  amountText: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 11,
    fontWeight: '500',
    opacity: 0.9,
    fontStyle: 'italic',
  },
  shadowOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 20,
    opacity: 0.2,
    zIndex: 1,
  },
});

export default StatusCard;