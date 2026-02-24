import { useAuth } from '@/contexts/AuthContext';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
    const { isLoggedIn, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0A0A' }}>
                <ActivityIndicator size="large" color="#D4AF37" />
            </View>
        );
    }

    if (isLoggedIn) {
        return <Redirect href="/(tabs)" />;
    }

    return <Redirect href="/login" />;
}
