import { Gift, Headset, ShieldCheck, Truck } from "lucide-react";

const features = [
  { icon: Gift, title: "Special Gift Cards", desc: "Offer special bonuses with gift." },
  { icon: ShieldCheck, title: "Secure Payment", desc: "100% secure payment methods." },
  { icon: Headset, title: "24/7 Support", desc: "We have dedicated support." },
  { icon: Truck, title: "Free Shipping", desc: "On all orders over $99." },
];

const FeaturesSection = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="flex items-center gap-4 group p-4 border border-transparent hover:border-gray-100 hover:shadow-sm rounded-lg transition-all"
          >
            <div className="p-4 bg-gray-100 rounded-full text-gray-500 group-hover:bg-[#5cb85c] group-hover:text-white transition-colors">
              <feature.icon size={32} strokeWidth={1.5} />
            </div>
            <div>
              <h4 className="font-bold text-gray-800 text-lg group-hover:text-[#5cb85c] transition-colors">
                {feature.title}
              </h4>
              <p className="text-sm text-gray-500">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;
