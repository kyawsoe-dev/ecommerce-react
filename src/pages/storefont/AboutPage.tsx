import { ArrowRight } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About Us</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Welcome to ShopEase, your number one source for all things
          electronics, fashion, and home products. We're dedicated to giving you
          the very best of products, with a focus on quality, customer service,
          and uniqueness.
        </p>
      </div>

      {/* Our Story */}
      <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
        <img
          src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800"
          alt="Our Story"
          className="w-full h-80 object-cover rounded-lg shadow-lg"
        />
        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
          <p className="text-gray-600 mb-4">
            ShopEase started in 2020 with a simple goal: to make online shopping
            convenient, reliable, and enjoyable for everyone. We source the best
            products directly from trusted suppliers and bring them to your
            doorstep.
          </p>
          <p className="text-gray-600">
            Over the years, we’ve expanded our catalog and now offer thousands
            of products across multiple categories including electronics,
            fashion, and home essentials.
          </p>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-4">
            To provide a seamless shopping experience with high-quality products
            at competitive prices.
          </p>
          <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
          <p className="text-gray-600">
            To become the most trusted online marketplace, where customers can
            find everything they need with ease.
          </p>
        </div>
        <img
          src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800"
          alt="Mission and Vision"
          className="w-full h-80 object-cover rounded-lg shadow-lg"
        />
      </div>

      {/* Team Section */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Meet Our Team</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {["Kyaw Soe", "Aung Si Thu", "Htay Than Aung", "Mady Moe Ko"].map(
            (name, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow-lg p-4 flex flex-col items-center"
              >
                <img
                  src={`https://i.pravatar.cc/150?img=${idx + 1}`}
                  alt={name}
                  className="w-24 h-24 rounded-full mb-4"
                />
                <h3 className="font-semibold text-lg">{name}</h3>
                <p className="text-gray-500 text-sm">Team Member</p>
              </div>
            )
          )}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-blue-600 text-white py-12 px-6 rounded-lg text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Shopping?</h2>
        <p className="mb-6">
          Explore thousands of products and enjoy exclusive deals every day!
        </p>
        <Link
          to="/products"
          className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
        >
          Shop Now
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </div>
    </div>
  );
};

export default AboutPage;
