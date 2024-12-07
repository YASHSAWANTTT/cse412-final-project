import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Navbar */}
            <Navbar />

            {/* Main Content */}
            <main className="flex-grow container mx-auto px-4 py-8">
                <section className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Uber Data Analysis</h1>
                    <p className="text-lg text-gray-700">
                        Explore trends in Uber ride data, visualize key metrics, and gain insights into ride patterns.
                    </p>
                </section>

                {/* Dashboard Section */}
                <section className="mt-12">
                    <h2 className="text-2xl font-semibold mb-4">Visualizations</h2>
                    <Dashboard />
                </section>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
