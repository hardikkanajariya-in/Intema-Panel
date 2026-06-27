import { Server } from '@/components/Icons';
import { PlaceholderPage } from '@/components/PlaceholderPage';

export default function NginxIndex() {
    return (
        <PlaceholderPage
            title="Nginx"
            description="Manage Nginx virtual host configurations"
            icon={<Server size={40} />}
        />
    );
}
