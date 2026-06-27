import { Cloud } from '@/components/Icons';
import { PlaceholderPage } from '@/components/PlaceholderPage';

export default function CloudflareIndex() {
    return (
        <PlaceholderPage
            title="Cloudflare"
            description="Manage Cloudflare DNS and proxy settings"
            icon={<Cloud size={40} />}
        />
    );
}
