import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function TestAuth() {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (session) {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Authentication Test</h1>
                <p>✅ Signed in as: {session.user?.email}</p>
                <p>User ID: {session.user?.id}</p>
                <button 
                    onClick={() => signOut()}
                    className="bg-red-500 text-white px-4 py-2 rounded mt-4"
                >
                    Sign Out
                </button>
                <button 
                    onClick={() => router.push('/ChatAssistant?recipeId=2')}
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-4 ml-2"
                >
                    Test ChatAssistant
                </button>
            </div>
        );
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Authentication Test</h1>
            <p>❌ Not signed in</p>
            <button 
                onClick={() => signIn('google')}
                className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
            >
                Sign in with Google
            </button>
        </div>
    );
} 