// // components/CourseContent.js

// import { useState } from "react";

// const CourseContent = ({ topics }) => {
//   const [openIndex, setOpenIndex] = useState(null);

//   const toggleAccordion = (index) => {
//     setOpenIndex(openIndex === index ? null : index);
//   };

//   return (
//     <div className="p-8 max-w-4xl mx-auto">
//       <h2 className="text-2xl font-bold mb-4 text-gray-800">Course Content</h2>
//       <div className="space-y-4">
//         {topics.map((topic, index) => (
//           <div key={topic.id} className="border border-gray-300 rounded-lg shadow-sm">
//             <button
//               onClick={() => toggleAccordion(index)}
//               className="w-full text-left py-4 px-6 text-gray-800 flex justify-between items-center focus:outline-none bg-gray-100 hover:bg-gray-200 transition-all duration-300 rounded-lg"
//             >
//               <span className="font-semibold">Pertemuan {index + 1}: {topic.topic || 'No Topic Available'}</span>
//               <svg
//                 className={`w-6 h-6 transform ${openIndex === index ? "rotate-180" : ""} transition-transform duration-200`}
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M19 9l-7 7-7-7"
//                 />
//               </svg>
//             </button>

//             {openIndex === index && (
//               <div className="pt-4 pb-4 px-6 bg-white">
//                 <p className="text-gray-600">Dosen Mengajar: {topic.dosenMengajar || 'Tidak tersedia'}</p>
//                 <p className="text-gray-600">Waktu: {topic.waktu || 'Tidak tersedia'}</p>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default CourseContent;
