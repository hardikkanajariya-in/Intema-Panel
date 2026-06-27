import { Settings } from '@/components/Icons';
import { PlaceholderPage } from '@/components/PlaceholderPage';

export default function SettingsIndex() {
    return (
        <PlaceholderPage
            title="Settings"
            description="Configure panel preferences and integrations"
            icon={<Settings size={40} />}
        />
    );
}
