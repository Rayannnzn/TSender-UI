import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FaGithub } from "react-icons/fa";
import Image from "next/image";

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-white text-black">
      {/* Left side - Title */}
      <div className="flex items-center space-x-2">
        <h1 className="text-2xl font-bold text-gray-900">tsender</h1>
      </div>

      {/* Right side - GitHub link and Connect button */}
      <div className="flex items-center space-x-4">
        <a
          href="https://github.com/Rayannnzn"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-700 hover:text-gray-900"
        >
          <FaGithub size={24} />
        </a>
        <ConnectButton />
      </div>
    </header>
  );
}