// import { Link } from "react-router-dom";

// function Hero() {
//   return (
//     <section className="bg-gradient-to-r from-green-600 to-green-500 text-white">
//       <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between">

//         <div className="max-w-xl">
//           <h1 className="text-5xl font-bold leading-tight">
//             Farm Fresh Vegetables
//             <br />
//             Delivered to Your Door
//           </h1>

//           <p className="mt-6 text-lg">
//             Fresh vegetables delivered within 30–60 minutes in your area.
//           </p>

//           <Link
//             to="/products"
//             className="inline-block mt-8 bg-yellow-400 text-black px-8 py-3 rounded-xl font-bold hover:bg-yellow-300"
//           >
//             Shop Now
//           </Link>
//         </div>

//         <div className="mt-10 md:mt-0">
//           🥬🥕🍅🥔🥒
//         </div>

//       </div>
//     </section>
//   );
// }

// export default Hero;




import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-green-700 via-green-600 to-green-500 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-16">

        <div className="grid md:grid-cols-2 gap-10 items-center">

          {/* Left Side */}

          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight">
              Farm Fresh
              <br />
              Vegetables
              <br />
              Delivered to
              <span className="text-yellow-300">
                {" "}Your Door
              </span>
            </h1>

            <p className="mt-6 text-xl text-green-100">
              Fresh vegetables, fruits, dairy and juices delivered
              within 30-60 minutes.
            </p>

            <div className="flex gap-4 mt-8">

              <Link to="/products">
                <button className="bg-yellow-400 hover:bg-yellow-300 text-black px-8 py-4 rounded-xl font-bold shadow-lg">
                  Shop Now
                </button>
              </Link>

              <Link to="/delivery">
                <button className="border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-green-700">
                  Learn More
                </button>
              </Link>

            </div>

          </motion.div>

          {/* Right Side */}

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="flex justify-center"
          >

            <img
              src="/hero.png"
              alt="Fresh Vegetables"
              className="w-full max-w-xl drop-shadow-2xl"
            />

          </motion.div>

        </div>

      </div>
    </section>
  );
}