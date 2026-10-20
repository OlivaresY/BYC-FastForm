import React from 'react';
import { Text, View } from 'react-native';

export default function DashboardPage(): React.JSX.Element {
  return (
    <View className='flex-1 items-center justify-center bg-slate-100'>
      <Text className='text-lg text-slate-800'>Dashboard</Text>
    </View>
  );
}
