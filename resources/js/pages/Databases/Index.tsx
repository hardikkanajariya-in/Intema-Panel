import { Database } from '@/components/Icons';
import { PlaceholderPage } from '@/components/PlaceholderPage';

export default function DatabasesIndex() {
    return (
        <PlaceholderPage
            title="Databases"
            description="Manage PostgreSQL databases"
            icon={<Database size={40} />}
        />
    );
}
