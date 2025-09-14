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
            <p className="text-gray-200 text-xl font-semibold ">
              <h2>
              Argo is a global ocean observation program that uses a network of autonomous drifting floats, known as Argo floats, to collect vital data from the world’s oceans. These floats periodically dive to depths of up to 2,000 meters, measuring key parameters such as temperature, salinity, and ocean currents. The collected data is then transmitted via satellite to research centers around the world. This information helps scientists understand ocean circulation, monitor climate change, improve weather forecasts, and support marine ecosystem studies. Argo’s continuous data collection plays a crucial role in enhancing our understanding of the Earth’s oceans and their impact on the environment.
              </h2>
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
            <p className="text-gray-200 text-xl font-semibold">
              <h2>
              Argo floats gather important information such as temperature, salinity, and pressure by diving to different depths and repeating this process through regular cycles. The collected data is stored in NetCDF files, a format designed for large-scale scientific data. While these files are efficient for storing and sharing information, they are complex to access and require specialized software and knowledge to interpret, making it challenging for many users to work with the data directly.
              </h2>
            </p>
          </div>
        </div>

        {/* Section 3 */}
        <div className="grid grid-cols-2 gap-8 items-center">
          <div className="transition-transform duration-700 hover:scale-105 text-white">
            <h2 className="text-4xl font-bold mb-4">Our Solution</h2>
            <p className="text-gray-200 text-xl font-semibold">
              <h2>
              Our solution simplifies access to complex ocean data by providing intuitive visualization dashboards that make it easy to explore key variables like temperature and salinity. We use Retrieval-Augmented Generation (RAG) to enhance data search and insights, and store the processed information in a structured database, making it accessible, understandable, and actionable for researchers and users without requiring advanced technical skills.
              </h2>
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
