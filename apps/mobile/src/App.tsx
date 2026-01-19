import { AuthModule } from '@secure-login/shared';

const SUPABASE_URL = 'https://xzqicfaliuzwfcfzfuum.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6cWljZmFsaXV6d2ZjZnpmdXVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4MTYyMDAsImV4cCI6MjA4NDM5MjIwMH0.J2rGIgF6OYjRpGPG2ouckgFYzIdC_ss6m3tOpyrhve0';

function App() {
    return (
        <div style={{ backgroundColor: '#0f172a', minHeight: '100vh' }}>
            <AuthModule
                supabaseUrl={SUPABASE_URL}
                supabaseKey={SUPABASE_KEY}
                viewDetails="mobile"
            />
        </div>
    );
}

export default App;
