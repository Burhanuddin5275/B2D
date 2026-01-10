import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatDateUS } from '@/components/utilities/date_formate';
import { colors } from '@/theme/colors';
import { scale, verticalScale } from 'react-native-size-matters';

interface TimelineStep {
  label: string;
  time?: string;
}

interface Props {
  steps: TimelineStep[];
  activeIndex: number;
  isCancelled: boolean;
}

const OrderTimeline: React.FC<Props> = ({ steps, activeIndex, isCancelled }) => {
  return (
    <View style={styles.card}>
      {steps.map((entry, index) => {
        const isLast = index === steps.length - 1;
        const isActive = index <= activeIndex;
        const isCancelledStep = isCancelled && index === 1;

        return (
          <View key={`${entry.label}-${index}`} style={styles.timelineRow}>
            <View style={styles.timelineIndicatorColumn}>
              <View
                style={[
                  styles.dotWrapper,
                  {
                    backgroundColor: isCancelledStep ? 'red' : isActive ? '#23B14D' : '#D3D3D3',
                    borderColor: isCancelledStep ? 'red' : isActive ? '#23B14D' : '#D3D3D3',
                  },
                ]}
              >
                <View style={styles.timelineDot} />
              </View>
              {!isLast && <View style={[styles.timelineLine, { backgroundColor: isActive ? '#23B14D' : 'white' }]} />}
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineLabel}>{entry.label}</Text>
              {entry.time && <Text style={styles.timelineTime}>{formatDateUS(entry.time)}</Text>}
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default OrderTimeline;

const styles = StyleSheet.create({
  card: { borderBottomWidth: 1, borderBottomColor: '#EDE9D9', paddingHorizontal: scale(16), paddingBottom: verticalScale(12) },
  timelineRow: { flexDirection: 'row', marginBottom: verticalScale(12) },
  timelineIndicatorColumn: { width: scale(24), alignItems: 'center' },
  dotWrapper: { width: scale(14), height: scale(14), borderRadius: scale(8), borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  timelineDot: { width: scale(7), height: scale(7), borderRadius: scale(8), backgroundColor: colors.white },
  timelineLine: { width: 2, flex: 1, backgroundColor: '#c2edcfff', marginTop: verticalScale(4) },
  timelineContent: { flex: 1, paddingLeft: scale(8) },
  timelineLabel: { fontFamily: 'Montserrat', fontWeight: '600', fontSize: 15 },
  timelineTime: { fontFamily: 'MontserratMedium', fontWeight: '600', fontSize: 12, color: colors.textPrimary, marginTop: verticalScale(4) },
});
