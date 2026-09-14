import React from "react";
import Image from "next/image";
import img from "../../images/Man thinking-pana-Photoroom.png";

export default function WelcomeBanner({
  userName = "Katie",
  applicationsCount = 16,
  illustrationSrc = img,
  onReview,
}) {
  return (
    <div className="relative overflow-visible">
      <div className="relative flex flex-col md:flex-row items-center rounded-3xl bg-[var(--primary)] px-6 py-8 md:px-10 md:py-10 text-white overflow-visible">
        
        {/* Content */}
        <div className="w-full md:w-3/5 z-10">
          <h2 className="text-2xl md:text-4xl font-bold">
            Hello {userName}!
          </h2>

          <p className="mt-4 text-sm md:text-lg leading-relaxed text-indigo-100 max-w-lg">
            You have{" "}
            <span className="font-semibold">{applicationsCount}</span> new
            applications. It is a lot of work for today! So let's start 👀
          </p>

          <button
            onClick={onReview}
            className="mt-6 rounded-xl bg-white px-5 py-3 font-semibold text-[var(--primary)] transition hover:bg-indigo-100"
          >
            Review it!
          </button>
        </div>

        {/* Image */}
        {illustrationSrc && (
          <div className="relative mt-8 md:mt-0 w-full md:w-2/5 flex justify-center">
            <Image
              src={illustrationSrc}
              alt="Illustration"
              priority
              className="
                w-56
                sm:w-64
            
                lg:right-0
                lg:w-72
                xl:w-96
                h-auto
                object-contain
                pointer-events-none
              "
            />
          </div>
        )}
      </div>
    </div>
  );
}