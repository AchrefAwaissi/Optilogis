import React from "react";
import { House } from "../types";

interface HouseListingsProps {
  houses: House[];
  onHouseSelect: (house: House) => void;
}

const HouseListings: React.FC<HouseListingsProps> = ({
  houses,
  onHouseSelect,
}) => {
  return (
    <div className="space-y-4">
      {houses.map((house) => (
        <div
          key={house._id}
          className="w-[248px] h-[260px] relative bg-white rounded-[15px] shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
          onClick={() => onHouseSelect(house)}
        >
          <img
            className="w-[228px] h-[118px] mx-auto mt-[10px] rounded-[15px] object-cover"
            src={
              house.image
                ? `http://localhost:5000/uploads/${house.image}`
                : "https://via.placeholder.com/228x118"
            }
            alt={`${house.title}`}
          />
          <div className="px-4 pt-2">
            <h3 className="text-[14px] font-medium text-[#331832] truncate">
              {house.title}
            </h3>
            <p className="text-[12px] text-[#bbbdc8] truncate">{`${house.address}, ${house.city}`}</p>
            <p className="text-[14px] font-medium text-[#47a000] mt-1">
              ${house.price.toLocaleString()}
            </p>
          </div>
          <button className="absolute bottom-4 left-4 w-[216px] h-[30px] bg-white rounded-[9px] border border-[#47a000] text-[#47a000] text-xs font-normal hover:bg-[#47a000] hover:text-white transition-colors duration-200">
            View details
          </button>
        </div>
      ))}
    </div>
  );
};

export default HouseListings;
// import React from "react";
// import { House } from "../types";
// import { Heart } from "lucide-react"; // Assurez-vous que lucide-react est installé

// interface HouseListingsProps {
//   houses: House[];
//   onHouseSelect: (house: House) => void;
// }

// const HouseListings: React.FC<HouseListingsProps> = ({
//   houses,
//   onHouseSelect,
// }) => {
//   return (
//     <div className="space-y-4">
//       {houses.map((house) => (
//         <div
//           key={house._id}
//           className="w-[383px] h-[147px] relative bg-white rounded-[9px] shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
//           onClick={() => onHouseSelect(house)}
//         >
//           <img
//             className="w-[117px] h-[127px] absolute left-[10px] top-[10px] rounded-[9px] object-cover"
//             src={
//               house.image
//                 ? `http://localhost:5000/uploads/${house.image}`
//                 : "https://via.placeholder.com/117x127"
//             }
//             alt={`${house.title}`}
//           />
//           <div className="w-[230px] h-[105px] absolute left-[143px] top-[21px]">
//             <div className="flex justify-between items-center">
//               <h3 className="text-black text-base font-normal font-['Poppins'] tracking-tight">
//                 {house.title}
//               </h3>
//               <Heart
//                 className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors duration-200 cursor-pointer"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   console.log("Favorited:", house._id);
//                 }}
//               />
//             </div>
//             <p className="absolute top-[36px] text-[#a1a1a1] text-sm font-normal font-['Poppins'] tracking-tight">{`${house.address}, ${house.city}`}</p>
//             <p className="absolute top-[81px]">
//               <span className="text-[#47a000] text-base font-normal font-['Poppins'] tracking-tight">
//                 ${house.price.toLocaleString()}
//               </span>
//               <span className="text-black/40 text-[10px] font-normal font-['Poppins'] tracking-tight ml-1">
//                 /month
//               </span>
//             </p>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default HouseListings;
