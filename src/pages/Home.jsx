import Hero from "../components/Hero";
import OfferBanner from "../components/OfferBanner";
import LocationCard from "../components/LocationCard";


function Home() {
  return (
    <>
      <OfferBanner />
      <Hero />

      <div className="container mx-auto px-4 mt-6">
        <LocationCard />
      </div>

      <div className="max-w-7xl mx-auto py-12 px-6">
        <h2 className="text-3xl font-bold text-green-700">
          Welcome to Heera's Veg Mart
        </h2>

        <p className="mt-4 text-gray-600">
          Fresh vegetables delivered within a 10 km radius of PIN Code 440024.
        </p>
      </div>
    </>
  );
}

export default Home;