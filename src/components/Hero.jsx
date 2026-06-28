import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="bg-gradient-to-r from-green-600 to-green-500 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between">

        <div className="max-w-xl">
          <h1 className="text-5xl font-bold leading-tight">
            Farm Fresh Vegetables
            <br />
            Delivered to Your Door
          </h1>

          <p className="mt-6 text-lg">
            Fresh vegetables delivered within 30–60 minutes in your area.
          </p>

          <Link
            to="/products"
            className="inline-block mt-8 bg-yellow-400 text-black px-8 py-3 rounded-xl font-bold hover:bg-yellow-300"
          >
            Shop Now
          </Link>
        </div>

        <div className="mt-10 md:mt-0">
          🥬🥕🍅🥔🥒
        </div>

      </div>
    </section>
  );
}

export default Hero;