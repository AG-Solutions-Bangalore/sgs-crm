import React, { useEffect, useState } from "react";
import {
  CheckCircleOutlined,
  HomeOutlined,
  RightOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { Button } from "antd";

const ThankYouPage = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 100);
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: `
      radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
      radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
      linear-gradient(to bottom right, #a78bfa, #c084fc, #818cf8)
    `,
        backgroundSize: "20px 20px, 30px 30px, 100% 100%",
        backgroundPosition: "0 0, 10px 10px, 0 0",
      }}
    >
      {/* Minimalist Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%">
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="20" cy="20" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-radial from-white/5 to-transparent"></div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .animate-pulse-slow {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>

      <div
        className={`max-w-md w-full relative z-10 ${
          show ? "animate-fadeInUp" : "opacity-0"
        }`}
      >
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-br from-emerald-400 to-teal-500 px-8 py-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 animate-scaleIn shadow-lg">
                <CheckCircleOutlined className="text-5xl !text-emerald-500" />
              </div>

              <h1 className="text-3xl font-bold text-white mb-2">Success!</h1>
              <p className="text-white/90 text-base">
                Registration completed successfully
              </p>
            </div>

            {/* Decorative Wave */}
            <svg
              className="absolute bottom-0 left-0 w-full"
              viewBox="0 0 1440 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
                fill="white"
              />
            </svg>
          </div>

          {/* Content Section */}
          <div className="px-8 py-8">
            {/* Info Box */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-5 mb-6 border border-purple-100">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                  <MailOutlined className="!text-orange-600 text-lg" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1 text-sm">
                    Confirmation Sent
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Check your email for membership details and next steps
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                  <PhoneOutlined className="!text-orange-600 text-lg" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1 text-sm">
                    We'll Contact You
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Our team will reach out within 24-48 hours
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                type="primary"
                size="large"
                block
                icon={<HomeOutlined />}
                // className="h-12 rounded-xl font-semibold !bg-gradient-to-r from-orange-600 to-indigo-600 border-0 hover:shadow-lg transition-all shadow-md"
                onClick={() => (window.location.href = "/")}
              >
                Back to Home
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-5 text-center border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-2">Need assistance?</p>
            <div className="flex items-center justify-center gap-4 text-xs">
              <a
                href="mailto:support@example.com"
                className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
              >
                support@example.com
              </a>
              <span className="text-gray-300">•</span>
              <a
                href="tel:+1234567890"
                className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
              >
                +1 234 567 890
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Text */}
        <p className="text-center text-white/80 text-sm mt-6">
          Thank you for choosing us 🎉
        </p>
      </div>
    </div>
  );
};

export default ThankYouPage;
