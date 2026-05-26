import { Facebook, Instagram, Linkedin, Send, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#252525] text-gray-300 font-sans mt-12">
      {/* Newsletter */}
      <div className="border-b border-gray-700">
        <div className="container mx-auto px-4 py-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Send className="text-[#5cb85c] w-10 h-10" />
            <div>
              <h3 className="text-xl font-bold text-white">Subscribe Newsletter</h3>
              <p className="text-sm text-gray-400">Get e-mail updates about our latest shop and special offers.</p>
            </div>
          </div>
          <div className="flex w-full lg:w-auto max-w-md bg-white rounded-full overflow-hidden p-1">
            <input
              type="email"
              placeholder="Enter your email address..."
              className="flex-1 px-4 py-2 text-gray-700 outline-none bg-transparent"
            />
            <button className="bg-[#5cb85c] hover:bg-[#4cae4c] text-white px-6 py-2 rounded-full font-bold uppercase text-xs transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <h4 className="text-white font-bold text-lg mb-6 relative inline-block before:content-[''] before:absolute before:-bottom-2 before:left-0 before:w-10 before:h-0.5 before:bg-[#5cb85c]">
            Contact Us
          </h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <span className="text-[#5cb85c]">Address:</span>
              <span>123 Main Street, Anytown, CA 12345 USA</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#5cb85c]">Phone:</span>
              <span>(012) 800 456 789</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#5cb85c]">Email:</span>
              <span>support@groceryhub.com</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold text-lg mb-6 relative inline-block before:content-[''] before:absolute before:-bottom-2 before:left-0 before:w-10 before:h-0.5 before:bg-[#5cb85c]">
            Information
          </h4>
          <ul className="space-y-3 text-sm">
            {["About Us", "Delivery Information", "Privacy Policy", "Terms & Conditions", "Site Map"].map((item) => (
              <li key={item}>
                <a href="#" className="hover:text-[#5cb85c] transition-colors">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold text-lg mb-6 relative inline-block before:content-[''] before:absolute before:-bottom-2 before:left-0 before:w-10 before:h-0.5 before:bg-[#5cb85c]">
            My Account
          </h4>
          <ul className="space-y-3 text-sm">
            {["My Account", "Order History", "Wish List", "Newsletter", "Returns"].map((item) => (
              <li key={item}>
                <a href="#" className="hover:text-[#5cb85c] transition-colors">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold text-lg mb-6 relative inline-block before:content-[''] before:absolute before:-bottom-2 before:left-0 before:w-10 before:h-0.5 before:bg-[#5cb85c]">
            Download App
          </h4>
          <p className="text-sm mb-4">Download our mobile app for best experience.</p>
          <div className="flex gap-2">
            <div className="bg-gray-800 p-2 rounded border border-gray-700 flex-1 hover:border-[#5cb85c] cursor-pointer transition-colors text-center text-xs">
              Google Play
            </div>
            <div className="bg-gray-800 p-2 rounded border border-gray-700 flex-1 hover:border-[#5cb85c] cursor-pointer transition-colors text-center text-xs">
              App Store
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#1a1a1a] py-6">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">© 2024 Grocery Shopping Hub. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, idx) => (
              <a
                key={idx}
                href="#"
                className="bg-gray-800 p-2 rounded-full hover:bg-[#5cb85c] hover:text-white transition-colors"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
