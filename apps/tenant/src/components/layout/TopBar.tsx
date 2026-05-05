import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export function TopBar() {
  return (
    <div className="hidden lg:block w-full bg-dark-gray text-gray-400 text-xs py-2 border-b border-gray-800">
      <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Phone className="w-3 h-3 text-brand" />
            <span>+52 6589 0001</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-3 h-3 text-brand" />
            <span>info@fiykit.com</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3 h-3 text-brand" />
            <span>61GV+XV2, Unnamed Road, Chomchur</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="#" className="hover:text-brand transition-colors">Facebook</Link>
          <span className="text-gray-700">|</span>
          <Link href="#" className="hover:text-brand transition-colors">Twitter</Link>
          <span className="text-gray-700">|</span>
          <Link href="#" className="hover:text-brand transition-colors">LinkedIn</Link>
          <span className="text-gray-700">|</span>
          <Link href="#" className="hover:text-brand transition-colors">Instagram</Link>
        </div>
      </div>
    </div>
  );
}
