import { Monitor } from '@/components/Icons';
import { PlaceholderPage } from '@/components/PlaceholderPage';

export default function SystemIndex() {
    return (
        <PlaceholderPage
            title="System"
            description="Monitor server health and system resources"
            icon={<Monitor size={40} />}
        />
    );
}
