// src/components/CourseContent.js
import { useState } from "react";

const CourseContent = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const courseTopics = [
    "Pendahuluan Teori Bahasa dan Otomata",
    "Tata Bahasa dan Bahasa",
    "Pengantar Teori Automata",
    "Finite Automata (DFA dan NFA)",
    "Ekspresi Reguler dan Bahasa Reguler",
    "Tata bahasa dan Bahasa Bebas Konteks (Kelas Besar)",
    "Mengulang materi dan Latihan",
    "UTS",
    "Chamsky Normal Form",
  ];

  return (
    <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Course Content</h2>
      <div className="space-y-4">
        {courseTopics.map((topic, index) => (
          <div key={index} className="border border-gray-300 rounded-lg shadow-sm">
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full text-left py-4 px-6 text-gray-800 flex justify-between items-center focus:outline-none bg-gray-100 hover:bg-gray-200 transition-all duration-300 rounded-lg"
            >
              <span className="font-semibold">Pertemuan {index + 1}: {topic}</span>
              <svg
                className={`w-6 h-6 transform ${openIndex === index ? "rotate-180" : ""
                  } transition-transform duration-200`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {openIndex === index && (
              <div className="pt-4 pb-4 px-6 bg-white">
                <p className="text-gray-600">Content description for {topic}</p>
                <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded text-sm mt-2">
                  Mark as done
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseContent;
