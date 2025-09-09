import React from "react";
import bgImage from "../assets/new-bg.jpg";
import argoImg from "../assets/argo_img.jpg";
import argodeploy from "../assets/argo_deploy.jpg";
import OurSolution from "../assets/OurSolution.png";

function Dashboard() {
  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Overlay for fade/dark effect */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content on top of overlay */}
      <div className="relative space-y-32 p-10 pt-32">
        {/* Section 1 */}
        <div className="grid grid-cols-2 gap-8 items-center">
          <div className="transition-transform duration-700 hover:scale-105 text-white">
            <h2 className="text-4xl font-bold mb-4">
              WHAT IS ARGO AND ARGO FLOATS
            </h2>
            <p className="text-gray-200">
              Placeholder for info regarding Argo floats, data flow, or
              background.
            </p>
          </div>
          <div className="transition duration-700 hover:scale-105">
            <img
              src={argodeploy}
              alt="Argo process"
              className="rounded-2xl shadow-lg"
            />
          </div>
        </div>

        {/* Section 2 */}
        <div className="grid grid-cols-2 gap-8 items-center">
          <div className="transition duration-700 hover:scale-105">
            <img
              src={argoImg}
              alt="Profile chart"
              className="rounded-2xl shadow-lg"
            />
          </div>
          <div className="transition-transform duration-700 hover:scale-105 text-white">
            <h2 className="text-4xl font-bold mb-4">THE PROBLEM</h2>
            <p className="text-gray-200">
              Placeholder for info regarding profiling depths, cycles, or
              variables.
            </p>
          </div>
        </div>

        {/* Section 3 */}
        <div className="grid grid-cols-2 gap-8 items-center">
          <div className="transition-transform duration-700 hover:scale-105 text-white">
            <h2 className="text-4xl font-bold mb-4">Our Solution</h2>
            <p className="text-gray-200">
              Placeholder for info about visualization dashboards, RAG, or
              database setup.
            </p>
          </div>
          <div className="transition duration-700 hover:scale-105">
            <img
              src={OurSolution}
              alt="Dashboard visualization"
              className="rounded-2xl shadow-lg h-[400px] w-[1400px] object-fit"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
