import { Shield } from '@/components/Icons';
import { PlaceholderPage } from '@/components/PlaceholderPage';

export default function SslIndex() {
    return (
        <PlaceholderPage
            title="SSL"
            description="Manage SSL certificates and renewals"
            icon={<Shield size={40} />}
        />
    );
}
